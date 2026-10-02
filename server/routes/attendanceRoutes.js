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
} = require("../controllers/attendanceController")

const router = express.Router()

router.get(
  "/attendance",
  protect,
  getAttendance
)

router.post(
  "/attendance",
  protect,
  adminOnly,
  postAttendance
)

router.put(
  "/attendance/:id",
  protect,
  adminOnly,
  updateAttendance
)

router.delete(
  "/attendance/:id",
  protect,
  adminOnly,
  deleteAttendance
)

module.exports = router