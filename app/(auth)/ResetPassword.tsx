// /app/(auth)/ResetPassword.tsx

import { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useURL } from 'expo-linking';
import api from '@/lib/axios';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const url = useURL(); // Get the full URL

  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (url) {
      // Supabase puts the token in the fragment part of the URL
      // Example: http://localhost:8081/reset-password#access_token=...&...
      const fragment = url.split('#')[1];
      if (fragment) {
        const params = new URLSearchParams(fragment);
        const accessToken = params.get('access_token');
        if (accessToken) {
          setToken(accessToken);
        } else {
            setError("Token de redefinição não encontrado na URL. O link pode ser inválido.");
        }
      }
    }
  }, [url]);

  async function handleResetPassword() {
    if (!password) {
      setError("A nova senha não pode estar em branco.");
      return;
    }
    if (!token) {
        setError("Não foi possível encontrar o token de autorização. Por favor, tente novamente a partir do link no seu e-mail.");
        return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post('/users/reset-password', { token, password });
      
      Alert.alert(
        "Sucesso", 
        "Sua senha foi redefinida com sucesso! Você já pode fazer o login.",
        [{ text: "OK", onPress: () => router.replace('/(auth)/Login') }]
      );

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Ocorreu um erro ao redefinir a senha. O link pode ter expirado.";
      setError(errorMessage);
      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  }

  if (!token && !error) {
    // Show a loading or placeholder state while parsing the URL
    return (
        <View className="flex-1 items-center justify-center p-4">
            <ActivityIndicator size="large" />
            <Text className="mt-4">Verificando link...</Text>
        </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center gap-4 p-4">
      <Text className="text-2xl font-bold mb-4">Redefinir Senha</Text>
      
      {error ? (
         <Text className="text-red-500 text-center">{error}</Text>
      ) : (
        <>
            <Text className="text-center mb-4 text-gray-600">
                Digite sua nova senha abaixo.
            </Text>

            <TextInput
                placeholder="Nova Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                className="border w-full p-3 rounded-lg bg-gray-100"
            />

            <View className="w-full mt-4">
                <Button title="Salvar Nova Senha" onPress={handleResetPassword} disabled={loading} />
            </View>
        </>
      )}
    </View>
  );
}
