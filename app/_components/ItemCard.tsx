import { Image, Text, TouchableOpacity, View } from "react-native";
import { ItemType } from "../../types";

type Props = {
  item: ItemType;
  onPress?: (item: ItemType) => void;
  disabled?: boolean;
};

export default function ItemCard({ item, onPress, disabled }: Props) {

  const Wrapper = disabled ? View : TouchableOpacity;
  return (
    <View>
    
    <Wrapper
      className={`flex justify-center items-center m-4 w-28 h-28 rounded-[100%] ${item.cor}`}
       onPress={disabled ? undefined : () => onPress?.(item)}
    >
      <View className="">
        <Image
        source={item.img}
        className="w-16 h-16 object-cover"
        resizeMode="contain"
      />
      </View>
      
    </Wrapper>
    <Text className="flex justify-center items-center text-white text-xl text-center font-spaceBold">{item.nome}</Text>
    </View>
  );
}
