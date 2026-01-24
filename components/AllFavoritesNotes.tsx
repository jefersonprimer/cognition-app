import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import NoteTree from './NoteTree';
import { Note } from '../types/note';

type AllFavoritesNotesProps = {
  notes: Note[];
  onOpenModal: (note: Note) => void;
  onAddChild: (noteId: string) => void;
  onToggleExpand: (noteId: string) => void;
  expandedNotes: Record<string, boolean>;
  childNodes: Record<string, Note[]>;
};

const AllFavoritesNotes: React.FC<AllFavoritesNotesProps> = ({ 
  notes, 
  onOpenModal, 
  onAddChild, 
  onToggleExpand, 
  expandedNotes, 
  childNodes 
}) => {

  if (!notes || notes.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.subtitle}>Favoritos</ThemedText>
      <NoteTree
        notes={notes}
        onToggleExpand={onToggleExpand}
        expandedNotes={expandedNotes}
        childNodes={childNodes}
        onOpenModal={onOpenModal}
        onAddChild={onAddChild}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    color: '#838383',
    fontWeight: '500',
    fontSize: 14
  },
});

export default AllFavoritesNotes;
