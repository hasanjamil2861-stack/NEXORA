export interface Project {
  id: string
  name: string
  description: string
  client: string
  manager: string
  startDate: string
  endDate: string
  budget: number
  status:
    | "Planned"
    | "In Progress"
    | "Completed"
    | "Cancelled"
  assignedEmployees: string[]
}