// /components/auth/Register.tsx

import { useState } from "react";
import { View, TextInput, Text, Pressable, ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from "react-native";
import api from "@/lib/axios";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

type RegisterProps = {
  onSwitchToLogin: () => void;
};

export default function Register({ onSwitchToLogin }: RegisterProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  async function signUp() {
    if (!displayName) {
      setError("Por favor, insira seu nome.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // A rota correta é /users, conforme definido no backend
      await api.post(`/users/signup`, { email, password, displayName });
      Alert.alert("Sucesso!", "Sua conta foi criada. Por favor, faça o login.", [
        { text: "OK", onPress: onSwitchToLogin }
      ]);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Ocorreu um erro no cadastro.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 16,
      backgroundColor: themeColors.background,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 24,
      color: themeColors.text,
    },
    input: {
      borderWidth: 1,
      borderColor: themeColors.border,
      backgroundColor: themeColors.card,
      color: themeColors.text,
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
      width: '100%',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 16,
        position: 'relative',
    },
    passwordInput: {
        borderWidth: 1,
        borderColor: themeColors.border,
        backgroundColor: themeColors.card,
        color: themeColors.text,
        padding: 12,
        borderRadius: 8,
        flex: 1,
    },
    eyeIcon: {
        position: 'absolute',
        right: 12,
    },
    button: {
      backgroundColor: themeColors.tint,
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      width: '100%',
    },
    buttonText: {
      color: '#000000',
      fontSize: 16,
      fontWeight: 'bold',
    },
    errorText: {
      color: 'red',
      textAlign: 'center',
      marginBottom: 16,
    },
    link: {
      color: themeColors.tint,
      textAlign: 'center',
      marginTop: 16,
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      <TextInput
        placeholder="Nome"
        placeholderTextColor={themeColors.text}
        value={displayName}
        onChangeText={setDisplayName}
        style={styles.input}
        autoCapitalize="words"
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor={themeColors.text}
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <View style={styles.passwordContainer}>
        <TextInput
            placeholder="Senha"
            placeholderTextColor={themeColors.text}
            value={password}
            secureTextEntry={!isPasswordVisible}
            onChangeText={setPassword}
            style={styles.passwordInput}
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
            <Ionicons name={isPasswordVisible ? 'eye' : 'eye-off'} size={24} color={themeColors.text} />
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
      
      {loading ? (
        <ActivityIndicator size="large" color={themeColors.tint} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={signUp} disabled={loading}>
            <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      )}

      <Pressable onPress={onSwitchToLogin}>
        <Text style={styles.link}>Já tem uma conta? Entre</Text>
      </Pressable>
    </View>
  );
}
