import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    
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
    paddingTop: 20,
  },
  logoContainer: {
    marginTop: 28,
    flexDirection: "row",
    marginLeft: -48,
  },
  
  logoStar: {
    width: 250,
    height: 50,
  },
  logoImage: {
    width: "130%",
    height: "130%",
    objectFit: "contain",
  },
  headerIcons: {
    alignItems: "flex-end",
    gap: 6,
    marginRight: 22,
    marginTop: 32,
  },
  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
     backgroundColor: "rgba(28,41,58, 0.7)",
    borderColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  iconImage: {
    width: "125%",
    height: "125%",
  },
  // Login Card Styles
  loginCardContainer: {
    marginTop: 60,
    paddingHorizontal: 22,
  },
  loginCard: {
    borderWidth: 1,
    backgroundColor: "rgba(100, 100, 100, 0.3)",
    borderColor: 'rgba(90,107,133,255)',
    borderRadius: 20,
    padding: 24,
    paddingBottom: 0,
  },
  shieldContainer: {
    marginBottom: 16,
  },
  shieldIcon: {
    position: "relative",
    alignSelf: "flex-start",
    marginTop: 4,
    marginLeft: 6,
    marginBottom: 4,
  },
  shieldIconImage: {
    width: 28,
    height: 28,
  },
  greetingText: {
    fontSize: 18,
    color: "#FFF",
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: "400",
    fontFamily: "Inter_18pt-Regular",
  },
  usernameContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.5)",
    marginBottom: 20,
  },
  usernameInput: {
    fontSize: 16,
    color: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  passwordContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.5)",
    marginBottom: 28,
  },
  passwordInput: {
    fontSize: 18,
    color: "#FFF",
    paddingVertical: 12,
  },
  actionLinksContainer: {
    marginLeft: 4,
    flexDirection: "row",
    gap: 84,
  },
  actionLink: {
    marginTop: 3,
    fontWeight: "bold",
    color: "white",
    fontSize: 16,
    opacity: 0.7,
    fontFamily: "Inter_18pt-Bold",
  },
  loginButton: {
    backgroundColor: "#99d4f4",
    borderRadius: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 25,
    marginHorizontal: -24,
  },
  loginButtonText: {
    color: "#2e5983",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter_18pt-SemiBold",
  },
  // Features Styles
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 70,
    paddingHorizontal: 16,
  },
  featureButton: {
    alignItems: "center",
    width: 128,
  },
  feature: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    marginTop: 6,
    textAlign: "center",
    fontWeight: "400",
    fontFamily: "Inter_18pt-Regular",
  },
  featureText: {
    color: 'white'
  },
  featureIconImage: {
    width: 42,
    height: 36,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  // Footer Styles
  footer: {
    marginTop: 20,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  footerArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.0)",
    justifyContent: "center",
    alignItems: "center",
  },
});