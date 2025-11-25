"use client"

import { useState, useEffect } from "react"
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
import type { ApiCard } from "../../types"
import { updateFavoritesCard, deleteCard } from "../../services/favoritesService"
import ImagePickerButton from "./ImagePickerButton"
import AudioPickerButton from "./AudioPickerButton"

type Props = {
  visible: boolean
  card: ApiCard | null
  onClose: () => void
  onSuccess: () => void
}

export default function EditCardModal({ visible, card, onClose, onSuccess }: Props) {
  const [cardName, setCardName] = useState("")
  const [imageBlob, setImageBlob] = useState<Blob | null>(null)
  const [imageUri, setImageUri] = useState("")
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioName, setAudioName] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (card && visible) {
      setCardName(card.name)
      setImageUri(card.imageUrl)
      setAudioName(card.audioUrl ? "current-audio" : "")
    }
  }, [card, visible])

  const handleUpdate = async () => {
    try {
      if (!cardName.trim()) {
        Alert.alert("Erro", "Digite um nome para o card")
        return
      }

      setLoading(true)

      await updateFavoritesCard(card!.id, cardName, imageBlob || undefined, audioBlob || undefined)

      Alert.alert("Sucesso", "Card atualizado!")
      onSuccess()
      onClose()
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao atualizar card")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = () => {
    Alert.alert("Deletar Card", `Tem certeza que deseja deletar "${card?.name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true)
            await deleteCard(card!.id)
            Alert.alert("Sucesso", "Card deletado!")
            onSuccess()
            onClose()
          } catch (error: any) {
            Alert.alert("Erro", error.message || "Erro ao deletar card")
          } finally {
            setLoading(false)
          }
        },
      },
    ])
  }

  if (!card) return null

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-primary rounded-t-3xl p-6 pb-10 max-h-[90%]">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-radioBold text-secondary flex-1">Editar Card</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Card Name */}
            <View className="gap-4">
              <View>
                <Text className="text-neutro font-spaceBold mb-2">Nome do Card</Text>
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
                <Text className="text-neutro font-spaceBold mb-2">Imagem</Text>
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
                <Text className="text-neutro font-spaceBold mb-2">Áudio (Opcional)</Text>
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
                      {audioName === "recording" ? "Áudio Gravado" : "Áudio Selecionado/Atual"}
                    </Text>
                  </View>
                )}
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
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}
