"use client"

import { ScrollView, View, ActivityIndicator, Text, Alert } from "react-native"
import { useEffect, useState } from "react"
import Header from "../_components/Header"
import type { ApiCategory, ApiCard } from "../../types"
import { getHomeCategories, getHomeCategoryCards } from "../../services/homeService"
import CategorySection from "../_components/CategorySection"
import ApiCardModal from "../_components/ApiCardModal"

export default function HomeScreen() {
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [categoryCards, setCategoryCards] = useState<{ [key: string]: ApiCard[] }>({})
  const [loading, setLoading] = useState(true)
  const [selectedCard, setSelectedCard] = useState<ApiCard | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const cats = await getHomeCategories()
      setCategories(cats)

      // Load cards for each category
      const cardsMap: { [key: string]: ApiCard[] } = {}
      for (const category of cats) {
        const cards = await getHomeCategoryCards(category.id)
        cardsMap[category.id] = cards
      }
      setCategoryCards(cardsMap)
    } catch (error) {
      console.error("Error loading home data:", error)
      Alert.alert("Erro", "Não foi possível carregar os dados. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleCardPress = (card: ApiCard) => {
    setSelectedCard(card)
    setModalVisible(true)
  }

  const handleRefreshStats = (cardId: string) => {
    // Stats will be updated through the modal
  }

  if (loading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#3DF3FF" />
      </View>
    )
  }

  return (
    <View className="flex-1 bg-primary">
      <Header />

      <ScrollView className="pt-8 pb-24">
        {categories.length === 0 ? (
          <View className="justify-center items-center py-20">
            <Text className="text-white text-lg">Nenhuma categoria disponível</Text>
          </View>
        ) : (
          categories.map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              cards={categoryCards[category.id] || []}
              onCardPress={handleCardPress}
            />
          ))
        )}
      </ScrollView>

      <ApiCardModal
        visible={modalVisible}
        card={selectedCard}
        onClose={() => setModalVisible(false)}
        onPlayCountUpdate={handleRefreshStats}
      />
    </View>
  )
}
