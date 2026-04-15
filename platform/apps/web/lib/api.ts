const API_BASE = ""

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers, ...rest } = options

  let url = `${API_BASE}${endpoint}`

  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value))
    })
    url += `?${searchParams.toString()}`
  }

  const token = typeof window !== "undefined" ? localStorage.getItem("innings_token") : null

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...rest,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  })

  const contentType = response.headers.get("content-type") || ""
  const isJson = contentType.includes("application/json")

  if (!response.ok) {
    const errorData = isJson ? await response.json().catch(() => ({})) : {}
    const message =
      errorData.error ||
      errorData.message ||
      `Request failed with status ${response.status}`
    throw new Error(message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  if (!isJson) {
    return (await response.text()) as T
  }

  return response.json()
}

export function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  return request<T>(endpoint, options)
}
