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

router.get(
  "/tasks",
  protect,
  getTasks
)

router.post(
  "/tasks",
  protect,
  adminOnly,
  postTask
)

router.put(
  "/tasks/:id",
  protect,
  updateTask
)

router.delete(
  "/tasks/:id",
  protect,
  adminOnly,
  deleteTask
)

module.exports = router