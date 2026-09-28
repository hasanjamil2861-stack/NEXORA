import { apiRequest } from "./api"

type DocumentPayload = {
  name: string
  type: "PDF" | "Word" | "Excel" | "Image"
  category: string
  uploadedBy: string
  uploadDate: string
  status: "Active" | "Archived"
}

// Get all documents
export function getDocuments() {
  return apiRequest("/documents")
}

// Get one document by ID
export function getDocument(id: string) {
  return apiRequest(`/documents/${id}`)
}

// Create a new document
export function createDocument(
  document: DocumentPayload
) {
  return apiRequest("/documents", {
    method: "POST",
    body: JSON.stringify(document),
  })
}

// Update an existing document
export function updateDocument(
  id: string,
  document: DocumentPayload
) {
  return apiRequest(`/documents/${id}`, {
    method: "PUT",
    body: JSON.stringify(document),
  })
}

// Delete a document
export function deleteDocument(id: string) {
  return apiRequest(`/documents/${id}`, {
    method: "DELETE",
  })
}