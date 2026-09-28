import { apiRequest } from "./api"

type ContractPayload = {
  contractType: "Employee" | "Client"
  partyName: string
  value: number
  startDate: string
  endDate: string
  status: "Active" | "Expired" | "Pending"
}

// Get all contracts
export function getContracts() {
  return apiRequest("/contracts")
}

// Get one contract by ID
export function getContract(id: string) {
  return apiRequest(`/contracts/${id}`)
}

// Create a new contract
export function createContract(contract: ContractPayload) {
  return apiRequest("/contracts", {
    method: "POST",
    body: JSON.stringify(contract),
  })
}

// Update an existing contract
export function updateContract(
  id: string,
  contract: ContractPayload
) {
  return apiRequest(`/contracts/${id}`, {
    method: "PUT",
    body: JSON.stringify(contract),
  })
}

// Delete a contract
export function deleteContract(id: string) {
  return apiRequest(`/contracts/${id}`, {
    method: "DELETE",
  })
}