"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { loginUser } from "../../services/authService"

export default function Login() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [mostrarSenha, setMostrarSenha] = useState(false)

  const [erroEmail, setErroEmail] = useState("")
  const [erroSenha, setErroSenha] = useState("")
  const [loading, setLoading] = useState(false)

  async function realizarLogin() {
    let valido = true

    if (!email.includes("@") || !email.includes(".")) {
      setErroEmail("Digite um email válido")
      valido = false
    } else setErroEmail("")

    if (senha.length < 6) {
      setErroSenha("A senha deve ter no mínimo 6 caracteres")
      valido = false
    } else setErroSenha("")

    if (!valido) return

    setLoading(true)

    try {
      await loginUser({ email, senha })
      router.replace("/(app)/home")
    } catch (err: any) {
      console.log("[v0] Erro no login:", err)
      const msg = err?.message || "Credenciais inválidas ou erro de conexão."
      Alert.alert("Erro", msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="flex-1 bg-primary">
        <View className="justify-center items-center h-[45%]">
          <Text className="text-5xl text-center text-neutro font-radioBold mb-3">
            <Text className="text-secondary">VOX</Text>
            <Text className="text-white">IA</Text>
          </Text>
        </View>

        <View className="flex-1 bg-terciary rounded-tl-[6rem] px-8 pt-10">
          <Text className="text-5xl text-center text-neutro font-radioBold mb-6">
            <Text className="text-secondary">Entr</Text>
            <Text className="text-white">ar</Text>
          </Text>

          <View className="w-full">
            <Text className="text-neutro font-spaceBold mb-2 text-base">Email</Text>
            <View className="bg-primary h-14 rounded-2xl flex-row items-center px-4">
              <Ionicons name="mail-outline" size={22} color="#b5b5b5" />
              <TextInput
                placeholder="Digite seu email"
                placeholderTextColor="#b5b5b5"
                keyboardType="email-address"
                autoCapitalize="none"
                className="ml-2 flex-1 text-white"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            {erroEmail ? <Text className="text-red-500 mt-1">{erroEmail}</Text> : null}

            <Text className="text-neutro font-spaceBold mb-2 text-base mt-6">Senha</Text>
            <View className="bg-primary h-14 rounded-2xl flex-row items-center px-4">
              <Ionicons name="lock-closed-outline" size={22} color="#b5b5b5" />
              <TextInput
                placeholder="Digite sua senha"
                placeholderTextColor="#b5b5b5"
                secureTextEntry={!mostrarSenha}
                className="ml-2 flex-1 text-white"
                value={senha}
                onChangeText={setSenha}
              />
              <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                <Ionicons name={mostrarSenha ? "eye-off-outline" : "eye-outline"} size={22} color="#b5b5b5" />
              </TouchableOpacity>
            </View>
            {erroSenha ? <Text className="text-red-500 mt-1">{erroSenha}</Text> : null}

            <TouchableOpacity
              disabled={loading}
              onPress={realizarLogin}
              className="w-full h-14 bg-secondary rounded-2xl justify-center items-center mt-8"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-lg font-spaceBold">Entrar</Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center mt-4">
              <Text className="text-neutro text-base">Não tem conta? </Text>
              <TouchableOpacity onPress={() => router.push("/auth/cadastro")}>
                <Text className="text-secondary text-base font-spaceBold">Cadastre-se</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
