import { apiRequest } from "./api"

// Get leave requests
export function getLeaveRequests() {
  return apiRequest(
    "/leave-requests"
  )
}

// Get one leave request
export function getLeaveRequest(
  id: string
) {
  return apiRequest(
    `/leave-requests/${id}`
  )
}

// Create a leave request
export function createLeaveRequest(
  request: unknown
) {
  return apiRequest(
    "/leave-requests",
    {
      method: "POST",
      body: JSON.stringify(
        request
      ),
    }
  )
}

// Update a leave request
export function updateLeaveRequest(
  id: string,
  request: unknown
) {
  return apiRequest(
    `/leave-requests/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(
        request
      ),
    }
  )
}

// Delete a leave request
export function deleteLeaveRequest(
  id: string
) {
  return apiRequest(
    `/leave-requests/${id}`,
    {
      method: "DELETE",
    }
  )
}