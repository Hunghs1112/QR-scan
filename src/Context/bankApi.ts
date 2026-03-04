import { Bank } from './types';

export const fetchBanks = async (): Promise<Bank[]> => {
  try {
    const response = await fetch('https://api.banklookup.net/bank/list', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetch Banks Response:', JSON.stringify(data, null, 2));
    if (!data || typeof data !== 'object' || !data.success || !Array.isArray(data.data)) {
      throw new Error(`API error: Invalid response format - ${JSON.stringify(data)}`);
    }
    return data.data.map((bank: any) => ({
      id: bank.id,
      name: bank.name,
      code: bank.code,
      short_name: bank.short_name,
      icon_url: bank.icon_url,
    }));
  } catch (error) {
    console.error('Error fetching banks:', error);
    throw error;
  }
};