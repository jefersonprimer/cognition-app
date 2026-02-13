import { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Alert, Button, Clipboard } from 'react-native';
import api from '@/lib/axios';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthProvider';
import { useFocusEffect, useRouter } from 'expo-router';

import { Note } from '@/types/note';
import RecentNotes from '@/components/RecentNotes';
import AllFavoritesNotes from '@/components/AllFavoritesNotes';
import AllNotes from '@/components/AllNotes';
import NoteTree from '@/components/NoteTree';
import NoteActionsModal from '@/components/NoteActionsModal';

export default function HomeScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [favoriteNotes, setFavoriteNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [childNodes, setChildNodes] = useState<Record<string, Note[]>>({});
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const [favoriteExpandedNotes, setFavoriteExpandedNotes] = useState<Record<string, boolean>>({});

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [parentNote, setParentNote] = useState<Note | null>(null);
  const [modalVariant, setModalVariant] = useState<'all-notes' | 'favorites'>('all-notes');

  const { session, signOut } = useAuth();
  const router = useRouter();

  const fetchNotes = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/notes');
      setNotes(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch notes.';
      if (err.response?.status === 401) {
        signOut();
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [session, signOut]);

  const fetchFavoriteNotes = useCallback(async () => {
    if (!session) return;
    try {
      const response = await api.get('/notes?favorites=true');
      setFavoriteNotes(response.data);
    } catch (err: any) {
      console.error('Failed to fetch favorite notes.', err);
    }
  }, [session]);

  useFocusEffect(
    useCallback(() => {
      const refreshData = async () => {
        await Promise.all([fetchNotes(), fetchFavoriteNotes()]);

        const expandedIds = Object.keys(expandedNotes).filter(id => expandedNotes[id]);
        const favExpandedIds = Object.keys(favoriteExpandedNotes).filter(id => favoriteExpandedNotes[id]);
        const uniqueExpandedIds = [...new Set([...expandedIds, ...favExpandedIds])];

        if (uniqueExpandedIds.length > 0) {
          try {
            const childPromises = uniqueExpandedIds.map(id => 
              api.get(`/notes/${id}/children`).then(response => ({ id, children: response.data }))
            );
            
            const results = await Promise.all(childPromises);
            
            setChildNodes(prevChildNodes => {
              const newChildNodes = { ...prevChildNodes };
              results.forEach(result => {
                newChildNodes[result.id] = result.children;
              });
              return newChildNodes;
            });

          } catch (err) {
            console.error("Failed to refresh child notes on focus", err);
          }
        }
      };

      refreshData();
    }, [fetchNotes, fetchFavoriteNotes, expandedNotes, favoriteExpandedNotes])
  );

  const handleToggleExpand = async (noteId: string) => {
    const isCurrentlyExpanded = !!expandedNotes[noteId];
    const newExpandedState = { ...expandedNotes, [noteId]: !isCurrentlyExpanded };
    setExpandedNotes(newExpandedState);

    if (!isCurrentlyExpanded && !childNodes[noteId]) {
      try {
        const response = await api.get(`/notes/${noteId}/children`);
        setChildNodes(prev => ({ ...prev, [noteId]: response.data }));
      } catch (err) {
        console.error(`Failed to fetch child notes for ${noteId}`, err);
        setExpandedNotes(expandedNotes); // Rollback on error
      }
    }
  };

  const handleFavoriteToggleExpand = async (noteId: string) => {
    const isCurrentlyExpanded = !!favoriteExpandedNotes[noteId];
    const newExpandedState = { ...favoriteExpandedNotes, [noteId]: !isCurrentlyExpanded };
    setFavoriteExpandedNotes(newExpandedState);

    // Child fetching logic can be shared
    if (!isCurrentlyExpanded && !childNodes[noteId]) {
      try {
        const response = await api.get(`/notes/${noteId}/children`);
        setChildNodes(prev => ({ ...prev, [noteId]: response.data }));
      } catch (err) {
        console.error(`Failed to fetch child notes for ${noteId}`, err);
        setFavoriteExpandedNotes(favoriteExpandedNotes); // Rollback on error
      }
    }
  };

  const openModal = async (note: Note, variant: 'all-notes' | 'favorites') => {
    setSelectedNote(note);
    setModalVariant(variant);
    if (note.parentId) {
      try {
        const response = await api.get(`/notes/${note.parentId}`);
        setParentNote(response.data);
      } catch (err) {
        console.error(`Failed to fetch parent note for ${note.id}`, err);
        setParentNote(null);
      }
    } else {
      setParentNote(null);
    }
    setModalVisible(true);
  };

  const updateNoteInState = (updatedNote: Note) => {
    const recursiveUpdate = (noteList: Note[]): Note[] => {
      return noteList.map(note => {
        if (note.id === updatedNote.id) {
          return updatedNote;
        }
        return note;
      });
    };
    setNotes(prev => recursiveUpdate(prev));
    setChildNodes(prev => {
      const newChildNodes: Record<string, Note[]> = {};
      for (const parentId in prev) {
        newChildNodes[parentId] = recursiveUpdate(prev[parentId]);
      }
      return newChildNodes;
    });
  };

  // Modal Action Handlers
  const handleToggleFavorite = () => {
    if (!selectedNote) return;
    const isFavorite = !selectedNote.is_favorite;

    api.patch(`/notes/${selectedNote.id}`, { is_favorite: isFavorite }).then(() => {
      const updatedNote = { ...selectedNote, is_favorite: isFavorite };
      
      // Update the note in the modal
      setSelectedNote(updatedNote);
      
      // Update the note in the main lists
      updateNoteInState(updatedNote);

      // Add or remove from the dedicated favorites list
      if (isFavorite) {
        setFavoriteNotes(prev => {
          // To prevent duplicates, only add if it's not already there
          if (prev.some(n => n.id === updatedNote.id)) {
            return prev.map(n => n.id === updatedNote.id ? updatedNote : n);
          }
          return [...prev, updatedNote];
        });
      } else {
        setFavoriteNotes(prev => prev.filter(n => n.id !== selectedNote.id));
      }
    }).catch(err => {
      console.error('Failed to toggle favorite', err);
      Alert.alert("Erro", "Não foi possível atualizar o favorito.");
    });
  };

  const handleDelete = () => {
    if (!selectedNote) return;
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
              await api.delete(`/notes/${selectedNote.id}`);
              setNotes(prev => prev.filter(n => n.id !== selectedNote.id));
              setFavoriteNotes(prev => prev.filter(n => n.id !== selectedNote.id));
              // Also remove from childNodes if present
              setChildNodes(prev => {
                  const newChildNodes = { ...prev };
                  for (const parentId in newChildNodes) {
                      newChildNodes[parentId] = newChildNodes[parentId].filter(n => n.id !== selectedNote.id);
                  }
                  return newChildNodes;
              });
              setModalVisible(false);
            } catch (err: any) {
              Alert.alert('Erro', err.response?.data?.message || 'Não foi possível mover a nota.');
            }
          },
        },
      ]
    );
  };

  const handleDuplicate = () => {
    if (!selectedNote) return;
    api.post(`/notes/${selectedNote.id}/duplicate`).then(response => {
        const newNote = response.data;
        setNotes(prev => [...prev, newNote]);
    }).catch(err => {
        Alert.alert('Erro', 'Não foi possível duplicar a nota.');
    });
    setModalVisible(false);
  };
  
  const handleMakeOffline = (isOffline: boolean) => {
    if (!selectedNote) return;
    api.patch(`/notes/${selectedNote.id}/offline`, { isOffline }).then(() => {
        const updatedNote = { ...selectedNote, is_offline: isOffline };
        updateNoteInState(updatedNote);
    }).catch(err => {
        Alert.alert('Erro', 'Não foi possível alterar o status offline.');
    });
    // Do not close modal, so user can see switch state
  };

  const handleCopyLink = () => {
    if (!selectedNote) return;
    Clipboard.setString(`https://notion.app/note/${selectedNote.id}`);
    Alert.alert('Link Copiado', 'O link para a nota foi copiado.');
    setModalVisible(false);
  };

  const handleMoveTo = () => {
    if (!selectedNote) return;
    Alert.alert('Mover Para', 'Funcionalidade de mover ainda não implementada.');
    setModalVisible(false);
  };

  const handleAddChild = (noteId: string) => {
    router.push({ pathname: '/create', params: { parentId: noteId } });
  };

  if (loading && notes.length === 0) {
    return <ThemedView style={styles.centerContainer}><ActivityIndicator size="large" /></ThemedView>;
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText type="subtitle" style={{ textAlign: 'center', marginBottom: 12 }}>Ocorreu um erro ao buscar suas notas.</ThemedText>
        <ThemedText style={{ marginBottom: 20 }}>{error}</ThemedText>
        <Button title="Tentar Novamente" onPress={fetchNotes} />
      </ThemedView>
    );
  }

  const recentNotes = notes.slice(0, 5);

  return (
    <ThemedView style={styles.flex1}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => { fetchNotes(); fetchFavoriteNotes(); }} />}
      >
        <RecentNotes notes={recentNotes} />
        <AllFavoritesNotes 
          notes={favoriteNotes} 
          onOpenModal={(note) => openModal(note, 'favorites')}
          onAddChild={handleAddChild}
          onToggleExpand={handleFavoriteToggleExpand}
          expandedNotes={favoriteExpandedNotes}
          childNodes={childNodes}
        />
        
        <AllNotes 
          notes={notes}
          onOpenModal={(note) => openModal(note, 'all-notes')}
          onAddChild={handleAddChild}
          onToggleExpand={handleToggleExpand}
          expandedNotes={expandedNotes}
          childNodes={childNodes}
        />
      </ScrollView>

      <NoteActionsModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        note={selectedNote}
        parentNote={parentNote}
        variant={modalVariant}
        onToggleFavorite={handleToggleFavorite}
        onDuplicate={handleDuplicate}
        onMoveToTrash={handleDelete}
        onMakeOffline={handleMakeOffline}
        onCopyLink={handleCopyLink}
        onMoveTo={handleMoveTo}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
    flex1: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    container: {
      flex: 1,
      marginBottom: 20,
    },
    subtitle: {
      color: '#838383',
      fontWeight: '500',
      fontSize: 14,
      marginBottom: 10,
    },
});