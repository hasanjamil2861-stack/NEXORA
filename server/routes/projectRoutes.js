const express = require("express")

const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")

const {
  getProjects,
  postProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController")

const router = express.Router()

// Create a project
router.post(
  "/projects",
  authMiddleware,
  postProject
)

// Get all projects
router.get(
  "/projects",
  authMiddleware,
  getProjects
)

// Update a project
router.put(
  "/projects/:id",
  authMiddleware,
  updateProject
)

// Delete a project
router.delete(
  "/projects/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  deleteProject
)

module.exports = router