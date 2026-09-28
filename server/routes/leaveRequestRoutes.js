const express = require("express")

const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")

const {
  getLeaveRequests,
  postLeaveRequest,
  updateLeaveRequest,
  deleteLeaveRequest,
} = require("../controllers/leaveRequestController")

const router = express.Router()

// Create a leave request
router.post(
  "/leaveRequests",
  authMiddleware,
  postLeaveRequest
)

// Get all leave requests
router.get(
  "/leaveRequests",
  authMiddleware,
  getLeaveRequests
)

// Update a leave request
router.put(
  "/leaveRequests/:id",
  authMiddleware,
  updateLeaveRequest
)

// Delete a leave request
router.delete(
  "/leaveRequests/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  deleteLeaveRequest
)

module.exports = router