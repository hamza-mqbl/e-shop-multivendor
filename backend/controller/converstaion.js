const Conversation = require("../model/coversation.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const express = require("express");
const { isSeller, isAuthenticated } = require("../middleware/auth");
const router = express.Router();

router.post(
  "/create-new-conversation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { groupTitle, userId, sellerId } = req.body;
      const isConverstationExixt = await Conversation.findOne({ groupTitle });
      if (isConverstationExixt) {
        const conversation = isConverstationExixt;
        res.status(201).json({
          success: true,
          conversation,
        });
      } else {
        const conversation = await Conversation.create({
          members: [userId, sellerId],
          groupTitle: groupTitle,
        });
        res.status(201).json({
          success: true,
          conversation,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error.response.message), 500);
    }
  })
);


// get seller conversations
router.get(
    "/get-all-conversation-seller/:id",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
      try {
        const conversations = await Conversation.find({
          members: {
            $in: [req.params.id],
          },
        }).sort({ updatedAt: -1, createdAt: -1 });
  
        res.status(201).json({
          success: true,
          conversations,
        });
      } catch (error) {
        return next(new ErrorHandler(error), 500);
      }
    })
  );
  
module.exports = router;
