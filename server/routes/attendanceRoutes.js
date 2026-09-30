const express = require("express")

const {
    protect,
    adminOnly,
} = require("../middleware/authMiddleware")

const {
    getAttendance,
    postAttendance,
    updateAttendance,
    deleteAttendance,
} = require("../controllers/attendancesController")

const router = express.Router()

// Create attendance record - Admin only
router.post(
    "/attendance",
    protect,
    adminOnly,
    postAttendance
)

// Get all attendance records - Admin + Employee
router.get(
    "/attendance",
    protect,
    getAttendance
)

// Update attendance record - Admin only
router.put(
    "/attendance/:id",
    protect,
    adminOnly,
    updateAttendance
)

// Delete attendance record - Admin only
router.delete(
    "/attendance/:id",
    protect,
    adminOnly,
    deleteAttendance
)

module.exports = router