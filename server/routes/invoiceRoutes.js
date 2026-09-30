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

// Create an invoice - Admin only
router.post(
    "/invoices",
    protect,
    adminOnly,
    postInvoice
)

// Get all invoices - Admin + Employee
router.get(
    "/invoices",
    protect,
    getInvoices
)

// Update an invoice - Admin only
router.put(
    "/invoices/:id",
    protect,
    adminOnly,
    updateInvoice
)

// Delete an invoice - Admin only
router.delete(
    "/invoices/:id",
    protect,
    adminOnly,
    deleteInvoice
)

module.exports = router