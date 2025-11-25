// Service for Favorites (editable) endpoints
import api from "./api"
import type { ApiCategory, ApiCard } from "../types"

// Helper function to map API response to ApiCard with full URLs
function mapCardResponse(cardData: any): ApiCard {
  const baseUrl = "https://voxia-api.onrender.com"
  return {
    id: cardData.id,
    nome: cardData.nome,
    imagemUrl: cardData.imagemPath?.startsWith("http") ? cardData.imagemPath : `${baseUrl}${cardData.imagemPath}`,
    audioUrl: cardData.audioPath?.startsWith("http") ? cardData.audioPath : `${baseUrl}${cardData.audioPath}`,
    vezes: cardData.vezes || 0,
    criadoEm: cardData.criadoEm,
    categoriaId: cardData.categoriaFavoritoId,
  }
}

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
    const mappedCards = (data || []).map(mapCardResponse)
    console.log("[v0] Mapped cards:", mappedCards)
    return mappedCards
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
  imageUri: string,
  audioUri?: string,
): Promise<ApiCard> {
  try {
    if (!imageUri) {
      throw new Error("Imagem é obrigatória")
    }

    console.log("[v0] Creating card with URIs:", {
      nome,
      categoriaFavoritoId,
      imageUri,
      audioUri,
    })

    const formData = new FormData()
    formData.append("Nome", nome)
    formData.append("CategoriaFavoritoId", categoriaFavoritoId)

    formData.append("Imagem", {
      uri: imageUri,
      type: "image/jpeg",
      name: "imagem.jpg",
    } as any)

    if (audioUri) {
      const audioType = audioUri.endsWith(".m4a") ? "audio/m4a" : "audio/mpeg"
      formData.append("Audio", {
        uri: audioUri,
        type: audioType,
        name: audioUri.endsWith(".m4a") ? "audio.m4a" : "audio.mp3",
      } as any)
    }

    const data = await api.postFormData("/api/Favorites/cards", formData)
    console.log("[v0] Card created successfully:", data)
    return mapCardResponse(data)
  } catch (error) {
    console.error("Error creating favorites card:", error)
    throw error
  }
}

export async function updateFavoritesCard(
  cardId: string,
  nome?: string,
  imageUri?: string,
  audioUri?: string,
): Promise<ApiCard> {
  try {
    const formData = new FormData()

    if (nome) {
      formData.append("Nome", nome)
    }

    if (imageUri) {
      formData.append("Imagem", {
        uri: imageUri,
        type: "image/jpeg",
        name: "imagem.jpg",
      } as any)
    }

    if (audioUri) {
      const audioType = audioUri.endsWith(".m4a") ? "audio/m4a" : "audio/mpeg"
      formData.append("Audio", {
        uri: audioUri,
        type: audioType,
        name: audioUri.endsWith(".m4a") ? "audio.m4a" : "audio.mp3",
      } as any)
    }

    const data = await api.putFormData(`/api/Favorites/cards/${cardId}`, formData)
    return mapCardResponse(data)
  } catch (error) {
    console.error("Error updating favorites card:", error)
    throw error
  }
}

export async function getCard(cardId: string): Promise<ApiCard> {
  try {
    const data = await api.get(`/api/Favorites/cards/${cardId}`)
    return mapCardResponse(data)
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

export async function incrementCardClick(cardId: string): Promise<void> {
  try {
    await api.post(`/api/Clicks/card/${cardId}`, {})
    console.log("[v0] Card click registered:", cardId)
  } catch (error) {
    console.error("Error registering card click:", error)
    throw error
  }
}
