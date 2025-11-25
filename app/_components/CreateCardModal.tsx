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
import { createFavoritesCard } from "../../services/favoritesService"
import ImagePickerButton from "./ImagePickerButton"
import AudioPickerButton from "./AudioPickerButton"

type Props = {
  visible: boolean
  category: ApiCategory | null
  onClose: () => void
  onSuccess: () => void
}

export default function CreateCardModal({ visible, category, onClose, onSuccess }: Props) {
  const [cardName, setCardName] = useState("")
  const [imageUri, setImageUri] = useState("")
  const [audioUri, setAudioUri] = useState("")
  const [audioName, setAudioName] = useState("")
  const [loading, setLoading] = useState(false)

  if (!category) {
    return null
  }

  const resetForm = () => {
    setCardName("")
    setImageUri("")
    setAudioUri("")
    setAudioName("")
  }

  const handleCreate = async () => {
    if (!cardName.trim()) {
      Alert.alert("Erro", "Digite um nome para o card")
      return
    }
    if (!imageUri) {
      Alert.alert("Erro", "Selecione uma imagem para o card")
      return
    }
    if (!audioUri) {
      Alert.alert("Erro", "Selecione ou grave um áudio para o card")
      return
    }

    try {
      setLoading(true)
      console.log("[v0] Creating card for category:", category.nome, category.id)

      await createFavoritesCard(cardName.trim(), category.id, imageUri, audioUri)

      Alert.alert("Sucesso", `Card "${cardName}" criado na categoria "${category.nome}"!`)
      resetForm()
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error("[v0] Error in handleCreate:", error)
      Alert.alert("Erro", error.message || "Erro ao criar card. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onShow={resetForm} onRequestClose={onClose}>
      <View className="flex-1 bg-black/70 justify-end">
        <View className="bg-primary rounded-t-3xl p-6 pb-10 max-h-[90%] border-t-4 border-secondary">
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-1">
              <Text className="text-3xl font-radioBold text-secondary">Novo Card</Text>
              <View className="flex-row items-center mt-2 bg-terciary px-3 py-2 rounded-lg self-start">
                <Ionicons name="folder" size={16} color="#3DF3FF" />
                <Text className="text-secondary font-spaceBold ml-2">{category.nome}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} className="bg-terciary p-2 rounded-full">
              <Ionicons name="close" size={28} color="#3DF3FF" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="gap-5">
              <View>
                <View className="flex-row items-center mb-2">
                  <Ionicons name="text" size={18} color="#3DF3FF" />
                  <Text className="text-secondary font-spaceBold ml-2">Nome do Card *</Text>
                </View>
                <TextInput
                  placeholder="Ex: Água, Comida, Amor"
                  placeholderTextColor="#6b7280"
                  value={cardName}
                  onChangeText={setCardName}
                  className="bg-terciary rounded-xl p-4 text-white font-spaceBold text-base border-2 border-secondary/20"
                />
              </View>

              <View>
                <View className="flex-row items-center mb-2">
                  <Ionicons name="image" size={18} color="#3DF3FF" />
                  <Text className="text-secondary font-spaceBold ml-2">Imagem *</Text>
                </View>
                <ImagePickerButton onImageSelected={setImageUri} selectedUri={imageUri} />
                {imageUri && (
                  <View className="mt-3 items-center">
                    <Image
                      source={{ uri: imageUri }}
                      style={{ width: 120, height: 120, borderRadius: 16 }}
                      className="border-2 border-secondary"
                    />
                  </View>
                )}
              </View>

              <View>
                <View className="flex-row items-center mb-2">
                  <Ionicons name="musical-notes" size={18} color="#3DF3FF" />
                  <Text className="text-secondary font-spaceBold ml-2">Áudio (MP3/M4A) *</Text>
                </View>
                <AudioPickerButton
                  onAudioSelected={(uri, name) => {
                    setAudioUri(uri)
                    setAudioName(name || "audio.mp3")
                  }}
                  selectedName={audioName}
                />
                {audioName && (
                  <View className="mt-3 bg-terciary rounded-xl p-4 flex-row items-center gap-3 border-2 border-secondary/20">
                    <View className="bg-secondary/20 p-2 rounded-lg">
                      <Ionicons name="musical-note" size={24} color="#3DF3FF" />
                    </View>
                    <Text className="text-white font-spaceBold flex-1" numberOfLines={1}>
                      {audioName}
                    </Text>
                    <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                  </View>
                )}
              </View>

              <TouchableOpacity
                onPress={handleCreate}
                disabled={loading || !cardName.trim() || !imageUri || !audioUri}
                className={`h-14 rounded-xl justify-center items-center mt-4 ${
                  loading || !cardName.trim() || !imageUri || !audioUri ? "bg-neutro/50" : "bg-secondary"
                }`}
                style={
                  !loading && cardName.trim() && imageUri && audioUri
                    ? {
                        shadowColor: "#3DF3FF",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 6,
                        elevation: 6,
                      }
                    : {}
                }
              >
                {loading ? (
                  <View className="flex-row items-center gap-2">
                    <ActivityIndicator color="#1B1B1B" />
                    <Text className="text-primary font-spaceBold text-base">Criando...</Text>
                  </View>
                ) : (
                  <Text className="text-primary font-spaceBold text-lg">Criar Card</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}
