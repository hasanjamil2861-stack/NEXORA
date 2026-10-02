const express = require("express")

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware")

const {
  getContracts,
  postContract,
  updateContract,
  deleteContract,
} = require("../controllers/contractController")

const router = express.Router()

router.get(
  "/contracts",
  protect,
  getContracts
)

router.post(
  "/contracts",
  protect,
  adminOnly,
  postContract
)

router.put(
  "/contracts/:id",
  protect,
  adminOnly,
  updateContract
)

router.delete(
  "/contracts/:id",
  protect,
  adminOnly,
  deleteContract
)

module.exports = router