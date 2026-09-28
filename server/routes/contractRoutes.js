const express = require("express")

const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")

const {
  getContracts,
  postContract,
  updateContract,
  deleteContract,
} = require("../controllers/contractController")

const router = express.Router()

// Create a contract
router.post(
  "/contracts",
  authMiddleware,
  postContract
)

// Get all contracts
router.get(
  "/contracts",
  authMiddleware,
  getContracts
)

// Update a contract
router.put(
  "/contracts/:id",
  authMiddleware,
  updateContract
)

// Delete a contract
router.delete(
  "/contracts/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  deleteContract
)

module.exports = router