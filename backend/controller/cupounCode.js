const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const Shop = require("../model/shop");

const { isSeller } = require("../middleware/auth");
const ErrorHandler = require("../utils/ErrorHandler");
const CoupounCode = require("../model/cupounCode");
const router = express.Router();

// create coupoun code
router.post(
  "/create-coupon-code",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const isCoupounCodeExists = await CoupounCode.find({
        name: req.body.name,
      });

      if (isCoupounCodeExists.length !== 0) {
        return next(new ErrorHandler("Coupoun code already exists!", 400));
      }

      const coupounCode = await CoupounCode.create(req.body);
      // console.log("coupounCode", coupounCode);

      res.status(201).json({
        success: true,
        coupounCode,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);
// // get coupons code
// get all coupons of a shop
router.get(
  "/get-coupon/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      // console.log("req.seller.id", req.seller.id); // Add this line

      const couponCodes = await CoupounCode.find({ shop: req.seller.id });
      // console.log("couponCodes", couponCodes);

      res.status(200).json({
        success: true,
        couponCodes,
      });
    } catch (error) {
      console.error(error);
      return next(new ErrorHandler(error, 400));
    }
  })
);

// delete coupon code of a shop
router.delete(
  "/delete-coupon/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const coupon = await CoupounCode.findOneAndDelete(req.params.id);
      if (!coupon) {
        return next(new ErrorHandler("coupon not found with this id!", 500));
      }
      res.status({
        success: true,
        message: "Coupon code delelted successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

//  get coupon code by its name
router.get(
  "/get-coupon-value/:name",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const couponCode = await CoupounCode.findOne({ name: req.params.name });
      res.status(200).json({
        success: true,
        couponCode,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

module.exports = router;
