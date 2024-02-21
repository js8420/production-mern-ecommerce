import mongoose from "mongoose";

const productScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.ObjectId,
      ref: "Category", // model name that is given in the categoryModel.js
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    // If you use cloudinary, then you can use type as String.
    photo: {
      data: Buffer,
      contentType: String,
    },
    shipping: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Products", productScheme);
