import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Share, Platform } from 'react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Lock, Link2, ChevronDown, Send } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { createNoteSlug } from '@/lib/utils';

interface ShareModalProps {
  noteId: string;
  noteTitle: string;
  onClose: () => void;
}

const ShareModal = React.forwardRef<BottomSheetModal, ShareModalProps>(
  ({ noteId, noteTitle, onClose }, ref) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [activeTab, setActiveTab] = useState<'share' | 'publish'>('share');
    const [email, setEmail] = useState('');

    const snapPoints = useMemo(() => ['65%'], []);

    const handleCopyLink = async () => {
      const slug = createNoteSlug(noteTitle, noteId);
      const url = `http://localhost:3000/${slug}`;
      await Clipboard.setStringAsync(url);
      
      // Native Share as well
      try {
        await Share.share({
          message: url,
          url: url,
        });
      } catch (error) {
        console.log(error);
      }
    };

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        onDismiss={onClose}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: isDark ? '#1f1f1f' : '#fff' }}
        handleIndicatorStyle={{ backgroundColor: isDark ? '#3d3d3d' : '#ccc' }}
      >
        <BottomSheetView style={styles.contentContainer}>
          {/* Tabs */}
          <View style={[styles.tabsContainer, { borderBottomColor: isDark ? '#2a2a2a' : '#eee' }]}>
            <TouchableOpacity
              onPress={() => setActiveTab('share')}
              style={[styles.tab, activeTab === 'share' && styles.activeTab]}
            >
              <Text style={[styles.tabText, { color: activeTab === 'share' ? (isDark ? '#fff' : '#000') : '#8a8a8a' }]}>
                Share
              </Text>
              {activeTab === 'share' && <View style={[styles.activeIndicator, { backgroundColor: isDark ? '#fff' : '#000' }]} />}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('publish')}
              style={[styles.tab, activeTab === 'publish' && styles.activeTab]}
            >
              <Text style={[styles.tabText, { color: activeTab === 'publish' ? (isDark ? '#fff' : '#000') : '#8a8a8a' }]}>
                Publish
              </Text>
              {activeTab === 'publish' && <View style={[styles.activeIndicator, { backgroundColor: isDark ? '#fff' : '#000' }]} />}
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.body}>
            {/* Invite Input */}
            <View style={styles.inviteContainer}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email or group, separated by commas"
                placeholderTextColor="#8a8a8a"
                style={[styles.input, { 
                  backgroundColor: isDark ? '#1f1f1f' : '#f9f9f9',
                  borderColor: isDark ? '#3a3a3a' : '#ddd',
                  color: isDark ? '#d4d4d4' : '#000'
                }]}
              />
              <TouchableOpacity style={styles.inviteButton}>
                <Text style={styles.inviteButtonText}>Invite</Text>
              </TouchableOpacity>
            </View>

            {/* User Row */}
            <View style={[styles.userRow, { backgroundColor: isDark ? 'transparent' : '#f5f5f5' }]}>
              <View style={styles.userInfo}>
                <View style={[styles.avatar, { backgroundColor: isDark ? '#333' : '#ddd' }]}>
                  <Text style={{ color: isDark ? '#cfcfcf' : '#666' }}>J</Text>
                </View>
                <View>
                  <Text style={[styles.userName, { color: isDark ? '#e4e4e4' : '#000' }]}>
                    Jeferson Primer <Text style={{ color: '#8a8a8a' }}>(You)</Text>
                  </Text>
                  <Text style={styles.userEmail}>jefersonprimer@gmail.com</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.accessButton}>
                <Text style={{ color: '#bdbdbd' }}>Full access</Text>
                <ChevronDown size={14} color="#bdbdbd" />
              </TouchableOpacity>
            </View>

            {/* General Access */}
            <View style={styles.generalAccessContainer}>
              <Text style={styles.sectionTitle}>General access</Text>
              <TouchableOpacity style={[styles.accessRow, { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }]}>
                <View style={styles.accessInfo}>
                  <View style={[styles.iconContainer, { backgroundColor: isDark ? '#333' : '#ddd' }]}>
                    <Lock size={16} color="#bdbdbd" />
                  </View>
                  <Text style={{ color: isDark ? '#d4d4d4' : '#000' }}>Only people invited</Text>
                </View>
                <ChevronDown size={14} color="#bdbdbd" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom */}
          <View style={[styles.footer, { borderTopColor: isDark ? '#2a2a2a' : '#eee' }]}>
            <TouchableOpacity>
              <Text style={{ color: '#8a8a8a' }}>Learn about sharing</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleCopyLink}
              style={[styles.copyButton, { 
                backgroundColor: isDark ? '#262626' : '#f0f0f0',
                borderColor: isDark ? '#3a3a3a' : '#ddd'
              }]}
            >
              <Link2 size={16} color={isDark ? '#d4d4d4' : '#000'} />
              <Text style={{ color: isDark ? '#d4d4d4' : '#000', marginLeft: 8 }}>Copy link</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingTop: 10,
  },
  tab: {
    marginRight: 24,
    paddingBottom: 12,
    position: 'relative',
  },
  activeTab: {},
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 1,
  },
  body: {
    paddingVertical: 20,
    gap: 20,
  },
  inviteContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  inviteButton: {
    backgroundColor: '#4c8bf5',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
  },
  inviteButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 14,
  },
  userEmail: {
    fontSize: 12,
    color: '#8a8a8a',
  },
  accessButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  generalAccessContainer: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#8a8a8a',
  },
  accessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
  },
  accessInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    marginTop: 'auto',
    marginBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
});

export default ShareModal;
