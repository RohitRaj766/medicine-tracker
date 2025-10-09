import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Modal as RNModal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ModalProps } from '../../types'
import theme from '../../styles/theme'

interface CustomModalProps extends ModalProps {
  animationType?: 'none' | 'slide' | 'fade'
  transparent?: boolean
  onRequestClose?: () => void
}

export default function Modal({
  visible,
  onClose,
  title,
  children,
  animationType = 'slide',
  transparent = true,
  onRequestClose
}: CustomModalProps) {
  return (
    <RNModal
      visible={visible}
      animationType={animationType}
      transparent={transparent}
      onRequestClose={onRequestClose || onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name={"close" as any} size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
          {children}
        </View>
      </View>
    </RNModal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '80%',
    ...theme.shadows.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    flex: 1,
  },
  closeButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
})
