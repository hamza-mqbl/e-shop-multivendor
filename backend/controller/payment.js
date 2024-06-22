const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
router.post(
  "/process",
  catchAsyncErrors(async (req, res, next) => {
    console.log("api is hitting ")
    console.log("req.body,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,", req.body);

    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "usd",
      metadata: {
        company: "Hamza",
      },
    });
    res.status(201).json({
      success: true,
      client_secret: myPayment.client_secret,
    });
      console.log("🚀 ~ res.status ~  myPayment:",  myPayment)
  })
);

router.get(
  "/stripeapikey",
  catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({
      stripeApiKey: process.env.STRIPE_API_KEY,
    });
  })
);

module.exports=router;