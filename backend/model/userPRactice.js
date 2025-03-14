const express = require("express");
const router = express.Router();
const User = require("../model/user");

router.post("/create-user", async (req, res) => {
  try {
    const user = await User.create(req.body);
  } catch (error) {
    console.log("🚀 ~ router.post ~ error:", error);
  }
});

router.post("/get-users", async (req, res) => {
  try {
    const user = await User.find();
    res.status(201).json(user);
  } catch (error) {
    console.log("🚀 ~ router.post ~ error:", error);
  }
});
router.post("/get-user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(201).json(user);
  } catch (error) {
    console.log("🚀 ~ router.post ~ error:", error);
  }
});
router.post("/update-user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) return res.status(404).json({ message: "user not found" });
    res.status(201).json(user);
  } catch (error) {
    console.log("🚀 ~ router.post ~ error:", error);
  }
});
router.post("/delete-user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "user not found" });
    res.status(201).json({message:"uuser deleted successfully"});
  } catch (error) {
    console.log("🚀 ~ router.post ~ error:", error);
  }
});
