import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

// controller for create category
export const createCategoryController = async (request, response) => {
  try {
    const { name } = request.body;

    if (!name) {
      return response.status(401).send({ message: "Name is required" });
    }

    const existingCategory = await categoryModel.findOneAndDelete({ name });

    if (existingCategory) {
      return response.status(200).send({
        success: true,
        message: "Category already exists",
      });
    }

    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();

    response.status(201).send({
      success: true,
      message: "New category created",
      category,
    });
  } catch (error) {
    // console.log("Error in createCategoryController\n", error);
    response.status(500).send({
      success: false,
      error,
      message: "Error in createCategoryController",
    });
  }
};

// controller for update category
export const updateCategoryController = async (request, response) => {
  try {
    const { name } = request.body;
    const { id } = request.params;

    const category = await categoryModel.findByIdAndUpdate(
      id,
      {
        name,
        slug: slugify(name),
      },
      { new: true }
    );
    response.status(201).send({
      success: true,
      message: "New category created",
      category,
    });
  } catch (error) {
    // console.log("Error in updateCategoryController\n", error);
    response.status(500).send({
      success: false,
      error,
      message: "Error in updateCategoryController",
    });
  }
};

// get all category
export const categoryController = async (request, response) => {
  try {
    const category = await categoryModel.find({});

    response.status(200).send({
      success: true,
      message: "All categories list",
      category,
    });
  } catch (error) {
    // console.log("Error in categoryController\n", error);
    response.status(500).send({
      success: false,
      error,
      message: "Error in categoryController",
    });
  }
};

// get single category
export const singleCategoryController = async (request, response) => {
  try {
    const { slug } = request.params;
    const category = await categoryModel.findOne({ slug });
    // const category = await categoryModel.findOne({ slug: request.params.slug });

    response.status(200).send({
      success: true,
      message: "Single category successful",
      category,
    });
  } catch (error) {
    // console.log("Error in singleCategoryController\n", error);
    response.status(500).send({
      success: false,
      error,
      message: "Error in singleCategoryController",
    });
  }
};
// In ThunderClient, do:
// Method: GET
// http://localhost:8080/api/v1/category/single-category/kids-collection

// get single category by id
export const singleCategoryControllerById = async (request, response) => {
  try {
    const { id } = request.params;
    const category = await categoryModel.findOne({ _id: id });
    // const category = await categoryModel.findOne({ slug: request.params.slug });

    // console.log(category);

    response.status(200).send({
      success: true,
      message: "Single category by ID successful",
      category,
    });
  } catch (error) {
    // console.log("Error in singleCategoryControllerById\n", error);
    response.status(500).send({
      success: false,
      error,
      message: "Error in singleCategoryControllerById",
    });
  }
};

// delete category
export const deleteCategoryController = async (request, response) => {
  try {
    const { id } = request.params;
    await categoryModel.findByIdAndDelete(id);

    response.status(200).send({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    // console.log("Error in deleteCategoryController\n", error);
    response.status(500).send({
      success: false,
      error,
      message: "Error in deleteCategoryController",
    });
  }
};
