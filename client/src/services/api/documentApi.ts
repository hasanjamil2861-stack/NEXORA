import { apiRequest } from "./api"

type DocumentPayload = {
  name: string
  type:
    | "PDF"
    | "Word"
    | "Excel"
    | "Image"
  category:
    | "Employee"
    | "Contract"
    | "Invoice"
    | "Project"
    | "Company"
  employeeId?: string | null
  uploadedBy: string
  uploadDate: string
  status:
    | "Active"
    | "Archived"
}

export function getDocuments() {
  return apiRequest(
    "/documents"
  )
}

export function getDocument(
  id: string
) {
  return apiRequest(
    `/documents/${id}`
  )
}

export function createDocument(
  document: DocumentPayload
) {
  return apiRequest(
    "/documents",
    {
      method: "POST",
      body: JSON.stringify(
        document
      ),
    }
  )
}

export function updateDocument(
  id: string,
  document: DocumentPayload
) {
  return apiRequest(
    `/documents/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(
        document
      ),
    }
  )
}

export function deleteDocument(
  id: string
) {
  return apiRequest(
    `/documents/${id}`,
    {
      method: "DELETE",
    }
  )
}