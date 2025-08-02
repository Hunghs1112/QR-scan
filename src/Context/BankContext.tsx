import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  JSX,
  useCallback,
} from 'react';
import { SvgXml } from 'react-native-svg';
import { Image } from 'react-native';
import { Bank } from './types';
import { fetchBanks } from './bankApi';

interface BankContextType {
  banks: Bank[];
  selectedBank: Bank | null;
  setSelectedBank: (bank: Bank | null) => void;
  svgCache: Record<string, string | null>;
  renderBankLogo: (
    bankId: string | undefined,
    width: number,
    height: number,
    style?: any
  ) => JSX.Element;
}

const BankContext = createContext<BankContextType | undefined>(undefined);

export const BankProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [svgCache, setSvgCache] = useState<Record<string, string | null>>({});

  useEffect(() => {
    const loadBanks = async () => {
      try {
        const bankList = await fetchBanks();
        setBanks(bankList);

        const newCache: Record<string, string | null> = {};

        await Promise.all(
          bankList.map(async (bank) => {
            if (!bank.icon_url) {
              newCache[bank.id] = null;
              return;
            }

            try {
              const response = await fetch(bank.icon_url);
              const svgData = await response.text();

              newCache[bank.id] = svgData.trim().startsWith('<svg') ? svgData : null;
              // console.log(`[SVG] ${bank.name}: ${svgData.substring(0, 50)}...`);
            } catch (err) {
              console.error(`Failed to fetch SVG for ${bank.name}:`, err);
              newCache[bank.id] = null;
            }
          })
        );

        setSvgCache(newCache);
      } catch (error) {
        console.error('Failed to load banks:', error);
      }
    };

    loadBanks();
  }, []);

  const renderBankLogo = useCallback(
    (
      bankId: string | undefined,
      width: number,
      height: number,
      style?: any
    ): JSX.Element => {
      if (bankId && svgCache[bankId]?.startsWith('<svg')) {
        return (
          <SvgXml
            xml={svgCache[bankId]!}
            width={width}
            height={height}
            style={style}
          />
        );
      }

      return (
        <Image
          source={require('../screen/image/nh.png')}
          style={[style, { width, height }]}
          resizeMode="contain"
        />
      );
    },
    [svgCache]
  );

  return (
    <BankContext.Provider
      value={{ banks, selectedBank, setSelectedBank, svgCache, renderBankLogo }}
    >
      {children}
    </BankContext.Provider>
  );
};

export const useBank = (): BankContextType => {
  const context = useContext(BankContext);
  if (!context) {
    throw new Error('useBank must be used within a BankProvider');
  }
  return context;
};
