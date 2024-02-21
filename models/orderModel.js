import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Products",
      },
    ],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "delivered", "cancel"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

// In our orderModel, it contains a user field "products", which is set to type ObjetId, and with the ref option. It tells mongoose to use the id from our productModel to fill the user field in orderModel during population, where all _id we store in the user field of orderModel must be document _id from the productModel.
