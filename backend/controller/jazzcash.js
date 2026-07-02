const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const Order = require("../model/order");
const Product = require("../model/product");

// Keep these in sync with the storefront cart/checkout rules.
const FREE_SHIPPING_OVER = 5000;
const FLAT_SHIPPING = 200;

const pad = (n) => String(n).padStart(2, "0");
const fmtDate = (d) =>
  `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(
    d.getHours()
  )}${pad(d.getMinutes())}${pad(d.getSeconds())}`;

/**
 * JazzCash secure hash (HTTP POST / Page Redirect).
 * Per the official spec + reference implementations:
 *   1. take every non-empty pp_* / ppmpf_* field EXCEPT pp_SecureHash
 *   2. sort by key (ASCII ascending) and concatenate the VALUES with "&"
 *   3. prepend the Integrity Salt, then HMAC-SHA256 keyed with that same salt
 *   4. hex digest
 */
const computeSecureHash = (fields, salt) => {
  const keys = Object.keys(fields)
    .filter(
      (k) =>
        k.startsWith("pp") &&
        k !== "pp_SecureHash" &&
        fields[k] !== "" &&
        fields[k] !== null &&
        fields[k] !== undefined
    )
    .sort();
  let toHash = salt;
  for (const k of keys) toHash += "&" + fields[k];
  return crypto.createHmac("sha256", salt).update(toHash).digest("hex");
};

const config = () => ({
  merchantId: process.env.JAZZCASH_MERCHANT_ID,
  password: process.env.JAZZCASH_PASSWORD,
  salt: process.env.JAZZCASH_INTEGRITY_SALT,
  returnUrl: process.env.JAZZCASH_RETURN_URL,
  postUrl: process.env.JAZZCASH_POST_URL,
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
});

// ── 1) INITIATE ───────────────────────────────────────────────────────────
// Recompute the amount from the database (never trust the client), create the
// pending order(s), and return a fully-signed field set for the browser to
// POST to JazzCash's hosted payment page.
router.post(
  "/initiate",
  catchAsyncErrors(async (req, res, next) => {
    const cfg = config();
    if (!cfg.merchantId || !cfg.password || !cfg.salt || !cfg.returnUrl || !cfg.postUrl) {
      return next(new ErrorHandler("JazzCash is not configured on the server", 500));
    }

    const { cart, shippingAddress, user } = req.body;
    if (!cart || !cart.length) {
      return next(new ErrorHandler("Cart is empty", 400));
    }

    // Anti-tamper: price comes from the DB product, not the request body.
    let subTotal = 0;
    for (const item of cart) {
      const product = await Product.findById(item._id);
      if (!product) return next(new ErrorHandler("A product in your cart no longer exists", 400));
      const qty = Math.max(1, Number(item.qty) || 1);
      subTotal += product.discountPrice * qty;
    }
    const shipping =
      subTotal === 0 || subTotal >= FREE_SHIPPING_OVER ? 0 : FLAT_SHIPPING;
    const total = subTotal + shipping;
    const amountPaisa = String(Math.round(total * 100)); // JazzCash wants the lowest denomination

    const now = new Date();
    const expiry = new Date(now.getTime() + 60 * 60 * 1000); // valid 1 hour
    const txnRefNo = "T" + fmtDate(now) + Math.floor(Math.random() * 900 + 100);

    // one pending order per shop, all tagged with this txnRefNo
    const shopItems = new Map();
    for (const item of cart) {
      if (!shopItems.has(item.shopId)) shopItems.set(item.shopId, []);
      shopItems.get(item.shopId).push(item);
    }
    for (const [, items] of shopItems) {
      await Order.create({
        cart: items,
        shippingAddress,
        user,
        totalPrice: total,
        status: "Pending Payment",
        paymentInfo: { id: txnRefNo, status: "Pending", type: "JazzCash" },
      });
    }

    const fields = {
      pp_Version: "1.1",
      pp_Language: "EN",
      pp_MerchantID: cfg.merchantId,
      pp_Password: cfg.password,
      pp_TxnRefNo: txnRefNo,
      pp_Amount: amountPaisa,
      pp_TxnCurrency: "PKR",
      pp_TxnDateTime: fmtDate(now),
      pp_BillReference: "qadam",
      pp_Description: "Qadam order payment",
      pp_TxnExpiryDateTime: fmtDate(expiry),
      pp_ReturnURL: cfg.returnUrl,
      ppmpf_1: String((user && user._id) || ""),
    };
    fields.pp_SecureHash = computeSecureHash(fields, cfg.salt);

    res.status(200).json({ success: true, url: cfg.postUrl, params: fields });
  })
);

// ── 2) CALLBACK (pp_ReturnURL) ────────────────────────────────────────────
// JazzCash returns the customer here (HTTP POST). We re-verify the secure hash
// before trusting anything, then confirm or roll back the order and redirect
// the browser back into the storefront.
router.post(
  "/callback",
  catchAsyncErrors(async (req, res) => {
    const cfg = config();
    const data = req.body || {};
    const txnRefNo = data.pp_TxnRefNo;
    const received = data.pp_SecureHash || "";
    const expected = computeSecureHash(data, cfg.salt);

    // Integrity check first — reject any tampered response.
    if (!received || received.toLowerCase() !== expected.toLowerCase()) {
      if (txnRefNo) {
        await Order.deleteMany({
          "paymentInfo.id": txnRefNo,
          "paymentInfo.status": "Pending",
        });
      }
      return res.redirect(`${cfg.clientUrl}/payment?status=invalid`);
    }

    if (data.pp_ResponseCode === "000") {
      await Order.updateMany(
        { "paymentInfo.id": txnRefNo },
        {
          $set: {
            status: "Processing",
            "paymentInfo.status": "Approved",
            paidAt: new Date(),
          },
        }
      );
      return res.redirect(`${cfg.clientUrl}/order/success`);
    }

    // declined / cancelled / expired — drop the pending order(s)
    await Order.deleteMany({
      "paymentInfo.id": txnRefNo,
      "paymentInfo.status": "Pending",
    });
    return res.redirect(
      `${cfg.clientUrl}/payment?status=failed&code=${data.pp_ResponseCode || ""}`
    );
  })
);

module.exports = router;
