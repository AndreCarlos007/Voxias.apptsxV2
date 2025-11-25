// Service for User endpoints
import api from "./api"
import type { UserProfile } from "../types"
import { removeToken } from "../storage/tokenStorage"

export async function getUserProfile(): Promise<UserProfile> {
  try {
    const data = await api.get("/api/User/me")
    return data
  } catch (error) {
    console.error("Error fetching user profile:", error)
    throw error
  }
}

export async function logout(): Promise<void> {
  try {
    await removeToken()
  } catch (error) {
    console.error("Error logging out:", error)
    throw error
  }
}
