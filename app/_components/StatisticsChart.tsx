import { View, Text } from "react-native"
import type { StatsCardData } from "../../services/statisticsService"

type Props = {
  data: StatsCardData[]
}

export default function StatisticsChart({ data }: Props) {
  if (data.length === 0) return null

  const maxCount = Math.max(...data.map((d) => d.playCount), 1)

  return (
    <View className="bg-terciary rounded-2xl p-4">
      <Text className="text-white font-spaceBold text-lg mb-4">Top Cards</Text>

      {data.map((item, index) => {
        const percentage = (item.playCount / maxCount) * 100

        return (
          <View key={item.cardId} className="mb-4">
            <View className="flex-row justify-between mb-1">
              <Text className="text-secondary font-spaceBold flex-1" numberOfLines={1}>
                {index + 1}. {item.cardName}
              </Text>
              <Text className="text-neutro font-spaceBold">{item.playCount}</Text>
            </View>

            <View className="w-full h-6 bg-primary rounded-full overflow-hidden">
              <View style={{ width: `${percentage}%` }} className="h-full bg-secondary rounded-full" />
            </View>
          </View>
        )
      })}
    </View>
  )
}
