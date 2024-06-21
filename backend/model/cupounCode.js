const mongoose = require("mongoose");
const cupounCodeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your cupoun code name"],
  },
  value: {
    type: Number,
    required: true,
  },
  minAmount: {
    type: Number,
  },
  maxAmount: {
    type: Number,
  },
  selectedProduct: {
    type: String,
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("CupounCode", cupounCodeSchema);
