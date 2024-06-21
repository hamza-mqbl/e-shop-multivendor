const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { upload } = require("../multer");
const Shop = require("../model/shop");
const Event = require("../model/event");
// const event = require("../model/event");
const { isSeller } = require("../middleware/auth");
const router = express.Router();

// create event
router.post(
  "/create-event",
  upload.array("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      // console.log(shop);
      if (!shopId) {
        return next(new ErrorHandler("Shop id is invalid", 400));
      } else {
        const files = req.files;
        const imageUrls = files.map(
          (file) => `${process.env.BASE_URL}/${file.filename}`
        );
        const eventData = req.body;
        eventData.images = imageUrls.map((url) => ({ url }));
        eventData.shop = shop;
        // console.log(eventData);
        const event = await Event.create(eventData);
        // console.log(event);
        res.status(201).json({
          success: true,
          event,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 404));
    }
  })
);

// get all event
router.get(
  "/get-all-events-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find({ shopId: req.params.id });
      // console.log(events);
      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 404));
    }
  })
);
// delete product of  a shop
router.delete(
  "/delete-shop-event/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;
      // console.log("productId", productId);
      const event = await Event.findByIdAndDelete(productId);
      // console.log("event", event);
      if (!event) {
        return next(new ErrorHandler("event not found with this id!", 500));
      }
      res.status({
        success: true,
        message: "event delete successfully ",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 404));
    }
  })
);

router.get(
  "/get-all-events",

  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find();
      // console.log(events);
      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);
module.exports = router;
