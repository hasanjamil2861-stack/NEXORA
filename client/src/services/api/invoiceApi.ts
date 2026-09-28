import { apiRequest } from "./api"

type InvoicePayload = {
  // Add the exact invoice fields used by your backend/model
  [key: string]: unknown
}

// Get all invoices
export function getInvoices() {
  return apiRequest("/invoices")
}

// Get one invoice by ID
export function getInvoice(id: string) {
  return apiRequest(`/invoices/${id}`)
}

// Create a new invoice
export function createInvoice(invoice: InvoicePayload) {
  return apiRequest("/invoices", {
    method: "POST",
    body: JSON.stringify(invoice),
  })
}

// Update an existing invoice
export function updateInvoice(
  id: string,
  invoice: InvoicePayload
) {
  return apiRequest(`/invoices/${id}`, {
    method: "PUT",
    body: JSON.stringify(invoice),
  })
}

// Delete an invoice
export function deleteInvoice(id: string) {
  return apiRequest(`/invoices/${id}`, {
    method: "DELETE",
  })
}