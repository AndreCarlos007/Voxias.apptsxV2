"use client"

import { View, Text, TouchableOpacity, Modal, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useRef } from "react"
import { Audio } from "expo-av"

type Props = {
  visible: boolean
  onClose: () => void
  onAudioRecorded: (uri: string) => void
}

export default function AudioRecorder({ visible, onClose, onAudioRecorded }: Props) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordedUri, setRecordedUri] = useState<string | null>(null)
  const timerRef = useRef<NodeJS.Timeout | number | null>(null)

  const startRecording = async () => {
    try {
      console.log("[v0] Requesting audio permissions")
      const { granted } = await Audio.requestPermissionsAsync()
      if (!granted) {
        Alert.alert("Permissão negada", "Permitir acesso ao microfone para gravar áudio")
        return
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })

      const newRecording = new Audio.Recording()
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
      await newRecording.startAsync()

      setRecording(newRecording)
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)

      console.log("[v0] Recording started")
    } catch (error) {
      console.error("Error starting recording:", error)
      Alert.alert("Erro", "Falha ao iniciar gravação")
    }
  }

  const stopRecording = async () => {
    if (!recording) return

    try {
      setIsRecording(false)
      if (timerRef.current) clearInterval(timerRef.current as NodeJS.Timeout)

      await recording.stopAndUnloadAsync()
      const uri = recording.getURI()

      console.log("[v0] Recording stopped, URI:", uri)

      if (uri) {
        setRecordedUri(uri)
      }
    } catch (error) {
      console.error("Error stopping recording:", error)
      Alert.alert("Erro", "Falha ao parar gravação")
    }
  }

  const confirmRecording = () => {
    if (recordedUri) {
      onAudioRecorded(recordedUri)
      resetRecorder()
    }
  }

  const resetRecorder = () => {
    setRecording(null)
    setIsRecording(false)
    setRecordingTime(0)
    setRecordedUri(null)
    if (timerRef.current) clearInterval(timerRef.current as NodeJS.Timeout)
  }

  const cancelRecording = async () => {
    if (recording && isRecording) {
      await recording.stopAndUnloadAsync()
    }
    resetRecorder()
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={cancelRecording}>
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-terciary rounded-3xl p-8 items-center w-full">
          <Text className="text-2xl font-radioBold text-secondary mb-8">Gravar Áudio</Text>

          <View className="mb-8 items-center">
            <Text className="text-5xl font-spaceBold text-secondary">
              {String(Math.floor(recordingTime / 60)).padStart(2, "0")}:{String(recordingTime % 60).padStart(2, "0")}
            </Text>
            {isRecording && <Text className="text-neutro text-sm mt-2">Gravando...</Text>}
          </View>

          <TouchableOpacity
            onPress={isRecording ? stopRecording : startRecording}
            disabled={recordedUri !== null}
            className={`w-20 h-20 rounded-full justify-center items-center mb-6 ${
              isRecording ? "bg-red-500" : recordedUri ? "bg-green-500" : "bg-secondary"
            }`}
          >
            <Ionicons
              name={isRecording ? "stop" : recordedUri ? "checkmark" : "mic"}
              size={40}
              color={isRecording || recordedUri ? "white" : "#1B1B1B"}
            />
          </TouchableOpacity>

          <View className="flex-row gap-3 w-full">
            <TouchableOpacity
              onPress={cancelRecording}
              className="flex-1 h-12 bg-neutro rounded-xl justify-center items-center"
            >
              <Text className="text-primary font-spaceBold">Cancelar</Text>
            </TouchableOpacity>

            {recordedUri && (
              <TouchableOpacity
                onPress={confirmRecording}
                className="flex-1 h-12 bg-secondary rounded-xl justify-center items-center"
              >
                <Text className="text-primary font-spaceBold">Confirmar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  )
}
