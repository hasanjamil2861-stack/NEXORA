const express = require("express")

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware")

const {
  getEmployees,
  updateEmployee,
  deleteEmployee,
  postEmployee,
} = require("../controllers/employeeController")

const router = express.Router()

// Create employee - Admin only
router.post(
  "/employees",
  protect,
  adminOnly,
  postEmployee
)

// Get all employees - Admin + Employee
router.get(
  "/employees",
  protect,
  getEmployees
)

// Update employee - Admin only
router.put(
  "/employees/:id",
  protect,
  adminOnly,
  updateEmployee
)

// Delete employee - Admin only
router.delete(
  "/employees/:id",
  protect,
  adminOnly,
  deleteEmployee
)

module.exports = router