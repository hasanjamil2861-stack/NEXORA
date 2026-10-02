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
      "Authentication required. Please login again."
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
      "UPLOAD FETCH ERROR:",
      error
    )

    throw new Error(
      "Failed to connect to the server. Please check your internet connection."
    )
  }

  const contentType =
    response.headers.get(
      "content-type"
    ) || ""

  const responseText =
    await response.text()

  console.log(
    "UPLOAD STATUS:",
    response.status
  )

  console.log(
    "UPLOAD CONTENT TYPE:",
    contentType
  )

  console.log(
    "UPLOAD RESPONSE:",
    responseText
  )

  let result: {
    message?: string
    [key: string]: unknown
  } = {}

  if (
    contentType.includes(
      "application/json"
    )
  ) {
    try {
      result =
        responseText
          ? JSON.parse(
              responseText
            )
          : {}
    } catch (error) {
      console.error(
        "JSON PARSE ERROR:",
        error
      )

      throw new Error(
        "The server returned invalid JSON."
      )
    }
  } else {
    console.error(
      "SERVER RETURNED NON-JSON RESPONSE:",
      responseText
    )

    throw new Error(
      `Server returned an unexpected response (${response.status}).`
    )
  }

  if (!response.ok) {
    throw new Error(
      result.message ||
        `Upload failed (${response.status}).`
    )
  }

  return result
}