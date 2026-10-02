const API_URL =
  "https://nexora-3-v485.onrender.com"

export type UploadDocumentData = {
  name: string
  category:
    | "Employee"
    | "Contract"
    | "Invoice"
    | "Project"
    | "Company"
  projectId?: string
  taskId?: string
  file: File
}

export async function uploadDocument(
  data: UploadDocumentData
) {
  const token =
    localStorage.getItem(
      "nexora-token"
    )

  const formData =
    new FormData()

  formData.append(
    "name",
    data.name
  )

  formData.append(
    "category",
    data.category
  )

  if (data.projectId) {
    formData.append(
      "projectId",
      data.projectId
    )
  }

  if (data.taskId) {
    formData.append(
      "taskId",
      data.taskId
    )
  }

  formData.append(
    "file",
    data.file
  )

  const response =
    await fetch(
      `${API_URL}/documents/upload`,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${token}`,
        },

        body: formData,
      }
    )

  const result =
    await response.json()

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to upload document."
    )
  }

  return result
}