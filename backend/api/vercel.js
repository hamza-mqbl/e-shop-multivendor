const app = require("../app"); // Import your Express app
const connectDatabase = require("../db/Database");
const cloudinary = require("cloudinary").v2;
const serverless = require("serverless-http");
require("dotenv").config({ path: "config/.env" });

// Connect to database
connectDatabase();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Export serverless function
module.exports = serverless(app);
