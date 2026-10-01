export interface ContractEmployee {
  _id: string
  firstName: string
  lastName: string
  email: string
  position: string
}

export interface Contract {
  id: string
  employeeId?: string | ContractEmployee | null
  partyName: string
  contractType:
    | "Employee"
    | "Client"
  startDate: string
  endDate: string
  value: number
  status:
    | "Active"
    | "Expired"
    | "Pending"
}