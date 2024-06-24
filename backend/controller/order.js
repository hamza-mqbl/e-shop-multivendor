const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const { isAuthenticated } = require("../middleware/auth");
const Order = require("../model/order");
const Product = require("../model/product");

router.post(
  "/create-order",
  catchAsyncErrors(async (req, res, next) => {
    console.log("api is hitting now");
    try {
      const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;
      console.log("req.body,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", req.body);
      //  group cart item by shopid
      const shopItemsMap = new Map();
      for (const item of cart) {
        const shopId = item.shopId;
        if (!shopItemsMap.has(shopId)) {
          shopItemsMap.set(shopId, []);
        }
        shopItemsMap.get(shopId).push(item);
      }
      //   creat an order for each shop
      const orders = [];
      for (const [shopId, items] of shopItemsMap) {
        const order = await Order.create({
          cart: items,
          shippingAddress,
          user,
          totalPrice,
          paymentInfo,
        });
        orders.push(order);
      }
      res.status(201).json({
        success: true,
        orders,
      });
      console.log("🚀 ~ res.status ~ orders:", orders);
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);
// get all order for user
router.get(
  "/get-all-orders/:userId",
  catchAsyncErrors(async (req, res, next) => {
    // console.log(req.params.userId);
    console.log("api is hitting ");
    try {
      const orders = await Order.find({ "user._id": req.params.userId }).sort({
        createdAt: -1,
      });
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// get all orders for seller
router.get(
  "/get-seller-all-orders/:shopId",
  catchAsyncErrors(async (req, res, next) => {
    console.log("API is hitting ");
    try {
      const orders = await Order.find({
        "cart.shopId": req.params.shopId,
      }).sort({
        createdAt: -1,
      });
      if (orders.length == 0) {
        res.status(404).json({
          message: "there is no order for this shop",
        });
      }
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

module.exports = router;
