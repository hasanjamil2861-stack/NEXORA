const API_URL =
  "https://nexora-3-v485.onrender.com"

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const token =
    localStorage.getItem(
      "nexora-token"
    )

  const headers = new Headers(
    options.headers
  )

  headers.set(
    "Content-Type",
    "application/json"
  )

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    )
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  )

  if (!response.ok) {
    if (
      response.status === 401
    ) {
      throw new Error(
        "Unauthorized. Please login again."
      )
    }

    if (
      response.status === 403
    ) {
      throw new Error(
        "You do not have permission to perform this action."
      )
    }

    throw new Error(
      `API Error: ${response.status}`
    )
  }

  return response.json()
}