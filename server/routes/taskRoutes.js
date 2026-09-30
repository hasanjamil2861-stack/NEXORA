const express = require("express")

const {
    protect,
    adminOnly,
} = require("../middleware/authMiddleware")

const {
    getTasks,
    postTask,
    updateTask,
    deleteTask,
} = require("../controllers/taskController")

const router = express.Router()

// Create a task - Admin only
router.post(
    "/tasks",
    protect,
    adminOnly,
    postTask
)

// Get all tasks - Admin + Employee
router.get(
    "/tasks",
    protect,
    getTasks
)

// Update a task - Admin only
router.put(
    "/tasks/:id",
    protect,
    adminOnly,
    updateTask
)

// Delete a task - Admin only
router.delete(
    "/tasks/:id",
    protect,
    adminOnly,
    deleteTask
)

module.exports = router