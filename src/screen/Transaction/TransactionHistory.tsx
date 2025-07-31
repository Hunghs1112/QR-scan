import React, { useState } from "react"
import { View, Text, TouchableOpacity, FlatList, SafeAreaView, RefreshControl, TextInput } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import Ionicons from "react-native-vector-icons/Ionicons"
import Entypo from "react-native-vector-icons/Entypo"
import { styles } from "./styles"
import { useTransactionLogic } from "./TransactionLogic"
import { useAuth } from "../../Context/AuthContext"

type RootStackParamList = {
  Login: undefined
  Main: undefined
  Home: undefined
  Payment: undefined
  Bank: undefined
  QRPage: undefined
  Bill: undefined
  Confirm: undefined
  TransactionHistory: undefined
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

type Transaction = {
  user_id: number
  username: string
  account_number: string
  amount: number
  recipient_name: string
  recipient_account_number: string
  type: string
  timestamp: string
  codes: { randomNum1?: number; randomNum2?: number; transactionCode?: string }
}

const TransactionHistory: React.FC = () => {
  const { groupedTransactions, loading, handleRefresh, formatVND, formatTimestamp, handleSearch } = useTransactionLogic()
  const { account_number, name, balance } = useAuth()
  const navigation = useNavigation<NavigationProp>()
  const [activeTab, setActiveTab] = useState<"mine" | "balance">("balance")
  const [searchText, setSearchText] = useState("")

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const maskedAccount = account_number ? `${account_number.slice(0, 2)}xxx${account_number.slice(-4)}` : "TKxxxxxx"
    const formattedAmount = `${item.type === "CASH_IN" ? "+" : "-"}${formatVND(item.amount)}VND`
    const formattedTime = formatTimestamp(item.timestamp)
    const formattedBalance = formatVND(balance || 0)
    const { randomNum1, randomNum2, transactionCode } = item.codes || {}

    const notificationContent =
      item.type === "CASH_IN"
        ? `TK ${maskedAccount} | GD: ${formattedAmount}|${formattedTime}|SD: +${formattedBalance}VND|Từ: ${item.recipient_name} - ${item.recipient_account_number}|ND: MBVCB.${randomNum1 || "1234567"}.${randomNum2 || "8901234"}.${item.recipient_name}...`
        : `TK: ${maskedAccount}|GD: ${formattedAmount} ${formattedTime}|SD: ${formattedBalance}VND|DEN: ${item.recipient_name} - ${item.recipient_account_number}|ND: ${name || "Người dùng"} chuyen tien- Ma GD ${transactionCode || "ACSP/P1234567"}`

    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionContent}>
          <Text style={[styles.transactionText, styles.transactionTitle]}>
            Thông báo biến động số dư
          </Text>
          <Text style={[styles.transactionText, item.type === "CASH_IN" ? styles.amountPositive : styles.amountNegative]}>
            {notificationContent}
          </Text>
          <Text style={[styles.transactionText, styles.transactionTime]}>
            {formattedTime.split(" ")[1]}
          </Text>
        </View>
      </View>
    )
  }

  const renderGroup = ({ item }: { item: { date: string; transactions: Transaction[] } }) => (
    <View style={styles.dateContainer}>
      <Text style={styles.dateHeader}>{item.date}</Text>
      <FlatList
        data={item.transactions}
        renderItem={renderTransaction}
        keyExtractor={(transaction) => transaction.timestamp}
      />
    </View>
  )

  return (
    <SafeAreaView style={styles.pageContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Entypo name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "mine" ? styles.activeTab : null]}
          onPress={() => setActiveTab("mine")}
        >
          <Text style={[styles.tabText, activeTab === "mine" ? styles.activeTabText : styles.inactiveTabText]}>
            Của tôi
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "balance" ? styles.activeTab : null]}
          onPress={() => setActiveTab("balance")}
        >
          <Text style={[styles.tabText, activeTab === "balance" ? styles.activeTabText : styles.inactiveTabText]}>
            Biến động số dư
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm theo nội dung hoặc ngày"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text)
            handleSearch(text)
          }}
        />
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
      </View>
      <View style={styles.transactionContainer}>
        <FlatList
          data={groupedTransactions}
          renderItem={renderGroup}
          keyExtractor={(item) => item.date}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {loading ? "Đang tải..." : "Không có giao dịch nào"}
            </Text>
          }
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
          }
          contentContainerStyle={styles.transactionList}
        />
      </View>
    </SafeAreaView>
  )
}

export default TransactionHistory