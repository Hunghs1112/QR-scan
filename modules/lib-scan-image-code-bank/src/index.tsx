import LibScanImageCodeBank from './NativeLibScanImageCodeBank';


export function multiply(a: number, b: number): number {
  return LibScanImageCodeBank.multiply(a, b);
}

export function scanFromPath(path: string): Promise<string[]> {
  return LibScanImageCodeBank.scanFromPath(path);
}