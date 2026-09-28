import { apiRequest } from "./api"

// Get all departments
export function getDepartments() {
  return apiRequest("/departments")
}

// Get one department by ID
export function getDepartment(id: string) {
  return apiRequest(`/departments/${id}`)
}

// Create a new department
export function createDepartment(
  department: unknown
) {
  return apiRequest("/departments", {
    method: "POST",
    body: JSON.stringify(department),
  })
}

// Update an existing department
export function updateDepartment(
  id: string,
  department: unknown
) {
  return apiRequest(`/departments/${id}`, {
    method: "PUT",
    body: JSON.stringify(department),
  })
}

// Delete a department
export function deleteDepartment(
  id: string
) {
  return apiRequest(`/departments/${id}`, {
    method: "DELETE",
  })
}