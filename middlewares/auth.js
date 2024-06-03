const jwt = require("jsonwebtoken");
require("dotenv").config();
const {ApiResponse}  = require("../utils/ApiResponse");

const auth = async (req,res,next) => {
    try{
        const token = req.body.token || req.cookies.accessToken ;
        const payload = jwt.verify(token,process.env.JWT_SECRET);
        const {id,role} = payload;
        req.userId = id;
        req.role = role;
        next();

    } catch (error){
        return res.json(new ApiResponse(401,null,"Invalid Token"));
    }
}


const isAdmin = async (req,res,next) => {
    try{
        if(req.role==="admin"){
            next();
        }else{
            return res.json(new ApiResponse(401,null,"can accessible for admins."));
        }
    } catch (error){
        return res.json(new ApiResponse(401,null,"Something went wrong"));
    }
}

const isCustomer = async (req,res,next) => {
    try{
        if(req.role==="customer"){
            next();
        }else{
            return res.json(new ApiResponse(401,null,"can accessible for customers."));
        }
    } catch (error){
        return res.json(new ApiResponse(401,null,"something went wrong."));
    }
}

module.exports = {auth,isCustomer,isAdmin};
