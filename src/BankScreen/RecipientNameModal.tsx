"use client"

import type React from "react"
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native"

interface RecipientNameModalProps {
  visible: boolean
  onClose: () => void
  onSubmit: (name: string) => void
}

const RecipientNameModal: React.FC<RecipientNameModalProps> = ({ visible, onClose, onSubmit }) => {
  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <Text style={styles.exclamationIcon}>!</Text>
          </View>

          <Text style={styles.errorMessage}>Tài khoản hoặc thẻ thụ hưởng không tồn tại (MC2046)</Text>

          <TouchableOpacity style={styles.agreeButton} onPress={onClose}>
            <Text style={styles.agreeButtonText}>Đồng ý</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 6,
    padding: 24,
    width: "90%",
    alignItems: "center",
    elevation: 5,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: 22,
    color: "#2f5884",
    fontWeight: "300",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2f5884",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    marginTop: 20,
  },
  exclamationIcon: {
    fontSize: 36,
    color: "white",
    fontWeight: "700",
    marginBottom: 6,
  },
  errorMessage: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  agreeButton: {
    backgroundColor: "#2f5884",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 4,
    width: "100%",
    alignItems: "center",
  },
  agreeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default RecipientNameModal
