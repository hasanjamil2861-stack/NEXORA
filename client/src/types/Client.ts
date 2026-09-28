export interface Client {
  id: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  address: string
  status: "Active" | "Inactive"
}