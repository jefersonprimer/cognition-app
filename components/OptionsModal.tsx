
import React from 'react';
import { View, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './themed-text';

type OptionsModalProps = {
  visible: boolean;
  onClose: () => void;
  onOrderByPress: () => void;
  onDisplayPress: () => void;
  notesToShow: number;
  orderBy: 'manual' | 'lastEdition';
};

const OptionsModal: React.FC<OptionsModalProps> = ({ visible, onClose, onOrderByPress, onDisplayPress, notesToShow, orderBy }) => {
  const getOrderByDisplayText = (orderBy: 'manual' | 'lastEdition') => {
    return orderBy === 'manual' ? 'Manual' : 'Last edition';
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPressOut={onClose}
      >
        <View style={styles.modalView}>
          <ThemedText type="subtitle" style={{paddingBottom: 20}}>Display options</ThemedText>
          <TouchableOpacity style={styles.option} onPress={onOrderByPress}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
              <ThemedText>Order by</ThemedText>
              <ThemedText>{getOrderByDisplayText(orderBy)}</ThemedText>
            </View>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.option} onPress={onDisplayPress}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
              <ThemedText>Display</ThemedText>
              <ThemedText>{notesToShow === Infinity ? 'All' : notesToShow}</ThemedText>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  option: {
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#E5E5E5',
  },
});

export default OptionsModal;
