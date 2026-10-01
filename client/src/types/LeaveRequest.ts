export interface LeaveEmployee {
  _id: string
  firstName: string
  lastName: string
  email: string
  position: string
}

export interface LeaveRequest {
  id: string
  employeeId: LeaveEmployee
  leaveType:
    | "Annual"
    | "Sick"
    | "Personal"
  startDate: string
  endDate: string
  reason: string
  status:
    | "Pending"
    | "Approved"
    | "Rejected"
}