"use client"

import { View, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Text, RefreshControl } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useState, useCallback } from "react"
import { useFocusEffect } from "@react-navigation/native"
import type { ApiCategory, ApiCard } from "../../types"
import { getFavoritesCategories, getFavoritesCategoryCards } from "../../services/favoritesService"
import CategorySection from "../_components/CategorySection"
import CreateCardModal from "../_components/CreateCardModal"
import ApiCardModal from "../_components/ApiCardModal"
import EditCardModal from "../_components/EditCardModal"
import EditCategoryModal from "../_components/EditCategoryModal"

export default function FavoritesScreen() {
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [categoryCards, setCategoryCards] = useState<{ [key: string]: ApiCard[] }>({})
  const [loading, setLoading] = useState(true)
  const [selectedCard, setSelectedCard] = useState<ApiCard | null>(null)
  const [cardModalVisible, setCardModalVisible] = useState(false)
  const [createCardModalVisible, setCreateCardModalVisible] = useState(false)
  const [editCardModalVisible, setEditCardModalVisible] = useState(false)
  const [editCategoryModalVisible, setEditCategoryModalVisible] = useState(false)
  const [selectedEditCard, setSelectedEditCard] = useState<ApiCard | null>(null)
  const [selectedEditCategory, setSelectedEditCategory] = useState<ApiCategory | null>(null)

  useFocusEffect(
    useCallback(() => {
      loadData()
    }, []),
  )

  const loadData = async () => {
    try {
      setLoading(true)
      const cats = await getFavoritesCategories()
      console.log("[v0] Categories loaded:", cats)
      setCategories(cats)

      const cardsMap: { [key: string]: ApiCard[] } = {}
      for (const category of cats) {
        try {
          const cards = await getFavoritesCategoryCards(category.id)
          cardsMap[category.id] = cards
        } catch (error) {
          console.error(`[v0] Error loading cards for category ${category.id}:`, error)
          cardsMap[category.id] = []
        }
      }
      setCategoryCards(cardsMap)
    } catch (error) {
      console.error("[v0] Error loading favorites:", error)
      if (categories.length === 0) {
        Alert.alert("Erro", "Não foi possível carregar os favoritos.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCardPress = (card: ApiCard) => {
    setSelectedCard(card)
    setCardModalVisible(true)
  }

  const handleEditCard = (card: ApiCard) => {
    setSelectedEditCard(card)
    setEditCardModalVisible(true)
  }

  const handleEditCategory = (category: ApiCategory) => {
    setSelectedEditCategory(category)
    setEditCategoryModalVisible(true)
  }

  const handleDeleteCategory = (categoryId: string) => {
    loadData()
  }

  const handleAddCardSuccess = () => {
    setCreateCardModalVisible(false)
    loadData()
  }

  const handleEditCardSuccess = () => {
    setEditCardModalVisible(false)
    loadData()
  }

  const handleEditCategorySuccess = () => {
    setEditCategoryModalVisible(false)
    loadData()
  }

  if (loading && categories.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#3DF3FF" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-terciary px-6 py-4">
          <Text className="text-3xl font-radioBold text-secondary">
            Meus <Text className="text-white">Favoritos</Text>
          </Text>
        </View>

        {/* Content */}
        <ScrollView
          className="flex-1 pt-6 pb-24"
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} tintColor="#3DF3FF" />}
        >
          {categories.length === 0 ? (
            <View className="flex-1 justify-center items-center py-20">
              <Ionicons name="heart-outline" size={60} color="#b5b5b5" />
              <Text className="text-white text-lg mt-4">Nenhum favorito ainda</Text>
              <Text className="text-neutro text-sm mt-2">Clique no botão + para adicionar</Text>
            </View>
          ) : (
            categories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                cards={categoryCards[category.id] || []}
                onCardPress={handleCardPress}
                onCategoryEdit={handleEditCategory}
                onCategoryDelete={handleDeleteCategory}
              />
            ))
          )}
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity
          onPress={() => setCreateCardModalVisible(true)}
          className="absolute bottom-24 right-6 w-16 h-16 bg-secondary rounded-full justify-center items-center shadow-lg"
        >
          <Ionicons name="add" size={32} color="#1B1B1B" />
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <CreateCardModal
        visible={createCardModalVisible}
        onClose={() => setCreateCardModalVisible(false)}
        onSuccess={handleAddCardSuccess}
        categories={categories}
      />

      <ApiCardModal
        visible={cardModalVisible}
        card={selectedCard}
        onClose={() => setCardModalVisible(false)}
        onPlayCountUpdate={() => loadData()}
        onEdit={(card) => {
          setCardModalVisible(false)
          handleEditCard(card)
        }}
      />

      <EditCardModal
        visible={editCardModalVisible}
        card={selectedEditCard}
        onClose={() => setEditCardModalVisible(false)}
        onSuccess={handleEditCardSuccess}
      />

      <EditCategoryModal
        visible={editCategoryModalVisible}
        category={selectedEditCategory}
        onClose={() => setEditCategoryModalVisible(false)}
        onSuccess={handleEditCategorySuccess}
      />
    </SafeAreaView>
  )
}
