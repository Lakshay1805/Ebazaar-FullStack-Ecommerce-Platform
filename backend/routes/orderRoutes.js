const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const router = express.Router();
const {getOrders , createOrder , getMyOrders , updateOrderStatus , getRecentOrders , getTopSoldProducts} = require("../controller/orderController.js")
const { validateOrder } = require("../middleware/validateMiddleware.js")

router.route("/")
.get(authenticateToken, admin , getOrders)
.post(authenticateToken , validateOrder , createOrder)

router.route("/recent").get(authenticateToken , admin , getRecentOrders)
router.route("/topSold").get(authenticateToken , admin , getTopSoldProducts)

router.route("/myorders").get(authenticateToken , getMyOrders)

router.route("/:id/status").put(authenticateToken , admin , updateOrderStatus)

module.exports = router;