"use client"

import { View, TouchableOpacity, Text, ActivityIndicator, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import * as MediaLibrary from "expo-media-library"
import AudioRecorder from "./AudioRecorder"

type Props = {
  onAudioSelected: (uri: string, name?: string) => void
  selectedName?: string
}

export default function AudioPickerButton({ onAudioSelected, selectedName }: Props) {
  const [loading, setLoading] = useState(false)
  const [recordingModalVisible, setRecordingModalVisible] = useState(false)

  const pickAudioFile = async () => {
    try {
      setLoading(true)

      const { status } = await MediaLibrary.requestPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Permitir acesso à mídia para selecionar áudio")
        return
      }

      const media = await MediaLibrary.getAssetsAsync({
        mediaType: "audio",
        first: 1000,
      })

      if (media.assets.length === 0) {
        Alert.alert("Nenhum áudio", "Nenhum arquivo de áudio encontrado no seu dispositivo")
        return
      }

      const audioAsset = media.assets[0]
      onAudioSelected(audioAsset.uri, audioAsset.filename || "áudio")
    } catch (error) {
      console.error("Error picking audio:", error)
      Alert.alert("Erro", "Falha ao selecionar arquivo de áudio")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <View className="gap-2">
        <TouchableOpacity
          onPress={pickAudioFile}
          disabled={loading}
          className="flex-row items-center justify-center gap-2 bg-secondary rounded-xl p-4"
        >
          {loading ? (
            <ActivityIndicator color="#1B1B1B" />
          ) : (
            <>
              <Ionicons name="musical-note" size={20} color="#1B1B1B" />
              <Text className="text-primary font-spaceBold">{selectedName ? "Alterar Áudio" : "Selecionar Áudio"}</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setRecordingModalVisible(true)}
          className="flex-row items-center justify-center gap-2 bg-terciary rounded-xl p-4 border border-secondary"
        >
          <Ionicons name="mic" size={20} color="#3DF3FF" />
          <Text className="text-secondary font-spaceBold">Gravar Áudio</Text>
        </TouchableOpacity>
      </View>

      <AudioRecorder
        visible={recordingModalVisible}
        onClose={() => setRecordingModalVisible(false)}
        onAudioRecorded={(uri) => {
          onAudioSelected(uri, "recording")
          setRecordingModalVisible(false)
        }}
      />
    </>
  )
}
