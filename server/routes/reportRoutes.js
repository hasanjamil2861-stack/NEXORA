const express = require("express")

const authMiddleware = require("../middleware/authMiddleware")
const {
  getReportOverview,
} = require("../controllers/reportController")

const router = express.Router()

// Get report overview
router.get(
  "/reports/overview",
  authMiddleware,
  getReportOverview
)

module.exports = router