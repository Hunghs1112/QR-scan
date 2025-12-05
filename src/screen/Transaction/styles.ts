import { StyleSheet, Dimensions } from "react-native"

const { width } = Dimensions.get("window")

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  pageContainer: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "#FFF",
  },
  headerTitle: {
    color: "#333",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 5,
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#EAF3FF",
    borderRadius: 0,
    margin: 0,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#1565C0",
  },
  tabText: {
    fontSize: 16,
  },
  activeTabText: {
    color: "#1565C0",
    fontWeight: "500",
  },
  inactiveTabText: {
    color: "#999",
  },
  searchContainer: {
    position: "relative",
    backgroundColor: "#FFF",
  },
  searchInput: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 16,
    marginHorizontal: 15,
  },
  searchIcon: {
    position: "absolute",
    right: 25,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  dateContainer: {
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#EAF3FF",
    borderRadius: 8,
  },
  transactionContainer: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  transactionList: {
    paddingBottom: 40,
  },
  transactionItem: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 15,
  },
  transactionContent: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
    marginBottom: 8,
  },
  transactionText: {
    fontSize: 14,
    color: "#000",
    lineHeight: 22,
    marginBottom: 8,
  },
  transactionTime: {
    fontSize: 12,
    color: "#1565C0",
  },
  amountPositive: {
    
  },
  amountNegative: {
    
  },
  emptyText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginTop: 30,
    fontWeight: "500",
  },
  transactionDivider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginHorizontal: 15,
  },
})