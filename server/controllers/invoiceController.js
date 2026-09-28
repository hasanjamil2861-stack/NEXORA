const Invoice = require("../models/Invoice")

// Get all invoices
const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()

    res.json(invoices)
  } catch (error) {
    console.error("Get invoices error:", error)

    res.status(500).json({
      message: "Failed to get invoices",
      error: error.message,
    })
  }
}

// Create an invoice
const postInvoice = async (req, res) => {
  try {
    const newInvoice = new Invoice(req.body)

    await newInvoice.save()

    res.status(201).json(newInvoice)
  } catch (error) {
    console.error("Save invoice error:", error)

    res.status(500).json({
      message: "Failed to save invoice",
      error: error.message,
    })
  }
}

// Update an invoice
const updateInvoice = async (req, res) => {
  try {
    const updatedInvoice =
      await Invoice.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      )

    res.json(updatedInvoice)
  } catch (error) {
    console.error("Update invoice error:", error)

    res.status(500).json({
      message: "Failed to update invoice",
      error: error.message,
    })
  }
}

// Delete an invoice
const deleteInvoice = async (req, res) => {
  try {
    const deletedInvoice =
      await Invoice.findByIdAndDelete(
        req.params.id
      )

    res.json(deletedInvoice)
  } catch (error) {
    console.error("Delete invoice error:", error)

    res.status(500).json({
      message: "Failed to delete invoice",
      error: error.message,
    })
  }
}

module.exports = {
  getInvoices,
  postInvoice,
  updateInvoice,
  deleteInvoice,
}