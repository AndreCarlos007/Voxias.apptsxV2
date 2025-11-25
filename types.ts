export type ItemType = {
  id: number
  nome: string
  cor: string
  img: any
}

export type CategoriaType = {
  id: number
  nome: string
  cor: string
  itens: ItemType[]
}

// API Models
export interface ApiCard {
  id: string
  name: string
  imageUrl: string
  audioUrl?: string
  playCount?: number
  createdAt?: string
  categoryId?: string
}

export interface ApiCategory {
  id: string
  name: string
  imageUrl?: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  photoUrl?: string
  createdAt?: string
}

export interface PlayEvent {
  cardId: string
  timestamp: string
  playCount: number
}
