const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const router = express.Router()
const {subscribe} = require("../controller/subscriptionController")


router.route("/")
.post(subscribe)

module.exports = router;