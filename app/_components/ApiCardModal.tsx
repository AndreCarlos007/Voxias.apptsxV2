"use client"

import { useState, useEffect, useRef } from "react"
import { Modal, View, Text, Image, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { ApiCard } from "../../types"
import { Audio } from "expo-av"
import { incrementCardClick, deleteCard } from "../../services/favoritesService"

type Props = {
  visible: boolean
  card: ApiCard | null
  onClose: () => void
  onPlayCountUpdate: (cardId: string) => void
  onEdit?: (card: ApiCard) => void
}

export default function ApiCardModal({ visible, card, onClose, onPlayCountUpdate, onEdit }: Props) {
  const [playCount, setPlayCount] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const soundRef = useRef<Audio.Sound | null>(null)

  useEffect(() => {
    if (card) {
      setPlayCount(card.vezes || 0)
    }
  }, [card])

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync()
      }
    }
  }, [])

  useEffect(() => {
    if (!visible) {
      stopPlayback()
    }
  }, [visible])

  const stopPlayback = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync()
      await soundRef.current.unloadAsync()
      soundRef.current = null
    }
    setIsPlaying(false)
  }

  const playAudio = async () => {
    if (!card || isPlaying) return

    try {
      setIsPlaying(true)
      console.log("[v0] Playing audio for card:", card.nome)

      // Stop any previous playback
      await stopPlayback()

      if (!card.audioUrl) {
        Alert.alert("Erro", "Este card não possui áudio")
        setIsPlaying(false)
        return
      }

      const audioUri = card.audioUrl.startsWith("http")
        ? card.audioUrl
        : `https://voxia-api.onrender.com${card.audioUrl}`

      console.log("[v0] Loading audio from:", audioUri)

      const { sound } = await Audio.Sound.createAsync({ uri: audioUri }, { shouldPlay: true })
      soundRef.current = sound

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false)
          sound.unloadAsync()
        }
      })

      const newCount = playCount + 1
      setPlayCount(newCount)

      try {
        await incrementCardClick(card.id)
        onPlayCountUpdate(card.id)
      } catch (error) {
        console.error("Error registering click:", error)
      }
    } catch (error) {
      console.error("Error playing audio:", error)
      Alert.alert("Erro", "Não foi possível reproduzir o áudio")
      setIsPlaying(false)
    }
  }

  const handleDelete = () => {
    if (!card) return

    Alert.alert("Deletar Card", `Tem certeza que deseja deletar "${card.nome}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteCard(card.id)
            Alert.alert("Sucesso", "Card deletado com sucesso!")
            onClose()
            onPlayCountUpdate(card.id)
          } catch (error) {
            console.error("Error deleting card:", error)
            Alert.alert("Erro", "Não foi possível deletar o card.")
          }
        },
      },
    ])
  }

  if (!card) return null

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/50 px-6">
        <View className="bg-terciary w-full rounded-3xl p-8 items-center shadow-2xl max-w-md">
          {/* Header actions */}
          <View className="absolute top-4 right-4 flex-row gap-2 z-10">
            {onEdit && (
              <>
                <TouchableOpacity onPress={() => onEdit(card)} className="p-2 bg-secondary rounded-full">
                  <Ionicons name="pencil" size={20} color="#1B1B1B" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete} className="p-2 bg-red-500 rounded-full">
                  <Ionicons name="trash" size={20} color="white" />
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity onPress={onClose} className="p-2 bg-secondary rounded-full">
              <Ionicons name="close" size={20} color="#1B1B1B" />
            </TouchableOpacity>
          </View>

          {/* Card image */}
          <View className="w-40 h-40 rounded-full bg-secondary justify-center items-center mb-6 overflow-hidden">
            <Image
              source={{
                uri: card.imagemUrl?.startsWith("http")
                  ? card.imagemUrl
                  : `https://voxia-api.onrender.com${card.imagemUrl}`,
              }}
              className="w-32 h-32"
              resizeMode="contain"
            />
          </View>

          {/* Card name */}
          <Text className="text-white text-2xl font-radioBold text-center mb-8">{card.nome}</Text>

          {/* Play button and stats */}
          <View className="w-full flex-row justify-around items-center mb-6">
            <TouchableOpacity
              onPress={playAudio}
              disabled={isPlaying}
              className="w-20 h-20 rounded-full bg-secondary justify-center items-center"
            >
              {isPlaying ? (
                <ActivityIndicator color="#1B1B1B" size="large" />
              ) : (
                <Image source={require("../../assets/icons/sound.png")} className="w-12 h-12" resizeMode="contain" />
              )}
            </TouchableOpacity>

            {onEdit && (
              <View className="items-center">
                <Text className="text-neutro text-sm mb-1">Reproduções</Text>
                <Text className="text-5xl font-spaceBold text-secondary">{playCount.toString().padStart(2, "0")}</Text>
              </View>
            )}
          </View>

          {/* Close button */}
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
