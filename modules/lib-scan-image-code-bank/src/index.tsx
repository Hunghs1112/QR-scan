// QRCodeImageScan.ts
import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The native module 'LibScanImageCodeBank' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the native module\n' +
  '- You are not using Expo Go\n';

const LibScanImageCodeBank = NativeModules.LibScanImageCodeBank
  ? NativeModules.LibScanImageCodeBank
  : new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );

// Nếu native function là đồng bộ (sync):
export function multiply(a: number, b: number): number {
  return LibScanImageCodeBank.multiply(a, b);
}

// Nếu sau này bạn thêm hàm async:
export function scanFromPath(path: string): Promise<string[]> {
  return LibScanImageCodeBank.scanFromPath(path);
}


