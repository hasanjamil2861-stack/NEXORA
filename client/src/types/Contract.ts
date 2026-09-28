export interface Contract {
  id: string
  partyName: string
  contractType: "Employee" | "Client"
  startDate: string
  endDate: string
  value: number
  status: "Active" | "Expired" | "Pending"
}