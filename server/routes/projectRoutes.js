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

router.get(
  "/projects",
  protect,
  getProjects
)

router.post(
  "/projects",
  protect,
  adminOnly,
  postProject
)

router.put(
  "/projects/:id",
  protect,
  adminOnly,
  updateProject
)

router.delete(
  "/projects/:id",
  protect,
  adminOnly,
  deleteProject
)

module.exports = router