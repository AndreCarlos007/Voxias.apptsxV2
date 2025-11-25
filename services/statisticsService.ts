// Service for calculating statistics from play events
import type { ApiCard } from "../types"

export interface StatsDayData {
  date: string
  totalPlays: number
}

export interface StatsCardData {
  cardId: string
  cardName: string
  playCount: number
}

export function calculateDailyStats(cards: ApiCard[]): StatsCardData[] {
  return cards
    .map((card) => ({
      cardId: card.id,
      cardName: card.name,
      playCount: card.playCount || 0,
    }))
    .sort((a, b) => b.playCount - a.playCount)
    .slice(0, 5)
}

export function calculateWeeklyStats(cards: ApiCard[]): StatsCardData[] {
  // Similar logic for weekly stats
  return cards
    .map((card) => ({
      cardId: card.id,
      cardName: card.name,
      playCount: card.playCount || 0,
    }))
    .sort((a, b) => b.playCount - a.playCount)
    .slice(0, 5)
}

export function calculateMonthlyStats(cards: ApiCard[]): StatsCardData[] {
  // Similar logic for monthly stats
  return cards
    .map((card) => ({
      cardId: card.id,
      cardName: card.name,
      playCount: card.playCount || 0,
    }))
    .sort((a, b) => b.playCount - a.playCount)
    .slice(0, 5)
}

export function getTotalPlays(cards: ApiCard[]): number {
  return cards.reduce((total, card) => total + (card.playCount || 0), 0)
}

export function getMostPlayedCard(cards: ApiCard[]): ApiCard | null {
  if (cards.length === 0) return null
  return cards.reduce((max, card) => ((card.playCount || 0) > (max.playCount || 0) ? card : max))
}
