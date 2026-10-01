const express = require("express")

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware")

const {
  getLeaveRequests,
  postLeaveRequest,
  updateLeaveRequest,
  deleteLeaveRequest,
} = require("../controllers/leaveRequestController")

const router = express.Router()

// Employee + Admin
// Employee can create their own request
router.post(
  "/leave-requests",
  protect,
  postLeaveRequest
)

// Employee -> own requests
// Admin -> all requests
router.get(
  "/leave-requests",
  protect,
  getLeaveRequests
)

// Admin only
// Approve / Reject
router.put(
  "/leave-requests/:id",
  protect,
  adminOnly,
  updateLeaveRequest
)

// Admin only
router.delete(
  "/leave-requests/:id",
  protect,
  adminOnly,
  deleteLeaveRequest
)

module.exports = router