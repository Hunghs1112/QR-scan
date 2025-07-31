import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  headerContainer: {},
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logomb: {
    width: 152,
    height: 70,
  },
  logoImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  headerIcons: {
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    marginTop: 20,
    paddingHorizontal: 7,
  },
  headerImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
})