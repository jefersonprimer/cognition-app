import { View, Button, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Note } from '@/types/note';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

import { PageFilledDarkIcon } from './ui/PageFilledDarkIcon';
import { PageEmptyIcon } from './ui/PageEmptyIcon';
import { ArrowUTurnUpLeftIcon } from './ui/ArrowUTurnUpLeftIcon';
import { TrashIcon } from './ui/TrashIcon';

type TrashNoteCardProps = {
  item: Note;
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string) => void;
};

export default function TrashNoteCard({ item, onRestore, onPermanentDelete }: TrashNoteCardProps) {
  const colorScheme = useColorScheme();

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#252525', padding: 10, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#353535' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1, marginRight: 30 }}>
        {item.title && item.description ? <PageFilledDarkIcon color={Colors[colorScheme ?? 'light'].icon} size={20} /> : <PageEmptyIcon color={Colors[colorScheme ?? 'light'].icon} size={20} />}
          <ThemedText type="subtitle" numberOfLines={1} style={{ fontSize: 16, fontWeight: 500 }}>{item.title}</ThemedText>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <TouchableOpacity onPress={() => onRestore(item.id)} >
          <ArrowUTurnUpLeftIcon color={Colors[colorScheme ?? 'light'].icon} size={20}/>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => onPermanentDelete(item.id)} >
          <TrashIcon color={Colors[colorScheme ?? 'light'].icon} size={20}/>
        </TouchableOpacity>
      </View>
    </View>
  );
}
