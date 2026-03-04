import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Home: undefined;
  Payment: undefined;
  Bank: undefined;
  QRPage: undefined;
  Bill: undefined;
  Confirm: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// types.ts
export type Bank = {
  id: string;
  name: string;
  code: string;
  bin: number;
  short_name: string;
  logo_url: string;
  icon_url: string;
  swift_code: string | null;
  lookup_supported: number;
};

export type Contact = {
  id: string;
  name: string;
  avatar?: string;
  bankId: string; // Matches Bank.code (e.g., 'MB', 'ABB')
};