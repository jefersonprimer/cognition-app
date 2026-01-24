import { useState } from 'react';
import { View, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthProvider';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Stack } from 'expo-router';
import { useTheme } from '@react-navigation/native';

export default function SettingsScreen() {
  const { setSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  const handleLogout = () => {
    setSession(null);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Deletar Conta Permanentemente',
      'Você tem certeza? Esta ação é irreversível e todos os seus dados, incluindo todas as suas notas, serão apagados para sempre.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eu entendo, deletar minha conta',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await api.delete('/users/me');
              Alert.alert('Conta Deletada', 'Sua conta foi deletada com sucesso.');
              setSession(null);
            } catch (error: any) {
              const errorMessage = error.response?.data?.message || 'Não foi possível deletar a conta.';
              Alert.alert('Erro', errorMessage);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    title: {
      marginBottom: 24,
    },
    section: {
      marginTop: 10,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
    },
    dangerZone: {
      borderColor: colors.notification,
    },
    sectionText: {
      marginBottom: 10,
      lineHeight: 20,
    },
  });

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Configurações' }} />
      <ThemedText type="title" style={styles.title}>Configurações</ThemedText>

      <ThemedText type="subtitle">Conta</ThemedText>
        <View style={styles.section}>
          <Button
            title="Sair (Logout)"
            onPress={handleLogout}
            color={colors.primary}
          />
        </View>

      <ThemedText type="subtitle" style={{ marginTop: 30 }}>Zona de Perigo</ThemedText>
      <View style={[styles.section, styles.dangerZone]}>
        <ThemedText style={styles.sectionText}>
          Apagar sua conta é uma ação permanente e todos os seus dados serão perdidos para sempre.
        </ThemedText>
        {loading ? (
          <ActivityIndicator size="large" color={colors.notification} />
        ) : (
          <Button
            title="Deletar Minha Conta"
            color={colors.notification}
            onPress={handleDeleteAccount}
          />
        )}
      </View>
    </ThemedView>
  );
}