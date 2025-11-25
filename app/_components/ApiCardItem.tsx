"use client"

import { Image, Text, TouchableOpacity, View, ActivityIndicator } from "react-native"
import type { ApiCard } from "../../types"
import { useState } from "react"

type Props = {
  card: ApiCard
  onPress: () => void
}

export default function ApiCardItem({ card, onPress }: Props) {
  const [imageLoading, setImageLoading] = useState(true)

  const imageUrl = card.imagemUrl?.startsWith("http")
    ? card.imagemUrl
    : `https://voxia-api.onrender.com${card.imagemUrl}`

  return (
    <TouchableOpacity onPress={onPress} className="items-center">
      <View className="w-28 h-28 rounded-full bg-secondary justify-center items-center overflow-hidden">
        {imageLoading && <ActivityIndicator size="large" color="#1B1B1B" style={{ position: "absolute" }} />}
        <Image
          source={{ uri: imageUrl }}
          className="w-20 h-20"
          resizeMode="contain"
          onLoadEnd={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
        />
      </View>
      <Text className="text-white text-center font-spaceBold mt-2 w-28" numberOfLines={2}>
        {card.nome}
      </Text>
    </TouchableOpacity>
  )
}
