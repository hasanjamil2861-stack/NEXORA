export interface LeaveRequest {
  id: string
  employeeName: string
  leaveType: "Annual" | "Sick" | "Personal"
  startDate: string
  endDate: string
  reason: string
  status: "Pending" | "Approved" | "Rejected"
}