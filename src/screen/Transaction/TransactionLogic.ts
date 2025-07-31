import { useState, useEffect, useCallback } from "react"
import { useAuth } from "../../Context/AuthContext"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Config from "react-native-config"

const api = axios.create({
  baseURL: Config.API_BASE_URL || "http://51.79.181.161:5000",
})

export const checkTransactions = async (username: string) => {
  try {
    const response = await api.get("/transactions", { params: { username } })
    return response.data.transactions || []
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("checkTransactions error:", {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
        } : null,
        config: error.config,
      })
      throw new Error(error.response?.data?.message || "Lỗi kiểm tra giao dịch")
    }
    throw new Error("Lỗi kiểm tra giao dịch")
  }
}

export const useTransactionLogic = () => {
  const { username } = useAuth()
  const [groupedTransactions, setGroupedTransactions] = useState<{ date: string; transactions: any[] }[]>([])
  const [allTransactions, setAllTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const formatVND = useCallback((amount: number): string => {
    if (isNaN(amount) || amount === 0) {
      return "0"
    }
    const numStr = Math.floor(amount).toString()
    let result = ""
    for (let i = numStr.length - 1, count = 0; i >= 0; i--) {
      result = numStr[i] + result
      count++
      if (count % 3 === 0 && i > 0) {
        result = "," + result
      }
    }
    return result
  }, [])

  const formatTimestamp = useCallback((timestamp: string): string => {
    const date = new Date(timestamp)
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear().toString().slice(-2)
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    return `${day}/${month}/${year} ${hours}:${minutes}`
  }, [])

  const formatDateForGroup = useCallback((timestamp: string): string => {
    const date = new Date(timestamp)
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear().toString().slice(-2)
    return `${day}/${month}/${year}`
  }, [])

  const getCachedCodes = useCallback(async (key: string) => {
    try {
      const cached = await AsyncStorage.getItem(`transactionCode_${key}`)
      return cached ? JSON.parse(cached) : null
    } catch (error) {
      console.error("Error reading from AsyncStorage:", error)
      return null
    }
  }, [])

  const setCachedCodes = useCallback(async (key: string, codes: { randomNum1?: number; randomNum2?: number; transactionCode?: string }) => {
    try {
      await AsyncStorage.setItem(`transactionCode_${key}`, JSON.stringify(codes))
    } catch (error) {
      console.error("Error writing to AsyncStorage:", error)
    }
  }, [])

  const fetchTransactions = useCallback(async () => {
    if (!username) return
    setLoading(true)
    try {
      const data = await checkTransactions(username)
      const sortedData = data.sort((a: any, b: any) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      const transactionsWithCodes = await Promise.all(
        sortedData.map(async (transaction: any, index: number) => {
          const key = transaction.timestamp
          let codes = await getCachedCodes(key)
          if (!codes) {
            const randomNum1 = Math.floor(Math.random() * (999999999 - 1000000 + 1)) + 1000000
            const randomNum2 = Math.floor(Math.random() * (999999999 - 1000000 + 1)) + 1000000
            const transactionCode = `ACSP/P${Math.floor(Math.random() * 10000000).toString().padStart(7, "0")}`
            codes = {
              randomNum1: transaction.type === "CASH_IN" ? randomNum1 : undefined,
              randomNum2: transaction.type === "CASH_IN" ? randomNum2 : undefined,
              transactionCode: transaction.type === "CASH_OUT" ? transactionCode : undefined,
            }
            await setCachedCodes(key, codes)
          }
          return { ...transaction, codes }
        })
      )
      setAllTransactions(transactionsWithCodes)
      const grouped = transactionsWithCodes.reduce((acc: { [key: string]: any[] }, transaction: any) => {
        const date = formatDateForGroup(transaction.timestamp)
        if (!acc[date]) {
          acc[date] = []
        }
        acc[date].push(transaction)
        return acc
      }, {})
      const groupedArray = Object.keys(grouped)
        .sort((a, b) => {
          const [dayA, monthA, yearA] = a.split("/").map(Number)
          const [dayB, monthB, yearB] = b.split("/").map(Number)
          return new Date(2000 + yearB, monthB - 1, dayB).getTime() - new Date(2000 + yearA, monthA - 1, dayA).getTime()
        })
        .map(date => ({
          date,
          transactions: grouped[date],
        }))
      setGroupedTransactions(groupedArray)
    } catch (error) {
      console.error("Error fetching transactions:", error)
      setGroupedTransactions([])
      setAllTransactions([])
    } finally {
      setLoading(false)
    }
  }, [username, formatDateForGroup, getCachedCodes, setCachedCodes])

  const handleSearch = useCallback((searchText: string) => {
    if (!searchText) {
      const grouped = allTransactions.reduce((acc: { [key: string]: any[] }, transaction: any) => {
        const date = formatDateForGroup(transaction.timestamp)
        if (!acc[date]) {
          acc[date] = []
        }
        acc[date].push(transaction)
        return acc
      }, {})
      const groupedArray = Object.keys(grouped)
        .sort((a, b) => {
          const [dayA, monthA, yearA] = a.split("/").map(Number)
          const [dayB, monthB, yearB] = b.split("/").map(Number)
          return new Date(2000 + yearB, monthB - 1, dayB).getTime() - new Date(2000 + yearA, monthA - 1, dayA).getTime()
        })
        .map(date => ({
          date,
          transactions: grouped[date],
        }))
      setGroupedTransactions(groupedArray)
      return
    }

    const filtered = allTransactions.filter((transaction) => {
      const formattedDate = formatDateForGroup(transaction.timestamp)
      const formattedTime = formatTimestamp(transaction.timestamp)
      const content = transaction.type === "CASH_IN"
        ? `${transaction.recipient_name} ${transaction.recipient_account_number} MBVCB.${transaction.codes?.randomNum1 || ""}.${transaction.codes?.randomNum2 || ""}`
        : `${transaction.recipient_name} ${transaction.recipient_account_number} ${transaction.codes?.transactionCode || ""}`
      return (
        formattedDate.includes(searchText) ||
        formattedTime.includes(searchText) ||
        content.toLowerCase().includes(searchText.toLowerCase())
      )
    })

    const grouped = filtered.reduce((acc: { [key: string]: any[] }, transaction: any) => {
      const date = formatDateForGroup(transaction.timestamp)
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(transaction)
      return acc
    }, {})
    const groupedArray = Object.keys(grouped)
      .sort((a, b) => {
        const [dayA, monthA, yearA] = a.split("/").map(Number)
        const [dayB, monthB, yearB] = b.split("/").map(Number)
        return new Date(2000 + yearB, monthB - 1, dayB).getTime() - new Date(2000 + yearA, monthA - 1, dayA).getTime()
      })
      .map(date => ({
        date,
        transactions: grouped[date],
      }))
    setGroupedTransactions(groupedArray)
  }, [allTransactions, formatDateForGroup, formatTimestamp])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const handleRefresh = useCallback(async () => {
    await fetchTransactions()
  }, [fetchTransactions])

  return {
    groupedTransactions,
    loading,
    handleRefresh,
    formatVND,
    formatTimestamp,
    handleSearch,
  }
}