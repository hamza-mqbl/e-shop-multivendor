const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
router.post(
  "/payment/process",
  catchAsyncErrors(async (req, res, next) => {
    const myPayment = await stripe.payementIntents.create({
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
