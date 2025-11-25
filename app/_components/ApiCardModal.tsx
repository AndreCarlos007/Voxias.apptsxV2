"use client"

import { useState, useEffect, useRef } from "react"
import { Modal, View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { ApiCard } from "../../types"
import * as Speech from "expo-speech"
import { updateCardPlayCount } from "../../services/favoritesService"

type Props = {
  visible: boolean
  card: ApiCard | null
  onClose: () => void
  onPlayCountUpdate: (cardId: string) => void
  onEdit?: (card: ApiCard) => void
}

export default function ApiCardModal({ visible, card, onClose, onPlayCountUpdate, onEdit }: Props) {
  const [playCount, setPlayCount] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [updating, setUpdating] = useState(false)
  const debounceTimer = useRef<NodeJS.Timeout | number | null>(null)
  const [audioUrl, setAudioUrl] = useState("")

  useEffect(() => {
    if (card) {
      setPlayCount(card.playCount || 0)
      if (card.audioUrl) {
        const url = card.audioUrl.startsWith("http") ? card.audioUrl : `https://voxia-api.onrender.com${card.audioUrl}`
        setAudioUrl(url)
        console.log("[v0] Audio URL set:", url)
      }
    }
  }, [card])

  useEffect(() => {
    if (!visible) {
      Speech.stop()
      setIsSpeaking(false)
    }
  }, [visible])

  const speak = async () => {
    if (!card || !card.name || isSpeaking) return

    try {
      setIsSpeaking(true)
      console.log("[v0] Speaking card name:", card.name)
      await Speech.speak(card.name, {
        language: "pt-BR",
        pitch: 1.0,
        rate: 0.9,
      })

      const newCount = playCount + 1
      setPlayCount(newCount)

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current as NodeJS.Timeout)
      }
      debounceTimer.current = setTimeout(async () => {
        try {
          await updateCardPlayCount(card.id, newCount)
          onPlayCountUpdate(card.id)
        } catch (error) {
          console.error("[v0] Error updating play count:", error)
        }
      }, 1000)
    } catch (error) {
      console.error("[v0] Error speaking:", error)
    } finally {
      setIsSpeaking(false)
    }
  }

  if (!card) return null

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/50 px-6">
        <View className="bg-terciary w-full rounded-3xl p-8 items-center shadow-2xl">
          <View className="absolute top-4 right-4 flex-row gap-2 z-10">
            {onEdit && (
              <TouchableOpacity
                onPress={() => {
                  onEdit(card)
                  onClose()
                }}
                className="p-2 bg-secondary rounded-full"
              >
                <Ionicons name="pencil" size={20} color="#1B1B1B" />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onClose} className="p-2 bg-secondary rounded-full">
              <Ionicons name="close" size={20} color="#1B1B1B" />
            </TouchableOpacity>
          </View>

          <View className="w-40 h-40 rounded-full bg-secondary justify-center items-center mb-6 overflow-hidden">
            <Image source={{ uri: card.imageUrl }} className="w-32 h-32" resizeMode="contain" />
          </View>

          <Text className="text-white text-2xl font-radioBold text-center mb-8">{card.name}</Text>

          <View className="w-full flex-row justify-around items-center mb-6">
            <TouchableOpacity
              onPress={speak}
              disabled={isSpeaking || updating}
              className="w-20 h-20 rounded-full bg-secondary justify-center items-center"
            >
              {isSpeaking ? (
                <ActivityIndicator color="#1B1B1B" size="large" />
              ) : (
                <Image source={require("../../assets/icons/sound.png")} className="w-12 h-12" resizeMode="contain" />
              )}
            </TouchableOpacity>

            <View className="items-center">
              <Text className="text-neutro text-sm mb-1">Reproduções</Text>
              <Text className="text-5xl font-spaceBold text-secondary">{playCount.toString().padStart(2, "0")}</Text>
            </View>
          </View>

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
