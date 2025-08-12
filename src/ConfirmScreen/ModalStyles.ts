import { StyleSheet } from 'react-native';

const pinModalStyles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: '100%',
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginVertical: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#2f5884',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalDescription: {
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '400',
    color: '#424242',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalDescriptionBold: {
    fontWeight: 'bold',
  },
  pinInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    alignSelf: 'center',
    marginBottom: 24,
  },
  pinCircle: {
    width: 28,
    height: 28,
    borderWidth: 1.5,
    borderColor: '#2f5884',
    borderRadius: 20,
    backgroundColor: '#ffffff',
    margin: 5,
  },
  pinCircleFilled: {
    backgroundColor: '#2f5884',
  },
  minimalInput: {
    width: 1,
    height: 1,
    opacity: 0,
    position: 'absolute',
    top: 0,
  },
  resetButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    color: '#2f5884',
    fontWeight: '500',
  },
});

const otpModalStyles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginVertical: 10,
  },
  contentWrapper: {
    flex: 1,
    paddingBottom: 100, // Increased spacing to push "Xác thực" button further down
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2f5884',
    textAlign: 'center',
    marginBottom: 32,
  },
  otpLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#424242',
    textAlign: 'center',
    marginBottom: 24,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    alignSelf: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 32,
  },
  otpDigit: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2f5884',
    lineHeight: 40,
  },
  otpTimer: {
    fontSize: 16,
    fontWeight: '400',
    color: '#424242',
    textAlign: 'center',
    marginBottom: 32,
  },
  otpTimerHighlight: {
    color: '#2f5884',
    fontWeight: 'bold',
  },
  autoFillText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#78909C',
    textAlign: 'center',
    marginBottom: 64,
  },
  confirmButton: {
    backgroundColor: '#2f5884',
    borderRadius: 4,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export { pinModalStyles, otpModalStyles };