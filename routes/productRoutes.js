import express from "express";
import formidable from "express-formidable"; // for file upload

import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  braintreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  relatedProductController,
  searchProductController,
  updateProductController,
} from "../controllers/productController.js";

const router = express.Router();

// routes
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

// get products
router.get("/get-product", getProductController);

// get single product
router.get("/get-product/:slug", getSingleProductController);

// get photo
router.get("/product-photo/:pid", productPhotoController);

// delete product
router.delete("/delete-product/:pid", deleteProductController);

// update product
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

// filter product
router.post("/product-filters", productFiltersController);

// product count
router.get("/product-count", productCountController);

// product per page for pagination
router.get("/product-list/:page", productListController);

// search product
router.get("/search/:keyword", searchProductController);

// similar products based on product id, category id
router.get("/related-product/:pid/:cid", relatedProductController);

// category-wise product
router.get("/product-category/:slug", productCategoryController);

// get token from Braintree for verification. Only after verification, we can perform transactions.
router.get("/braintree/token", braintreeTokenController);

// payment routes
router.post("/braintree/payment", requireSignIn, braintreePaymentController);

export default router;
