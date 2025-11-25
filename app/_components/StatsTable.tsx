import { View, Text } from "react-native"
import type { StatsCardData } from "../../services/statisticsService"

type Props = {
  data: StatsCardData[]
}

export default function StatsTable({ data }: Props) {
  return (
    <View className="bg-terciary rounded-2xl overflow-hidden">
      {/* Header */}
      <View className="flex-row bg-secondary p-3">
        <Text className="flex-1 text-primary font-spaceBold">Posição</Text>
        <Text className="flex-1 text-primary font-spaceBold">Card</Text>
        <Text className="flex-1 text-center text-primary font-spaceBold">Reproduções</Text>
      </View>

      {/* Rows */}
      {data.map((item, index) => (
        <View
          key={item.cardId}
          className={`flex-row p-3 border-b border-primary ${index % 2 === 0 ? "bg-terciary" : "bg-primary"}`}
        >
          <Text className="flex-1 text-white font-spaceBold">#{index + 1}</Text>
          <Text className="flex-1 text-neutro font-spaceBold" numberOfLines={1}>
            {item.cardName}
          </Text>
          <Text className="flex-1 text-center text-secondary font-spaceBold">{item.playCount}</Text>
        </View>
      ))}
    </View>
  )
}
