import React, { useState, useEffect, useMemo } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import api from '@/lib/axios';
import { useDebounce } from '@/hooks/use-debouncer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Note } from '@/types/note';

import { PageFilledDarkIcon } from '@/components/ui/PageFilledDarkIcon';
import { PageEmptyIcon } from '@/components/ui/PageEmptyIcon';
import { SearchIcon } from '@/components/ui/SearchIcon';
import { FilterCircleIcon } from '@/components/ui/FilterCircleIcon';
import { ArrowUpDownIcon } from '@/components/ui/ArrowUpDownIcon';
import { TextFormatIcon } from  '@/components/ui/TextFormatIcon';
import { PersonIcon } from '@/components/ui/PersonIcon';

type GroupedNotes = {
  today: Note[];
  yesterday: Note[];
  thisWeek: Note[];
  older: Note[];
};

const SearchNoteCard = ({ note, allNotes }: { note: Note, allNotes: Note[] }) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const styles = StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderColor: '#242424'
    },
    iconContainer: {
      marginRight: 12,
    },
    textContainer: {
      flex: 1,
    },
    subtitle: {
      color: Colors[colorScheme ?? 'light'].secundaryText,
      fontSize: 12,
    },
  });

  const parentNote = useMemo(() => {
    if (!note.parentId) return null;
    return allNotes.find(n => n.id === note.parentId);
  }, [note.parentId, allNotes]);

  return (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/note/${note.id}`)}>
      <View style={styles.iconContainer}>
        {note.description ? <PageFilledDarkIcon color={Colors[colorScheme ?? 'light'].icon} size={20} /> : <PageEmptyIcon color={Colors[colorScheme ?? 'light'].icon} size={20} />}
      </View>
      <View style={styles.textContainer}>
        <ThemedText type="defaultSemiBold">{note.title}</ThemedText>
        <ThemedText style={styles.subtitle}>{parentNote ? `em ${parentNote.title}` : 'em Particular'}</ThemedText>
      </View>
    </TouchableOpacity>
  );
};

const TimeSection = ({ title, notes, allNotes }: { title: string, notes: Note[], allNotes: Note[] }) => {
  const colorScheme = useColorScheme();
  if (notes.length === 0) return null;

  const styles = StyleSheet.create({
    divider: {
      color: Colors[colorScheme ?? 'light'].secundaryText,
      marginTop: 24,
      marginBottom: 8,
      fontSize: 12,
    },
  });

  return (
    <View>
      <ThemedText style={styles.divider}>{title}</ThemedText>
      {notes.map(note => <SearchNoteCard key={note.id} note={note} allNotes={allNotes} />)}
    </View>
  );
};


export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Note[]>([]);
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFiltersVisible, setFiltersVisible] = useState(false);
  const [isSortModalVisible, setSortModalVisible] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState('Ordenar');
  const [isTitleOnlyActive, setTitleOnlyActive] = useState(false);
  const [isCreatedByActive, setCreatedByActive] = useState(false);

  const handleSortOptionSelect = (option: string) => {
    setSelectedSortOption(option);
    setSortModalVisible(false);
  };

  const router = useRouter();
  const colorScheme = 'dark';

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    setLoading(true);
    api.get('/notes')
      .then(response => {
        setAllNotes(response.data);
      })
      .catch(error => {
        console.error("Failed to fetch all notes:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (debouncedQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const getSortParams = () => {
      switch (selectedSortOption) {
        case 'Ultima edicao: Mais recente primeiro':
          return { sortBy: 'updated_at', sortDirection: 'desc' };
        case 'Ultima edicao: Mais antigo primeiro':
          return { sortBy: 'updated_at', sortDirection: 'asc' };
        case 'Criado: Mais recente primeiro':
          return { sortBy: 'created_at', sortDirection: 'desc' };
        case 'Criado: Mais antigo primeiro':
          return { sortBy: 'created_at', sortDirection: 'asc' };
        default:
          return { sortBy: undefined, sortDirection: undefined };
      }
    };

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const { sortBy, sortDirection } = getSortParams();
        const params = new URLSearchParams({
          q: debouncedQuery,
          titleOnly: String(isTitleOnlyActive),
        });
        if (sortBy && sortDirection) {
          params.append('sortBy', sortBy);
          params.append('sortDirection', sortDirection);
        }
        const response = await api.get(`/notes/search?${params.toString()}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedQuery, isTitleOnlyActive, selectedSortOption]);

  const groupedNotes = useMemo<GroupedNotes>(() => {
    const groups: GroupedNotes = { today: [], yesterday: [], thisWeek: [], older: [] };
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    allNotes.forEach(note => {
      const noteDate = new Date(note.createdAt);
      if (noteDate >= today) {
        groups.today.push(note);
      } else if (noteDate >= yesterday) {
        groups.yesterday.push(note);
      } else if (noteDate >= startOfWeek) {
        groups.thisWeek.push(note);
      } else {
        groups.older.push(note);
      }
    });
    return groups;
  }, [allNotes]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.dark.background,
      paddingHorizontal: 16,
      paddingTop: 40,
    },
    headerText: {
      color: Colors.dark.text,
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center'
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8
    },
    searchInputContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#232323',
      borderWidth: 2,
      borderColor: '#2F2F2F',
      borderRadius: 30,
      paddingHorizontal: 12,
    },
    input: {
      flex: 1,
      fontSize: 16,
      paddingVertical: 12,
      color: Colors.dark.text,
      marginLeft: 8,
    },
    filterContainer: {
      flexDirection: 'row',
      marginTop: 12,
      gap: 8,
    },
    chip: {
      flexDirection: 'row',
      gap: 5,
      borderColor: Colors.dark.gray,
      borderWidth: 1,
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: '#2C2C2E',
    },
    chipText: {
      color: Colors.dark.text,
      fontSize: 12,
    },
    contentContainer: {
      flex: 1,
      marginTop: 20,
    },
    emptyContainer: {
      marginTop: 50,
      alignItems: 'center',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: '#2C2C2E',
      padding: 20,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: Colors.dark.text,
    },
    modalButton: {
      padding: 15,
      alignItems: 'flex-start',
    },
    modalButtonText: {
      fontSize: 16,
      color: Colors.dark.text,
    }
  });

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator style={{marginTop: 50}} size="large" color={Colors.dark.tint} />;
    }

    if (debouncedQuery) {
      return (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SearchNoteCard note={item} allNotes={allNotes} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ThemedText>Nenhum resultado encontrado.</ThemedText>
            </View>
          }
        />
      );
    }

    return (
      <ScrollView>
        <TimeSection title="Hoje" notes={groupedNotes.today} allNotes={allNotes} />
        <TimeSection title="Ontem" notes={groupedNotes.yesterday} allNotes={allNotes} />
        <TimeSection title="Esta semana" notes={groupedNotes.thisWeek} allNotes={allNotes} />
        <TimeSection title="Anteriores" notes={groupedNotes.older} allNotes={allNotes} />
      </ScrollView>
    );
  };

  const activeBlue = '#0a7ea4';

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.headerText}>Workspace</ThemedText>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <SearchIcon color={Colors.dark.icon} size={20}/>
          <TextInput
            placeholder="Buscar"
            value={query}
            onChangeText={setQuery}
            style={styles.input}
            placeholderTextColor="#888888"
          />
        </View>
        <TouchableOpacity onPress={() => setFiltersVisible(!isFiltersVisible)} >
          <FilterCircleIcon color={Colors.dark.icon} size={36} />
        </TouchableOpacity>
      </View>

      {isFiltersVisible && (
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[styles.chip, { borderColor: selectedSortOption !== 'Ordenar' && selectedSortOption !== 'Melhores correspondências' ? activeBlue : Colors.dark.gray }]} 
            onPress={() => setSortModalVisible(true)}
          >
            <ArrowUpDownIcon color={selectedSortOption !== 'Ordenar' && selectedSortOption !== 'Melhores correspondências' ? activeBlue : Colors.dark.icon} size={20}/>
            <ThemedText style={[styles.chipText, { color: selectedSortOption !== 'Ordenar' && selectedSortOption !== 'Melhores correspondências' ? activeBlue : Colors.dark.text }]}>{selectedSortOption}</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.chip, { borderColor: isTitleOnlyActive ? activeBlue : Colors.dark.gray }]}
            onPress={() => setTitleOnlyActive(!isTitleOnlyActive)}
          >
            <TextFormatIcon color={isTitleOnlyActive ? activeBlue : Colors.dark.icon} size={20}/>
            <ThemedText style={[styles.chipText, { color: isTitleOnlyActive ? activeBlue : Colors.dark.text }]}>Somente título</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.chip, { borderColor: isCreatedByActive ? activeBlue : Colors.dark.gray }]}
            onPress={() => setCreatedByActive(!isCreatedByActive)}
          >
            <PersonIcon color={isCreatedByActive ? activeBlue : Colors.dark.icon} size={20}/>
            <ThemedText style={[styles.chipText, { color: isCreatedByActive ? activeBlue : Colors.dark.text }]}>Criado por</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.contentContainer}>
        {renderContent()}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isSortModalVisible}
        onRequestClose={() => setSortModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPressOut={() => setSortModalVisible(false)}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Ordenar por</ThemedText>
            <TouchableOpacity style={styles.modalButton} onPress={() => handleSortOptionSelect('Melhores correspondências')}>
              <ThemedText style={styles.modalButtonText}>Melhores correspondências</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => handleSortOptionSelect('Ultima edicao: Mais recente primeiro')}>
              <ThemedText style={styles.modalButtonText}>Ultima edicao: Mais recente primeiro</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => handleSortOptionSelect('Ultima edicao: Mais antigo primeiro')}>
              <ThemedText style={styles.modalButtonText}>Ultima edicao: Mais antigo primeiro</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => handleSortOptionSelect('Criado: Mais recente primeiro')}>
              <ThemedText style={styles.modalButtonText}>Criado: Mais recente primeiro</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => handleSortOptionSelect('Criado: Mais antigo primeiro')}>
              <ThemedText style={styles.modalButtonText}>Criado: Mais antigo primeiro</ThemedText>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ThemedView>
  );
}
