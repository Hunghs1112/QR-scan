import { useState, useMemo } from 'react';

interface Bank {
  id: string;
  name: string;
  code: string;
  short_name: string;
  icon_url?: string;
}

interface BankSelectorModalLogicProps {
  onClose: () => void;
  onSelectBank: (bank: Bank) => void;
  banks: Bank[];
}

export const useBankSelectorModalLogic = ({ onClose, onSelectBank, banks }: BankSelectorModalLogicProps) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const priorityBankCodes = ['MB', 'VTB', 'VCB', 'VARB', 'BIDV', 'TCB', 'VIB', 'LPB', 'VTLMONEY', 'VNPTMONEY', 'TPB'];

  const filteredBanks = useMemo(() => {
    let filtered = banks;
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = banks.filter(
        (bank) =>
          bank.name.toLowerCase().includes(lowerQuery) ||
          bank.code.toLowerCase().includes(lowerQuery) ||
          bank.short_name.toLowerCase().includes(lowerQuery),
      );
    }

    return [...filtered].sort((a, b) => {
      const aIsPriority = priorityBankCodes.includes(a.code);
      const bIsPriority = priorityBankCodes.includes(b.code);

      if (aIsPriority && !bIsPriority) return -1;
      if (!aIsPriority && bIsPriority) return 1;
      if (aIsPriority && bIsPriority) {
        return priorityBankCodes.indexOf(a.code) - priorityBankCodes.indexOf(b.code);
      }
      return a.name.localeCompare(b.name);
    });
  }, [banks, searchQuery]);

  const handleSelectBank = (bank: Bank) => {
    onSelectBank(bank);
    onClose();
  };

  return {
    handleSelectBank,
    handleClose: onClose,
    searchQuery,
    setSearchQuery,
    filteredBanks,
  };
};