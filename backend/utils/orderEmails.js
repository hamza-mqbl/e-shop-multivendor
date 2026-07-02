const sendMail = require("./sendMail");
const Shop = require("../model/shop");

const money = (n) => `Rs ${n}`;

const itemsList = (cart) =>
  (cart || [])
    .map(
      (i) =>
        `• ${i.name} x ${i.qty} — ${money(i.discountPrice * i.qty)}` +
        (i.selectedSize ? ` (Size ${i.selectedSize})` : "")
    )
    .join("\n");

const addressOf = (a = {}) =>
  [a.address1, a.address2, a.city, a.country, a.zipCode]
    .filter(Boolean)
    .join(", ");

/**
 * Fire order emails: one confirmation to the customer and one notification per
 * shop to the seller. Never throws — a mail failure must not break the order.
 */
const sendOrderEmails = async (orders, user) => {
  if (!orders || !orders.length) return;

  const address = addressOf(orders[0].shippingAddress);
  const payType = orders[0].paymentInfo?.type || "—";

  // 1) customer confirmation (all items across every shop-order)
  try {
    if (user?.email) {
      const allItems = orders.flatMap((o) => o.cart || []);
      await sendMail({
        email: user.email,
        subject: "Your Qadam order is confirmed",
        message:
          `Hi ${user.name || "there"},\n\n` +
          `Thank you for shopping with Qadam! Your order is confirmed.\n\n` +
          `Items:\n${itemsList(allItems)}\n\n` +
          `Total: ${money(orders[0].totalPrice)}\n` +
          `Payment: ${payType}\n` +
          `Deliver to: ${address}\n\n` +
          `We'll let you know as soon as it ships.\n\n— Team Qadam`,
      });
    }
  } catch (e) {
    console.log("Customer order email failed:", e.message);
  }

  // 2) seller notification, one per shop
  for (const order of orders) {
    try {
      const shopId = order.cart?.[0]?.shopId;
      if (!shopId) continue;
      const shop = await Shop.findById(shopId);
      if (!shop?.email) continue;
      const subtotal = (order.cart || []).reduce(
        (a, i) => a + i.discountPrice * i.qty,
        0
      );
      await sendMail({
        email: shop.email,
        subject: `New order on Qadam — ${money(subtotal)}`,
        message:
          `Hi ${shop.name || "there"},\n\n` +
          `You have a new order.\n\n` +
          `Items:\n${itemsList(order.cart)}\n\n` +
          `Order value: ${money(subtotal)}\n` +
          `Payment: ${payType}\n` +
          `Customer: ${user?.name || ""} (${user?.email || ""})\n` +
          `Deliver to: ${address}\n\n` +
          `Manage it in your dashboard → All Orders.\n\n— Qadam`,
      });
    } catch (e) {
      console.log("Seller order email failed:", e.message);
    }
  }
};

module.exports = sendOrderEmails;
