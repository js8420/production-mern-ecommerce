import mongoose from "mongoose";

import colors from "colors";
const { bgRed } = colors;

// Connect MongoDB
const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URL);
    // console.log(`Connection to MongoDB is successful. Host: ${con.connection.host}`.bgBlue.white);
  } catch (error) {
    // console.log(`Error in MongoDB, inside db.js: ${error}`.bgRed.white);
  }
};

export default connectDB;
