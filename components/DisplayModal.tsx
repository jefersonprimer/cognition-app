
import React from 'react';
import { View, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './themed-text';

type DisplayModalProps = {
  visible: boolean;
  onClose: () => void;
  onDisplayChange: (value: number) => void;
  totalNotes: number;
};

const DisplayModal: React.FC<DisplayModalProps> = ({ visible, onClose, onDisplayChange, totalNotes }) => {
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
          <ThemedText type="subtitle" style={{paddingBottom: 20}}>Display</ThemedText>
          <TouchableOpacity style={styles.option} onPress={() => onDisplayChange(5)}>
            <ThemedText>5</ThemedText>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.option} onPress={() => onDisplayChange(10)}>
            <ThemedText>10</ThemedText>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.option} onPress={() => onDisplayChange(15)}>
            <ThemedText>15</ThemedText>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.option} onPress={() => onDisplayChange(20)}>
            <ThemedText>20</ThemedText>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.option} onPress={() => onDisplayChange(Infinity)}>
            <ThemedText>All</ThemedText>
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

export default DisplayModal;
