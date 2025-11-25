import api from "./api"
import { saveToken } from "../storage/tokenStorage"

type RegisterPayload = {
  email: string
  senha: string
  confirmarSenha: string
}

type LoginPayload = {
  email: string
  senha: string
}

export async function registerUser(data: RegisterPayload) {
  try {
    console.log("[v0] Register payload:", { email: data.email, senha: "***" })
    const response = await api.post("/api/Auth/register", data)
    console.log("[v0] Register response:", response)
    return response
  } catch (error: any) {
    console.log("[v0] Register error:", error)
    throw new Error(error?.message || "Erro ao registrar usuário")
  }
}

export async function loginUser(data: LoginPayload) {
  try {
    console.log("[v0] Login payload:", { email: data.email, senha: "***" })
    const response = await api.post("/api/Auth/login", data)
    console.log("[v0] Login response:", response)

    const token = response?.token
    if (!token) {
      throw new Error("Token não retornado pela API. Verifique suas credenciais.")
    }

    await saveToken(token)
    console.log("[v0] Token saved successfully")
    return response
  } catch (error: any) {
    console.log("[v0] Login error:", error)
    throw new Error(error?.message || "Falha ao fazer login. Verifique email e senha.")
  }
}
