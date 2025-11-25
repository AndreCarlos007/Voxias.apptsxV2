import { getToken } from "../storage/tokenStorage"

const BASE_URL = "https://voxia-api.onrender.com"
const TIMEOUT = 10000

async function fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
  try {
    const token = await getToken()
    const headers = new Headers({
      "Content-Type": "application/json",
    })

    // Merge any existing headers from options
    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers.set(key, value)
        })
      } else if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => {
          headers.set(key, value)
        })
      } else {
        Object.entries(options.headers).forEach(([key, value]) => {
          headers.set(key, value as string)
        })
      }
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
      console.log("[v0] Authorization header set")
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT)

    console.log("[v0] Fetching:", `${BASE_URL}${endpoint}`)
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    console.log("[v0] Response status:", response.status)

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      try {
        const errorBody = await response.json()
        errorMessage = errorBody?.message || errorBody?.error || errorMessage
        console.log("[v0] Error body:", errorBody)
      } catch (e) {
        console.log("[v0] Could not parse error body")
      }
      throw new Error(errorMessage)
    }

    return response
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("aborted")) {
      throw new Error("Timeout na requisição")
    }
    throw error
  }
}

interface ApiClient {
  get: (endpoint: string) => Promise<any>
  post: (endpoint: string, data?: unknown) => Promise<any>
  put: (endpoint: string, data?: unknown) => Promise<any>
  delete: (endpoint: string) => Promise<any>
  postFormData: (endpoint: string, formData: FormData) => Promise<any>
  putFormData: (endpoint: string, formData: FormData) => Promise<any>
}

const api: ApiClient = {
  get: async (endpoint: string) => {
    const response = await fetchWithAuth(endpoint, { method: "GET" })
    return response.json()
  },
  post: async (endpoint: string, data?: unknown) => {
    const response = await fetchWithAuth(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
    return response.json()
  },
  put: async (endpoint: string, data?: unknown) => {
    const response = await fetchWithAuth(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    })
    return response.json()
  },
  delete: async (endpoint: string) => {
    const response = await fetchWithAuth(endpoint, { method: "DELETE" })
    return response.status === 204 ? null : response.json()
  },
  postFormData: async (endpoint: string, formData: FormData) => {
    const token = await getToken()
    const headers = new Headers()

    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
      console.log("[v0] Authorization header set for multipart")
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT)

    console.log("[v0] Fetching (FormData):", `${BASE_URL}${endpoint}`)
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    console.log("[v0] Response status:", response.status)

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      try {
        const errorBody = await response.json()
        errorMessage = errorBody?.message || errorBody?.error || errorMessage
        console.log("[v0] Error body:", errorBody)
      } catch (e) {
        console.log("[v0] Could not parse error body")
      }
      throw new Error(errorMessage)
    }

    return response.json()
  },
  putFormData: async (endpoint: string, formData: FormData) => {
    const token = await getToken()
    const headers = new Headers()

    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT)

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers,
      body: formData,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      try {
        const errorBody = await response.json()
        errorMessage = errorBody?.message || errorBody?.error || errorMessage
      } catch (e) {
        // ignore
      }
      throw new Error(errorMessage)
    }

    return response.json()
  },
}

export default api
