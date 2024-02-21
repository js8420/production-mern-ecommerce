import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import JWT from "jsonwebtoken";

// Register controller | Method POST
export const registerController = async (request, response) => {
  try {
    const { name, email, password, phone, address, answer } = request.body;

    // validation
    if (!name) {
      return response.send({ error: "Name is required" });
    }
    if (!email) {
      return response.send({ error: "Email is required" });
    }
    if (!password) {
      return response.send({ error: "Password is required" });
    }
    if (!phone) {
      return response.send({ error: "Phone number is required" });
    }
    if (!address) {
      return response.send({ error: "Address is required" });
    }
    if (!answer) {
      return response.send({ error: "Answer is required" });
    }

    // check for existing user.
    const existingUser = await userModel.findOne({ email: email });

    // if the user is already registered, send the response
    if (existingUser) {
      return response
        .status(200)
        .send({ success: false, message: "Already registered. Please login." });
    }

    // register the user by hashing the password
    const hashedPassword = await hashPassword(password);

    // save
    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      answer,
    }).save();

    response.status(201).send({
      success: true,
      message: "User registered. Please login.",
      user,
    });
  } catch (error) {
    response
      .status(201)
      .send({ success: false, message: `Error in Registration:\n${error}` });
  }
};

// Login controller || Method POST
export const loginController = async (request, response) => {
  try {
    const { email, password } = request.body;

    // Check if the email and password exists
    if (!email || !password) {
      response
        .status(404)
        .send({ success: false, message: `Invalid email or password` });
    }

    // Find the user record for the given email
    const existingUser = await userModel.findOne({ email });

    // If the email is not registered
    if (!existingUser) {
      response
        .status(404)
        .send({ success: false, message: `Email is not registered` });
    }

    // If the email is registered, check the password
    const match = await comparePassword(password, existingUser.password);

    // If the password does not match
    if (!match) {
      response
        .status(200)
        .send({ success: false, message: `Password did not match` });
    }

    // Generate the token based on the user id
    const token = await JWT.sign(
      { _id: existingUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    response.status(200).send({
      success: true,
      message: `Login Successful`,
      user: {
        name: existingUser.name,
        email: existingUser.email,
        phone: existingUser.phone,
        address: existingUser.address,
        role: existingUser.role,
      },
      token,
    });
  } catch (error) {
    response
      .status(500)
      .send({ success: false, message: `Error in Login:\n${error}` });
  }
};

// Forgot Password controller || Method POST
export const forgotPasswordController = async (request, response) => {
  try {
    const { email, answer, newPassword } = request.body;

    if (!email) {
      response.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      response.status(400).send({ message: "Answer is required" });
    }
    if (!newPassword) {
      response.status(400).send({ message: "New password is required" });
    }

    // Check if the email and answer match. If they do, then allow to change the password
    const user = await userModel.findOne({ email, answer });
    // validation
    if (!user) {
      return response.status(404).send({
        success: false,
        message: "Wrong email or answer",
      });
    }

    // hash the new password
    const hashed = await hashPassword(newPassword);
    // update password
    await userModel.findByIdAndUpdate(user.id, { password: hashed });

    response
      .status(200)
      .send({ success: true, message: "Password reset successfully" });
  } catch (error) {
    // console.log(error);
    response.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

// profile update controller
export const updateProfileController = async (request, response) => {
  try {
    const { name, email, password, address, phone } = request.body;

    const user = await userModel.findById(request.user._id);

    // password
    if (!password && password.length < 6) {
      return response.json({
        error: "Password is required and 6 character long",
      });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;

    // if the appropriate field is found in the response, then use this new value or else keep the previous value
    const updatedUser = await userModel.findByIdAndUpdate(
      request.user._id,
      {
        name: name || user.name,
        email: email || email.password,
        password: hashedPassword || user.password,
        address: address || user.address,
        phone: phone || user.phone,
      },
      { new: true }
    );

    response.status(200).send({
      success: true,
      message: "User profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    // console.log("Profile update failed..\n");
    response.status(400).send({
      success: false,
      message: `Error in updateProfileController`,
      error,
    });
  }
};

// order controller
export const getOrdersController = async (request, response) => {
  try {
    const orders = await orderModel
      .find({ buyer: request.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");

    response.json(orders);
  } catch (error) {
    // console.log("Error in getOrdersController", error);
    response.status(500).send({
      success: false,
      message: "Error while getting order information",
      error,
    });
  }
};

// All order controller
export const getAllOrdersController = async (request, response) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: -1 });

    response.json(orders);
  } catch (error) {
    // console.log("Error in getAllOrdersController", error);
    response.status(500).send({
      success: false,
      message: "Error while getting all order information",
      error,
    });
  }
};

// order status update controller
export const orderStatusUpdateController = async (request, response) => {
  try {
    const { orderId } = request.params;

    const { status } = request.body;

    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    response.json(orders);
  } catch (error) {
    // console.log("Error in orderStatusUpdateController", error);
    response.status(500).send({
      success: false,
      message: "Error while updating order status",
      error,
    });
  }
};

// Test controller || Method GET
export const testController = (request, response) => {
  try {
    // console.log("User profile updated successfully..\n");
    response.status(200).send("Protected Route");
  } catch (Error) {
    // console.log("Access Denied..\n");
    response
      .status(500)
      .send({ success: false, message: `Error in Test`, error });
  }
};
