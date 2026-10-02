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

// Get all clients - Admin only
router.get(
  "/clients",
  protect,
  adminOnly,
  getClients
)

// Create client - Admin only
router.post(
  "/clients",
  protect,
  adminOnly,
  postClient
)

// Update client - Admin only
router.put(
  "/clients/:id",
  protect,
  adminOnly,
  updateClient
)

// Delete client - Admin only
router.delete(
  "/clients/:id",
  protect,
  adminOnly,
  deleteClient
)

module.exports = router