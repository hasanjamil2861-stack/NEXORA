const express = require("express")

const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")

const {
  getClients,
  postClient,
  updateClient,
  deleteClient,
} = require("../controllers/clientController")

const router = express.Router()

// Create a client
router.post(
  "/clients",
  authMiddleware,
  postClient
)

// Get all clients
router.get(
  "/clients",
  authMiddleware,
  getClients
)

// Update a client
router.put(
  "/clients/:id",
  authMiddleware,
  updateClient
)

// Delete a client
router.delete(
  "/clients/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  deleteClient
)

module.exports = router