import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './themed-text';
import { Note } from '../types/note';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Link, useRouter } from 'expo-router';

import { ArrowChevronSingleDownIcon } from './ui/ArrowChevronSingleDownIcon';
import { ChevronRightIcon } from './ui/ChevronRightIcon';
import { PageFilledDarkIcon } from './ui/PageFilledDarkIcon';
import { PageEmptyIcon } from './ui/PageEmptyIcon';
import { EllipsisIcon } from './ui/EllipsisIcon';
import { PlusSmallIcon } from './ui/PlusSmallIcon';

type NoteCardProps = {
  item: Note;
  onToggleExpand: (noteId: string) => void;
  isExpanded: boolean;
  indentationLevel: number;
  onOpenModal: (note: Note) => void;
  onAddChild: (noteId: string) => void;
  onLongPress?: () => void;
};

const NoteCard: React.FC<NoteCardProps> = ({ 
  item, 
  onToggleExpand, 
  isExpanded, 
  indentationLevel, 
  onOpenModal,
  onAddChild,
  onLongPress
}) => {
  const colorScheme = useColorScheme();

  return (
    <View style={[styles.noteItem, { marginLeft: indentationLevel * 20 }]}>
      <TouchableOpacity onPress={() => onToggleExpand(item.id)}>
        {isExpanded ? <ArrowChevronSingleDownIcon color={Colors[colorScheme ?? 'light'].icon} size={20} /> : <ChevronRightIcon color={Colors[colorScheme ?? 'light'].icon} size={20} />}
      </TouchableOpacity>
      <View style={styles.noteHead}>
        <TouchableOpacity 
          style={styles.noteHeadContent}
          onLongPress={onLongPress}
          delayLongPress={500}
        >
          <Link href={`/note/${item.id}`} style={styles.noteHeadContent}>
            <View style={styles.noteHeadContent}>
              {item.title && item.description ? <PageFilledDarkIcon color={Colors[colorScheme ?? 'light'].icon} size={20} /> : <PageEmptyIcon color={Colors[colorScheme ?? 'light'].icon} size={20} />}
              <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
            </View>
          </Link>
        </TouchableOpacity>
      </View>
      <View style={styles.noteTail}>
        <TouchableOpacity onPress={() => onOpenModal(item)}>
          <EllipsisIcon color={Colors[colorScheme ?? 'light'].icon} size={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onAddChild(item.id)}>
          <PlusSmallIcon color={Colors[colorScheme ?? 'light'].icon} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  noteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 16
  }, 
  noteHead: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  noteHeadContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  noteTail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  } 
});

export default NoteCard;
