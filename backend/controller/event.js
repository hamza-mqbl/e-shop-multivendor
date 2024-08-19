const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
// const { upload } = require("../multer");
const Shop = require("../model/shop");
const Event = require("../model/event");
// const event = require("../model/event");
const { isSeller } = require("../middleware/auth");
const ErrorHandler = require("../utils/ErrorHandler");
const multer = require("multer");
const router = express.Router();
const cloudinary = require("cloudinary").v2;

const storage = multer.memoryStorage();
const upload = multer({ storage });
// create event
// Create event route
router.post(
  "/create-event",
  upload.array("images"), // Use `upload.array` to handle multiple files
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);

      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      }

      let imagesLinks = [];

      if (req.files && req.files.length > 0) {
        // Iterate over each file and upload to Cloudinary
        for (let i = 0; i < req.files.length; i++) {
          const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: "products",
              },
              (error, result) => {
                if (error) {
                  return reject(new ErrorHandler("Cloudinary upload error", 500));
                }
                resolve(result);
              }
            );
            uploadStream.end(req.files[i].buffer);
          });

          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
      }

      const productData = req.body;
      productData.images = imagesLinks;
      productData.shop = shop;

      const event = await Event.create(productData);

      res.status(201).json({
        success: true,
        event,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);
// router.post(
//   "/create-event",
//   catchAsyncErrors(async (req, res, next) => {
//     console.log(req.body,"it is that")
//     try {
//       const shopId = req.body.shopId;
//       console.log("🚀 ~ catchAsyncErrors ~ shopId:", shopId)
//       const shop = await Shop.findById(shopId);
//       console.log("🚀 ~ catchAsyncErrors ~ shop:", shop)
//       if (!shop) {
//         return next(new ErrorHandler("Shop Id is invalid!", 400));
//       } else {
//         let images = [];

//         if (typeof req.body.images === "string") {
//           images.push(req.body.images);
//         } else {
//           images = req.body.images;
//         }

//         const imagesLinks = [];

//         for (let i = 0; i < images.length; i++) {
//           const result = await cloudinary.v2.uploader.upload(images[i], {
//             folder: "products",
//           });

//           imagesLinks.push({
//             public_id: result.public_id,
//             url: result.secure_url,
//           });
//         }

//         const productData = req.body;
//         productData.images = imagesLinks;
//         productData.shop = shop;

//         const event = await Event.create(productData);

//         res.status(201).json({
//           success: true,
//           event,
//         });
//       }
//     } catch (error) {
//       return next(new ErrorHandler(error, 400));
//     }
//   })
// );

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
