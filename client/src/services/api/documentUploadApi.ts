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

  if (!token) {
    throw new Error(
      "You are not authenticated. Please login again."
    )
  }

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

  let response: Response

  try {
    response =
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
  } catch (error) {
    console.error(
      "Document upload network error:",
      error
    )

    throw new Error(
      "Failed to connect to the server. Please check your internet connection and try again."
    )
  }

  const contentType =
    response.headers.get(
      "content-type"
    ) || ""

  let result: any = null

  if (
    contentType.includes(
      "application/json"
    )
  ) {
    try {
      result =
        await response.json()
    } catch (error) {
      console.error(
        "Failed to parse JSON response:",
        error
      )

      throw new Error(
        "The server returned an invalid response."
      )
    }
  } else {
    const text =
      await response.text()

    console.error(
      "Server returned non-JSON response:",
      text
    )

    throw new Error(
      response.ok
        ? "The server returned an unexpected response."
        : `Upload failed. Server returned status ${response.status}.`
    )
  }

  if (!response.ok) {
    throw new Error(
      result?.message ||
        "Failed to upload document."
    )
  }

  return result
}