const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const Order = require("../model/order");
const Product = require("../model/product");
const sendOrderEmails = require("../utils/orderEmails");




// Sandbox diagnostics: log EVERY request that reaches the JazzCash router.
// If this line never prints when JazzCash "returns" the customer, the request
// is not hitting our server at all (wrong ReturnURL / not publicly reachable
// from JazzCash / stuck on JazzCash's side). Remove/gate before production.
router.use((req, _res, next) => {
  console.log("──────── JazzCash request ────────");
  console.log("time    :", new Date().toISOString());
  console.log("method  :", req.method);
  console.log("url     :", req.originalUrl);
  console.log("ip      :", req.ip, "| xff:", req.headers["x-forwarded-for"]);
  console.log("type    :", req.headers["content-type"]);
  console.log("query   :", JSON.stringify(req.query));
  console.log("body    :", JSON.stringify(req.body));
  console.log("──────────────────────────────────");
  next();
});

// Keep these in sync with the storefront cart/checkout rules.
const FREE_SHIPPING_OVER = 5000;
const FLAT_SHIPPING = 200;

const pad = (n) => String(n).padStart(2, "0");
// JazzCash validates pp_TxnDateTime / pp_TxnExpiryDateTime against its OWN
// clock, which is PKT (UTC+5, no DST). Build the timestamp in PKT explicitly
// so it's correct regardless of server timezone. Locally your Mac is PKT so an
// unqualified local time happens to work, but on Vercel/serverless the host is
// UTC — there the time would look ~5h in the past and JazzCash would treat the
// transaction as expired. Shifting the epoch by +5h and reading UTC fields
// yields PKT wall-clock everywhere.
const fmtDate = (d) => {
  const pkt = new Date(d.getTime() + 5 * 60 * 60 * 1000);
  return `${pkt.getUTCFullYear()}${pad(pkt.getUTCMonth() + 1)}${pad(
    pkt.getUTCDate()
  )}${pad(pkt.getUTCHours())}${pad(pkt.getUTCMinutes())}${pad(
    pkt.getUTCSeconds()
  )}`;
};

/**
 * JazzCash secure hash (HTTP POST / Page Redirect).
 * Per the official spec + reference implementations:
 *   1. take every non-empty pp_* / ppmpf_* field EXCEPT pp_SecureHash
 *   2. sort by key (ASCII ascending) and concatenate the VALUES with "&"
 *   3. prepend the Integrity Salt, then HMAC-SHA256 keyed with that same salt
 *   4. hex digest
 */
const buildHashString = (fields, salt) => {
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
  return { keys, toHash };
};

const computeSecureHash = (fields, salt) => {
  const { toHash } = buildHashString(fields, salt);
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

    // Full hosted page-redirection field set. The empty ones (pp_TxnType,
    // pp_SubMerchantID, pp_BankID, pp_ProductID) MUST still be posted — the
    // hosted merchantform expects them present so the customer can pick a
    // payment method on JazzCash's page. They're empty, so both our hash and
    // JazzCash's hash skip them (consistent), but omitting the fields entirely
    // triggers "insufficient merchant information".
    const fields = {
      pp_Version: "1.1",
      pp_TxnType: "",
      pp_Language: "EN",
      pp_MerchantID: cfg.merchantId,
      pp_SubMerchantID: "",
      pp_Password: cfg.password,
      pp_BankID: "",
      pp_ProductID: "",
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

    // Log the exact signed field set we hand to the browser (sandbox only).
    if (process.env.NODE_ENV !== "PRODUCTION") {
      console.log("JazzCash /initiate → posting to:", cfg.postUrl);
      console.log("JazzCash /initiate fields:", JSON.stringify({ ...fields, pp_Password: "***" }, null, 2));
    }

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

    // Sandbox diagnostics: see exactly what we signed vs. what JazzCash sent.
    // Remove (or gate) before production — this prints the salt-derived string.
    if (process.env.NODE_ENV !== "PRODUCTION") {
      const { keys, toHash } = buildHashString(data, cfg.salt);
      console.log("JazzCash /callback body:", JSON.stringify(data, null, 2));
      console.log("JazzCash /callback signed keys:", keys);
      console.log("JazzCash /callback string-to-sign:", toHash);
      console.log("JazzCash /callback salt present:", Boolean(cfg.salt), "len:", (cfg.salt || "").length);
      console.log("JazzCash /callback hash received:", received);
      console.log("JazzCash /callback hash expected:", expected);
    }

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
      // notify customer + sellers now that payment is confirmed
      const paidOrders = await Order.find({ "paymentInfo.id": txnRefNo });
      sendOrderEmails(paidOrders, paidOrders[0]?.user).catch(() => {});
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

// ── 3) IPN (Instant Payment Notification) ─────────────────────────────────
// Server-to-server "safety net". JazzCash POSTs the payment result here
// directly, independent of the customer's browser — so the order still gets
// resolved even if the customer closes the tab before the /callback redirect.
//
// Two rules that matter:
//   • ALWAYS return HTTP 200 (even on a bad hash), or JazzCash keeps retrying.
//   • Be idempotent — this can race/overlap with /callback for the same txn,
//     so only act on orders still "Pending" and only email on the first win.
router.post(
  "/ipn",
  catchAsyncErrors(async (req, res) => {
    const cfg = config();
    const data = req.body || {};

    // Sandbox visibility: dump exactly what JazzCash POSTs here so you can see
    // the real field set/values while testing. Safe to remove for production.
    console.log("JazzCash IPN payload:", JSON.stringify(data, null, 2));

    const txnRefNo = data.pp_TxnRefNo;
    const received = data.pp_SecureHash || "";
    const expected = computeSecureHash(data, cfg.salt);

    // Verify integrity, but never make JazzCash retry: log + 200 on mismatch.
    if (!txnRefNo || !received || received.toLowerCase() !== expected.toLowerCase()) {
      console.warn("JazzCash IPN: invalid or missing secure hash", { txnRefNo });
      return res.status(200).send("OK");
    }

    if (data.pp_ResponseCode === "000") {
      // Claim only the still-Pending orders for this txn. If /callback already
      // approved them, matchedCount is 0 and we skip the emails — no dupes.
      const result = await Order.updateMany(
        { "paymentInfo.id": txnRefNo, "paymentInfo.status": "Pending" },
        {
          $set: {
            status: "Processing",
            "paymentInfo.status": "Approved",
            paidAt: new Date(),
          },
        }
      );
      if (result.modifiedCount > 0) {
        const paidOrders = await Order.find({ "paymentInfo.id": txnRefNo });
        sendOrderEmails(paidOrders, paidOrders[0]?.user).catch(() => {});
      }
    } else {
      // declined / cancelled / expired — drop any pending order(s) for this txn
      await Order.deleteMany({
        "paymentInfo.id": txnRefNo,
        "paymentInfo.status": "Pending",
      });
    }

    return res.status(200).send("OK");
  })
);

module.exports = router;
