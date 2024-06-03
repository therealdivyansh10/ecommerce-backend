const express = require("express");
const router = express.Router();
const {getCategories,createCategory,deleteCategory,updateCategory} = require("../controllers/category");
const {auth, isAdmin } = require("../middlewares/auth");


router.get("/getCategories",getCategories);
router.post("/createCategory",auth,isAdmin,createCategory);
router.delete("/deleteCategory/:id",auth,isAdmin,deleteCategory);
router.put("/updateCategory/:id",auth,isAdmin,updateCategory);


// another syntax
// router.route("/category")
// .get(getCategories)
// .post(auth,authAdmin,createCategory)



module.exports = router;