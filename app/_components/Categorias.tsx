import { Text, View } from "react-native";
import { CategoriaType, ItemType } from "../../types";
import ItemCard from "./ItemCard";

type Props = {
  categoria: CategoriaType;
  onItemPress: (item: ItemType) => void;
};

export default function Categorias({ categoria, onItemPress }: Props) {
  return (
    <View className="mb-8 mx-4 ">
      <Text
        className={`text-xl font-spaceBold text-white p-2 pl-4 rounded-2xl ${categoria.cor}`}
      >
        {categoria.nome}
      </Text>
      <View className="flex-row flex-wrap flex items-center ">
        {categoria.itens.map((item) => (
          <ItemCard key={item.id} item={item} onPress={onItemPress} />
        ))}
      </View>
    </View>
  );
}
