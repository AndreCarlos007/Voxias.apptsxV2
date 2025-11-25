import { Text, View, ScrollView, TouchableOpacity, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { ApiCategory, ApiCard } from "../../types"
import ApiCardItem from "./ApiCardItem"

type Props = {
  category: ApiCategory
  cards: ApiCard[]
  onCardPress: (card: ApiCard) => void
  onCategoryEdit?: (category: ApiCategory) => void
  onCategoryDelete?: (categoryId: string) => void
}

export default function CategorySection({ category, cards, onCardPress, onCategoryEdit, onCategoryDelete }: Props) {
  const handleDeleteCategory = () => {
    Alert.alert(
      "Deletar Categoria",
      `Tem certeza que deseja deletar "${category.name}"? Os cards também serão deletados.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: () => onCategoryDelete?.(category.id),
        },
      ],
    )
  }

  return (
    <View className="mb-8 mx-4">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-xl font-spaceBold text-secondary flex-1">{category.name}</Text>
        <View className="flex-row gap-2">
          {category.name !== "Favoritos" && (
            <>
              <TouchableOpacity onPress={() => onCategoryEdit?.(category)} className="p-2 bg-terciary rounded-full">
                <Ionicons name="pencil" size={18} color="#3DF3FF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteCategory} className="p-2 bg-red-500/20 rounded-full">
                <Ionicons name="trash" size={18} color="#ff6b6b" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

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
