import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from './themed-text';

import { Note } from '../types/note';
import NoteTree from './NoteTree';
import DraggableNoteTree from './DraggableNoteTree';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

import { EllipsisIcon } from './ui/EllipsisIcon';
import OptionsModal from './OptionsModal';
import OrderByModal from './OrderByModal';
import DisplayModal from './DisplayModal';
import { PlusSmallIcon } from './ui/PlusSmallIcon';
import { Link } from 'expo-router';

type AllNotesProps = {
  notes: Note[];
  onOpenModal: (note: Note) => void;
  onAddChild: (noteId: string) => void;
  onToggleExpand: (noteId: string) => void;
  expandedNotes: Record<string, boolean>;
  childNodes: Record<string, Note[]>;
  onNotesReorder?: (reorderedNotes: Note[]) => void;
};

const AllNotes: React.FC<AllNotesProps> = ({ 
  notes, 
  onOpenModal, 
  onAddChild, 
  onToggleExpand, 
  expandedNotes, 
  childNodes,
  onNotesReorder
}) => {
  const colorScheme = useColorScheme();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [orderByModalVisible, setOrderByModalVisible] = React.useState(false);
  const [displayModalVisible, setDisplayModalVisible] = React.useState(false);
  const [notesToShow, setNotesToShow] = React.useState(Infinity);
  const [orderBy, setOrderBy] = React.useState<'manual' | 'lastEdition'>('lastEdition');
  const [manualOrderedNotes, setManualOrderedNotes] = React.useState<Note[]>([]);

  React.useEffect(() => {
    const loadSettings = async () => {
      const savedNotesToShow = await AsyncStorage.getItem('notesToShow');
      const savedOrderBy = await AsyncStorage.getItem('orderBy');
      
      if (savedNotesToShow) {
        setNotesToShow(JSON.parse(savedNotesToShow));
      }
      
      if (savedOrderBy) {
        setOrderBy(JSON.parse(savedOrderBy));
      }
    };
    loadSettings();
  }, []);

  React.useEffect(() => {
    if (orderBy === 'manual') {
      setManualOrderedNotes(notes);
    }
  }, [notes, orderBy]);

  const handleDisplayChange = async (value: number) => {
    setNotesToShow(value);
    await AsyncStorage.setItem('notesToShow', JSON.stringify(value));
    setDisplayModalVisible(false);
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleOrderByPress = () => {
    setModalVisible(false);
    setOrderByModalVisible(true);
  };

  const handleDisplayPress = () => {
    setModalVisible(false);
    setDisplayModalVisible(true);
  };

  const handleCloseOrderByModal = () => {
    setOrderByModalVisible(false);
  };

  const handleCloseDisplayModal = () => {
    setDisplayModalVisible(false);
  };

  const handleOrderBySelect = async (selectedOrderBy: 'manual' | 'lastEdition') => {
    setOrderBy(selectedOrderBy);
    await AsyncStorage.setItem('orderBy', JSON.stringify(selectedOrderBy));
    
    if (selectedOrderBy === 'manual') {
      setManualOrderedNotes(notes);
    }
  };

  const handleNotesReorder = (reorderedNotes: Note[]) => {
    setManualOrderedNotes(reorderedNotes);
    if (onNotesReorder) {
      onNotesReorder(reorderedNotes);
    }
  };

  if (!notes || notes.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.title}>Particular</ThemedText>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={handleOpenModal}>
            <EllipsisIcon color={Colors[colorScheme ?? 'light'].icon} size={20} />
          </TouchableOpacity>
          <Link href="/create">
            <PlusSmallIcon color={Colors[colorScheme ?? 'light'].icon} size={20} />
          </Link>
        </View>
      </View> 
      {orderBy === 'manual' ? (
        <DraggableNoteTree
          notes={manualOrderedNotes.slice(0, notesToShow)}
          onToggleExpand={onToggleExpand}
          expandedNotes={expandedNotes}
          childNodes={childNodes}
          onOpenModal={onOpenModal}
          onAddChild={onAddChild}
          onNotesReorder={handleNotesReorder}
        />
      ) : (
        <NoteTree
          notes={notes.slice(0, notesToShow)}
          onToggleExpand={onToggleExpand}
          expandedNotes={expandedNotes}
          childNodes={childNodes}
          onOpenModal={onOpenModal}
          onAddChild={onAddChild}
        />
      )}
      <OptionsModal 
        visible={modalVisible} 
        onClose={handleCloseModal} 
        onOrderByPress={handleOrderByPress}
        onDisplayPress={handleDisplayPress}
        notesToShow={notesToShow}
        orderBy={orderBy}
      />
      <OrderByModal 
        visible={orderByModalVisible} 
        onClose={handleCloseOrderByModal} 
        onOrderBySelect={handleOrderBySelect}
        currentOrderBy={orderBy}
      />
      <DisplayModal 
        visible={displayModalVisible} 
        onClose={handleCloseDisplayModal} 
        onDisplayChange={handleDisplayChange}
        totalNotes={notes.length}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16
  },
  title: {
    color: '#838383',
    fontWeight: '500',
    fontSize: 14,
    paddingVertical: 10
  },
});

export default AllNotes;