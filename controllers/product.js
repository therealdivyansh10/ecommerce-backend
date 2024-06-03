const Product = require("../models/product.model");
const { ApiResponse } = require("../utils/ApiResponse");
const path = require("path");
const {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} = require("../utils/imageUploader");
const fs = require("fs");
const Category = require("../models/category.model");

exports.getAllProducts = async (req, res) => {
  try {
    // Extract query parameters for pagination, sorting, and filtering
    const { page = 1, limit = 10, sortBy, sortOrder, category } = req.query;
    const skip = (page - 1) * limit;

    // Construct sort query object if sortBy and sortOrder are provided
    const sortQuery =
      sortBy && sortOrder ? { [sortBy]: sortOrder === "asc" ? 1 : -1 } : {};

    // Construct filter query object based on category or any other filtering criteria
    const filterQuery = {};
    if (category) {
      filterQuery.category = category;
    }

    // Fetch products with pagination, sorting, and filtering
    const productsQuery = Product.find(filterQuery)
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit));
    const products = await productsQuery.exec();

    // Calculate total count for pagination metadata
    const totalCount = await Product.countDocuments(filterQuery);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    const pagination = {
      total: totalCount,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      currentPage: parseInt(page),
    };

    return res.json(
      new ApiResponse(
        200,
        { products, pagination },
        "Successfully found all products"
      )
    );
  } catch (error) {
    return res.json(new ApiResponse(500, null, error.message));
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { title, price, description, content, categoryName } = req.body;

    var category = await Category.findOne({ name: categoryName });

    if (!category) {
      category = new Category({ name: categoryName });
      await category.save();
    }

    // Check if productImage exists in req.files
    if (!req.files || !req.files.productImage) {
      return res.status(500).json(new ApiResponse(500, null, error.message));
    }

    // Retrieve productImage from req.files
    const productImage = req.files.productImage;

    const uploadPath = path.join(__dirname, "temp", `${Date.now()}.png`);

    // Move the uploaded image file to the specified path
    await productImage.mv(uploadPath);

    console.log("Image moved to path:", uploadPath);
    const image = await uploadImageToCloudinary(uploadPath, "ecommerce");
    // get public ID
    const publicId = image.public_id;

    // count the number of products in the schema
    const productId = await Product.find({}).count({});

    // Create product in database
    const product = await Product.create({
      productId,
      title,
      price,
      description,
      content,
      category: category._id,
      publicId,
      image: image.secure_url, // Assuming you want to store the path in the database
    });

    category.products.push(product._id);
    await category.save();

    // deleting the file that was saved locally
    fs.unlink(uploadPath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return;
      }
    });

    return res.json(
      new ApiResponse(200, product, "Successfully added a product")
    );
  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    console.log("delte controller called");
    const { productId } = req.body;
    const product = await Product.findOne({ productId });
    await Product.deleteOne({ productId });

    // delete image from cloudinary
    deleteImageFromCloudinary(product.publicId);
    return res.status(200).json(new ApiResponse(200, "deletion done", null));
  } catch (error) {
    return res.json(new ApiResponse(500, null, error.message));
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { productId, title, price, description, content, category } =
      req.body;
    const product = await Product.updateOne(
      { productId },
      {
        $set: {
          title,
          price,
          description,
          content,
          category,
        },
      }
    );

    return res.status(200).json(new ApiResponse(200, "deletion done", product));
  } catch (error) {
    return res.json(new ApiResponse(500, null, error.message));
  }
};
