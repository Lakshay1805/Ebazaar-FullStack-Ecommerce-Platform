const express = require("express")
const { authenticateToken } = require("../middleware/authMiddleware.js")
const { admin } = require("../middleware/adminMiddleware.js")
const router = express.Router()
const {getAdminStats} = require("../controller/analyticController.js")

router.route("/")
.get(authenticateToken , admin , getAdminStats)

module.exports = router;