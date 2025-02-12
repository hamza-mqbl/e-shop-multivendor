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
  'http://localhost:3000',  // Local development
  'http://localhost:8000',  // Local development
  'http://13.60.95.182:8000',
  'https://e-shop-server-zeta.vercel.app/',
  'https://e-shop-frontend-six.vercel.app/',
  'https://e-shop-multivendor.onrender.com'  // Production
];

app.use(
  cors({
    origin: function(origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
// app.use()
app.use("/", express.static("uploads")); //setup done for 2nd branch
// Increase the payload size limit
app.use(bodyParser.json({ limit: '50mb' })); // Increase limit as needed
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
console.log("🚀 ~ player:", player)

const shop = require("./controller/shop");
const product = require("./controller/product");
const event = require("./controller/event");
const coupon = require("./controller/cupounCode");
const payment = require("./controller/payment");
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