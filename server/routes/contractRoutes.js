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

// Create a contract - Admin only
router.post(
    "/contracts",
    protect,
    adminOnly,
    postContract
)

// Get all contracts - Admin + Employee
router.get(
    "/contracts",
    protect,
    getContracts
)

// Update a contract - Admin only
router.put(
    "/contracts/:id",
    protect,
    adminOnly,
    updateContract
)

// Delete a contract - Admin only
router.delete(
    "/contracts/:id",
    protect,
    adminOnly,
    deleteContract
)

module.exports = router