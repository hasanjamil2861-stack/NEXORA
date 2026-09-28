import { apiRequest } from "./api"

// Get all projects
export function getProjects() {
  return apiRequest("/projects")
}

// Get one project by ID
export function getProject(id: string) {
  return apiRequest(`/projects/${id}`)
}

// Create a new project
export function createProject(
  project: unknown
) {
  return apiRequest("/projects", {
    method: "POST",
    body: JSON.stringify(project),
  })
}

// Update an existing project
export function updateProject(
  id: string,
  project: unknown
) {
  return apiRequest(`/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(project),
  })
}

// Delete a project
export function deleteProject(id: string) {
  return apiRequest(`/projects/${id}`, {
    method: "DELETE",
  })
}