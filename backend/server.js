const app = require("./app");
const mongoose=require("mongoose")
const connectDatabase=require("./db/Database.js")
const cloudinary = require("cloudinary").v2;
const express = require("express");  
// handling uncaught Execption

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server for handling uncaught exception`);
});

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}
console.log(process.env.CLOUDINARY_NAME,"jjj");
console.log(process.env.CLOUDINARY_API_KEY,"jjjsss"),
console.log(process.env.CLOUDINARY_API_SECRET,'dahfasdfhk')

// connect 
connectDatabase();
// pre requist for deployement 
// const __dirname = path.resolve();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})
app.use(express.static(path.join(__dirname, "/frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});



// create server
const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on http://localhost:${process.env.PORT}`
  );
});

// unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(err)
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`shutting down the server for unhandle promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});
