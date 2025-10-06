import Colors from '@/constant/Colors'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Modal as RNModal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ModalProps } from '@/types'

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
              <Ionicons name={"close" as any} size={24} color="#666" />
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  closeButton: {
    padding: 5,
    marginLeft: 10,
  },
})
