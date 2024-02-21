import mongoose from "mongoose";

// Create user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      trim: true,
    },
    phone: {
      type: String,
      require: true,
      trim: true,
    },
    address: {
      type: {},
      require: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0, // 0 for normal user, 1 for admin
      trim: true,
    },
  },
  { timestamps: true } // Whenever a new user is created, it's created time will be added there.
);

export default mongoose.model("users", userSchema);
