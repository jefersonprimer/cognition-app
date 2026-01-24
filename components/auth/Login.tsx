// /components/auth/Login.tsx

import { useState } from "react";
import { View, TextInput, Text, Pressable, ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from "react-native";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthProvider";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

type LoginProps = {
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: () => void;
};

export default function Login({ onSwitchToRegister, onSwitchToForgotPassword }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const { signIn } = useAuth();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  async function handleSignIn() {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/users/login`, { email, password });
      const { user, accessToken } = response.data;

      signIn({
        access_token: accessToken,
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
        },
      });

      console.log("Login realizado com sucesso!");

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Ocorreu um erro no login.";
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
    },
    secondaryLink: {
        color: 'gray',
        textAlign: 'center',
        marginTop: 12,
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>

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
        <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
            <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      )}

      <Pressable onPress={onSwitchToRegister}>
        <Text style={styles.link}>Não tem uma conta? Cadastre-se</Text>
      </Pressable>

      <Pressable onPress={onSwitchToForgotPassword}>
        <Text style={styles.secondaryLink}>Esqueceu sua senha?</Text>
      </Pressable>
    </View>
  );
}