"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { registerUser } from "../../services/authService"

export default function Cadastro() {
  const router = useRouter()

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")

  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false)

  const [erroNome, setErroNome] = useState("")
  const [erroEmail, setErroEmail] = useState("")
  const [erroSenha, setErroSenha] = useState("")
  const [erroConfirmar, setErroConfirmar] = useState("")

  const [loading, setLoading] = useState(false)

  async function cadastrar() {
    let valido = true

    if (!email.includes("@") || !email.includes(".")) {
      setErroEmail("Digite um email válido")
      valido = false
    } else setErroEmail("")

    if (senha.length < 6) {
      setErroSenha("A senha deve ter no mínimo 6 caracteres")
      valido = false
    } else setErroSenha("")

    if (confirmarSenha !== senha) {
      setErroConfirmar("As senhas não coincidem")
      valido = false
    } else setErroConfirmar("")

    if (!valido) return

    setLoading(true)

    try {
      const payload = {
        email,
        senha,
        confirmarSenha,
      }

      const response = await registerUser(payload)

      if (response) {
        Alert.alert("Sucesso", "Conta criada com sucesso! Faça login para continuar.", [
          { text: "OK", onPress: () => router.replace("/auth/login") },
        ])
      } else {
        Alert.alert("Erro", "Não foi possível cadastrar. Tente novamente.")
      }
    } catch (err: any) {
      console.log("[v0] Erro no register:", err)
      const message = err?.message || "Erro ao cadastrar. Verifique os dados."
      Alert.alert("Erro", message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="flex-1 bg-primary">
        <View className="justify-center items-center h-[30%]">
          <Text className="text-6xl text-center text-neutro font-radioBold">
            <Text className="text-secondary">VOX</Text>
            <Text className="text-white">IA</Text>
          </Text>
        </View>

        <View className="flex-1 bg-terciary rounded-tl-[6rem] px-8 pt-10">
          <Text className="text-5xl text-center text-neutro font-radioBold mb-10">
            <Text className="text-secondary">Cadas</Text>
            <Text className="text-white">tro</Text>
          </Text>

          <View>
            <Text className="text-neutro font-spaceBold mb-2 text-base">Nome completo</Text>
            <View className="flex-row items-center bg-primary h-14 rounded-2xl px-4">
              <Ionicons name="person-outline" size={22} color="#b5b5b5" />
              <TextInput
                placeholder="Digite seu nome completo"
                placeholderTextColor="#b5b5b5"
                className="ml-2 flex-1 text-white"
                value={nome}
                onChangeText={setNome}
              />
            </View>
            {erroNome ? <Text className="text-red-500 mt-1">{erroNome}</Text> : null}

            <Text className="text-neutro font-spaceBold mb-2 text-base mt-6">Email</Text>
            <View className="flex-row items-center bg-primary h-14 rounded-2xl px-4">
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

            <View className="flex-row justify-between mt-6">
              <View className="w-[48%]">
                <Text className="text-neutro font-spaceBold mb-2 text-base">Senha</Text>
                <View className="flex-row items-center bg-primary h-14 rounded-2xl px-4">
                  <Ionicons name="lock-closed-outline" size={22} color="#b5b5b5" />
                  <TextInput
                    placeholder="Senha"
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
              </View>

              <View className="w-[48%]">
                <Text className="text-neutro font-spaceBold mb-2 text-base">Confirmar</Text>
                <View className="flex-row items-center bg-primary h-14 rounded-2xl px-4">
                  <Ionicons name="lock-closed-outline" size={22} color="#b5b5b5" />
                  <TextInput
                    placeholder="Confirmar"
                    placeholderTextColor="#b5b5b5"
                    secureTextEntry={!mostrarConfirmarSenha}
                    className="ml-2 flex-1 text-white"
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
                  />
                  <TouchableOpacity onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}>
                    <Ionicons
                      name={mostrarConfirmarSenha ? "eye-off-outline" : "eye-outline"}
                      size={22}
                      color="#b5b5b5"
                    />
                  </TouchableOpacity>
                </View>
                {erroConfirmar ? <Text className="text-red-500 mt-1">{erroConfirmar}</Text> : null}
              </View>
            </View>

            <TouchableOpacity
              disabled={loading}
              onPress={cadastrar}
              className="w-full h-14 bg-secondary rounded-2xl justify-center items-center mt-8"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-lg font-spaceBold">Cadastrar</Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center mt-4">
              <Text className="text-neutro text-base font-spaceRegular">Já tem conta? </Text>
              <TouchableOpacity onPress={() => router.push("/auth/login")}>
                <Text className="text-secondary text-base font-spaceBold">Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
