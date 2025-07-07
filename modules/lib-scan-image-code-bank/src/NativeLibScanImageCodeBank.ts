import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  multiply(a: number, b: number): number;
  scanFromPathIOS(path: string): Promise<string[]>;
}

const LibScanImageCodeBank = TurboModuleRegistry.getEnforcing<Spec>('LibScanImageCodeBank');

export function multiply(a: number, b: number): number {
  return LibScanImageCodeBank.multiply(a, b);
}

export function scanFromPathIOS(path: string): Promise<string[]> {
  return LibScanImageCodeBank.scanFromPathIOS(path);
}

export default LibScanImageCodeBank;


