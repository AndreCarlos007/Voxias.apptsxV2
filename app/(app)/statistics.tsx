"use client"

import { View, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useState, useCallback } from "react"
import { useFocusEffect } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import type { ApiCard } from "../../types"
import { getFavoritesCategoryCards, getFavoritesCategories } from "../../services/favoritesService"
import {
  calculateDailyStats,
  calculateWeeklyStats,
  calculateMonthlyStats,
  getTotalPlays,
  getMostPlayedCard,
  type StatsCardData,
} from "../../services/statisticsService"
import StatisticsChart from "../_components/StatisticsChart"
import StatsTable from "../_components/StatsTable"

type FilterType = "day" | "week" | "month"

export default function StatisticsScreen() {
  const [allCards, setAllCards] = useState<ApiCard[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>("day")
  const [statsData, setStatsData] = useState<StatsCardData[]>([])
  const [totalPlays, setTotalPlays] = useState(0)
  const [mostPlayed, setMostPlayed] = useState<ApiCard | null>(null)

  useFocusEffect(
    useCallback(() => {
      loadData()
    }, []),
  )

  const loadData = async () => {
    try {
      setLoading(true)
      const categories = await getFavoritesCategories()
      let cards: ApiCard[] = []

      for (const category of categories) {
        const categoryCards = await getFavoritesCategoryCards(category.id)
        cards = [...cards, ...categoryCards]
      }

      setAllCards(cards)
      calculateStats(cards, "day")
    } catch (error) {
      console.error("Error loading statistics:", error)
      Alert.alert("Erro", "Não foi possível carregar as estatísticas")
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (cards: ApiCard[], filterType: FilterType) => {
    let stats: StatsCardData[] = []

    switch (filterType) {
      case "day":
        stats = calculateDailyStats(cards)
        break
      case "week":
        stats = calculateWeeklyStats(cards)
        break
      case "month":
        stats = calculateMonthlyStats(cards)
        break
    }

    setStatsData(stats)
    setTotalPlays(getTotalPlays(cards))
    setMostPlayed(getMostPlayedCard(cards))
    setFilter(filterType)
  }

  const handleFilterChange = (newFilter: FilterType) => {
    calculateStats(allCards, newFilter)
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#3DF3FF" />
      </SafeAreaView>
    )
  }

  const getFilterLabel = () => {
    switch (filter) {
      case "day":
        return "Hoje"
      case "week":
        return "Esta Semana"
      case "month":
        return "Este Mês"
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-terciary px-6 py-4">
          <Text className="text-3xl font-radioBold text-secondary">
            Estatís<Text className="text-white">ticas</Text>
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 pt-6 pb-24">
          {/* Filter Buttons */}
          <View className="flex-row gap-3 px-6 mb-6">
            {(["day", "week", "month"] as FilterType[]).map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => handleFilterChange(f)}
                className={`flex-1 py-3 rounded-xl ${
                  filter === f ? "bg-secondary" : "bg-terciary border border-neutro"
                }`}
              >
                <Text className={`text-center font-spaceBold ${filter === f ? "text-primary" : "text-neutro"}`}>
                  {f === "day" ? "Dia" : f === "week" ? "Semana" : "Mês"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Summary Cards */}
          <View className="flex-row gap-3 px-6 mb-6">
            <View className="flex-1 bg-terciary rounded-2xl p-4">
              <Text className="text-neutro text-sm mb-1">Total de Reproduções</Text>
              <Text className="text-3xl font-radioBold text-secondary">{totalPlays}</Text>
            </View>

            {mostPlayed && (
              <View className="flex-1 bg-terciary rounded-2xl p-4">
                <Text className="text-neutro text-sm mb-1">Mais Clicado</Text>
                <Text className="text-base font-spaceBold text-secondary" numberOfLines={2}>
                  {mostPlayed.name}
                </Text>
              </View>
            )}
          </View>

          {/* Chart */}
          {statsData.length > 0 ? (
            <>
              <View className="px-6 mb-6">
                <StatisticsChart data={statsData} />
              </View>

              {/* Table */}
              <View className="px-6 mb-6">
                <StatsTable data={statsData} />
              </View>
            </>
          ) : (
            <View className="items-center justify-center py-20">
              <Ionicons name="bar-chart-outline" size={60} color="#b5b5b5" />
              <Text className="text-white text-lg mt-4">Nenhum dado de reprodução</Text>
              <Text className="text-neutro text-sm mt-2">Reproduza cards para ver estatísticas</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
