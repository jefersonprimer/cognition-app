// /components/auth/ForgotPassword.tsx

import { useState } from "react";
import { View, TextInput, Button, Text, Pressable, ActivityIndicator, Alert } from "react-native";
import api from "@/lib/axios";

type ForgotPasswordProps = {
  onSwitchToLogin: () => void;
};

export default function ForgotPassword({ onSwitchToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handlePasswordReset() {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const response = await api.post(`/users/forgot-password`, { email });
      setMessage(response.data.message);
      Alert.alert("Verifique seu e-mail", response.data.message);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Ocorreu um erro ao tentar redefinir a senha.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 items-center justify-center gap-4 p-4">
      <Text className="text-2xl font-bold mb-4">Recuperar Senha</Text>
      <Text className="text-center mb-4 text-gray-600">
        Digite seu e-mail e enviaremos um link para você redefinir sua senha.
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="border w-full p-3 rounded-lg bg-gray-100"
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {error && <Text className="text-red-500 mt-2">{error}</Text>}
      {message && <Text className="text-green-500 mt-2">{message}</Text>}
      
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View className="w-full">
            <Button title="Enviar Link de Recuperação" onPress={handlePasswordReset} disabled={loading} />
        </View>
      )}

      <Pressable onPress={onSwitchToLogin} className="mt-4">
        <Text className="text-blue-500">Voltar para o Login</Text>
      </Pressable>
    </View>
  );
}
