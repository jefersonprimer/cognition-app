// /app/splash.tsx

import { View, Text, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthProvider";

export default function SplashScreen() {
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Se não está carregando mais, redireciona baseado no estado de autenticação
      if (session) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/Login");
      }
    }
  }, [session, loading]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-bold text-blue-600 mb-4">Notion</Text>
      <ActivityIndicator size="large" color="#2563eb" />
      <Text className="text-gray-600 mt-4">Carregando...</Text>
    </View>
  );
}