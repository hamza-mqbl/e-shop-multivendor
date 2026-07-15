const express = require("express");
const ErrorHandler = require("./middleware/error");
const serverless = require("serverless-http");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:3000", // Local development
  "http://localhost:8000", // Local development
  "https://e-shop-multivendor.vercel.app",
  "https://cbf5-182-189-70-124.ngrok-free.app/",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allowed browser origins get credentialed CORS headers.
      // Anything else (e.g. a payment gateway POSTing the customer back to our
      // callback) is still processed — we just don't add CORS headers. This
      // keeps XHR from unknown origins unreadable while letting cross-site
      // navigations/redirects (JazzCash return) reach their route handler.
    callback(null,true)
    },
    credentials: true,
  })
);

// app.use()
app.use("/", express.static("uploads")); //setup done for 2nd branch
// Increase the payload size limit
app.use(bodyParser.json({ limit: "50mb" })); // Increase limit as needed
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "backend/config/.env",
  });
}

// import routes
const user = require("./controller/user");
const player = require("./controller/player.js");
console.log("🚀 ~ player:", player);

const shop = require("./controller/shop");
const product = require("./controller/product");
const event = require("./controller/event");
const coupon = require("./controller/cupounCode");
const payment = require("./controller/payment");
const jazzcash = require("./controller/jazzcash");
const order = require("./controller/order");
const conversation = require("./controller/converstaion");
const message = require("./controller/message");

app.use("/api/v2/player", player);
app.use("/api/v2/user", user);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/payment", payment);
app.use("/api/v2/jazzcash", jazzcash);
app.use("/api/v2/order", order);
app.use("/api/v2/conversation", conversation);
app.use("/api/v2/message", message);
app.get("/is", (req, res) => {
  res.send("Server is running!");
});

// it is not for errorhandling
app.use(ErrorHandler);

module.exports = app;
module.exports.handler = serverless(app);
