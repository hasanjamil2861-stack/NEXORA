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

// Get all contracts - Admin only
router.get(
  "/contracts",
  protect,
  adminOnly,
  getContracts
)

// Create contract - Admin only
router.post(
  "/contracts",
  protect,
  adminOnly,
  postContract
)

// Update contract - Admin only
router.put(
  "/contracts/:id",
  protect,
  adminOnly,
  updateContract
)

// Delete contract - Admin only
router.delete(
  "/contracts/:id",
  protect,
  adminOnly,
  deleteContract
)

module.exports = router