"use client"

import { useState, useEffect } from "react"
import { Modal, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { ApiCategory } from "../../types"
import { updateFavoritesCategory, deleteFavoritesCategory } from "../../services/favoritesService"

type Props = {
  visible: boolean
  category: ApiCategory | null
  onClose: () => void
  onSuccess: () => void
}

export default function EditCategoryModal({ visible, category, onClose, onSuccess }: Props) {
  const [categoryName, setCategoryName] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (category && visible) {
      setCategoryName(category.name)
    }
  }, [category, visible])

  const handleUpdate = async () => {
    try {
      if (!categoryName.trim()) {
        Alert.alert("Erro", "Digite um nome para a categoria")
        return
      }

      setLoading(true)
      await updateFavoritesCategory(category!.id, categoryName)

      Alert.alert("Sucesso", "Categoria atualizada!")
      onSuccess()
      onClose()
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao atualizar categoria")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = () => {
    Alert.alert("Deletar Categoria", `Tem certeza que deseja deletar "${category?.name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true)
            await deleteFavoritesCategory(category!.id)
            Alert.alert("Sucesso", "Categoria deletada!")
            onSuccess()
            onClose()
          } catch (error: any) {
            Alert.alert("Erro", error.message || "Erro ao deletar categoria")
          } finally {
            setLoading(false)
          }
        },
      },
    ])
  }

  if (!category) return null

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-primary rounded-t-3xl p-6 pb-10">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-radioBold text-secondary flex-1">Editar Categoria</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
          </View>

          {/* Category Name */}
          <View className="gap-4">
            <View>
              <Text className="text-neutro font-spaceBold mb-2">Nome da Categoria</Text>
              <TextInput
                placeholder="Nome da categoria"
                placeholderTextColor="#b5b5b5"
                value={categoryName}
                onChangeText={setCategoryName}
                className="bg-secondary rounded-xl p-4 text-primary font-spaceBold text-base"
              />
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3 mt-6">
              <TouchableOpacity
                onPress={handleDelete}
                className="h-12 bg-red-500/20 rounded-xl justify-center items-center px-4"
              >
                <Ionicons name="trash" size={24} color="#ff6b6b" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleUpdate}
                disabled={loading}
                className="h-12 bg-secondary rounded-xl justify-center items-center flex-1"
              >
                {loading ? (
                  <ActivityIndicator color="#1B1B1B" />
                ) : (
                  <Text className="text-primary font-spaceBold">Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}
