import { StyleSheet, Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Hàm tiện ích để tính kích thước tương đối dựa trên chiều rộng
const scaleWidth = (size: number) => (SCREEN_WIDTH * size) / 100;

// Hàm tiện ích để tính kích thước tương đối dựa trên chiều cao
const scaleHeight = (size: number) => (SCREEN_HEIGHT * size) / 100;

// Hàm tiện ích để tính fontSize tương đối
const scaleFont = (size: number) => (SCREEN_WIDTH * size) / 100;

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  // Header Styles
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: scaleHeight(0), // 20px -> ~2.5% chiều cao
  },
  logoContainer: {
    marginTop: scaleHeight(3.5), // 28px -> ~3.5% chiều cao
    flexDirection: "row",
    marginLeft: scaleWidth(-8), // -48px -> ~-12% chiều rộng
  },
  logoStar: {
    width: scaleWidth(62.5), // 250px -> ~62.5% chiều rộng
    height: scaleHeight(6.25), // 50px -> ~6.25% chiều cao
  },
  logoImage: {
    width: "130%", // Giữ nguyên vì là tỷ lệ phần trăm
    height: "130%", // Giữ nguyên vì là tỷ lệ phần trăm
    resizeMode: "contain", // Thay objectFit thành resizeMode
  },
  headerIcons: {
    alignItems: "flex-end",
    gap: scaleHeight(0.75), // 6px -> ~0.75% chiều cao
    marginRight: scaleWidth(5.5), // 22px -> ~5.5% chiều rộng
    marginTop: scaleHeight(4), // 32px -> ~4% chiều cao
  },
  iconButton: {
    width: scaleWidth(11.5), // 46px -> ~11.5% chiều rộng
    height: scaleWidth(11.5), // 46px -> ~11.5% chiều rộng
    borderRadius: scaleWidth(5.75), // 23px -> ~5.75% chiều rộng
    backgroundColor: '#212e3f',
    borderColor: "rgba(255, 255, 255, 1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: scaleHeight(1.5), // 12px -> ~1.5% chiều cao
  },
  iconImage: {
    width: "125%", // Giữ nguyên vì là tỷ lệ phần trăm
    height: "125%", // Giữ nguyên vì là tỷ lệ phần trăm
  },
  // Login Card Styles
  loginCardContainer: {
    marginTop: scaleHeight(6), // 60px -> ~7.5% chiều cao
    paddingHorizontal: scaleWidth(5.5), // 22px -> ~5.5% chiều rộng
  },
  loginCard: {
    borderWidth: 1,
    borderColor: 'rgba(90,107,133,255)',
    backgroundColor: "rgba(100, 100, 100, 0.3)",
    borderRadius: scaleWidth(5), // 20px -> ~5% chiều rộng
    padding: scaleWidth(6), // 24px -> ~6% chiều rộng
    paddingBottom: 0,
  },
  shieldContainer: {
    marginBottom: scaleHeight(2), // 16px -> ~2% chiều cao
  },
  shieldIcon: {
    position: "relative",
    alignSelf: "flex-start",
    marginTop: scaleHeight(0.5), // 4px -> ~0.5% chiều cao
    marginLeft: scaleWidth(1), // 6px -> ~1.5% chiều rộng
    marginBottom: scaleHeight(0), // 4px -> ~0.5% chiều cao
  },
  shieldIconImage: {
    width: scaleWidth(7), // 28px -> ~7% chiều rộng
    height: scaleWidth(7), // 28px -> ~7% chiều rộng
  },
  greetingText: {
    fontSize: scaleFont(4.5), // 18px -> ~4.5% chiều rộng
    color: "#FFF",
    marginBottom: scaleHeight(1), // 8px -> ~1% chiều cao
    marginLeft: scaleWidth(1), // 4px -> ~1% chiều rộng
    fontWeight: "400",
    fontFamily: "Inter_18pt-Regular",
  },
  usernameContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.5)",
    marginBottom: scaleHeight(2.5), // 20px -> ~2.5% chiều cao
  },
  usernameInput: {
    fontSize: scaleFont(4), // 16px -> ~4% chiều rộng
    color: "#FFF",
    paddingVertical: scaleHeight(1.5), // 12px -> ~1.5% chiều cao
    paddingHorizontal: 0,
  },
  passwordContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    marginBottom: scaleHeight(1.75), // 14px -> ~1.75% chiều cao
    marginLeft: scaleWidth(0.5), // 2px -> ~0.5% chiều rộng
  },
  passwordInput: {
    fontSize: scaleFont(4.5), // 18px -> ~4.5% chiều rộng
    color: "#FFF",
    paddingVertical: scaleHeight(1), // 12px -> ~1.5% chiều cao
  },
  actionLinksContainer: {
    flexDirection: "row",
    gap: scaleWidth(15), // 70px -> ~17.5% chiều rộng
  },
  actionLink: {
    marginTop: scaleHeight(0.375), // 3px -> ~0.375% chiều cao
    fontWeight: "bold",
    color: "#FFF",
    fontSize: scaleFont(4), // 16px -> ~4% chiều rộng
    opacity: 0.7,
    fontFamily: "Inter_18pt-Bold",
  },
  loginButton: {
    backgroundColor: "#99d4f4",
    borderRadius: 0,
    borderBottomLeftRadius: scaleWidth(5), // 20px -> ~5% chiều rộng
    borderBottomRightRadius: scaleWidth(5), // 20px -> ~5% chiều rộng
    paddingVertical: scaleHeight(2), // 16px -> ~2% chiều cao
    alignItems: "center",
    marginTop: scaleHeight(2), // 25px -> ~3.125% chiều cao
    marginHorizontal: scaleWidth(-6), // -24px -> ~-6% chiều rộng
  },
  loginButtonText: {
    color: "#295584",
    fontSize: scaleFont(4), // 16px -> ~4% chiều rộng
    fontWeight: "600",
    fontFamily: "Inter_18pt-SemiBold",
  },
  // Main Card Styles
  userNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: scaleHeight(1.75), // 14px -> ~1.75% chiều cao
    marginLeft: scaleWidth(1), // 4px -> ~1% chiều rộng
  },
  userNameContainer: {
    flex: 1,
    width: scaleWidth(12.5), // 50px -> ~12.5% chiều rộng
  },
  userName: {
    fontSize: scaleFont(8), // 32px -> ~8% chiều rộng
    color: "#FFF",
    fontWeight: "300",
    lineHeight: scaleHeight(5.5), // 46px -> ~5.75% chiều cao
    fontFamily: "Inter_28pt-Light",
    flexWrap: 'wrap',
  },
  faceIdButton: {
    width: scaleWidth(14), // 56px -> ~14% chiều rộng
    height: scaleWidth(14), // 56px -> ~14% chiều rộng
    borderRadius: scaleWidth(7), // 28px -> ~7% chiều rộng
    backgroundColor: "rgba(28,41,58, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: scaleHeight(1), // 32px -> ~4% chiều cao
    marginRight: scaleWidth(1.5), // 6px -> ~1.5% chiều rộng
  },
  // Features Styles
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: scaleHeight(7), // 70px -> ~8.75% chiều cao
    paddingHorizontal: scaleWidth(2), // 16px -> ~4% chiều rộng
  },
  featureButton: {
    alignItems: "center",
    width: scaleWidth(32), // 128px -> ~32% chiều rộng
  },
  featureText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: scaleFont(3), // 12px -> ~3% chiều rộng
    marginTop: scaleHeight(0.75), // 6px -> ~0.75% chiều cao
    textAlign: "center",
    fontWeight: "400",
    fontFamily: "Inter_18pt-Regular",
  },
  featureIconImage: {
    width: scaleWidth(10.5), // 42px -> ~10.5% chiều rộng
    height: scaleHeight(4.5), // 36px -> ~4.5% chiều cao
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  // Footer Styles
  footer: {
    alignItems: "center",
    paddingBottom: scaleHeight(2.5), // 20px -> ~2.5% chiều cao
    paddingHorizontal: scaleWidth(4), // 16px -> ~4% chiều rộng
  },
  footerArrow: {
    width: scaleWidth(10), // 40px -> ~10% chiều rộng
    height: scaleWidth(10), // 40px -> ~10% chiều rộng
    borderRadius: scaleWidth(5), // 20px -> ~5% chiều rộng
    backgroundColor: "rgba(255, 255, 255, 0.0)",
    justifyContent: "center",
    alignItems: "center",
  },
});