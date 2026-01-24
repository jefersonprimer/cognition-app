import React, { useState } from 'react';
import api from '@/lib/axios';
import { Note } from '../types/note';
import { ThemedText } from './themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { View, FlatList, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';

import { PageFilledDarkIcon } from './ui/PageFilledDarkIcon';

type RecentNotesProps = {
  notes: Note[];
};

const RecentNotes: React.FC<RecentNotesProps> = ({ notes}) => {
  const iconColor = useThemeColor({}, 'icon');
  
  if (!notes || notes.length === 0) {
    return null;
  }
 
  const renderItem = ({ item }: { item: Note }) => (
    <View style={styles.card}>
      <Link href={`/note/${item.id}`} asChild>
        <Pressable style={styles.pressableContent}>
          <View style={styles.cardBackground}>
            <View style={styles.topHalf} />
            <View style={styles.bottomHalf} />
          </View>

          <View style={styles.contentContainer}>
            <PageFilledDarkIcon color={iconColor} size={24} />
            <ThemedText style={styles.title} numberOfLines={2}>
              {item.title}
            </ThemedText>
          </View>
        </Pressable>
      </Link>
    </View>
  );

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.subtitle}>Retornar</ThemedText>
      <FlatList
        data={notes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      /> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 2
  },
  subtitle: {
    color: '#838383',
    fontWeight: '500',
    fontSize: 14
  },
  listContent: {
    paddingVertical: 14,
    gap: 16
  },
  card: {
    width: 130,
    height: 130,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#393939',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  pressableContent: {
    width: '100%',
    height: '100%'
  },
  cardBackground: {
    ...StyleSheet.absoluteFillObject
  },
  topHalf: {
    height: '50%',
    backgroundColor: '#313131'
  },
  bottomHalf: {
    height: '50%',
    backgroundColor: '#252525'
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 12
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center'
  },
});

export default RecentNotes;
