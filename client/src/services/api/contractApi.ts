import { apiRequest } from "./api"

type ContractPayload = {
  contractType:
    | "Employee"
    | "Client"
  employeeId?: string | null
  partyName: string
  value: number
  startDate: string
  endDate: string
  status:
    | "Active"
    | "Expired"
    | "Pending"
}

export function getContracts() {
  return apiRequest("/contracts")
}

export function getContract(
  id: string
) {
  return apiRequest(
    `/contracts/${id}`
  )
}

export function createContract(
  contract: ContractPayload
) {
  return apiRequest(
    "/contracts",
    {
      method: "POST",
      body: JSON.stringify(
        contract
      ),
    }
  )
}

export function updateContract(
  id: string,
  contract: ContractPayload
) {
  return apiRequest(
    `/contracts/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(
        contract
      ),
    }
  )
}

export function deleteContract(
  id: string
) {
  return apiRequest(
    `/contracts/${id}`,
    {
      method: "DELETE",
    }
  )
}