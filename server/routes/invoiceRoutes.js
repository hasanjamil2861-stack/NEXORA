const express = require("express")

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware")

const {
  getInvoices,
  postInvoice,
  updateInvoice,
  deleteInvoice,
} = require("../controllers/invoiceController")

const router = express.Router()

// Get all invoices - Admin only
router.get(
  "/invoices",
  protect,
  adminOnly,
  getInvoices
)

// Create invoice - Admin only
router.post(
  "/invoices",
  protect,
  adminOnly,
  postInvoice
)

// Update invoice - Admin only
router.put(
  "/invoices/:id",
  protect,
  adminOnly,
  updateInvoice
)

// Delete invoice - Admin only
router.delete(
  "/invoices/:id",
  protect,
  adminOnly,
  deleteInvoice
)

module.exports = router