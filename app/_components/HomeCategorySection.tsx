import { Text, View, ScrollView } from "react-native"
import type { ApiCategory, ApiCard } from "../../types"
import ApiCardItem from "./ApiCardItem"

type Props = {
  category: ApiCategory
  cards: ApiCard[]
  onCardPress: (card: ApiCard) => void
}

export default function HomeCategorySection({ category, cards, onCardPress }: Props) {
  return (
    <View className="mb-8 mx-4">
      <Text className="text-xl font-spaceBold text-secondary mb-4">{category.nome}</Text>

      {cards.length === 0 ? (
        <Text className="text-neutro text-center py-4">Nenhum card nesta categoria</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {cards.map((card) => (
            <ApiCardItem key={card.id} card={card} onPress={() => onCardPress(card)} />
          ))}
        </ScrollView>
      )}
    </View>
  )
}
