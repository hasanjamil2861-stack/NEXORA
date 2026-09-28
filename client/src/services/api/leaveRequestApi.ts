import { apiRequest } from "./api"

// Get all leave requests
export function getLeaveRequests() {
  return apiRequest("/leaveRequests")
}

// Get one leave request by ID
export function getLeaveRequest(id: string) {
  return apiRequest(`/leaveRequests/${id}`)
}

// Create a new leave request
export function createLeaveRequest(
  request: unknown
) {
  return apiRequest("/leaveRequests", {
    method: "POST",
    body: JSON.stringify(request),
  })
}

// Update an existing leave request
export function updateLeaveRequest(
  id: string,
  request: unknown
) {
  return apiRequest(`/leaveRequests/${id}`, {
    method: "PUT",
    body: JSON.stringify(request),
  })
}

// Delete a leave request
export function deleteLeaveRequest(
  id: string
) {
  return apiRequest(`/leaveRequests/${id}`, {
    method: "DELETE",
  })
}