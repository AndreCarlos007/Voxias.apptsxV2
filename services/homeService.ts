// Service for Home (read-only) endpoints
import api from "./api"
import type { ApiCategory, ApiCard } from "../types"

export async function getHomeCategories(): Promise<ApiCategory[]> {
  try {
    const data = await api.get("/api/Home/categories")
    return data || []
  } catch (error) {
    console.error("Error fetching home categories:", error)
    throw error
  }
}

export async function getHomeCategoryCards(categoryId: string): Promise<ApiCard[]> {
  try {
    const data = await api.get(`/api/Home/categories/${categoryId}/cards`)
    return data || []
  } catch (error) {
    console.error("Error fetching home category cards:", error)
    throw error
  }
}
