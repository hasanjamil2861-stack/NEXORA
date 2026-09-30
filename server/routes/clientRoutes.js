const express = require("express")

const {
    protect,
    adminOnly,
} = require("../middleware/authMiddleware")

const {
    getClients,
    postClient,
    updateClient,
    deleteClient,
} = require("../controllers/clientController")

const router = express.Router()

// Create a client - Admin only
router.post(
    "/clients",
    protect,
    adminOnly,
    postClient
)

// Get all clients - Admin + Employee
router.get(
    "/clients",
    protect,
    getClients
)

// Update a client - Admin only
router.put(
    "/clients/:id",
    protect,
    adminOnly,
    updateClient
)

// Delete a client - Admin only
router.delete(
    "/clients/:id",
    protect,
    adminOnly,
    deleteClient
)

module.exports = router