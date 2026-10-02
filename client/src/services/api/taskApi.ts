import { apiRequest } from "./api"

// Get all tasks
export function getTasks() {
  return apiRequest("/tasks")
}

// Get one task
export function getTask(id: string) {
  return apiRequest(`/tasks/${id}`)
}

// Create task
export function createTask(task: unknown) {
  return apiRequest("/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  })
}

// Update task
export function updateTask(
  id: string,
  task: unknown
) {
  return apiRequest(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(task),
  })
}

// Delete task
export function deleteTask(id: string) {
  return apiRequest(`/tasks/${id}`, {
    method: "DELETE",
  })
}