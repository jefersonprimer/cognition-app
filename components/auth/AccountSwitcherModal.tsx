import React, { forwardRef, useMemo, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useAuth } from '@/context/AuthProvider';
import { useTheme } from '@react-navigation/native';
import { SavedAccount } from '@/types/user';
import { Feather } from '@expo/vector-icons';

import { EllipsisIcon } from '@/components/ui/EllipsisIcon';
import { ThinCheckIcon } from '@/components/ui/ThinCheckIcon';
import { PlusSmallIcon } from '@/components/ui/PlusSmallIcon';
import { ArrowChevronSingleRightSmallIcon } from '@/components/ui/ArrowChevronSingleRightSmallIcon';
import { XMarkCircleIcon } from '@/components/ui/XMarkCircleIcon';

interface AccountSwitcherModalProps {
  onClose: () => void;
}

const AccountListItem = ({ item, onSwitch, isSelected, onLogout }: { item: SavedAccount, onSwitch: () => void, isSelected: boolean, onLogout: () => void }) => {
  const { colors } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const ellipsisRef = useRef<TouchableOpacity>(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, right: 0 });

  const openMenu = () => {
    ellipsisRef.current?.measure((fx, fy, width, height, px, py) => {
      setModalPosition({ top: py - 10, right: 20 });
      setMenuVisible(true);
    });
  };

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
        <Text style={[styles.email, { color: colors.text }]}>{item.email}</Text>
        <TouchableOpacity ref={ellipsisRef} onPress={openMenu}>
          <EllipsisIcon color='#898989' size={20}/>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onSwitch} style={[styles.itemContainer, { padding: 10,borderWidth: 1, borderColor: colors.border, borderTop: 1, borderBottom: 1, borderTopLeftRadius: 10, borderTopRightRadius: 10 }]}>
        <View style={[styles.avatar, { justifyContent: 'center', alignItems: 'center',width: 30,height: 30,backgroundColor: '#404040',borderRadius: 4,}]}>
          <Text style={{ color: 'white',color: 'rgb(168, 164, 156)', fontSize: 20, fontWeight: '500', textTransform: 'uppercase'}}>n</Text>
        </View>
        <View style={styles.accountInfo}>
          <Text style={[styles.email, { color: colors.text }]}>{item.displayName}</Text>
          <Text style={[styles.displayName, { color: colors.text, opacity: 0.65 }]}>Plano free</Text>
        </View>
        <View style={styles.removeButton}>
          {isSelected && <ThinCheckIcon color='#898989' size={20}/>}
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={{ padding: 10, borderWidth: 1, borderColor: colors.border, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, borderTopWidth: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10 }}>  
          <PlusSmallIcon color='#898989' size={16} withBorder/>
          <Text style={{ color: colors.text, fontSize: 16 }}>Novo espaço de trabalho</Text>        
        </View>
      </TouchableOpacity>

      <Modal
        transparent
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity style={{ flex: 1 }} onPress={() => setMenuVisible(false)}>
          <View style={[styles.menuModalContent, { top: modalPosition.top, right: modalPosition.right }]}>
            <TouchableOpacity onPress={() => { setMenuVisible(false); onLogout(); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <XMarkCircleIcon color='#D4524E' size={22}/>
              <Text style={{ color: '#D4524E', fontSize: 16 }}>Fazer logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export const AccountSwitcherModal = forwardRef<BottomSheet, AccountSwitcherModalProps>(({ onClose }, ref) => {
  const { session, savedAccounts, switchAccount, removeAccount, signOut } = useAuth();
  const { colors } = useTheme();
  const snapPoints = useMemo(() => ['30%', '60%', '90%'], []);

  const handleSwitch = async (accountId: string) => {
    try {
      await switchAccount(accountId);
      onClose();
    } catch (error) {
      console.error("Failed to switch account", error);
    }
  };

  const handleAddNew = () => {
    onClose();
    signOut();
  };

  const handleLogout = () => {
    onClose();
    signOut();
  };

  const handleLogoutOfAccount = (item: SavedAccount) => {
    if (item.id === session?.user?.id) {
      signOut();
    } else {
      removeAccount(item.id);
    }
    onClose();
  };

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backgroundStyle={{ backgroundColor: '#202020' }}
      handleIndicatorStyle={{ backgroundColor: colors.border }}
    >
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: colors.text }]}>Contas</Text>
        
        <BottomSheetFlatList
          data={savedAccounts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AccountListItem 
              item={item} 
              onSwitch={() => handleSwitch(item.id)} 
              isSelected={item.id === session?.user?.id}
              onLogout={() => handleLogoutOfAccount(item)}
            />
          )}
          contentContainerStyle={styles.listContentContainer}
        />
          <View style={{ flexDirection: 'column', marginVertical: 20, }}>
            <TouchableOpacity style={[styles.actionButton, styles.addAccountButton, { borderColor: colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]} onPress={handleAddNew}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <PlusSmallIcon color='#898989' size={16} withBorder/>
                <Text style={[styles.actionButtonText, { color: '#D3D3D3' }]}>Adicionar uma conta</Text>
              </View>
              <ArrowChevronSingleRightSmallIcon color='#898989' size={20} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, styles.logoutButton, { borderColor: colors.border, marginTop: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }]} onPress={handleLogout}>
              <XMarkCircleIcon color='#D4524E' size={22}/>
              <Text style={[styles.actionButtonText, { color: colors.notification }]}>Fazer logout</Text>
            </TouchableOpacity>
          </View>
        </View>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  accountInfo: {
    flex: 1,
  },
  email: {
    fontSize: 16,
    fontWeight: '500',
  },
  displayName: {
    fontSize: 14,
  },
  removeButton: {
    padding: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15
  },
  addAccountButton: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottom: 1,
    borderWidth: 1
  },
  logoutButton: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1 
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  footerButton: {
    padding: 15,
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 16,
  },
  menuModalContent: {
    position: 'absolute',
    backgroundColor: '#373C3F',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    gap: 15,
    width: 300,
    borderRadius: 10,
  }
});
