import React from 'react';
import { View } from 'react-native';
import { Note } from '../types/note';
import NoteCard from './NoteCard';
import { ThemedText } from './themed-text';

type NoteTreeProps = {
  notes: Note[];
  onToggleExpand: (noteId: string) => void;
  expandedNotes: Record<string, boolean>;
  childNodes: Record<string, Note[]>;
  indentationLevel?: number;
  onOpenModal: (note: Note) => void;
  onAddChild: (noteId: string) => void;
};

const NoteTree: React.FC<NoteTreeProps> = ({ 
  notes, 
  onToggleExpand, 
  expandedNotes, 
  childNodes, 
  indentationLevel = 0, 
  onOpenModal,
  onAddChild
}) => {
  return (
    <View>
      {notes.map(note => (
        <View key={note.id}>
          <NoteCard 
            item={note} 
            onToggleExpand={onToggleExpand}
            isExpanded={!!expandedNotes[note.id]}
            indentationLevel={indentationLevel}
            onOpenModal={onOpenModal}
            onAddChild={onAddChild}
          />
          {expandedNotes[note.id] && childNodes[note.id] && childNodes[note.id].length > 0 && (
            <NoteTree
              notes={childNodes[note.id]}
              onToggleExpand={onToggleExpand}
              expandedNotes={expandedNotes}
              childNodes={childNodes}
              indentationLevel={indentationLevel + 1}
              onOpenModal={onOpenModal}
              onAddChild={onAddChild}
            />
          )}
          {expandedNotes[note.id] && childNodes[note.id] && childNodes[note.id].length === 0 && (
            <View style={{ marginLeft: (indentationLevel + 1) * 20, paddingHorizontal: 14 }}>
              <ThemedText>Não contém páginas</ThemedText>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

export default NoteTree;
