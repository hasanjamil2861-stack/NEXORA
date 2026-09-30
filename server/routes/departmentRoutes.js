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

// Get all departments - Admin + Employee
router.get(
    "/departments",
    protect,
    getDepartments
)

// Create a department - Admin only
router.post(
    "/departments",
    protect,
    adminOnly,
    postDepartment
)

// Update a department - Admin only
router.put(
    "/departments/:id",
    protect,
    adminOnly,
    updateDepartment
)

// Delete a department - Admin only
router.delete(
    "/departments/:id",
    protect,
    adminOnly,
    deleteDepartment
)

module.exports = router