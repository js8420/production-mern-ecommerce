// Create routes using express

import express from "express";
import {
  registerController,
  loginController,
  forgotPasswordController,
  testController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusUpdateController,
} from "../controllers/authController.js";

import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

// create router object
// You need router object, if you do routing in a separate file.
const router = express.Router();

// Perform routing
// 1) REGISTER || Method POST
router.post("/register", registerController);

// 2) LOGIN || Method POST
router.post("/login", loginController);
/*
Note: Since we are using MVC pattern, we are using registerController from the folder "controllers".
*/

// Forgot Password || Method POST
router.post("/forgot-password", forgotPasswordController);

// TEST route || Method GET
router.get("/test", requireSignIn, isAdmin, testController);

// Protected route auth for user
router.get("/user-auth", requireSignIn, (request, response) => {
  response.status(200).send({ ok: true });
});

// Protected route auth for Admin
router.get("/admin-auth", requireSignIn, isAdmin, (request, response) => {
  response.status(200).send({ ok: true });
});

// update profile
router.put("/user-profile-update", requireSignIn, updateProfileController);

// orders
router.get("/orders", requireSignIn, getOrdersController);

// All orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusUpdateController
);

export default router;
