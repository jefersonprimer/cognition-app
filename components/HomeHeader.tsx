import { useRef, useState } from 'react';
import { View, TouchableOpacity, Modal, StyleSheet, Image, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthProvider';
import { ThemedText } from './themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

import { ArrowChevronSingleDownIcon } from '@/components/ui/ArrowChevronSingleDownIcon';
import { EllipsisIcon } from '@/components/ui/EllipsisIcon';
import { TrashIcon } from '@/components/ui/TrashIcon';
import { SettingsIcon } from '@/components/ui/SettingsIcon';
import { PeopleIcon } from '@/components/ui/PeopleIcon';
import { SacIcon } from '@/components/ui/SacIcon';
import { ArrowInCircleUpFillIcon } from '@/components/ui/ArrowInCircleUpFillIcon';

interface HomeHeaderProps {
  onOpenAccountSwitcher: () => void;
}

export default function HomeHeader({ onOpenAccountSwitcher }: HomeHeaderProps) {
  const { session } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [menuModalPosition, setMenuModalPosition] = useState({ top: 0, right: 0 });
  const ellipsisIconRef = useRef<TouchableOpacity>(null);

  const handleNavigate = (path: string) => {
    setMenuModalVisible(false);
    router.push(path as any);
  };

  const openMenuModal = () => {
    ellipsisIconRef.current?.measure((fx, fy, width, height, px, py) => {
      setMenuModalPosition({ top: py, right: 20 });
      setMenuModalVisible(true);
    });
  };

  const styles = StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 0,
      backgroundColor: Colors[colorScheme ?? 'light'].background,
    },
    headerUserMenu: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 15,
    },
    logo: {
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#404040',
      borderRadius: 4,
    },
    logoText: {
      color: 'rgb(168, 164, 156)',
      fontWeight: '500',
      textTransform: 'uppercase',
    },
    emailText: {
      fontWeight: 'bold',
    },
    menuModalOverlay: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    menuModalContent: {
      position: 'absolute',
      alignItems: 'flex-start',
      backgroundColor: '#252525',
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
    }
  });

  return (
    <SafeAreaView style={{ backgroundColor: Colors[colorScheme ?? 'light'].background }}>
      <View style={styles.headerContainer}>
        <View style={styles.headerUserMenu}>
          <Pressable style={styles.logo}>
            <Text style={styles.logoText}>c</Text>
          </Pressable>

          <TouchableOpacity onPress={onOpenAccountSwitcher} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <ThemedText style={styles.emailText}>Notion de {session?.user?.displayName || session?.user?.email}</ThemedText>
            <ArrowChevronSingleDownIcon color={Colors[colorScheme ?? 'light'].icon} size={20}/>
          </TouchableOpacity>
        </View>
  
        <View style={{ zIndex: 1 }}>
          <TouchableOpacity ref={ellipsisIconRef} onPress={openMenuModal}>
            <EllipsisIcon color={Colors[colorScheme ?? 'light'].icon} size={20}/>
          </TouchableOpacity>
                
          <Modal
            animationType="fade"
            transparent={true}
            visible={menuModalVisible}
            onRequestClose={() => setMenuModalVisible(false)}
          >
            <TouchableOpacity style={styles.menuModalOverlay} activeOpacity={1} onPressOut={() => setMenuModalVisible(false)}>
              <View style={[styles.menuModalContent, { top: menuModalPosition.top, right: menuModalPosition.right }]}>
                <TouchableOpacity onPress={() => handleNavigate('#')}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                    <ArrowInCircleUpFillIcon color='#2383E2' size={20}/>
                    <ThemedText>Fazer upgrade do plano</ThemedText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNavigate('#')}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                    <PeopleIcon color={Colors[colorScheme ?? 'light'].text} size={20}/>
                    <ThemedText>Membros</ThemedText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNavigate('/settings')}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                    <SettingsIcon color={Colors[colorScheme ?? 'light'].text} size={20}/>
                    <ThemedText>Configurações</ThemedText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNavigate('/trash')}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                    <TrashIcon color={Colors[colorScheme ?? 'light'].text} size={20}/>
                    <ThemedText>Lixeira</ThemedText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNavigate('#')}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                    <SacIcon color={Colors[colorScheme ?? 'light'].text} size={20}/>
                    <ThemedText>Ajuda e suporte</ThemedText>
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      </View>
    </SafeAreaView>
  );
}
