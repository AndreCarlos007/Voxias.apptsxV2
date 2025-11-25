import { useState, useEffect } from "react";

import { Modal, View, Text, Image, TouchableOpacity } from "react-native";
import { ItemType } from "../../types";

import ItemCard from "./ItemCard";

import * as Speech from 'expo-speech';

type Props = {
  visible: boolean;
  item: ItemType | null;
  onClose: () => void;
  onActionPress: (item: ItemType) => void;
};

export default function ItemModal({
  visible,
  item,
  onClose,
  onActionPress,
}: Props) {
  const [contadores, setContadores] = useState<{ [key: number]: number }>({});

  const speak = () => {
    
    if (item && item.nome) {
      Speech.speak(item.nome, {
        language: "pt-BR",
        
      })
    }
  };

  useEffect(() => {
    if (item && contadores[item.id] === undefined) {
      setContadores((prev) => ({ ...prev, [item.id]: 0 }));
    }
  }, [item]);

  const incrementar = () => {
    if (!item) return;
    setContadores((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));
  };

  if (!item) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center px-6">
        <View className="bg-terciary shadow-black  shadow-2xl w-full rounded-2xl p-16 items-center">
          <TouchableOpacity onPress={onClose} className="absolute top-4 left-4">
            <Text className="text-white font-spaceBold text-2xl">SAIR</Text>
          </TouchableOpacity>

           <ItemCard item={item} disabled />


          <View className="absolute bottom-4 left-0 right-0 flex-row justify-between items-center px-6">
            <TouchableOpacity onPress={() => {
              speak();
              incrementar();
            }} className="p-2">
              <Image
                source={require("../../assets/icons/sound.png")}
                className="w-12 h-12"
                resizeMode="contain"
              />
            </TouchableOpacity>

            <Text className="text-4xl font-spaceBold text-white">
              {(contadores[item.id] || 0).toString().padStart(2, "0")}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
