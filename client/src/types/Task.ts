export interface TaskEmployee {
  _id: string
  firstName: string
  lastName: string
  email: string
  position: string
}

export interface TaskProject {
  _id: string
  name: string
  status:
    | "Planned"
    | "In Progress"
    | "Completed"
    | "Cancelled"
}

export interface Task {
  id: string
  title: string
  description: string
  status:
    | "Pending"
    | "In Progress"
    | "Completed"
  priority:
    | "Low"
    | "Medium"
    | "High"
  assignedTo:
    | string
    | TaskEmployee
  projectId:
    | string
    | TaskProject
  dueDate: string
}