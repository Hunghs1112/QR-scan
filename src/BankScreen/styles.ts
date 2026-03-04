import { StyleSheet, Dimensions, Platform } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Hàm tiện ích để tính kích thước tương đối dựa trên chiều rộng
const scaleWidth = (size: number) => (SCREEN_WIDTH * size) / 100;

// Hàm tiện ích để tính kích thước tương đối dựa trên chiều cao
const scaleHeight = (size: number) => (SCREEN_HEIGHT * size) / 100;

// Hàm tiện ích để tính fontSize tương đối
const scaleFont = (size: number) => (SCREEN_WIDTH * size) / 100;

export const styles = StyleSheet.create({
  background: {
    paddingTop: Platform.OS === 'ios' ? scaleHeight(8) : scaleHeight(5),
    backgroundColor: '#ffffff',
    flex: 1,
  },
  mainContainer: {
    backgroundColor: '#ffffff',
    flex: 1,
    position: 'relative',
  },
  scrollContainer: {
    flex: 1,
    marginTop: scaleHeight(10), // 80px -> ~10% chiều cao
  },
  upperContainer: {
    backgroundColor: '#ffffff',
    paddingBottom: scaleHeight(3), // 24px -> ~3% chiều cao
  },
  lowerContainer: {
    backgroundColor: "#e5f2ff",
    paddingTop: scaleHeight(2), // 16px -> ~2% chiều cao
  },
  headerSection: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    paddingHorizontal: scaleWidth(3.5), // 14px -> ~3.5% chiều rộng
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: scaleHeight(3.75), // 30px -> ~3.75% chiều cao
    paddingBottom: scaleHeight(2.5), // 20px -> ~2.5% chiều cao
  },
  backIcon: {},
  headerTitle: {
    flex: 1,
    fontSize: scaleFont(5), // 20px -> ~5% chiều rộng
    fontWeight: "bold",
    color: "#2f5884",
    textAlign: "left",
    marginLeft: scaleWidth(5), // 20px -> ~5% chiều rộng
  },
  scrollContent: {
    flexGrow: 0,
  },
  sectionTitle: {
    color: "#182d38",
    fontSize: scaleFont(4), // 16px -> ~4% chiều rộng
    fontWeight: "bold",
    marginHorizontal: scaleWidth(6.25), // 25px -> ~6.25% chiều rộng
    marginBottom: scaleHeight(1), // 8px -> ~1% chiều cao
  },
  sourceAccountBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#dee4f6",
    padding: scaleWidth(3.5), // 14px -> ~3.5% chiều rộng
    marginHorizontal: scaleWidth(6.25), // 25px -> ~6.25% chiều rộng
    marginBottom: scaleHeight(3), // 24px -> ~3% chiều cao
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  accountText: {
    color: "#2f5884",
    fontSize: scaleFont(3.25), // 13px -> ~3.25% chiều rộng
    fontWeight: "bold",
    marginBottom: scaleHeight(1), // 8px -> ~1% chiều cao
  },
  balanceText: {
    color: "#182d38",
    fontSize: scaleFont(4.25), // 17px -> ~4.25% chiều rộng
    fontWeight: "600",
  },
  dropdownIcon: {
    position: "absolute",
    right: scaleWidth(3.5), // 14px -> ~3.5% chiều rộng
    top: scaleHeight(3.5), // 28px -> ~3.5% chiều cao
  },
  transferBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#dee4f6",
    padding: scaleWidth(2.25), // 9px -> ~2.25% chiều rộng
    marginHorizontal: scaleWidth(6.25), // 25px -> ~6.25% chiều rộng
    marginBottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  bankSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scaleHeight(1.5), // 12px -> ~1.5% chiều cao
    height: scaleHeight(6.875), // 55px -> ~6.875% chiều cao
    paddingVertical: scaleHeight(1), // 8px -> ~1% chiều cao
  },
  bankIcon: {
    width: scaleWidth(9), // 36px -> ~9% chiều rộng
    height: scaleWidth(9), // 36px -> ~9% chiều rộng
    borderRadius: scaleWidth(4.5), // 18px -> ~4.5% chiều rộng
    marginRight: scaleWidth(3), // 12px -> ~3% chiều rộng
    borderWidth: 0.4,
    borderColor: "#dee4f6",
  },
  bankSelector: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bankText: {
    color: "#182d38",
    fontSize: scaleFont(4), // 16px -> ~4% chiều rộng
    fontWeight: "500",
  },
  bankDropdownIcon: {
    marginRight: 0,
  },
  dashedLine: {
    borderBottomWidth: 1,
    borderColor: "#dee4f6",
    borderStyle: "solid",
    marginBottom: 0,
  },
  accountInputSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: scaleHeight(0.625), // 5px -> ~0.625% chiều cao
    height: scaleHeight(6.875), // 55px -> ~6.875% chiều cao
    paddingVertical: scaleHeight(1), // 8px -> ~1% chiều cao
  },
  accountInput: {
    flex: 1,
    fontSize: scaleFont(4), // 16px -> ~4% chiều rộng
    color: "#182d38",
    paddingVertical: scaleHeight(0.625), // 5px -> ~0.625% chiều cao
    fontWeight: "500",
  },
  contactIcon: {
    marginTop: scaleHeight(0.5), // 4px -> ~0.5% chiều cao
    width: scaleWidth(12.5), // 50px -> ~12.5% chiều rộng
    height: scaleWidth(12.5), // 50px -> ~12.5% chiều rộng
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  recipientContainer: {
    backgroundColor: "#e5f2ff",
    borderTopWidth: 0,
    borderColor: "#dee4f6",
    borderRadius: 4,
    marginHorizontal: scaleWidth(6.25), // 25px -> ~6.25% chiều rộng
    marginTop: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    minHeight: scaleHeight(6), // 48px -> ~6% chiều cao
  },
  recipientNameSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: scaleHeight(1), // 8px -> ~1% chiều cao
    paddingHorizontal: scaleWidth(2.25), // 9px -> ~2.25% chiều rộng
  },
  recipientNameTextContainer: {
    flex: 1,
    marginRight: scaleWidth(2), // 8px -> ~2% chiều rộng
  },
  recipientNameText: {
    color: "#182d38",
    fontSize: scaleFont(4), // 16px -> ~4% chiều rộng
    fontWeight: "500",
    flexWrap: "wrap",
    flexShrink: 1,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2f5884",
    borderRadius: 30,
    paddingVertical: scaleHeight(0.5), // 4px -> ~0.5% chiều cao
    paddingHorizontal: scaleWidth(2), // 8px -> ~2% chiều rộng
  },
  saveButtonText: {
    color: "#2f5884",
    fontSize: scaleFont(3.5), // 14px -> ~3.5% chiều rộng
    fontWeight: "600",
    marginRight: scaleWidth(1), // 4px -> ~1% chiều rộng
  },
  amountSection: {
    backgroundColor: "#ffffff",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#dee4f6",
    height: scaleHeight(8), // 64px -> ~8% chiều cao
    padding: scaleWidth(2.25), // 9px -> ~2.25% chiều rộng
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: scaleWidth(6.25), // 25px -> ~6.25% chiều rộng
    marginBottom: scaleHeight(3), // 24px -> ~3% chiều cao
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  amountInputContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  amountInput: {
    color: "#2f5884",
    fontSize: scaleFont(5), // 20px -> ~5% chiều rộng
    fontWeight: "bold",
    textAlign: "center",
    paddingRight: scaleWidth(1), // 4px -> ~1% chiều rộng
  },
  vndText: {
    color: "#182d38",
    fontSize: scaleFont(3), // 12px -> ~3% chiều rộng
    fontWeight: "600",
    alignSelf: "center",
  },
  amountClearIconContainer: {
    backgroundColor: "#999",
    borderRadius: 10,
    width: scaleWidth(5), // 20px -> ~5% chiều rộng
    height: scaleWidth(5), // 20px -> ~5% chiều rộng
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: scaleWidth(2.5), // 10px -> ~2.5% chiều rộng
  },
  contentInputContainer: {
    height: scaleHeight(8.75), // 70px -> ~8.75% chiều cao
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#dee4f6",
    padding: scaleWidth(3), // 12px -> ~3% chiều rộng
    marginHorizontal: scaleWidth(6.25), // 25px -> ~6.25% chiều rộng
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  contentLabel: {
    color: "#2f5884",
    fontSize: scaleFont(3), // 12px -> ~3% chiều rộng
    fontWeight: "bold",
  },
  contentInputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  contentInput: {
    flex: 1,
    fontSize: scaleFont(4.5), // 18px -> ~4.5% chiều rộng
    color: "#252836",
    paddingVertical: scaleHeight(0.875), // 7px -> ~0.875% chiều cao
    fontWeight: "500",
  },
  contentClearIconContainer: {
    backgroundColor: "#999",
    borderRadius: 10,
    width: scaleWidth(5), // 20px -> ~5% chiều rộng
    height: scaleWidth(5), // 20px -> ~5% chiều rộng
    justifyContent: "center",
    alignItems: "center",
    marginLeft: scaleWidth(2), // 8px -> ~2% chiều rộng
  },
  buttonContainerWrapper: {
    backgroundColor: '#e5f2ff',
    paddingHorizontal: scaleWidth(5), // 20px -> ~5% chiều rộng
    paddingBottom: scaleHeight(4), // 10px -> ~1% chiều cao
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: scaleWidth(2.5), // 10px -> ~2.5% chiều rộng
  },
  backButton: {
    height: scaleHeight(5.75), // 46px -> ~5.75% chiều cao
    backgroundColor: "#e5f2ff",
    borderWidth: 2,
    borderColor: "#2f5884",
    borderRadius: 30,
    paddingVertical: scaleHeight(1.5), // 12px -> ~1.5% chiều cao
    paddingHorizontal: scaleWidth(4.5), // 18px -> ~4.5% chiều rộng
    flex: 0.62,
    alignItems: "center",
  },
  backButtonText: {
    color: "#2f5884",
    fontSize: scaleFont(3.75), // 15px -> ~3.75% chiều rộng
    fontWeight: "600",
  },
  continueButton: {
    backgroundColor: "#2f5884",
    borderRadius: 30,
    paddingVertical: scaleHeight(1.5), // 12px -> ~1.5% chiều cao
    paddingHorizontal: scaleWidth(10.5), // 42px -> ~10.5% chiều rộng
    flex: 1.4,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: scaleFont(3.75), // 15px -> ~3.75% chiều rộng
    fontWeight: "600",
  },
});