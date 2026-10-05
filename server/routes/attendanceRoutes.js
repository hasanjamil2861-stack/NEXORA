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

const router =
  express.Router()

router.get(
  "/attendance",
  protect,
  getAttendance
)

router.post(
  "/attendance",
  protect,
  postAttendance
)

router.put(
  "/attendance/:id",
  protect,
  updateAttendance
)

router.delete(
  "/attendance/:id",
  protect,
  adminOnly,
  deleteAttendance
)

module.exports = router