const express = require("express")

const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")

const {
  getTasks,
  postTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController")

const router = express.Router()

// Create a task
router.post(
  "/tasks",
  authMiddleware,
  postTask
)

// Get all tasks
router.get(
  "/tasks",
  authMiddleware,
  getTasks
)

// Update a task
router.put(
  "/tasks/:id",
  authMiddleware,
  updateTask
)

// Delete a task
router.delete(
  "/tasks/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  deleteTask
)

module.exports = router