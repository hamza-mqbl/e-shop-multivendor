const express = require("express");
const jwt = require("jsonwebtoken");
const Player = require("../model/player");
console.log("🚀 ~ Player:", Player);
const router = express.Router();

router.post("/register", async (req, res) => {
  console.log("Register API hit"); // Add this line to check if the API is called

  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let player = await Player.findOne({ email }); // Fix query: `{ email }`
    if (player) {
      console.log("🚀 ~ router.post ~ player:", player);
      return res.status(400).json({ message: "Email already exists" });
    }
    player = await Player.create({ name, email, password });
    const token = player.getJwtToken();
    console.log("🚀 ~ router.post ~ token:", token);
    res.status(201).json({ success: true, token, player });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ success: false, error });
  }
});

router.get("/getALLPlayer", async (req, res) => {
  try {
    const players = await Player.find();
    res.status(200).json({ players });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      error,
    });
  }
});
router.put("/updatePlayer/:id", async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!player) {
      res.status(400).json({
        message: "player not found with this id",
      });
    }
    res.status(200).json(player);
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
});
router.delete("/deletePlayer/:id", async (req, res) => {
  try {
    let player = await Player.findByIdAndDelete(req.params.id);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.status(200).json({ message: "Player deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      error,
      success: false,
    });
  }
});

module.exports = router;
