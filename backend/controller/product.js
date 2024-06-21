const express = require("express");
const router = express.Router();
const Product = require("../model/product");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const Shop = require("../model/shop");
const { isSeller } = require("../middleware/auth");

const { upload } = require("../multer");
// create product
router.post(
  "/create-product",
  upload.array("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shopId) {
        return next(new ErrorHandler("Shop id is invalid", 400));
      } else {
        const files = req.files;
        const imageUrls = files.map(
          (file) => `${process.env.BASE_URL}/${file.filename}`
        );

        const productData = req.body;
        productData.images = imageUrls.map(url => ({ url }));
        productData.shop = shop;
        console.log(productData);
        const product = await Product.create(productData);
        res.status(201).json({
          success: true,
          product,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 404));
    }
  })
);

router.get(
  "/get-all-products-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({ shopId: req.params.id });
      // console.log(products);
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 404));
    }
  })
);
// delete product of  a shop
router.delete(
  "/delete-shop-product/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;
      // console.log("productId", productId);
      const product = await Product.findByIdAndDelete(productId);
      // console.log("product", product);
      if (!product) {
        return next(new ErrorHandler("Product not found with this id!", 500));
      }
      res.status({
        success: true,
        message: "product delete successfully ",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 404));
    }
  })
);

// get all products
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
// console.log(products)
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);


module.exports = router;
