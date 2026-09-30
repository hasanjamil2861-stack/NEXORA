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

// Create a leave request - Admin + Employee
router.post(
    "/leaveRequests",
    protect,
    postLeaveRequest
)

// Get all leave requests - Admin + Employee
router.get(
    "/leaveRequests",
    protect,
    getLeaveRequests
)

// Update a leave request - Admin only
router.put(
    "/leaveRequests/:id",
    protect,
    adminOnly,
    updateLeaveRequest
)

// Delete a leave request - Admin only
router.delete(
    "/leaveRequests/:id",
    protect,
    adminOnly,
    deleteLeaveRequest
)

module.exports = router