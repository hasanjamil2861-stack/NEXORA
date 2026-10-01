import { apiRequest } from "./api"

// Get all attendance records
export function getAttendance() {
  return apiRequest("/attendance")
}

// Get one attendance record by ID
export function getAttendanceRecord(
  id: string
) {
  return apiRequest(
    `/attendance/${id}`
  )
}

// Create a new attendance record
export function createAttendance(
  attendance: unknown
) {
  return apiRequest(
    "/attendance",
    {
      method: "POST",
      body: JSON.stringify(
        attendance
      ),
    }
  )
}

// Update an existing attendance record
export function updateAttendance(
  id: string,
  attendance: unknown
) {
  return apiRequest(
    `/attendance/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(
        attendance
      ),
    }
  )
}

// Delete an attendance record
export function deleteAttendance(
  id: string
) {
  return apiRequest(
    `/attendance/${id}`,
    {
      method: "DELETE",
    }
  )
}