"use client"

import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Image, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useState, useCallback } from "react"
import { useRouter } from "expo-router"
import { useFocusEffect } from "@react-navigation/native"
import type { UserProfile } from "../../types"
import { getUserProfile, logout } from "../../services/userService"

export default function ProfileScreen() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [logoutLoading, setLogoutLoading] = useState(false)

  useFocusEffect(
    useCallback(() => {
      loadUserProfile()
    }, []),
  )

  const loadUserProfile = async () => {
    try {
      setLoading(true)
      const profile = await getUserProfile()
      setUser(profile)
    } catch (error) {
      console.error("Error loading user profile:", error)
      Alert.alert("Erro", "Não foi possível carregar o perfil")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    Alert.alert("Logout", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            setLogoutLoading(true)
            await logout()
            router.replace("/auth/login")
          } catch (error) {
            console.error("Error logging out:", error)
            Alert.alert("Erro", "Erro ao fazer logout")
          } finally {
            setLogoutLoading(false)
          }
        },
      },
    ])
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#3DF3FF" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-terciary px-6 py-4 pb-8">
          <Text className="text-3xl font-radioBold text-secondary">
            Meu Per<Text className="text-white">fil</Text>
          </Text>
        </View>

        {/* Profile Card */}
        <View className="mx-6 mt-8 mb-8">
          <View className="bg-terciary rounded-3xl p-8 items-center">
            {/* Avatar */}
            <View className="w-24 h-24 rounded-full bg-secondary justify-center items-center mb-6 overflow-hidden">
              {user?.photoUrl ? (
                <Image source={{ uri: user.photoUrl }} className="w-full h-full" resizeMode="cover" />
              ) : (
                <Ionicons name="person" size={48} color="#1B1B1B" />
              )}
            </View>

            {/* User Info */}
            <Text className="text-2xl font-radioBold text-white text-center mb-2">{user?.name || "Usuário"}</Text>
            <Text className="text-neutro text-sm text-center mb-6">{user?.email || "email@exemplo.com"}</Text>

            {/* Info Items */}
            <View className="w-full gap-4 mt-6 pt-6 border-t border-primary">
              <View className="flex-row items-center">
                <Ionicons name="mail" size={20} color="#3DF3FF" />
                <View className="ml-4 flex-1">
                  <Text className="text-neutro text-xs">Email</Text>
                  <Text className="text-white font-spaceBold text-sm">{user?.email}</Text>
                </View>
              </View>

              {user?.createdAt && (
                <View className="flex-row items-center">
                  <Ionicons name="calendar" size={20} color="#3DF3FF" />
                  <View className="ml-4 flex-1">
                    <Text className="text-neutro text-xs">Membro desde</Text>
                    <Text className="text-white font-spaceBold text-sm">
                      {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Account Section */}
        <View className="mx-6 mb-8">
          <Text className="text-lg font-spaceBold text-white mb-3">Conta</Text>

          <TouchableOpacity onPress={loadUserProfile} className="flex-row items-center bg-terciary rounded-xl p-4 mb-3">
            <Ionicons name="refresh" size={20} color="#3DF3FF" />
            <Text className="text-white font-spaceBold ml-3 flex-1">Atualizar Perfil</Text>
            <Ionicons name="chevron-forward" size={20} color="#b5b5b5" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            disabled={logoutLoading}
            className="flex-row items-center bg-red-900 rounded-xl p-4"
          >
            {logoutLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="log-out" size={20} color="#ff6b6b" />
                <Text className="text-red-300 font-spaceBold ml-3 flex-1">Sair</Text>
                <Ionicons name="chevron-forward" size={20} color="#ff6b6b" />
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View className="mx-6 mb-20 items-center">
          <Text className="text-3xl font-radioBold text-secondary">
            VOX<Text className="text-white">IA</Text>
          </Text>
          <Text className="text-neutro text-sm mt-2">Versão 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
