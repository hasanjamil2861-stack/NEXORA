const express = require("express")

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware")

const {
  getReportOverview,
} = require("../controllers/reportController")

const router = express.Router()

// Get report overview - Admin only
router.get(
  "/reports/overview",
  protect,
  adminOnly,
  getReportOverview
)

module.exports = router