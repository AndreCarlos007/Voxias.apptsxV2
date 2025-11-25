import { Text, View, ScrollView, TouchableOpacity, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { ApiCategory, ApiCard } from "../../types"
import ApiCardItem from "./ApiCardItem"
import { deleteFavoritesCategory } from "../../services/favoritesService"

type Props = {
  category: ApiCategory
  cards: ApiCard[]
  onCardPress: (card: ApiCard) => void
  onCategoryEdit?: (category: ApiCategory) => void
  onCategoryDelete?: (categoryId: string) => void
  onAddCard?: (category: ApiCategory) => void // Added prop for adding card to category
}

export default function CategorySection({
  category,
  cards,
  onCardPress,
  onCategoryEdit,
  onCategoryDelete,
  onAddCard,
}: Props) {
  const handleDeleteCategory = () => {
    Alert.alert(
      "Deletar Categoria",
      `Tem certeza que deseja deletar "${category.nome}"? Todos os cards serão deletados.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteFavoritesCategory(category.id)
              Alert.alert("Sucesso", "Categoria deletada com sucesso!")
              onCategoryDelete?.(category.id)
            } catch (error) {
              console.error("Error deleting category:", error)
              Alert.alert("Erro", "Não foi possível deletar a categoria.")
            }
          },
        },
      ],
    )
  }

  return (
    <View className="mb-8">
      <View className="flex-row items-center justify-between mb-4 px-6">
        <View className="flex-row items-center flex-1 gap-2">
          <View className="bg-secondary/20 p-2 rounded-lg">
            <Ionicons name="folder" size={20} color="#3DF3FF" />
          </View>
          <Text className="text-xl font-radioBold text-secondary flex-1" numberOfLines={1}>
            {category.nome}
          </Text>
        </View>
        <View className="flex-row gap-2">
          {onAddCard && (
            <TouchableOpacity
              onPress={() => onAddCard(category)}
              className="p-2 bg-secondary rounded-full"
              style={{
                shadowColor: "#3DF3FF",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <Ionicons name="add" size={20} color="#1B1B1B" />
            </TouchableOpacity>
          )}
          {onCategoryEdit && onCategoryDelete && (
            <>
              <TouchableOpacity onPress={() => onCategoryEdit(category)} className="p-2 bg-terciary rounded-full">
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
        <View className="mx-6 bg-terciary rounded-xl p-6 border-2 border-dashed border-neutro/30">
          <Text className="text-neutro text-center font-spaceBold">Nenhum card nesta categoria</Text>
          <Text className="text-neutro/70 text-center text-sm mt-1">Clique no + para adicionar</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row"
          contentContainerStyle={{
            paddingHorizontal: 24,
            gap: 16,
          }}
        >
          {cards.map((card) => (
            <ApiCardItem key={card.id} card={card} onPress={() => onCardPress(card)} />
          ))}
        </ScrollView>
      )}
    </View>
  )
}
