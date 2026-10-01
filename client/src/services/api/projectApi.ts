import { apiRequest } from "./api"

export function getProjects() {
  return apiRequest("/projects")
}

export function getProject(id: string) {
  return apiRequest(
    `/projects/${id}`
  )
}

export function createProject(
  project: unknown
) {
  return apiRequest("/projects", {
    method: "POST",
    body: JSON.stringify(project),
  })
}

export function updateProject(
  id: string,
  project: unknown
) {
  return apiRequest(
    `/projects/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(project),
    }
  )
}

export function deleteProject(
  id: string
) {
  return apiRequest(
    `/projects/${id}`,
    {
      method: "DELETE",
    }
  )
}