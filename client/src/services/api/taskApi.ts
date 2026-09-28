import { apiRequest } from "./api"

// Get all tasks
export function getTasks() {
  return apiRequest("/tasks")
}

// Get one task by ID
export function getTask(id: string) {
  return apiRequest(`/tasks/${id}`)
}

// Create a new task
export function createTask(task: unknown) {
  return apiRequest("/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  })
}

// Update an existing task
export function updateTask(
  id: string,
  task: unknown
) {
  return apiRequest(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(task),
  })
}

// Delete a task
export function deleteTask(id: string) {
  return apiRequest(`/tasks/${id}`, {
    method: "DELETE",
  })
}