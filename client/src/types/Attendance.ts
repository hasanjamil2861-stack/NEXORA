export interface Attendance {
  id: string
  employeeId: string
  employeeName: string
  date: string
  checkIn: string
  checkOut: string
  status: "Present" | "Absent" | "Late"
}