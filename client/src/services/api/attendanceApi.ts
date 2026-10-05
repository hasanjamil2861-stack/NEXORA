import { apiRequest } from "./api"

// Get attendance records
export function getAttendance() {
  return apiRequest("/attendance")
}

// Get one attendance record
export function getAttendanceRecord(
  id: string
) {
  return apiRequest(
    `/attendance/${id}`
  )
}

// Create attendance record
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

// Update attendance record
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

// Delete attendance record
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