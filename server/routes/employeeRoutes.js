const express = require("express")

const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")

const {
  getEmployees,
  updateEmployee,
  deleteEmployee,
  postEmployee,
} = require("../controllers/employeeController")

const router = express.Router()

// Create employee
router.post("/employees", postEmployee)

// Get all employees
router.get(
  "/employees",
  authMiddleware,
  getEmployees
)

// Update employee
router.put(
  "/employees/:id",
  updateEmployee
)

// Delete employee
router.delete(
  "/employees/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  deleteEmployee
)

module.exports = router