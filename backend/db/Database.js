const mongoose = require("mongoose");

// Serverless-safe connection.
//
// On Vercel each request may hit a reused (frozen→thawed) container whose old
// socket is dead. Opening a new connection per cold start and never awaiting it
// leaves queries buffering until they time out ("buffering timed out after
// 10000ms"). Instead we cache ONE connection promise on the global object and
// await it on every request (see the guard middleware in app.js), so warm
// invocations reuse a live connection and cold ones wait for it to be ready.
let cached = global.__qadamMongoose;
if (!cached) cached = global.__qadamMongoose = { conn: null, promise: null };

const connectDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URL, {
        // Don't buffer queries while (re)connecting — fail fast instead of
        // hanging, and let the awaited connection gate requests.
        bufferCommands: false,
        serverSelectionTimeoutMS: 8000,
      })
      .then((m) => {
        console.log("MongoDB connected");
        return m;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // reset so the next request can retry
    console.error("Error connecting to MongoDB:", error.message);
    throw error;
  }
  return cached.conn;
};

module.exports = connectDatabase;
