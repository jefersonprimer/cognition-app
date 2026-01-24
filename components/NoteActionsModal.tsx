
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, Switch } from 'react-native';
import { ThemedText } from './themed-text';
import { Note } from '../types/note';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

import { StarIcon } from '@/components/ui/StarIcon';
import { StarSlashIcon } from '@/components/ui/StarSlashIcon';
import { ArrowTurnUpRightIcon } from '@/components/ui/ArrowTurnUpRightIcon';
import { ArrowChevronSingleRightSmallIcon } from '@/components/ui/ArrowChevronSingleRightSmallIcon';
import { PageFilledDarkIcon } from '@/components/ui/PageFilledDarkIcon';
import { PageEmptyIcon } from './ui/PageEmptyIcon';
import { LinkIcon } from './ui/LinkIcon';
import { TrashIcon } from './ui/TrashIcon';
import { DuplicateIcon } from './ui/DuplicateIcon';

type NoteActionsModalProps = {
  isVisible: boolean;
  onClose: () => void;
  note: Note | null;
  parentNote?: Note | null;
  variant: 'all-notes' | 'favorites';
  onToggleFavorite: () => void;
  onDuplicate?: () => void;
  onMoveToTrash?: () => void;
  onMakeOffline?: (isOffline: boolean) => void;
  onCopyLink?: () => void;
  onMoveTo?: () => void;
};

const NoteActionsModal: React.FC<NoteActionsModalProps> = ({
  isVisible,
  onClose,
  note,
  parentNote,
  variant,
  onToggleFavorite,
  onDuplicate,
  onMoveToTrash,
  onMakeOffline,
  onCopyLink,
  onMoveTo,
}) => {
  const colorScheme = useColorScheme();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (note) {
      setIsOffline(note.is_offline || false);
    }
  }, [note]);

  if (!note) {
    return null;
  }

  const handleOfflineSwitch = (value: boolean) => {
    setIsOffline(value);
    if (onMakeOffline) {
      onMakeOffline(value);
    }
  };

  const iconColor = Colors[colorScheme ?? 'light'].icon;
  const textColor = '#D4D4D4';

  const renderAllNotesActions = () => (
    <>
      <View style={{ backgroundColor: '#252525', borderRadius: 10, marginVertical: 10, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15, paddingVertical: 15 }}>
            <ArrowTurnUpRightIcon color={iconColor} size={20} />
            <Text style={[styles.modalButtonText, { color: textColor }]}>Disponível offline</Text>
        </View>
        <Switch
            value={isOffline}
            onValueChange={handleOfflineSwitch}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isOffline ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>

      <View style={{ flexDirection: 'column', backgroundColor: '#252525', borderRadius: 10 }}>
        <TouchableOpacity style={styles.modalButton} onPress={onCopyLink}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
            <LinkIcon color={iconColor} size={20} />
            <Text style={[styles.modalButtonText, { color: textColor }]}>Copiar Link</Text>
          </View>
        </TouchableOpacity>
        <View style={{ borderWidth: 0.3, borderColor: '#8D8D8D' }}/>

        <TouchableOpacity style={styles.modalButton} onPress={onToggleFavorite}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
            {note.is_favorite ? <StarSlashIcon color={iconColor} size={20} /> : <StarIcon color={iconColor} size={20} />}
            <Text style={[styles.modalButtonText, { color: textColor }]}>
              {note.is_favorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={{ borderWidth: 0.3, borderColor: '#8D8D8D' }}/>

        <TouchableOpacity style={styles.modalButton} onPress={onDuplicate}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
            <DuplicateIcon color={iconColor}  size={20} />
            <Text style={[styles.modalButtonText, { color: textColor }]}>Duplicar</Text>
          </View>
        </TouchableOpacity>
        <View style={{ borderWidth: 0.3, borderColor: '#8D8D8D' }}/>

        <TouchableOpacity style={styles.modalButton} onPress={onMoveTo}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
              <ArrowTurnUpRightIcon color={iconColor} size={20} />
              <Text style={[styles.modalButtonText, { color: textColor }]}>Mover para</Text>
            </View>
            <ArrowChevronSingleRightSmallIcon color={Colors[colorScheme ?? 'light'].text} size={20} />
          </View>
        </TouchableOpacity>

        <View style={{ borderWidth: 0.3, borderColor: '#8D8D8D' }}/>

        <TouchableOpacity style={styles.modalButton} onPress={onMoveToTrash}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
            <TrashIcon color={'#DC5353'} size={20} />
            <Text style={[styles.modalButtonText, { color: '#DC5353' }]}>Excluir</Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderFavoritesActions = () => (
    <>
      <View style={{ backgroundColor: '#252525', borderRadius: 10, marginVertical: 10, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15, paddingVertical: 15 }}>
            <ArrowTurnUpRightIcon color={iconColor} size={20} />
            <Text style={[styles.modalButtonText, { color: textColor }]}>Disponível offline</Text>
        </View>
        <Switch
            value={isOffline}
            onValueChange={handleOfflineSwitch}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isOffline ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>

      <View style={{ flexDirection: 'column', backgroundColor: '#252525', borderRadius: 10 }}>
        <TouchableOpacity style={styles.modalButton} onPress={onCopyLink}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
            <LinkIcon color={iconColor} size={20} />
            <Text style={[styles.modalButtonText, { color: textColor }]}>Copiar Link</Text>
          </View>
        </TouchableOpacity>
        <View style={{ borderWidth: 0.3, borderColor: '#8D8D8D' }}/>

        <TouchableOpacity style={styles.modalButton} onPress={onToggleFavorite}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
            {note.is_favorite ? <StarSlashIcon color={iconColor} size={20} /> : <StarIcon color={iconColor} size={20} />}
            <Text style={[styles.modalButtonText, { color: textColor }]}>
              {note.is_favorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={{ borderWidth: 0.3, borderColor: '#8D8D8D' }}/>

        <TouchableOpacity style={styles.modalButton} onPress={onMoveTo}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
              <ArrowTurnUpRightIcon color={iconColor} size={20} />
              <Text style={[styles.modalButtonText, { color: textColor }]}>Mover para</Text>
            </View>
            <ArrowChevronSingleRightSmallIcon color={Colors[colorScheme ?? 'light'].text} size={20} />
          </View>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPressOut={onClose}>
        <View style={styles.modalContent}>
          <View style={{ alignSelf: 'center', borderWidth: 0.3, backgroundColor: '#3D3D3D', width: 40, height: 6, marginBottom: 10, borderRadius: 8 }}/>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ backgroundColor: '#2C2C2C', borderRadius: 5, padding: 5 }}>
              {note.title || note.description ? <PageFilledDarkIcon color={iconColor} size={24} /> : <PageEmptyIcon color={iconColor} size={24} />}
            </View>
            <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <ThemedText style={styles.modalTitle}>{note.title || 'Sem Título'}</ThemedText>
              <ThemedText style={styles.modalSubtitle}>{parentNote ? `em ${parentNote.title}` : 'em Particular'}</ThemedText>
            </View>
          </View>

          {variant === 'favorites' ? renderFavoritesActions() : renderAllNotesActions()}

        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#202020',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '500'
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: '400'
  },
  modalButton: {
    padding: 15,
  },
  modalButtonText: {
    fontSize: 16,
  }
});

export default NoteActionsModal;
