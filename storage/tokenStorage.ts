import AsyncStorage from "@react-native-async-storage/async-storage"

const TOKEN_KEY = "voxia_token"

export async function saveToken(token: string) {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token)
  } catch (e) {
    console.warn("Erro ao salvar token:", e)
  }
}

export async function getToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY)
  } catch (e) {
    console.warn("Erro ao ler token:", e)
    return null
  }
}

export async function removeToken() {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY)
  } catch (e) {
    console.warn("Erro ao remover token:", e)
  }
}
