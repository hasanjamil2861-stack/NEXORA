/* Invoice item schema */

const mongoose = require("mongoose")

const invoiceItemSchema = new mongoose.Schema(
  {
    description: String,
    quantity: Number,
    unitPrice: Number,
  },
  {
    _id: false,
  }
)

/* Invoice schema */

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: String,
  clientName: String,
  issueDate: String,
  dueDate: String,

  items: [invoiceItemSchema],

  subtotal: Number,
  tax: Number,
  total: Number,

  status: {
    type: String,
    enum: [
      "Pending",
      "Paid",
      "Overdue",
      "Cancelled",
    ],
  },
})

const Invoice = mongoose.model(
  "Invoice",
  invoiceSchema
)

module.exports = Invoice