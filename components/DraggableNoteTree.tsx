import React from 'react';
import { View } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { Note } from '../types/note';
import NoteCard from './NoteCard';
import { ThemedText } from './themed-text';

type DraggableNoteTreeProps = {
  notes: Note[];
  onToggleExpand: (noteId: string) => void;
  expandedNotes: Record<string, boolean>;
  childNodes: Record<string, Note[]>;
  onOpenModal: (note: Note) => void;
  onAddChild: (noteId: string) => void;
  onNotesReorder: (reorderedNotes: Note[]) => void;
};

const DraggableNoteTree: React.FC<DraggableNoteTreeProps> = ({ 
  notes, 
  onToggleExpand, 
  expandedNotes, 
  childNodes, 
  onOpenModal,
  onAddChild,
  onNotesReorder
}) => {
  const renderItem = ({ item, drag, isActive }: RenderItemParams<Note>) => {
    return (
      <View style={{ opacity: isActive ? 0.5 : 1 }}>
        <NoteCard 
          item={item} 
          onToggleExpand={onToggleExpand}
          isExpanded={!!expandedNotes[item.id]}
          indentationLevel={0}
          onOpenModal={onOpenModal}
          onAddChild={onAddChild}
          onLongPress={drag}
        />
        {expandedNotes[item.id] && childNodes[item.id] && childNodes[item.id].length > 0 && (
          <View style={{ marginLeft: 20 }}>
            {childNodes[item.id].map(childNote => (
              <NoteCard 
                key={childNote.id}
                item={childNote} 
                onToggleExpand={onToggleExpand}
                isExpanded={!!expandedNotes[childNote.id]}
                indentationLevel={1}
                onOpenModal={onOpenModal}
                onAddChild={onAddChild}
              />
            ))}
          </View>
        )}
        {expandedNotes[item.id] && childNodes[item.id] && childNodes[item.id].length === 0 && (
          <View style={{ marginLeft: 20, paddingHorizontal: 14 }}>
            <ThemedText>Não contém páginas</ThemedText>
          </View>
        )}
      </View>
    );
  };

  return (
    <DraggableFlatList
      data={notes}
      onDragEnd={({ data }) => onNotesReorder(data)}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
    />
  );
};

export default DraggableNoteTree;