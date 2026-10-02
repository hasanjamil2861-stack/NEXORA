const express = require("express")

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware")

const {
  getDepartments,
  postDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController")

const router = express.Router()

// Get all departments - Admin only
router.get(
  "/departments",
  protect,
  adminOnly,
  getDepartments
)

// Create department - Admin only
router.post(
  "/departments",
  protect,
  adminOnly,
  postDepartment
)

// Update department - Admin only
router.put(
  "/departments/:id",
  protect,
  adminOnly,
  updateDepartment
)

// Delete department - Admin only
router.delete(
  "/departments/:id",
  protect,
  adminOnly,
  deleteDepartment
)

module.exports = router