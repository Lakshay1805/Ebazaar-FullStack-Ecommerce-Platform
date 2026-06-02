const express = require("express")
const router = express.Router()
const {createOrder , verifyPayment} = require("../controller/paymentController.js")

router.route("/order").post(createOrder)
router.route("/verify").post(verifyPayment)


module.exports = router;