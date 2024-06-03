const router = require("express").Router();
const {
    deleteProduct,
    updateProduct,
    getAllProducts,
    addProduct,
  } = require("../controllers/product");
const { auth } = require("../middlewares/auth");
 
 router.get("/getAllProducts", getAllProducts);
router.post("/addProduct", addProduct);
router.delete("/deleteProduct", deleteProduct);
router.put("/updateProduct", updateProduct);
module.exports = router;
