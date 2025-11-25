// Service for Favorites (editable) endpoints
import api from "./api"
import type { ApiCategory, ApiCard } from "../types"

export async function getFavoritesCategories(): Promise<ApiCategory[]> {
  try {
    const data = await api.get("/api/Favorites/categories")
    return data || []
  } catch (error) {
    console.error("Error fetching favorites categories:", error)
    throw error
  }
}

export async function getFavoritesCategoryCards(categoryId: string): Promise<ApiCard[]> {
  try {
    const data = await api.get(`/api/Favorites/categories/${categoryId}/cards`)
    return data || []
  } catch (error) {
    console.error("Error fetching favorites category cards:", error)
    throw error
  }
}

export async function createFavoritesCategory(nome: string): Promise<ApiCategory> {
  try {
    const data = await api.post("/api/Favorites/categories", { nome })
    console.log("[v0] Category created:", data)
    return data
  } catch (error) {
    console.error("Error creating favorites category:", error)
    throw error
  }
}

export async function createFavoritesCard(
  nome: string,
  categoriaFavoritoId: string,
  imagemBlob: Blob,
  audioBlob?: Blob,
): Promise<ApiCard> {
  try {
    if (!imagemBlob || !(imagemBlob instanceof Blob)) {
      throw new Error("Imagem inválida")
    }
    if (audioBlob && !(audioBlob instanceof Blob)) {
      throw new Error("Áudio inválido")
    }

    const formData = new FormData()
    formData.append("Nome", nome)
    formData.append("CategoriaFavoritoId", categoriaFavoritoId)
    formData.append("Imagem", imagemBlob, "imagem.jpg")
    if (audioBlob) {
      formData.append("Audio", audioBlob, "audio.mp3")
    }

    console.log("[v0] Creating card with FormData, nome:", nome)
    const data = await api.postFormData("/api/Favorites/cards", formData)
    console.log("[v0] Card created successfully:", data)
    return data
  } catch (error) {
    console.error("Error creating favorites card:", error)
    throw error
  }
}

export async function updateFavoritesCard(
  cardId: string,
  nome?: string,
  imagemBlob?: Blob,
  audioBlob?: Blob,
): Promise<ApiCard> {
  try {
    const formData = new FormData()
    if (nome) formData.append("Nome", nome)
    if (imagemBlob) formData.append("Imagem", imagemBlob, "imagem.jpg")
    if (audioBlob) formData.append("Audio", audioBlob, "audio.mp3")

    const data = await api.putFormData(`/api/Favorites/cards/${cardId}`, formData)
    return data
  } catch (error) {
    console.error("Error updating favorites card:", error)
    throw error
  }
}

export async function getCard(cardId: string): Promise<ApiCard> {
  try {
    const data = await api.get(`/api/Favorites/cards/${cardId}`)
    return data
  } catch (error) {
    console.error("Error fetching card:", error)
    throw error
  }
}

export async function deleteCard(cardId: string): Promise<void> {
  try {
    await api.delete(`/api/Favorites/cards/${cardId}`)
  } catch (error) {
    console.error("Error deleting card:", error)
    throw error
  }
}

export async function deleteFavoritesCategory(categoryId: string): Promise<void> {
  try {
    await api.delete(`/api/Favorites/categories/${categoryId}`)
  } catch (error) {
    console.error("Error deleting category:", error)
    throw error
  }
}

export async function updateFavoritesCategory(categoryId: string, nome: string): Promise<ApiCategory> {
  try {
    const data = await api.put(`/api/Favorites/categories/${categoryId}`, { nome })
    console.log("[v0] Category updated:", data)
    return data
  } catch (error) {
    console.error("Error updating favorites category:", error)
    throw error
  }
}

export async function updateCardPlayCount(cardId: string, playCount: number): Promise<void> {
  try {
    await api.put(`/api/Favorites/cards/${cardId}/play-count`, { playCount })
  } catch (error) {
    console.error("Error updating play count:", error)
    throw error
  }
}
