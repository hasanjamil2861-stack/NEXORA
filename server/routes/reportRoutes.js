const express = require("express")

const {
    protect,
} = require("../middleware/authMiddleware")

const {
    getReportOverview,
} = require("../controllers/reportController")

const router = express.Router()

// Get report overview - Admin + Employee
router.get(
    "/reports/overview",
    protect,
    getReportOverview
)

module.exports = router