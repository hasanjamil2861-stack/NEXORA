import { apiRequest } from "./api"

type ClientPayload = {
  companyName: string
  contactPerson: string
  email: string
  phone: string
  address: string
  status: "Active" | "Inactive"
}

// Get all clients
export function getClients() {
  return apiRequest("/clients")
}

// Get one client by ID
export function getClient(id: string) {
  return apiRequest(`/clients/${id}`)
}

// Create a new client
export function createClient(client: ClientPayload) {
  return apiRequest("/clients", {
    method: "POST",
    body: JSON.stringify(client),
  })
}

// Update an existing client
export function updateClient(
  id: string,
  client: ClientPayload
) {
  return apiRequest(`/clients/${id}`, {
    method: "PUT",
    body: JSON.stringify(client),
  })
}

// Delete a client
export function deleteClient(id: string) {
  return apiRequest(`/clients/${id}`, {
    method: "DELETE",
  })
}