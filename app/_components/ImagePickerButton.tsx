"use client"

import { TouchableOpacity, Text, ActivityIndicator, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { useState } from "react"

type Props = {
  onImageSelected: (uri: string) => void
  selectedUri?: string
}

export default function ImagePickerButton({ onImageSelected, selectedUri }: Props) {
  const [loading, setLoading] = useState(false)

  const pickImage = async () => {
    try {
      setLoading(true)

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Permitir acesso à galeria para selecionar imagens")
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0]
        console.log("[v0] Image selected:", asset.uri)

        onImageSelected(asset.uri)
      }
    } catch (error) {
      console.error("Error picking image:", error)
      Alert.alert("Erro", "Falha ao selecionar imagem")
    } finally {
      setLoading(false)
    }
  }

  return (
    <TouchableOpacity
      onPress={pickImage}
      disabled={loading}
      className="flex-row items-center justify-center gap-2 bg-secondary rounded-xl p-4"
    >
      {loading ? (
        <ActivityIndicator color="#1B1B1B" />
      ) : (
        <>
          <Ionicons name="image" size={20} color="#1B1B1B" />
          <Text className="text-primary font-spaceBold">{selectedUri ? "Alterar Imagem" : "Selecionar Imagem"}</Text>
        </>
      )}
    </TouchableOpacity>
  )
}
