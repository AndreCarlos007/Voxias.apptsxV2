"use client"

import { useState, useEffect } from "react"
import { Modal, View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { ApiCard } from "../../types"
import * as Speech from "expo-speech"

type Props = {
  visible: boolean
  card: ApiCard | null
  onClose: () => void
}

export default function HomeCardModal({ visible, card, onClose }: Props) {
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    if (!visible) {
      Speech.stop()
      setIsSpeaking(false)
    }
  }, [visible])

  const speak = async () => {
    if (!card || !card.nome || isSpeaking) return

    try {
      setIsSpeaking(true)
      await Speech.speak(card.nome, {
        language: "pt-BR",
        pitch: 1.0,
        rate: 0.9,
      })
    } catch (error) {
      console.error("Error speaking:", error)
    } finally {
      setIsSpeaking(false)
    }
  }

  if (!card) return null

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/50 px-6">
        <View className="bg-terciary w-full rounded-3xl p-8 items-center shadow-2xl">
          <TouchableOpacity onPress={onClose} className="absolute top-4 right-4 p-2 bg-secondary rounded-full z-10">
            <Ionicons name="close" size={20} color="#1B1B1B" />
          </TouchableOpacity>

          <View className="w-40 h-40 rounded-full bg-secondary justify-center items-center mb-6 overflow-hidden">
            <Image source={{ uri: card.imagemUrl }} className="w-32 h-32" resizeMode="contain" />
          </View>

          <Text className="text-white text-2xl font-radioBold text-center mb-8">{card.nome}</Text>

          <TouchableOpacity
            onPress={speak}
            disabled={isSpeaking}
            className="w-20 h-20 rounded-full bg-secondary justify-center items-center mb-6"
          >
            {isSpeaking ? (
              <ActivityIndicator color="#1B1B1B" size="large" />
            ) : (
              <Image source={require("../../assets/icons/sound.png")} className="w-12 h-12" resizeMode="contain" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            className="w-full h-12 bg-secondary rounded-2xl justify-center items-center mt-4"
          >
            <Text className="text-primary font-spaceBold text-lg">Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
