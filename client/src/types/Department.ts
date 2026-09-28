export interface Department {
  id: string
  name: string
  description: string
  manager: string
  employeeCount: number
  status: "Active" | "Inactive"
}