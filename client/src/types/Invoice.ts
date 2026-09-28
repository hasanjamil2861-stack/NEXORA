export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  issueDate: string
  dueDate: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  status: "Pending" | "Paid" | "Overdue" | "Cancelled"
}