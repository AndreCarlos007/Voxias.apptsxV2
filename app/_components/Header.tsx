import { Image, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Header() {
  return (
    <SafeAreaView>
      <View className="static h-32 bg-terciary text-center pb-4 justify-center items-center">
        <Text className="text-5xl text-secondary font-radioBold">
                      VOX<Text className="text-white">IA</Text>
                    </Text>
      </View>

      <View className="mt-[-2.8rem]">
        <Image
          source={require("../../assets/images/vinhas9.png")}
          className="min-w-full h-24"
        />
      </View>
    </SafeAreaView>
  );
}
