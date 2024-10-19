const mongoose = require("mongoose");

const connectDatabase = () => {
  // Proper connection string with database name
  mongoose.connect(process.env.MONGO_URL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  }).then(() => {
    console.log(`MongoDb connected with server:`);
  }).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
}

module.exports = connectDatabase;
