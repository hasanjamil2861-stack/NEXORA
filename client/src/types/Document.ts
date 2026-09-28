export interface Document {
  id: string
  name: string
  type: "PDF" | "Word" | "Excel" | "Image"
  category: "Employee" | "Contract" | "Invoice" | "Project" | "Company"
  uploadedBy: string
  uploadDate: string
  status: "Active" | "Archived"
}