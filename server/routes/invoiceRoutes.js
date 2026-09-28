const express = require("express")

const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")

const {
  getInvoices,
  postInvoice,
  updateInvoice,
  deleteInvoice,
} = require("../controllers/invoiceController")

const router = express.Router()

// Create an invoice
router.post(
  "/invoices",
  authMiddleware,
  postInvoice
)

// Get all invoices
router.get(
  "/invoices",
  authMiddleware,
  getInvoices
)

// Update an invoice
router.put(
  "/invoices/:id",
  authMiddleware,
  updateInvoice
)

// Delete an invoice
router.delete(
  "/invoices/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  deleteInvoice
)

module.exports = router