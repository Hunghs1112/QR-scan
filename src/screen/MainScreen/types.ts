import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Home: undefined;
  Payment: undefined;
  Bank: undefined;
  QRPage: undefined;
  Bill: undefined;
  Confirm: undefined;
  FaceScan: undefined;
  FaceID: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;