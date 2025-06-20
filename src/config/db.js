const mongoose = require("mongoose");
require("dotenv").config();

const Uri = process.env.MONGO_URI;

const connectDb = async () => {
  await mongoose
    .connect(Uri)
    .then(() => console.log("Database Connected"))
    .catch((error) => console.error("Error in connecting DB", error));
};

module.exports = connectDb;
