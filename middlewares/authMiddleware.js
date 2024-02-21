// Based on the token, protect the routes

import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Protected routes based on token
export const requireSignIn = async (request, response, next) => {
  try {
    // Note: tokens are available in request under headers.authorization
    const decode = JWT.verify(
      request.headers.authorization,
      process.env.JWT_Secret
    );
    request.user = decode;
    next();
  } catch (error) {
    console.log(error);
    response.status(500).send({
      success: false,
      message: `Restricted Access. Missing or invalid Token`,
      error: error,
    });
  }
};

// Admin access
export const isAdmin = async (request, response, next) => {
  try {
    const user = await userModel.findById(request.user._id); // On successful login, we have passed "user" in the response.

    // Check if the user is admin
    if (user.role !== 1) {
      return response.send({
        success: false,
        message: "Unauthorized Access. Access denied",
      });
    } else {
      next();
    }
  } catch (error) {
    // console.log(error);
    response.status(401).send({
      success: false,
      message: "Error in isAdmin",
      error,
    });
  }
};
