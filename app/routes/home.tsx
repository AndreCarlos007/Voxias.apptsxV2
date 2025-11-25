import { ScrollView, View } from "react-native";
import React, { useState } from "react";
import Header from "../_components/Header";

import { categorias } from "../_data/categorias";
import { ItemType } from "../../types";
import Categoria from "../_components/Categorias";

import ItemModal from "../_components/ItemModal";

export default function Home() {

  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleItemPress = (item: ItemType) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  return (
    <View className="flex-1 bg-primary">
      <Header />

      <ScrollView className="pt-8">
        {categorias.map((categoria) => (
          <Categoria
            key={categoria.id}
            categoria={categoria}
            onItemPress={handleItemPress}
          />
        ))}
      </ScrollView>

      <ItemModal
        visible={modalVisible}
        item={selectedItem}
        onClose={() => setModalVisible(false)}
        onActionPress={(item) => console.log("Ação com:", item)}
      />
    </View>
  );
}
