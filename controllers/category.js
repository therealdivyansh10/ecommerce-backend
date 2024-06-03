const Category = require("../models/category.model");
const {ApiResponse} = require("../utils/ApiResponse");


exports.getCategories = async(req,res) => {
    try{
        const categories = await Category.find()
        return res.json(new ApiResponse(200,categories,"categories found"));

    } catch (error){
        return res.json(new ApiResponse(500,null,error.message));
    }
}

exports.createCategory = async (req,res) => {
    try{
        const {name} = req.body;
        const category = await Category.findOne({name});

        if(category) return res.json(new ApiResponse(400,null,"Category already exists"));

        const newCategory = await Category.create({name});
        res.json(new ApiResponse(200,newCategory,"new Category created"))

    } catch (error){
        res.json(new ApiResponse(500,null,error.message))
    }
}

exports.deleteCategory = async (req,res) => {
    try{
        const categoryId = req.params.id;
        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        if (!deletedCategory) {
            // If no category was found with the given ID, return an error response
            return res.json(new ApiResponse(404, null, 'Category not found'));
        }

        return res.json(new ApiResponse(200,deletedCategory,"deleted a category"))

    } catch (error){
        res.json(new ApiResponse(500,null,error.message));
    }
}


exports.updateCategory = async (req,res) => {
    try{
        const categoryId = req.params.id;
        const {name} = req.body;
        const updatedCategory = await Category.findByIdAndUpdate({_id:categoryId},{name});

        if (!updatedCategory) {
            return res.json(new ApiResponse(404, null, 'Category not found'));
        }

        return res.json(new ApiResponse(200,updatedCategory,"updated a category"))

    } catch (error){
        res.json(new ApiResponse(500,null,error.message));
    }
}