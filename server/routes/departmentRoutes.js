const express = require("express")

const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")

const {
  getDepartments,
  postDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController")

const router = express.Router()

// Get all departments
router.get(
  "/departments",
  authMiddleware,
  getDepartments
)

// Create a department
router.post(
  "/departments",
  authMiddleware,
  postDepartment
)

// Update a department
router.put(
  "/departments/:id",
  authMiddleware,
  updateDepartment
)

// Delete a department
router.delete(
  "/departments/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  deleteDepartment
)

module.exports = router