// Vercel serverless entry.
//
// @vercel/node invokes the module export as a Node HTTP handler (req, res).
// An Express app IS such a handler, so we export it directly. Do NOT wrap it
// with serverless-http here — that returns an AWS Lambda handler
// (event, context) and Vercel would never write a response, hanging every
// request until a 504 timeout.
const app = require("../app");
const connectDatabase = require("../db/Database");
const cloudinary = require("cloudinary").v2;

// Env vars come from the Vercel dashboard in production; config/.env only
// exists locally, so load it best-effort without failing when it's absent.
require("dotenv").config({ path: "config/.env" });

// Prime the Mongo connection at cold start (best-effort). The per-request
// guard middleware in app.js awaits it properly; this just gets a head start.
connectDatabase().catch(() => {});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = app;
