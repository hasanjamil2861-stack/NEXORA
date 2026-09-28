export interface Task {
  id: string
  title: string
  description: string
  status: "Pending" | "In Progress" | "Completed"
  priority: "Low" | "Medium" | "High"
  assignedTo: string
  projectId: string
  dueDate: string
}