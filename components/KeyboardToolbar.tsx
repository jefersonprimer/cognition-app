import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Animated,
  Keyboard,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  Pressable,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Code, 
  Sigma 
} from 'lucide-react-native';

import { TextFormatIcon } from "./ui/TextFormatIcon";
import { PhotoFillIcon } from "./ui/PhotoFillIcon";
import { ThinCheckIcon } from "./ui/ThinCheckIcon";
import { LinkIcon } from "./ui/LinkIcon";
import { EmojiFaceIcon } from "./ui/EmojiFaceIcon";
import { PlusSmallIcon } from "./ui/PlusSmallIcon";
import { CommentFilledFillIcon } from "./ui/CommentFilledFillIcon";
import { TextTranslaterIcon } from "./ui/TextTranslaterIcon";
import { SquareGrid2X2Icon } from "./ui/SquareGrid2X2Icon";
import { SlidersIcon } from "./ui/SlidersIcon";
import { ClockIcon } from "./ui/ClockIcon";
import { BellIcon } from "./ui/BellIcon";
import { PeopleIcon } from "./ui/PeopleIcon";
import { TrashIcon } from "./ui/TrashIcon";
import { ArrowTurnUpRightIcon } from "./ui/ArrowTurnUpRightIcon";
import { AngleLeftIcon } from "./ui/AngleLeftIcon";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  onAction?: (action: string) => void;
  activeStyles?: Record<string, boolean>;
}

export default function KeyboardToolbar({ onAction, activeStyles = {} }: Props) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const bottom = useRef(new Animated.Value(-100)).current; // Start off-screen
  const [visible, setVisible] = useState(false);
  const [showFormatting, setShowFormatting] = useState(false);
  const [showTextStyles, setShowTextStyles] = useState(false);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setShowFormatting(false);
      setShowTextStyles(false);
      setVisible(true);
      Animated.timing(bottom, {
        toValue: Platform.OS === "ios" ? e.endCoordinates.height : 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      if (!showFormatting) {
        Animated.timing(bottom, {
          toValue: -100,
          duration: 250,
          useNativeDriver: false,
        }).start(() => setVisible(false));
      } else {
        Animated.timing(bottom, {
          toValue: insets.bottom,
          duration: 250,
          useNativeDriver: false,
        }).start();
      }
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [showFormatting, insets.bottom]);

  const handlePlusPress = () => {
    setShowTextStyles(false);
    if (showFormatting) {
      setShowFormatting(false);
      onAction?.('focus');
    } else {
      setShowFormatting(true);
      Keyboard.dismiss();
    }
  };

  const handleOutsidePress = () => {
    setShowFormatting(false);
    setShowTextStyles(false);
    onAction?.('focus');
  };

  if (!visible && !showFormatting) return null;

  const iconColor = Colors[colorScheme ?? 'light'].text;
  const iconSize = 22;

  const actions = [
    { id: 'plus', icon: <PlusSmallIcon color={showFormatting ? Colors.light.tint : iconColor} size={28} />, onPress: handlePlusPress },
    { id: 'text', icon: <TextFormatIcon color={iconColor} size={iconSize} />, onPress: () => setShowTextStyles(true) },
    { id: 'todo', icon: <ThinCheckIcon color={iconColor} size={iconSize} /> },
    { id: 'photo', icon: <PhotoFillIcon color={iconColor} size={iconSize} /> },
    { id: 'link', icon: <LinkIcon color={iconColor} size={iconSize} /> },
    { id: 'emoji', icon: <EmojiFaceIcon color={iconColor} size={iconSize} /> },
    { id: 'comment', icon: <CommentFilledFillIcon color={iconColor} size={iconSize} /> },
    { id: 'translate', icon: <TextTranslaterIcon color={iconColor} size={iconSize} /> },
    { id: 'move', icon: <ArrowTurnUpRightIcon color={iconColor} size={iconSize} /> },
    { id: 'people', icon: <PeopleIcon color={iconColor} size={iconSize} /> },
    { id: 'bell', icon: <BellIcon color={iconColor} size={iconSize} /> },
    { id: 'clock', icon: <ClockIcon color={iconColor} size={iconSize} /> },
    { id: 'sliders', icon: <SlidersIcon color={iconColor} size={iconSize} /> },
    { id: 'grid', icon: <SquareGrid2X2Icon color={iconColor} size={iconSize} /> },
    { id: 'trash', icon: <TrashIcon color="#D4524E" size={iconSize} /> },
  ];

  const textStyleActions = [
    { id: 'back', icon: <AngleLeftIcon color={iconColor} size={iconSize} />, onPress: () => setShowTextStyles(false) },
    { id: 'bold', icon: <Bold color={activeStyles.bold ? Colors.light.tint : iconColor} size={iconSize} />, onPress: () => onAction?.('bold') },
    { id: 'italic', icon: <Italic color={activeStyles.italic ? Colors.light.tint : iconColor} size={iconSize} />, onPress: () => onAction?.('italic') },
    { id: 'underline', icon: <Underline color={activeStyles.underline ? Colors.light.tint : iconColor} size={iconSize} />, onPress: () => onAction?.('underline') },
    { id: 'strikethrough', icon: <Strikethrough color={activeStyles.strikethrough ? Colors.light.tint : iconColor} size={iconSize} />, onPress: () => onAction?.('strikethrough') },
    { id: 'link', icon: <LinkIcon color={iconColor} size={iconSize} />, onPress: () => onAction?.('link') },
    { id: 'code', icon: <Code color={activeStyles.code ? Colors.light.tint : iconColor} size={iconSize} />, onPress: () => onAction?.('code') },
    { id: 'math', icon: <Sigma color={activeStyles.math ? Colors.light.tint : iconColor} size={iconSize} />, onPress: () => onAction?.('math') },
  ];

  const formattingOptions = [
    { id: 'format-text', label: 'Texto', description: 'Comece a escrever com texto simples.', icon: <TextFormatIcon color={iconColor} size={24} /> },
    { id: 'format-h1', label: 'Título 1', description: 'Título de seção grande.', icon: <TextFormatIcon color={iconColor} size={30} /> },
    { id: 'format-h2', label: 'Título 2', description: 'Título de seção médio.', icon: <TextFormatIcon color={iconColor} size={26} /> },
    { id: 'format-h3', label: 'Título 3', description: 'Título de seção pequeno.', icon: <TextFormatIcon color={iconColor} size={22} /> },
    { id: 'format-bullet', label: 'Lista com marcadores', description: 'Crie uma lista com marcadores simples.', icon: <Ionicons name="list" color={iconColor} size={24} /> },
    { id: 'format-number', label: 'Lista numerada', description: 'Crie uma lista com numeração.', icon: <Ionicons name="list-outline" color={iconColor} size={24} /> },
    { id: 'format-todo', label: 'Lista de tarefas', description: 'Monitore tarefas com uma lista de tarefas.', icon: <Ionicons name="checkbox-outline" color={iconColor} size={24} /> },
    { id: 'format-toggle', label: 'Lista de alternantes', description: 'Alterne para ocultar ou mostrar conteúdo.', icon: <Ionicons name="chevron-forward-circle-outline" color={iconColor} size={24} /> },
  ];

  return (
    <>
      {showFormatting && (
        <Pressable 
          style={styles.backdrop} 
          onPress={handleOutsidePress}
        />
      )}
      <Animated.View
        style={[
          styles.container,
          {
            bottom: bottom,
            backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#ffffff',
            borderColor: colorScheme === 'dark' ? '#2c2c2e' : '#e0e0e0',
          },
          showFormatting && styles.expandedContainer
        ]}
      >
        <ScrollView 
          horizontal={!showFormatting}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={showFormatting ? styles.expandedScrollContent : styles.scrollContent}
          keyboardShouldPersistTaps="always"
        >
          {showFormatting ? (
            <View style={styles.formattingMenu}>
               <View style={styles.menuHeader}>
                <TouchableOpacity onPress={handlePlusPress} style={styles.plusButtonActive}>
                  <PlusSmallIcon color={Colors.light.tint} size={28} />
                </TouchableOpacity>
                <Text style={[styles.menuTitle, { color: iconColor }]}>Básico</Text>
              </View>
              {formattingOptions.map((option) => (
                <TouchableOpacity 
                  key={option.id} 
                  style={styles.formatOption}
                  onPress={() => {
                    onAction?.(option.id);
                    setShowFormatting(false);
                    onAction?.('focus');
                  }}
                >
                  <View style={[styles.optionIconContainer, { backgroundColor: colorScheme === 'dark' ? '#2c2c2e' : '#f0f0f0' }]}>
                    {option.icon}
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text style={[styles.optionLabel, { color: iconColor }]}>{option.label}</Text>
                    <Text style={styles.optionDescription}>{option.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : showTextStyles ? (
            textStyleActions.map((action) => (
              <TouchableOpacity 
                key={action.id} 
                style={[
                  styles.actionButton,
                  activeStyles[action.id] && { backgroundColor: colorScheme === 'dark' ? '#3a3a3c' : '#f0f0f0' }
                ]}
                onPress={() => action.onPress ? action.onPress() : onAction?.(action.id)}
                activeOpacity={0.7}
              >
                {action.icon}
              </TouchableOpacity>
            ))
          ) : (
            actions.map((action) => (
              <TouchableOpacity 
                key={action.id} 
                style={styles.actionButton}
                onPress={() => action.onPress ? action.onPress() : onAction?.(action.id)}
                activeOpacity={0.7}
              >
                {action.icon}
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: 4,
    zIndex: 1000,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  expandedContainer: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingTop: 12,
  },
  scrollContent: {
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 4,
  },
  expandedScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  actionButton: {
    padding: 10,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  formattingMenu: {
    width: '100%',
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  plusButtonActive: {
    padding: 4,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  formatOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 16,
  },
  optionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  optionDescription: {
    fontSize: 13,
    color: '#8e8e93',
    marginTop: 2,
  },
});
