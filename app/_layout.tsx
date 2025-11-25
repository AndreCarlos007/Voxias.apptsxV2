import { Stack } from "expo-router"
import "../global.css"

import { useFonts } from "expo-font"
import { SpaceGrotesk_400Regular, SpaceGrotesk_700Bold } from "@expo-google-fonts/space-grotesk"
import { RadioCanadaBig_400Regular, RadioCanadaBig_700Bold } from "@expo-google-fonts/radio-canada-big"

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_700Bold,
    RadioCanadaBig_400Regular,
    RadioCanadaBig_700Bold,
  })

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  )
}
