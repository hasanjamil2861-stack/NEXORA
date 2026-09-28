const express = require("express")

const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")

const {
  getAttendance,
  postAttendance,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendancesController")

const router = express.Router()

// Create attendance record
router.post(
  "/attendance",
  authMiddleware,
  postAttendance
)

// Get all attendance records
router.get(
  "/attendance",
  authMiddleware,
  getAttendance
)

// Update attendance record
router.put(
  "/attendance/:id",
  authMiddleware,
  updateAttendance
)

// Delete attendance record
router.delete(
  "/attendance/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  deleteAttendance
)

module.exports = router