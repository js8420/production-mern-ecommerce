import fs from "fs"; // file system

import slugify from "slugify";

import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";

import braintree from "braintree"; // for braintree payment

import dotenv from "dotenv";

dotenv.config();

// For payment, make the gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// create product
export const createProductController = async (request, response) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      request.fields;
    const { photo } = request.files;

    // validation
    switch (true) {
      case !name:
        return response.status(500).send({ error: "Name is required" });

      case !description:
        return response.status(500).send({ error: "Description is required" });

      case !price:
        return response.status(500).send({ error: "Price is required" });

      case !category:
        return response.status(500).send({ error: "Category is required" });

      case !quantity:
        return response.status(500).send({ error: "Quantity is required" });

      case photo && photo.size > 1000000:
        return response
          .status(500)
          .send({ error: "Photo is required and should be less than 1 MB" });
    }

    // create a  copy of the product
    const products = new productModel({
      ...request.fields,
      slug: slugify(name),
    });

    // validate photo
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    // save the product
    await products.save();

    response.status(200).send({
      success: true,
      message: "Product created successfully",
      products,
    });
  } catch (error) {
    // console.log("Error in createProductController\n", error);
    response.status(500).send({
      success: false,
      message: "Error in createProductController",
      error,
    });
  }
};

// get all products
export const getProductController = async (request, response) => {
  try {
    // get all the fields except photo. Since there can be large number of products, limit the fetch to the size of 12 and sort them in DESCENDING order
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });

    response.status(200).send({
      success: true,
      totalCount: products.length,
      message: "All products",
      products,
    });
  } catch (error) {
    // console.log("Error in getProductController\n", error);
    response.status(500).send({
      success: false,
      message: "Error in getProductController",
      error,
    });
  }
};

// single product controller
export const getSingleProductController = async (request, response) => {
  try {
    const { slug } = request.params;
    const product = await productModel
      .findOne({ slug })
      .select("-photo")
      .populate("category");

    response.status(200).send({
      success: true,
      message: "Single product fetched",
      product,
    });
  } catch (error) {
    // console.log("Error in getSingleProductController\n", error);
    response.status(500).send({
      success: false,
      message: "Error in getSingleProductController",
      error,
    });
  }
};

// get photo
export const productPhotoController = async (request, response) => {
  try {
    const { pid } = request.params;
    const product = await productModel.findById(pid).select("photo");

    if (product.photo.data) {
      response.set("Content-type", product.photo.contentType);
      response.status(200).send(product.photo.data);
    }
  } catch (error) {
    // console.log("Error in productPhotoController\n", error);
    response.status(500).send({
      success: false,
      message: "Error in productPhotoController",
      error,
    });
  }
};

// delete product
export const deleteProductController = async (request, response) => {
  try {
    const { pid } = request.params;
    await productModel.findByIdAndDelete(pid).select("-photo");
    response.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    // console.log("Error in deleteProductController\n", error);
    response.status(500).send({
      success: false,
      message: "Error in deleteProductController",
      error,
    });
  }
};

// update product
export const updateProductController = async (request, response) => {
  try {
    const { name, description, price, category, quantity } = request.fields;
    const { photo } = request.files;

    // validation
    switch (true) {
      case !name:
        return response.status(500).send({ error: "Name is required" });

      case !description:
        return response.status(500).send({ error: "Description is required" });

      case !price:
        return response.status(500).send({ error: "Price is required" });

      case !category:
        return response.status(500).send({ error: "Category is required" });

      case !quantity:
        return response.status(500).send({ error: "Quantity is required" });

      case photo && photo.size > 1000000:
        return response
          .status(500)
          .send({ error: "Photo is required and should be less than 1 MB" });
    }

    const { pid } = request.params;
    const product = await productModel.findByIdAndUpdate(
      pid,
      {
        ...request.fields,
        slug: slugify(name),
      },
      { new: true }
    );

    // validate photo
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    // save the product
    await product.save();

    response.status(200).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    // console.log("Error in updateProductController\n", error);
    response.status(500).send({
      success: false,
      message: "Error in updateProductController",
      error,
    });
  }
};

// filter by price
export const productFiltersController = async (request, response) => {
  try {
    // get two values: one is "category" and another is the "price"
    const { checked, radio } = request.body;

    let args = {};

    // check if category filter is used
    if (checked.length > 0) {
      args.category = checked;
    }

    // check if price filter is used
    if (radio.length) {
      args.price = { $gte: radio[0], $lte: radio[1] };
    }

    const products = await productModel.find(args);

    response.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    // console.log("Error in productFiltersController\n", error);
    response.status(400).send({
      success: false,
      message: "Error in productFiltersController",
      error,
    });
  }
};

// product count
export const productCountController = async (request, response) => {
  try {
    const totalProductCount = await productModel
      .find({})
      .estimatedDocumentCount();
    response.status(200).send({
      success: true,
      totalProductCount,
    });
  } catch (error) {
    // console.log("Error in productCountController\n", error);
    response.status(400).send({
      success: false,
      message: "Error in productCountController",
      error,
    });
  }
};

// product list controller based on page for pagination
export const productListController = async (request, response) => {
  try {
    const perPage = 5;
    const page = request.params.page ? request.params.page : 1;

    // In MongoDB, the skip() method will skip the first n document from the query result, you just need to pass the number of records/documents to be skipped. It basically removes the first n documents from the result set. For example, if your result has 5 records in it and you want to remove the first two records from it then you can use skip(2) at the end of the query.
    // Use the limit() method on a cursor to specify the maximum number of documents the cursor will return.
    // Specify in the sort parameter the field or fields to sort by and a value of 1 or -1 to specify an ascending or descending sort respectively.
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    response.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    // console.log("Error in productListController\n", error);
    response.status(400).send({
      success: false,
      message: "Error in productListController",
      error,
    });
  }
};

// search product
export const searchProductController = async (request, response) => {
  try {
    const { keyword } = request.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");

    response.json(results);
  } catch (error) {
    // console.log("Error in searchProductController\n", error);
    response.status(400).send({
      success: false,
      message: "Error in searchProductController",
      error,
    });
  }
};

// related product
export const relatedProductController = async (request, response) => {
  try {
    const { pid, cid } = request.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");

    response.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    // console.log("Error in relatedProductController\n", error);
    response.status(400).send({
      success: false,
      message: "Error in relatedProductController",
      error,
    });
  }
};

// category-wise product
export const productCategoryController = async (request, response) => {
  try {
    const { slug } = request.params;
    const category = await categoryModel.findOne({ slug });
    const products = await productModel.find({ category }).populate("category");

    response.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    // console.log("Error in productCategoryController\n", error);
    response.status(400).send({
      success: false,
      message: "Error in productCategoryController",
      error,
    });
  }
};

// Payment gateway API
// token controller
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    // console.log(error);
  }
};

// payment route controller
export const braintreePaymentController = async (request, response) => {
  try {
    const { cart, nonce } = request.body;

    let total = 0;
    cart.map((item) => {
      total += item.price;
    });

    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: request.user._id,
          }).save();
          response.json({ ok: true });
        } else {
          // console.log("Error in braintreePaymentController", error);
          response.status(500).send(error);
        }
      }
    );
  } catch (error) {
    // console.log(error);
  }
};
