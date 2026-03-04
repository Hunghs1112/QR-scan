import React from "react"
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native"

interface LimitedAccountModalProps {
  visible: boolean
  onClose: () => void
}

const LimitedAccountModal: React.FC<LimitedAccountModalProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>Thông báo</Text>
          
          <Text style={styles.message}>
            Vượt quá hạn mức tối đa trong tháng
          </Text>
          
          <Text style={styles.subMessage}>
            Vui lòng đến quầy giao dịch MB để định danh và nâng cao gói hạn mức giao dịch
          </Text>

          <TouchableOpacity
            style={styles.agreeButton}
            onPress={onClose}
          >
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
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2f5884",
    marginBottom: 16,
    marginTop: 0,
    textAlign: "left",
    width: "100%",
  },
  message: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    textAlign: "left",
    marginBottom: 12,
    lineHeight: 22,
    width: "100%",
  },
  subMessage: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6B7280",
    textAlign: "left",
    marginBottom: 32,
    lineHeight: 20,
    width: "100%",
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

export default LimitedAccountModal

