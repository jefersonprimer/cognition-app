import { useEffect, useState } from 'react';
import { View, TextInput, Text, Alert, ActivityIndicator, TouchableOpacity, StyleSheet, Modal, Switch, ScrollView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';

import api from '@/lib/axios';
import { useDebounce } from '@/hooks/use-debouncer';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

import { StarIcon } from '@/components/ui/StarIcon';
import { StarSlashIcon } from '@/components/ui/StarSlashIcon';
import { LinkIcon } from '@/components/ui/LinkIcon';
import { DuplicateIcon } from '@/components/ui/DuplicateIcon';
import { ArrowTurnUpRightIcon } from '@/components/ui/ArrowTurnUpRightIcon';
import { TrashIcon } from '@/components/ui/TrashIcon';
import { EmojiFaceIcon } from '@/components/ui/EmojiFaceIcon';
import { PhotoFillIcon } from '@/components/ui/PhotoFillIcon';
import { CommentFilledFillIcon } from '@/components/ui/CommentFilledFillIcon';
import { FolderOutlineIcon } from '@/components/ui/FolderOutlineIcon';
import { SlidersIcon } from '@/components/ui/SlidersIcon';
import { PadLockOpenIcon } from '@/components/ui/PadLockOpenIcon';
import { TextTranslaterIcon } from '@/components/ui/TextTranslaterIcon';
import { ArrowChevronSingleRightSmallIcon } from '@/components/ui/ArrowChevronSingleRightSmallIcon';
import { ArrowLineUpIcon } from '@/components/ui/ArrowLineUpIcon';
import { ArrowSquarePathUpDownIcon } from '@/components/ui/ArrowSquarePathUpDownIcon';
import { ClockIcon } from '@/components/ui/ClockIcon';
import { StackIcon } from '@/components/ui/StackIcon';
import { BellIcon } from '@/components/ui/BellIcon';
import { SquareGrid2X2Icon } from '@/components/ui/SquareGrid2X2Icon';

import { AngleLeftIcon } from '@/components/ui/AngleLeftIcon';
import { SquareAndArrowUpIcon } from '@/components/ui/SquareAndArrowUpIcon'; 
import { EllipsisIcon } from '@/components/ui/EllipsisIcon';


import { Note } from '@/types/note';
import ChildNoteCard from '@/components/ChildNoteCard';

export default function NoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();

  // Note content state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [children, setChildren] = useState<Note[]>([]);
  const [isOffline, setIsOffline] = useState(false);

  // UI editing state
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);

  // Debounce title and description for auto-saving
  const debouncedTitle = useDebounce(title, 500);
  const debouncedDescription = useDebounce(description, 500);

  // Fetch initial note data
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/notes/${id}`)
      .then(response => {
        setTitle(response.data.title);
        setDescription(response.data.description || '');
        setIsFavorite(response.data.is_favorite);
      })
      .catch(err => setError(err.response?.data?.message || 'Failed to fetch note.'))
      .finally(() => setLoading(false));

    api.get(`/notes/${id}/children`)
      .then(response => {
        setChildren(response.data);
      })
      .catch(err => console.error('Failed to fetch child notes.', err));
  }, [id]);

  // Auto-save title when debounced value changes
  useEffect(() => {
    if (debouncedTitle !== undefined && !loading) { // Avoid saving on initial fetch
      api.put(`/notes/${id}`, { title: debouncedTitle });
    }
  }, [debouncedTitle, id, loading]);

  // Auto-save description when debounced value changes
  useEffect(() => {
    if (debouncedDescription !== undefined && !loading) { // Avoid saving on initial fetch
      api.put(`/notes/${id}`, { description: debouncedDescription });
    }
  }, [debouncedDescription, id, loading]);

  const handleToggleFavorite = async () => {
    try {
      const newIsFavorite = !isFavorite;
      setIsFavorite(newIsFavorite);
      await api.patch(`/notes/${id}/favorite`, { isFavorite: newIsFavorite });
    } catch (err) {
      console.error('Failed to toggle favorite', err);
      // Revert the state if the API call fails
      setIsFavorite(!isFavorite);
      Alert.alert('Error', 'Failed to update favorite status.');
    }
  };

  const handleOfflineSwitch = () => setIsOffline(previousState => !previousState);

  const handleDelete = () => {
    Alert.alert(
      'Mover para a Lixeira',
      'Tem certeza que quer mover esta nota para a lixeira?',
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => setModalVisible(false) },
        {
          text: 'Mover',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/notes/${id}`);
              Alert.alert('Sucesso', 'Nota movida para a lixeira.');
              setModalVisible(false);
              router.back();
            } catch (err: any) {
              Alert.alert('Erro', err.response?.data?.message || 'Não foi possível mover a nota.');
            }
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <Stack.Screen
          options={{
            headerTitle: '',
            headerBackVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <AngleLeftIcon color={Colors[colorScheme ?? 'light'].icon} size={30} />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                <TouchableOpacity>
                  <SquareAndArrowUpIcon color={Colors[colorScheme ?? 'light'].icon} size={26} />  
                </TouchableOpacity>
              
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <EllipsisIcon color={Colors[colorScheme ?? 'light'].icon} size={24} />
                </TouchableOpacity>
                </View>
              ),
            }}
          />
          {loading ? (
            <ActivityIndicator style={{ flex: 1 }} size="large" />
          ) : error ? (
            <ThemedText>Error: {error}</ThemedText>
          ) : (
            <>
              {isEditingTitle ? (
                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    onBlur={() => setIsEditingTitle(false)}
                    autoFocus
                    style={styles.title}
                />
            ) : (
                <TouchableOpacity onPress={() => setIsEditingTitle(true)}>
                    <Text style={styles.title}>{title || 'Sem Título'}</Text>
                </TouchableOpacity>
            )}

            {isEditingDescription ? (
                <TextInput
                    value={description}
                    onChangeText={setDescription}
                    onBlur={() => setIsEditingDescription(false)}
                    autoFocus
                    multiline
                    style={styles.description}
                />
            ) : (
                <TouchableOpacity onPress={() => setIsEditingDescription(true)}>
                    <Text style={styles.description}>{description || 'Sem descrição'}</Text>
                </TouchableOpacity>
            )}

            {children.length > 0 && (
              <View style={{ marginTop: 20 }}>
                {children.map(child => (
                  <ChildNoteCard key={child.id} item={child} />
                ))}
              </View>
            )}

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                  setModalVisible(!modalVisible);
              }}
            >
              <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPressOut={() => setModalVisible(false)}>
                <View style={styles.modalContent}>
                  <ScrollView>
                    <View style={{ alignSelf: 'center', borderWidth: 0.3, backgroundColor: '#3D3D3D', width: 40, height: 6, marginBottom: 10, borderRadius: 8 }}/>
                    
                    <View>
                      <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text, alignSelf: 'center', marginLeft: 10 }]}>Ações</Text>
                    </View>

                    <View style={{ gap: 1, padding: 4, flexDirection: 'column', backgroundColor: '#252525', borderRadius: 10, marginVertical: 10  }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, paddingHorizontal: 8 }}>
                        
                        {/* Opção 1 - Padrão */}
                        <TouchableOpacity
                          style={{
                            flex: 1,
                            paddingVertical: 10,
                            paddingHorizontal: 6,
                            borderRadius: 4,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 34, justifyContent: 'flex-end' }}>
                            <Text style={{ fontSize: 25, position: 'relative', top: -2, color: Colors[colorScheme ?? 'light'].text, fontFamily: Platform.select({ web: 'Arial', ios: 'Helvetica', default: 'sans-serif' }) }}>Ag</Text>
                            <Text style={{ fontSize: 12, lineHeight: 16, color: Colors[colorScheme ?? 'light'].text, marginTop: 4 }}>Padrão</Text>
                          </View>
                        </TouchableOpacity>

                        {/* Opção 2 - Serifada */}
                        <TouchableOpacity
                          style={{
                            flex: 1,
                            paddingVertical: 10,
                            paddingHorizontal: 6,
                            borderRadius: 4,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 34, justifyContent: 'flex-end' }}>
                            <Text style={{ fontSize: 25, fontFamily: Platform.select({ web: 'Times New Roman', ios: 'Georgia', default: 'serif' }), fontStyle: 'italic', lineHeight: 21, height: 25, color: Colors[colorScheme ?? 'light'].text }}>Ag</Text>
                            <Text style={{ fontSize: 12, lineHeight: 16, color: Colors[colorScheme ?? 'light'].text, marginTop: 4 }}>Serifada</Text>
                          </View>
                        </TouchableOpacity>

                        {/* Opção 3 - Mono */}
                        <TouchableOpacity
                          style={{
                            flex: 1,
                            paddingVertical: 10,
                            paddingHorizontal: 6,
                            borderRadius: 4,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 34, justifyContent: 'flex-end' }}>
                            <Text style={{ fontSize: 26, fontFamily: Platform.select({ web: 'Courier New', ios: 'Menlo', default: 'monospace' }), fontWeight: 'bold', position: 'relative', top: -3, letterSpacing: -1, color: Colors[colorScheme ?? 'light'].text }}>
                              Ag
                            </Text>
                            <Text style={{ fontSize: 12, lineHeight: 16, color: Colors[colorScheme ?? 'light'].text, marginTop: 4 }}>Mono</Text>
                          </View>
                        </TouchableOpacity>

                      </View>
                    </View>


                      <View style={{ flexDirection: 'column', backgroundColor: '#252525', borderRadius: 10, marginVertical: 10, }}>
                        <TouchableOpacity style={styles.modalButton} onPress={handleToggleFavorite}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {isFavorite ? <StarSlashIcon color={Colors[colorScheme ?? 'light'].text} size={20} /> : <StarIcon color={Colors[colorScheme ?? 'light'].text} size={20} />}
                              <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text, marginLeft: 10 }]}>
                                {isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                              </Text>
                          </View>
                        </TouchableOpacity>

                        <View style={{ borderWidth: 0.3, borderColor: '#8D8D8D' }}/>

                        <TouchableOpacity style={styles.modalButton}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <LinkIcon color={Colors[colorScheme ?? 'light'].text} size={20} />
                          <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text, marginLeft: 10 }]}>
                            Copiar link
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <View style={{ borderWidth: 0.3, borderColor: '#8D8D8D' }}/>

                      <TouchableOpacity style={styles.modalButton}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <DuplicateIcon color={Colors[colorScheme ?? 'light'].text} size={20} />
                          <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text, marginLeft: 10 }]}>
                            Duplicar
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <View style={{ borderWidth: 0.3, borderColor: '#8D8D8D' }}/>

                      <TouchableOpacity style={styles.modalButton}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <ArrowTurnUpRightIcon color={Colors[colorScheme ?? 'light'].text} size={20} />
                          <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text, marginLeft: 10 }]}>
                            Mover para
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <View style={{ borderWidth: 0.3, borderColor: '#8D8D8D' }}/>

                      <TouchableOpacity style={styles.modalButton}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <TrashIcon color='#D4524E' size={20} />
                          <Text style={[styles.modalButtonText, { color: '#D4524E', marginLeft: 10 }]}>
                            Mover para a lixeira
                          </Text>
                        </View>
                      </TouchableOpacity>

                    </View>
                  
                  <View style={{ backgroundColor: '#252525', borderRadius: 10, marginVertical: 10, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15, paddingVertical: 15 }}>
                      <ArrowTurnUpRightIcon color={Colors[colorScheme ?? 'light'].text} size={20} />
                      <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text, marginLeft: 10 }]}>Disponível offline</Text>
                    </View>
                    <Switch
                        value={isOffline}
                        onValueChange={handleOfflineSwitch}
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={isOffline ? '#f5dd4b' : '#f4f3f4'}
                    />
                  </View>
                  
                  <View style={{ flexDirection: 'column', backgroundColor: '#252525', borderRadius: 10, marginVertical: 10, }}>
                    <TouchableOpacity style={styles.modalButton}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <EmojiFaceIcon color={Colors[colorScheme ?? 'light'].text} size={20} />
                        <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text, marginLeft: 10 }]}>
                          Adicionar ícone
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <View style={{ borderWidth: 0.3, borderColor: '#8D8D8D' }}/>
                    
                    <TouchableOpacity style={styles.modalButton}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <PhotoFillIcon color={Colors[colorScheme ?? 'light'].text} size={20} />
                        <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text, marginLeft: 10 }]}>
                          Adicionar capa
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <View style={{ borderWidth: 0.3, borderColor: '#8D8D8D' }}/>

                    <TouchableOpacity style={styles.modalButton}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <CommentFilledFillIcon color={Colors[colorScheme ?? 'light'].text} size={20} />
                        <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text, marginLeft: 10 }]}>
                          Adicionar comentário
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <View style={{ borderWidth: 0.3, borderColor: '#8D8D8D' }}/>

                    <TouchableOpacity style={styles.modalButton}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FolderOutlineIcon color={Colors[colorScheme ?? 'light'].text} size={20} />  
                        <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text, marginLeft: 10 }]}>
                          Ver trilha
                        </Text>
                      </View>
                    </TouchableOpacity >

                    <View style={{ borderWidth: 0.3, borderColor: '#8D8D8D' }}/>

                    <TouchableOpacity style={styles.modalButton}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <SlidersIcon color={Colors[colorScheme ?? 'light'].text} size={20} />
                        <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text, marginLeft: 10 }]}>
                          Personalizar página
                        </Text>
                      </View>
                    </TouchableOpacity>                      
                  </View>

                  <View style={{ backgroundColor: '#252525', borderRadius: 10, marginVertical: 10, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15, paddingVertical: 15 }}>
                      <PadLockOpenIcon color={Colors[colorScheme ?? 'light'].text} size={20} />
                      <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text, marginLeft: 10 }]}>
                        Bloquear página
                      </Text>
                    </View>
                    <Switch
                        value={isOffline}
                        onValueChange={handleOfflineSwitch}
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={isOffline ? '#f5dd4b' : '#f4f3f4'}
                    />
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#252525', borderRadius: 10, marginVertical: 10, padding: 15 }}>
                    <TouchableOpacity>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <TextTranslaterIcon color={Colors[colorScheme ?? 'light'].text} size={20} />                 
                        <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text }]}>
                          Traduzir
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <ArrowChevronSingleRightSmallIcon color={Colors[colorScheme ?? 'light'].text} size={20} />
                    </View>

                  </View>

                  <View style={{ flexDirection: 'column', backgroundColor: '#252525', borderRadius: 10, marginVertical: 10, }}>
                    <TouchableOpacity style={styles.modalButton}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <ArrowLineUpIcon color={Colors[colorScheme ?? 'light'].text} size={20} />
                        <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text, marginLeft: 10 }]}>
                          Exportar
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={{ flexDirection: 'column', backgroundColor: '#252525', borderRadius: 10, marginVertical: 10, }}>
                    <TouchableOpacity style={styles.modalButton}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <ArrowSquarePathUpDownIcon color={Colors[colorScheme ?? 'light'].text} size={20} />
                        <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text, marginLeft: 10 }]}>
                          Transformar em wiki
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={{ flexDirection: 'column', backgroundColor: '#252525', borderRadius: 10, marginVertical: 10, }}>
                    <TouchableOpacity style={styles.modalButton}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <ClockIcon color={Colors[colorScheme ?? 'light'].text} size={20} />
                        <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text, marginLeft: 10 }]}>
                          Atualizações da página
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <View style={{ borderWidth: 0.3, borderColor: '#8D8D8D' }}/>
                    
                    <TouchableOpacity style={styles.modalButton}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <StackIcon color={Colors[colorScheme ?? 'light'].text} size={20} />
                        <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text, marginLeft: 10 }]}>
                          Histórico de versão
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between',backgroundColor: '#252525', borderRadius: 10, marginVertical: 10, padding: 15 }}>
                    <TouchableOpacity>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <BellIcon color={Colors[colorScheme ?? 'light'].text} size={20} />
                        <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text, marginLeft: 10 }]}>
                          Receber notificação
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <ArrowChevronSingleRightSmallIcon color={Colors[colorScheme ?? 'light'].text} size={20} />
                    </View>

                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between',backgroundColor: '#252525', borderRadius: 10, marginVertical: 10, padding: 15 }}>
                    <TouchableOpacity>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <SquareGrid2X2Icon color={Colors[colorScheme ?? 'light'].text} size={20} />
                        <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text, marginLeft: 10 }]}>
                          Conexões
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <ArrowChevronSingleRightSmallIcon color={Colors[colorScheme ?? 'light'].text} size={20} />
                    </View>

                  </View>

                  <View style={{ flexDirection: 'column', backgroundColor: '#252525', padding: 20,borderRadius: 10, marginVertical: 10, }}>
                    <Text>Contagem de palavras: {38} palavras</Text>
                    <Text>Última edição por: Jeferson Primer</Text>
                    <Text>ontem às 15:30</Text>
                  </View>
                </ScrollView>
              </View>
            </TouchableOpacity>
          </Modal>
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  title: {
      fontSize: 32,
      fontWeight: 'bold',
      paddingVertical: 10,
      color: 'white' 
  },
  description: {
      fontSize: 18,
      paddingVertical: 10,
      lineHeight: 24,
      color: 'white' 
  },
  modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
      backgroundColor: '#202020',
      padding: 20,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
  },
  modalButton: {
      padding: 15,
      alignItems: 'flex-start',
  },
  modalButtonText: {
    fontSize: 18,
  }
});
