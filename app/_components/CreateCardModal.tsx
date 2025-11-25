"use client"

import { useState } from "react"
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { ApiCategory } from "../../types"
import { createFavoritesCategory, createFavoritesCard } from "../../services/favoritesService"
import ImagePickerButton from "./ImagePickerButton"
import AudioPickerButton from "./AudioPickerButton"

type Props = {
  visible: boolean
  onClose: () => void
  onSuccess: () => void
  categories: ApiCategory[]
}

export default function CreateCardModal({ visible, onClose, onSuccess, categories }: Props) {
  const [step, setStep] = useState(1) // 1: card info, 2: select/create category
  const [cardName, setCardName] = useState("")
  const [imageBlob, setImageBlob] = useState<Blob | null>(null)
  const [imageUri, setImageUri] = useState("")
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioName, setAudioName] = useState("")
  const [selectedCategoryId, setSelectedCategoryId] = useState("")
  const [newCategoryName, setNewCategoryName] = useState("")
  const [useNewCategory, setUseNewCategory] = useState(false)
  const [loading, setLoading] = useState(false)

  const resetForm = () => {
    setStep(1)
    setCardName("")
    setImageBlob(null)
    setImageUri("")
    setAudioBlob(null)
    setAudioName("")
    setSelectedCategoryId("")
    setNewCategoryName("")
    setUseNewCategory(false)
  }

  const handleOpenModal = () => {
    resetForm()
  }

  const handleNextStep = () => {
    if (step === 1) {
      if (!cardName.trim()) {
        Alert.alert("Erro", "Digite um nome para o card")
        return
      }
      if (!imageBlob) {
        Alert.alert("Erro", "Selecione uma imagem para o card")
        return
      }
      if (!audioBlob) {
        Alert.alert("Erro", "Selecione ou grave um áudio para o card")
        return
      }
      setStep(2)
    }
  }

  const handleCreate = async () => {
    try {
      if (!cardName.trim()) {
        Alert.alert("Erro", "Digite um nome para o card")
        return
      }
      if (!imageBlob) {
        Alert.alert("Erro", "Selecione uma imagem para o card")
        return
      }
      if (!audioBlob) {
        Alert.alert("Erro", "Selecione ou grave um áudio para o card")
        return
      }

      setLoading(true)

      let categoryId = selectedCategoryId

      if (useNewCategory && newCategoryName.trim()) {
        try {
          console.log("[v0] Creating new category:", newCategoryName)
          const newCategory = await createFavoritesCategory(newCategoryName)
          categoryId = newCategory.id
          console.log("[v0] New category created with ID:", categoryId)
        } catch (error: any) {
          console.log("[v0] Error creating category:", error.message)
          // Try to find existing category with same name
          const existingCat = categories.find((c) => c.nome?.toLowerCase() === newCategoryName.toLowerCase())
          if (existingCat) {
            categoryId = existingCat.id
            console.log("[v0] Using existing category:", existingCat.id)
          } else {
            throw new Error("Erro ao criar categoria. Tente novamente.")
          }
        }
      }

      if (!categoryId) {
        Alert.alert("Erro", "Selecione ou crie uma categoria")
        return
      }

      console.log("[v0] Creating card with categoryId:", categoryId)
      await createFavoritesCard(cardName, categoryId, imageBlob, audioBlob)

      console.log("[v0] Card created successfully")
      Alert.alert("Sucesso", "Card adicionado aos favoritos!")
      resetForm()
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error("[v0] Error in handleCreate:", error)
      Alert.alert("Erro", error.message || "Erro ao adicionar card. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onShow={handleOpenModal} onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-primary rounded-t-3xl p-6 pb-10 max-h-[90%]">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-radioBold text-secondary flex-1">Novo Card</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
          </View>

          {/* Progress Indicator */}
          <View className="flex-row gap-2 mb-6">
            {[1, 2].map((s) => (
              <View key={s} className={`h-1 flex-1 rounded ${step >= s ? "bg-secondary" : "bg-neutro"}`} />
            ))}
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Step 1: Card Info & Media */}
            {step === 1 && (
              <View className="gap-4">
                {/* Card Name */}
                <View>
                  <Text className="text-neutro font-spaceBold mb-2">Nome do Card *</Text>
                  <TextInput
                    placeholder="Ex: Água, Comida, Amor"
                    placeholderTextColor="#b5b5b5"
                    value={cardName}
                    onChangeText={setCardName}
                    className="bg-secondary rounded-xl p-4 text-primary font-spaceBold text-base"
                  />
                </View>

                {/* Image Picker */}
                <View>
                  <Text className="text-neutro font-spaceBold mb-2">Imagem *</Text>
                  <ImagePickerButton
                    onImageSelected={(blob, uri) => {
                      setImageBlob(blob)
                      setImageUri(uri)
                    }}
                    selectedUri={imageUri}
                  />
                  {imageUri && (
                    <View className="mt-3 items-center">
                      <Image source={{ uri: imageUri }} style={{ width: 80, height: 80, borderRadius: 12 }} />
                    </View>
                  )}
                </View>

                {/* Audio Picker */}
                <View>
                  <Text className="text-neutro font-spaceBold mb-2">Áudio *</Text>
                  <AudioPickerButton
                    onAudioSelected={(blob, name) => {
                      setAudioBlob(blob)
                      setAudioName(name)
                    }}
                    selectedName={audioName}
                  />
                  {audioName && (
                    <View className="mt-3 bg-terciary rounded-xl p-3 flex-row items-center gap-2">
                      <Ionicons name="checkmark-circle" size={24} color="#3DF3FF" />
                      <Text className="text-secondary font-spaceBold flex-1" numberOfLines={1}>
                        {audioName === "recording" ? "Áudio Gravado" : "Áudio Selecionado"}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Next Button */}
                <TouchableOpacity
                  onPress={handleNextStep}
                  className="h-12 bg-secondary rounded-xl justify-center items-center mt-4"
                >
                  <Text className="text-primary font-spaceBold text-lg">Próximo</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 2: Category Selection */}
            {step === 2 && (
              <View className="gap-4">
                <Text className="text-neutro font-spaceBold mb-3">Categorias Existentes</Text>
                {categories.length > 0 ? (
                  <View className="gap-2 mb-4">
                    {categories.map((cat) => (
                      <TouchableOpacity
                        key={cat.id}
                        onPress={() => {
                          setSelectedCategoryId(cat.id)
                          setUseNewCategory(false)
                        }}
                        className={`flex-row items-center p-4 rounded-xl border-2 ${
                          selectedCategoryId === cat.id && !useNewCategory
                            ? "bg-secondary border-secondary"
                            : "border-neutro bg-terciary"
                        }`}
                      >
                        <Ionicons
                          name="folder"
                          size={20}
                          color={selectedCategoryId === cat.id && !useNewCategory ? "#1B1B1B" : "#3DF3FF"}
                        />
                        <Text
                          className={`font-spaceBold ml-3 flex-1 ${
                            selectedCategoryId === cat.id && !useNewCategory ? "text-primary" : "text-secondary"
                          }`}
                        >
                          {cat.nome}
                        </Text>
                        {selectedCategoryId === cat.id && !useNewCategory && (
                          <Ionicons name="checkmark" size={20} color="#1B1B1B" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <Text className="text-neutro text-sm mb-4">Nenhuma categoria existente</Text>
                )}

                <Text className="text-neutro font-spaceBold mb-3">Criar Nova Categoria</Text>
                <TouchableOpacity
                  onPress={() => setUseNewCategory(!useNewCategory)}
                  className={`flex-row items-center p-4 rounded-xl border-2 ${
                    useNewCategory ? "bg-secondary border-secondary" : "border-neutro bg-terciary"
                  }`}
                >
                  <Ionicons
                    name={useNewCategory ? "checkmark-circle" : "add-circle-outline"}
                    size={20}
                    color={useNewCategory ? "#1B1B1B" : "#3DF3FF"}
                  />
                  <Text className={`font-spaceBold ml-3 flex-1 ${useNewCategory ? "text-primary" : "text-secondary"}`}>
                    {useNewCategory ? "Criar nova categoria" : "Clique para criar"}
                  </Text>
                </TouchableOpacity>

                {useNewCategory && (
                  <TextInput
                    placeholder="Nome da nova categoria"
                    placeholderTextColor="#b5b5b5"
                    value={newCategoryName}
                    onChangeText={setNewCategoryName}
                    className="bg-secondary rounded-xl p-4 text-primary font-spaceBold mt-3"
                  />
                )}

                {/* Action Buttons */}
                <View className="flex-row gap-3 mt-6">
                  <TouchableOpacity
                    onPress={() => setStep(1)}
                    className="h-12 bg-neutro rounded-xl justify-center items-center flex-1"
                  >
                    <Text className="text-primary font-spaceBold">Voltar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleCreate}
                    disabled={loading || (!selectedCategoryId && (!useNewCategory || !newCategoryName.trim()))}
                    className={`h-12 rounded-xl justify-center items-center flex-1 ${
                      loading || (!selectedCategoryId && (!useNewCategory || !newCategoryName.trim()))
                        ? "bg-neutro"
                        : "bg-secondary"
                    }`}
                  >
                    {loading ? (
                      <ActivityIndicator color="#1B1B1B" />
                    ) : (
                      <Text className="text-primary font-spaceBold">Criar Card</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}
