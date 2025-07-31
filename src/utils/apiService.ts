import axios from 'axios';
import Config from 'react-native-config';

const api = axios.create({
  baseURL: Config.API_BASE_URL || 'http://51.79.181.161:5000',
});

export const register = async (data: { name: string; username: string; password: string; account_number: string }) => {
  try {
    const response = await api.post('/register', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Lỗi đăng ký');
    }
    throw new Error('Lỗi đăng ký');
  }
};

export const getUserImage = async (account_number: string) => {
  try {
    const response = await api.get(`/user/${account_number}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Lỗi lấy ảnh người dùng');
    }
    throw new Error('Lỗi lấy ảnh người dùng');
  }
};

export const login = async (data: { username: string; password: string }) => {
  try {
    const response = await api.post('/login', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Lỗi đăng nhập');
    }
    throw new Error('Lỗi đăng nhập');
  }
};

export const cashIn = async (data: { username: string; account_number: string; amount: number; recipient_name: string; recipient_account_number: string }) => {
  try {
    const response = await api.post('/cash-in', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Lỗi nạp tiền');
    }
    throw new Error('Lỗi nạp tiền');
  }
};

export const cashOut = async (data: { username: string; account_number: string; amount: number; recipient_account_number: string; recipient_name: string }) => {
  try {
    const response = await api.post('/cash-out', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Lỗi rút tiền');
    }
    throw new Error('Lỗi rút tiền');
  }
};

export const checkTransactions = async (username: string, lastTimestamp: string | null = null) => {
  try {
    const response = await api.get('/transactions', { params: { username, lastTimestamp } });
    return response.data.transactions || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Lỗi kiểm tra giao dịch');
    }
    throw new Error('Lỗi kiểm tra giao dịch');
  }
};

export const checkBalance = async (account_number: string) => {
  try {
    const response = await api.get(`/user/${account_number}/balance`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Lỗi kiểm tra số dư');
    }
    throw new Error('Lỗi kiểm tra số dư');
  }
};

export default api;