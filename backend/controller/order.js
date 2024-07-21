const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const { isAuthenticated, isSeller } = require("../middleware/auth");
const Order = require("../model/order");
const Product = require("../model/product");
const Shop = require("../model/shop");

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

// update user status for seller
// router.put(
//   "/update-order-status/:id",
//   isSeller,
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       console.log("api working");
//       const order = await Order.findById(req.params.id);
//       if (!order) {
//         return next(new ErrorHandler("Order not found with this id", 400));
//       }
//       if (req.body.status === "Transferred to delivery partner") {
//         order.cart.forEach(async (o) => {
//           await updateOrder(o._id, o.qty);
//         });
//       }
//       order.status = req.body.status;
//       if (req.body.status === "Delivered") {
//         order.deliveredAt = Date.now();
//         order.paymentInfo.status = "Succeeded";
//       }
//       await order.save({ validateBeforeSave: false });
//       res.status(200).json({
//         success: true,
//         message: "Order status updated successfully",
//         order,
//       });
//       console.log("🚀 ~ catchAsyncErrors ~ order:", order);
//       async function updateOrder(id, qty) {
//         const product = await Product.findById(id);
//         product.stock -= qty;
//         product.sold_out += qty;

//         await product.save({ validateBeforeSave: false });
//         console.log("🚀 ~ updateOrder ~ product:", product)
//       }
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   })
// );

const updateOrder = async (id, qty) => {
  console.log("🚀 ~ updateOrder ~ qty:", qty);
  const product = await Product.findById(id);
  if (!product) {
    throw new ErrorHandler("Product not found with this id", 400);
  }
  product.stock -= qty;
  product.sold_out += qty;
  await product.save({ validateBeforeSave: false });
  console.log("🚀 ~ updateOrder ~ product:", product);
};
// update order status for seller
router.put(
  "/update-order-status/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log("api working");
      const order = await Order.findById(req.params.id);
      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }
      if (req.body.status === "Transferred to delivery partner") {
        for (const o of order.cart) {
          await updateOrder(o._id, o.qty);
        }
      }
      order.status = req.body.status;
      if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
        order.paymentInfo.status = "Succeeded";
        const serviceCharge = order.totalPrice * 0.1;
        await updateSellerInfo(order.totalPrice - serviceCharge);
      }
      await order.save({ validateBeforeSave: false });
      res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        order,
      });
      async function updateSellerInfo(amount) {
        const seller = await Shop.findById(req.seller.id);

        seller.availableBalance = amount;

        await seller.save();
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);
// give a refund ----- user
// give a refund ----- user
router.put(
  "/order-refund/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      order.status = req.body.status;

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
        message: "Order Refund Request successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
// accept the refund ---- seller
router.put(
  "/order-refund-success/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      order.status = req.body.status;

      await order.save();

      res.status(200).json({
        success: true,
        message: "Order Refund successfull!",
      });

      if (req.body.status === "Refund Success") {
        order.cart.forEach(async (o) => {
          await updateOrder(o._id, o.qty);
        });
      }

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);

        product.stock += qty;
        product.sold_out -= qty;

        await product.save({ validateBeforeSave: false });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


module.exports = router;
