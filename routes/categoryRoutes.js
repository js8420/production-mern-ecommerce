import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
import {
  categoryController,
  createCategoryController,
  deleteCategoryController,
  singleCategoryController,
  singleCategoryControllerById,
  updateCategoryController,
} from "../controllers/categoryController.js";

const router = express.Router();

// routes
// create category
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

// update category
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

// get all categories
router.get("/get-category", categoryController);

// get single category
router.get("/single-category/:slug", singleCategoryController);

// get single category by ID
router.get("/single-category-id/:id", singleCategoryControllerById);

// delete category
router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deleteCategoryController
);

export default router;
