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
  nome: string
  imagemUrl: string
  audioUrl?: string
  vezes?: number
  criadoEm?: string
  categoriaId?: string
}

export interface ApiCategory {
  id: string
  nome: string
  imagemUrl?: string
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
