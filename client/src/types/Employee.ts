export interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  position: string
  departmentId: number
  salary: number
  hireDate: string
  status: "Active" | "Inactive"
}