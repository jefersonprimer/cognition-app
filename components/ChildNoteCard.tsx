import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Text, Alert } from 'react-native';
import { ThemedText } from './themed-text';
import { Note } from '../types/note';
import api from '@/lib/axios';

import { Link, useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

import { PageFilledDarkIcon } from './ui/PageFilledDarkIcon';
import { PageEmptyIcon } from './ui/PageEmptyIcon';
import { EllipsisIcon } from './ui/EllipsisIcon';
import { ArrowSquarePathUpDownIcon } from './ui/ArrowSquarePathUpDownIcon';
import { BlockColorIcon } from './ui/BlockColorIcon';
import { EmojiFaceIcon } from './ui/EmojiFaceIcon';
import { ArrowStraightDownIcon } from './ui/ArrowStraightDownIcon';
import { LinkIcon } from './ui/LinkIcon';
import { DuplicateIcon } from './ui/DuplicateIcon';
import { ArrowTurnUpRightIcon } from './ui/ArrowTurnUpRightIcon';
import { StarIcon } from './ui/StarIcon';
import { StarSlashIcon } from './ui/StarSlashIcon';
import { TrashIcon } from './ui/TrashIcon';

type ChildNoteCardProps = {
  item: Note;
};

const ChildNoteCard: React.FC<ChildNoteCardProps> = ({ item }) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(item.is_favorite);

  const handleToggleFavorite = async () => {
    try {
      const newIsFavorite = !isFavorite;
      setIsFavorite(newIsFavorite);
      await api.patch(`/notes/${item.id}/favorite`, { isFavorite: newIsFavorite });
    } catch (err) {
      console.error('Failed to toggle favorite', err);
      setIsFavorite(!isFavorite);
      Alert.alert('Error', 'Failed to update favorite status.');
    }
  };

  const handleDelete = () => {
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
              await api.delete(`/notes/${item.id}`);
              Alert.alert('Sucesso', 'Nota movida para a lixeira.');
              setModalVisible(false);
              router.back();
            } catch (err: any) {
              Alert.alert('Erro', err.response?.data?.message || 'Não foi possível mover a nota.');
            }
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    noteItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      gap: 10,
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
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end' 
    },
    modalContent: {
      backgroundColor: '#202020',
      padding: 20,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    modalButton: {
      padding: 15,
      alignItems: 'flex-start',
    },
    modalButtonText: {
      fontSize: 18,
    },
  });

  return (
    <>
      <View style={styles.noteItem}>
        <Link href={`/note/${item.id}`} style={styles.noteHead}>
          <View style={styles.noteHeadContent}>
            {item.title && item.description ? <PageFilledDarkIcon color={Colors[colorScheme ?? 'light'].icon} size={20} /> : <PageEmptyIcon color={Colors[colorScheme ?? 'light'].icon} size={20} />}
            <ThemedText type="defaultSemiBold" style={{ textDecorationLine: 'underline' }}>
              {item.title}
            </ThemedText>
          </View>
        </Link>
        <View style={styles.noteTail}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <EllipsisIcon color={Colors[colorScheme ?? 'light'].icon} size={20}/>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPressOut={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            
            <View style={{ alignSelf: 'center', borderWidth: 0.3, backgroundColor: '#3D3D3D', width: 40, height: 6, marginBottom: 10, borderRadius: 8 }}/>
            
            <View>
              <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text, alignSelf: 'center', marginLeft: 10 }]}>Ações</Text>
            </View>

            <View>
              <Text style={{ color: Colors[colorScheme ?? 'light'].text, marginLeft: 10, color: '#838383',fontWeight: '500',fontSize: 14,paddingVertical: 10}}>Página</Text>
              
              <View style={{ flexDirection: 'column', backgroundColor: '#252525', borderRadius: 10, marginBottom: 20, }}>
                <TouchableOpacity style={styles.modalButton} >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>                    
                    <ArrowSquarePathUpDownIcon color={Colors[colorScheme ?? 'light'].text} size={20} />
                    <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text, marginLeft: 10 }]}>Transformar em</Text>
                  </View>
                </TouchableOpacity>

                <View style={{ borderWidth: 0.3, borderColor: '#8D8D8D' }}/>

                <TouchableOpacity style={styles.modalButton} >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <BlockColorIcon color={Colors[colorScheme ?? 'light'].text} size={20} />
                    <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text, marginLeft: 10 }]}>Cor</Text>
                  </View>
                </TouchableOpacity>

                <View style={{ borderWidth: 0.3, borderColor: '#8D8D8D' }}/>

                <TouchableOpacity style={styles.modalButton} >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <EmojiFaceIcon color={Colors[colorScheme ?? 'light'].text} size={20}  />
                    <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text, marginLeft: 10 }]}>Editar icone</Text>
                  </View>
                </TouchableOpacity>

                <View style={{ borderWidth: 0.3, borderColor: '#8D8D8D' }}/>

                <TouchableOpacity style={styles.modalButton} >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ArrowStraightDownIcon  color={Colors[colorScheme ?? 'light'].text} size={20} />
                    <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text, marginLeft: 10 }]}>Inserir abaixo</Text>
                  </View>
                </TouchableOpacity>

                <View style={{ borderWidth: 0.3, borderColor: '#8D8D8D' }}/>

                <TouchableOpacity style={styles.modalButton} onPress={handleToggleFavorite}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {isFavorite ? <StarSlashIcon color={Colors[colorScheme ?? 'light'].text} size={20} /> : <StarIcon color={Colors[colorScheme ?? 'light'].text} size={20} />}
                    <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text, marginLeft: 10 }]}>
                      {isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              
              <View style={{ flexDirection: 'column', backgroundColor: '#252525', borderRadius: 10 }}>
                <TouchableOpacity style={styles.modalButton} onPress={handleDelete}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <LinkIcon color={Colors[colorScheme ?? 'light'].text} size={20} />
                    <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text, marginLeft: 10 }]}>Copiar Link</Text>
                  </View>
                </TouchableOpacity>

                <View style={{ borderWidth: 0.3, borderColor: '#8D8D8D' }}/>

                <TouchableOpacity style={styles.modalButton} onPress={handleDelete}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <DuplicateIcon color={Colors[colorScheme ?? 'light'].text} size={20} />
                    <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text, marginLeft: 10 }]}>Duplicar</Text>
                  </View>
                </TouchableOpacity>

                <View style={{ borderWidth: 0.3, borderColor: '#8D8D8D' }}/>

                <TouchableOpacity style={styles.modalButton} onPress={handleDelete}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ArrowTurnUpRightIcon color={Colors[colorScheme ?? 'light'].text} size={20} />
                    <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text, marginLeft: 10 }]}>Mover para</Text>
                  </View>
                </TouchableOpacity>

                <View style={{ borderWidth: 0.3, borderColor: '#8D8D8D' }}/>

                <TouchableOpacity style={styles.modalButton} onPress={handleDelete}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TrashIcon color='#D4524E' size={20} />
                    <Text style={[styles.modalButtonText, { color: '#D4524E', marginLeft: 10 }]}>Excluir</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default ChildNoteCard;
