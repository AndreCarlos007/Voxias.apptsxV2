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
import CreateCategoryModal from "../_components/CreateCategoryModal"

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
  const [createCategoryModalVisible, setCreateCategoryModalVisible] = useState(false)
  const [selectedCategoryForCard, setSelectedCategoryForCard] = useState<ApiCategory | null>(null)

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
    setSelectedCategoryForCard(null)
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

  const handleCategoryCreated = (category: ApiCategory) => {
    setCreateCategoryModalVisible(false)
    setSelectedCategoryForCard(category)
    setCreateCardModalVisible(true)
    loadData()
  }

  const handleCategorySelectedForCard = (category: ApiCategory) => {
    setSelectedCategoryForCard(category)
    setCreateCardModalVisible(true)
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
        <View className="bg-terciary px-6 py-5 border-b-2 border-secondary/20">
          <Text className="text-3xl font-radioBold text-secondary">
            Meus <Text className="text-white">Favoritos</Text>
          </Text>
          <Text className="text-neutro font-spaceBold text-sm mt-1">Crie e organize seus cards personalizados</Text>
        </View>

        {/* Content */}
        <ScrollView
          className="flex-1 pt-6 pb-24"
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} tintColor="#3DF3FF" />}
        >
          {categories.length === 0 ? (
            <View className="flex-1 justify-center items-center py-20 px-6">
              <View className="bg-terciary p-8 rounded-3xl items-center">
                <Ionicons name="heart-outline" size={80} color="#3DF3FF" />
                <Text className="text-white text-xl font-radioBold mt-4 text-center">Nenhum favorito ainda</Text>
                <Text className="text-neutro text-base font-spaceBold mt-2 text-center">
                  Clique no botão + para criar{"\n"}sua primeira categoria
                </Text>
              </View>
            </View>
          ) : (
            <>
              {categories.map((category) => (
                <CategorySection
                  key={category.id}
                  category={category}
                  cards={categoryCards[category.id] || []}
                  onCardPress={handleCardPress}
                  onCategoryEdit={handleEditCategory}
                  onCategoryDelete={handleDeleteCategory}
                  onAddCard={handleCategorySelectedForCard}
                />
              ))}

              <TouchableOpacity
                onPress={() => setCreateCategoryModalVisible(true)}
                className="mx-6 mt-2 mb-6 p-5 bg-terciary border-2 border-dashed border-secondary/40 rounded-2xl flex-row items-center justify-center gap-3"
              >
                <Ionicons name="add-circle" size={28} color="#3DF3FF" />
                <Text className="text-secondary font-spaceBold text-base">Criar Nova Categoria</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>

        <TouchableOpacity
          onPress={() => setCreateCategoryModalVisible(true)}
          className="absolute bottom-28 right-6 w-16 h-16 bg-secondary rounded-full justify-center items-center"
          style={{
            shadowColor: "#3DF3FF",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Ionicons name="add" size={36} color="#1B1B1B" />
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <CreateCategoryModal
        visible={createCategoryModalVisible}
        onClose={() => setCreateCategoryModalVisible(false)}
        onSuccess={handleCategoryCreated}
      />

      {selectedCategoryForCard && (
        <CreateCardModal
          visible={createCardModalVisible}
          category={selectedCategoryForCard}
          onClose={() => {
            setCreateCardModalVisible(false)
            setSelectedCategoryForCard(null)
          }}
          onSuccess={handleAddCardSuccess}
        />
      )}

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
