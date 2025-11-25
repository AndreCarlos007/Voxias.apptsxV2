"use client"

import { useState } from "react"
import { Modal, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { createFavoritesCategory } from "../../services/favoritesService"
import type { ApiCategory } from "../../types"

type Props = {
  visible: boolean
  onClose: () => void
  onSuccess: (category: ApiCategory) => void
}

export default function CreateCategoryModal({ visible, onClose, onSuccess }: Props) {
  const [categoryName, setCategoryName] = useState("")
  const [loading, setLoading] = useState(false)

  const resetForm = () => {
    setCategoryName("")
  }

  const handleCreate = async () => {
    if (!categoryName.trim()) {
      Alert.alert("Erro", "Digite um nome para a categoria")
      return
    }

    try {
      setLoading(true)
      const newCategory = await createFavoritesCategory(categoryName.trim())
      Alert.alert("Sucesso", "Categoria criada com sucesso!")
      resetForm()
      onSuccess(newCategory)
      onClose()
    } catch (error: any) {
      console.error("[v0] Error creating category:", error)
      Alert.alert("Erro", error.message || "Erro ao criar categoria")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onShow={resetForm} onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-primary rounded-t-3xl p-6 pb-10">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-radioBold text-secondary">Nova Categoria</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
          </View>

          {/* Input */}
          <View className="mb-6">
            <Text className="text-neutro font-spaceBold mb-2">Nome da Categoria *</Text>
            <TextInput
              placeholder="Ex: Comidas, Sentimentos, Animais"
              placeholderTextColor="#b5b5b5"
              value={categoryName}
              onChangeText={setCategoryName}
              className="bg-secondary rounded-xl p-4 text-primary font-spaceBold text-base"
              autoFocus
            />
          </View>

          {/* Create Button */}
          <TouchableOpacity
            onPress={handleCreate}
            disabled={loading || !categoryName.trim()}
            className={`h-12 rounded-xl justify-center items-center ${
              loading || !categoryName.trim() ? "bg-neutro" : "bg-secondary"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#1B1B1B" />
            ) : (
              <Text className="text-primary font-spaceBold text-lg">Criar Categoria</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
