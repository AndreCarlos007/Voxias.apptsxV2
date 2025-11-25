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
import { createFavoritesCategory, createFavoritesCard, getFavoritesCategories } from "../../services/favoritesService"
import ImagePickerButton from "./ImagePickerButton"
import AudioPickerButton from "./AudioPickerButton"

type Props = {
  visible: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AddCardModal({ visible, onClose, onSuccess }: Props) {
  const [step, setStep] = useState(1) // 1: info, 2: media, 3: category
  const [cardName, setCardName] = useState("")
  const [imageBlob, setImageBlob] = useState<Blob | null>(null)
  const [imageUri, setImageUri] = useState("")
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState("")
  const [newCategoryName, setNewCategoryName] = useState("")
  const [useNewCategory, setUseNewCategory] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleOpenModal = async () => {
    try {
      const cats = await getFavoritesCategories()
      setCategories(cats)
      setStep(1)
      setCardName("")
      setImageBlob(null)
      setImageUri("")
      setAudioBlob(null)
      setSelectedCategoryId("")
      setNewCategoryName("")
      setUseNewCategory(false)
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as categorias")
    }
  }

  const handleNextStep = () => {
    if (step === 1) {
      if (!cardName.trim()) {
        Alert.alert("Erro", "Digite um nome para o card")
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (!imageBlob) {
        Alert.alert("Erro", "Selecione uma imagem")
        return
      }
      if (!audioBlob) {
        Alert.alert("Erro", "Selecione ou grave um áudio")
        return
      }
      setStep(3)
    }
  }

  const handleCreate = async () => {
    try {
      setLoading(true)

      let categoryId = selectedCategoryId

      if (useNewCategory && newCategoryName.trim()) {
        const newCategory = await createFavoritesCategory(newCategoryName)
        categoryId = newCategory.id
      }

      if (!categoryId) {
        Alert.alert("Erro", "Selecione ou crie uma categoria")
        return
      }

      await createFavoritesCard(cardName, categoryId, imageBlob!, audioBlob)

      Alert.alert("Sucesso", "Card adicionado aos favoritos!")
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error("Error creating card:", error)
      Alert.alert("Erro", error.response?.data?.message || "Erro ao adicionar card")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onShow={handleOpenModal} onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-primary rounded-t-3xl p-6 pb-10 max-h-[90%]">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-radioBold text-secondary flex-1">Novo Card</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <View key={s} className={`h-1 flex-1 rounded ${step >= s ? "bg-secondary" : "bg-neutro"}`} />
            ))}
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {step === 1 && (
              <View>
                <Text className="text-neutro font-spaceBold mb-2">Nome do Card</Text>
                <TextInput
                  placeholder="Ex: Água, Comida, Amor"
                  placeholderTextColor="#b5b5b5"
                  value={cardName}
                  onChangeText={setCardName}
                  className="bg-secondary rounded-xl p-4 text-primary font-spaceBold text-base mb-6"
                />

                <TouchableOpacity
                  onPress={handleNextStep}
                  className="h-12 bg-secondary rounded-xl justify-center items-center"
                >
                  <Text className="text-primary font-spaceBold text-lg">Próximo</Text>
                </TouchableOpacity>
              </View>
            )}

            {step === 2 && (
              <View>
                <Text className="text-neutro font-spaceBold mb-3">Selecionar Imagem</Text>
                <ImagePickerButton
                  onImageSelected={(blob, uri) => {
                    setImageBlob(blob)
                    setImageUri(uri)
                  }}
                  selectedUri={imageUri}
                />

                {imageUri && (
                  <View className="bg-secondary rounded-xl p-4 mt-4 items-center">
                    <Image source={{ uri: imageUri }} style={{ width: 80, height: 80, borderRadius: 8 }} />
                  </View>
                )}

                <Text className="text-neutro font-spaceBold mb-3 mt-6">Selecionar Áudio</Text>
                <AudioPickerButton
                  onAudioSelected={(blob) => {
                    setAudioBlob(blob)
                  }}
                  selectedName={audioBlob ? "Áudio selecionado" : undefined}
                />

                <View className="flex-row gap-3 mt-6">
                  <TouchableOpacity
                    onPress={() => setStep(1)}
                    className="h-12 bg-neutro rounded-xl justify-center items-center flex-1"
                  >
                    <Text className="text-primary font-spaceBold">Voltar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleNextStep}
                    className="h-12 bg-secondary rounded-xl justify-center items-center flex-1"
                  >
                    <Text className="text-primary font-spaceBold">Próximo</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {step === 3 && (
              <View>
                <Text className="text-neutro font-spaceBold mb-3">Selecionar Categoria</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => {
                        setSelectedCategoryId(cat.id)
                        setUseNewCategory(false)
                      }}
                      className={`px-4 py-2 rounded-full mr-3 border-2 ${
                        selectedCategoryId === cat.id ? "bg-secondary border-secondary" : "border-neutro"
                      }`}
                    >
                      <Text
                        className={`font-spaceBold ${selectedCategoryId === cat.id ? "text-primary" : "text-neutro"}`}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <View className="border-t border-neutro pt-4 mb-4">
                  <Text className="text-neutro font-spaceBold mb-2">Ou Criar Nova</Text>
                  <TouchableOpacity
                    onPress={() => setUseNewCategory(!useNewCategory)}
                    className={`flex-row items-center p-3 rounded-xl ${
                      useNewCategory ? "bg-secondary" : "bg-terciary"
                    }`}
                  >
                    <Ionicons
                      name={useNewCategory ? "checkmark-circle" : "add-circle-outline"}
                      size={24}
                      color={useNewCategory ? "#1B1B1B" : "#3DF3FF"}
                    />
                    <Text className={`ml-3 font-spaceBold ${useNewCategory ? "text-primary" : "text-secondary"}`}>
                      Criar categoria
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
                </View>

                <View className="flex-row gap-3 mt-6">
                  <TouchableOpacity
                    onPress={() => setStep(2)}
                    className="h-12 bg-neutro rounded-xl justify-center items-center flex-1"
                  >
                    <Text className="text-primary font-spaceBold">Voltar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleCreate}
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
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}
