const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const {admin} = require("../middleware/adminMiddleware")
const router = express.Router();
const {getProducts , createProduct , getProductById , updateProduct , deleteProduct, getProductByfilter , rateProduct} = require("../controller/productController")
const multer = require("multer")
const upload = multer({dest : "uploads/"})
const { validateProduct } = require("../middleware/validateMiddleware")

router.route("/")
.get(getProducts)
.post(authenticateToken , admin , upload.single('image'), validateProduct , createProduct)

router.route("/filter")
.get(getProductByfilter)

router.route("/:id")
.get(getProductById)
.post(authenticateToken , rateProduct)
.put(authenticateToken , admin  , upload.single('image') , updateProduct)
.delete(authenticateToken , admin , deleteProduct)

module.exports = router;