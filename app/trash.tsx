import { useEffect, useState } from 'react';
import { View, FlatList, Button, Alert, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import api from '@/lib/axios';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Stack, useRouter } from 'expo-router';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

import { Note } from '@/types/note';
import TrashNoteCard from '@/components/TrashNoteCard';
import { SacIcon } from '@/components/ui/SacIcon';
import { AngleLeftIcon } from '@/components/ui/AngleLeftIcon';

type DeletedNote = Note;

export default function TrashScreen() {
  const colorScheme = useColorScheme();
  const [notes, setNotes] = useState<DeletedNote[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function fetchDeletedNotes() {
    setLoading(true);
    try {
      const response = await api.get('/notes/trash');
      setNotes(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar a lixeira.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDeletedNotes();
  }, []);

  const handleRestore = async (id: string) => {
    try {
      await api.post(`/notes/${id}/restore`);
      Alert.alert('Sucesso', 'A nota foi restaurada.');
      fetchDeletedNotes(); // Refresh the list
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível restaurar a nota.');
    }
  };

  const handlePermanentDelete = (id: string) => {
    Alert.alert(
      'Apagar Permanentemente',
      'Esta ação não pode ser desfeita. Tem certeza?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/notes/${id}/permanent`);
              Alert.alert('Sucesso', 'A nota foi apagada permanentemente.');
              fetchDeletedNotes(); // Refresh the list
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível apagar a nota.');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: DeletedNote }) => (
    <TrashNoteCard
      item={item}
      onRestore={handleRestore}
      onPermanentDelete={handlePermanentDelete}
    />
  );

  return (
    <ThemedView style={{ flex: 1, backgroundColor: '#202020', }}>
      <Stack.Screen options={{
        headerStyle: { backgroundColor: '#202020' },
        headerTintColor: '#fff',
        headerTitle: 'Lixeira',
        headerTitleAlign: 'center',
        headerRight: () => (
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <ThemedText style={{color: '#2383E2', fontSize: 16}}>Concluído</ThemedText>
          </TouchableOpacity>
        ),
        headerLeft: () => (
          <TouchableOpacity onPress={() => Linking.openURL('https://www.notion.com/pt/help/duplicate-delete-and-restore-content')} style={{ padding: 4 }}>
            <SacIcon color={Colors[colorScheme ?? 'light'].icon} size={20} />
          </TouchableOpacity>
        ),
      }} />
      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" />
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ThemedText>A lixeira está vazia.</ThemedText>
            </View>
          }
        />
      )}
    </ThemedView>
  );
}
