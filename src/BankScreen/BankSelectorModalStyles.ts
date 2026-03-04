import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: '86%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2f5884',
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  bankList: {
    flexGrow: 0,
  },
  bankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  bankItemIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  bankItemTextContainer: {
    flex: 1,
  },
  bankItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#182d38',
  },
  bankItemCode: {
    fontSize: 14,
    color: '#666',
  },
  searchInput: {
    height: 40,
    borderColor: '#E3F2FD',
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginVertical: 10,
  },
  searchContainer: {
    borderBottomWidth: 1,
    borderColor: '#E3F2FD',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  searchIcon: {
    position: 'absolute',
    right: 10,
  },
  loader: {
    marginVertical: 20,
  },
  bankItemContent: {
    flex: 1,
  },
  bankItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankIcon: {
    width: 36,
    height: 36,
    marginRight: 12,
  },
  bankItemName: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginVertical: 10,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  // Added styles for new elements
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
  },
});