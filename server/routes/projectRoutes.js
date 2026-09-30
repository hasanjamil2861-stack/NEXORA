const express = require("express")

const {
    protect,
    adminOnly,
} = require("../middleware/authMiddleware")

const {
    getProjects,
    postProject,
    updateProject,
    deleteProject,
} = require("../controllers/projectController")

const router = express.Router()

// Create a project - Admin only
router.post(
    "/projects",
    protect,
    adminOnly,
    postProject
)

// Get all projects - Admin + Employee
router.get(
    "/projects",
    protect,
    getProjects
)

// Update a project - Admin only
router.put(
    "/projects/:id",
    protect,
    adminOnly,
    updateProject
)

// Delete a project - Admin only
router.delete(
    "/projects/:id",
    protect,
    adminOnly,
    deleteProject
)

module.exports = router