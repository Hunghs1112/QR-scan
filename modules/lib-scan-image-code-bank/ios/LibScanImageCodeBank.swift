import Foundation
import Vision
import UIKit

@objc(LibScanImageCodeBank)
class LibScanImageCodeBank: NSObject {

  @objc(scanFromPath:withResolver:withRejecter:)
  func scanFromPath(path: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {

    // 1. Load image từ đường dẫn
    guard let url = URL(string: path),
          let data = try? Data(contentsOf: url),
          let image = UIImage(data: data),
          let cgImage = image.cgImage else {
      reject("IMAGE_ERROR", "Cannot load or convert image from path: \(path)", nil)
      return
    }

    // 2. Tạo request để detect barcode
    let request = VNDetectBarcodesRequest { request, error in
      if let error = error {
        reject("VISION_ERROR", "Error in barcode detection: \(error.localizedDescription)", error)
        return
      }

      guard let results = request.results as? [VNBarcodeObservation] else {
        reject("NO_RESULT", "No barcode found", nil)
        return
      }

      // 3. Lấy danh sách mã quét được
      let qrCodes = results.compactMap { $0.payloadStringValue }
      resolve(qrCodes)
    }

    // 4. Loại barcode hỗ trợ (mặc định chỉ QR, có thể thêm các loại khác)
    request.symbologies = [.qr, .code128]  // Mở rộng nếu cần thêm loại khác

    // 5. Đảm bảo tương thích với simulator
    #if targetEnvironment(simulator)
    request.revision = VNDetectBarcodesRequestRevision1
    #endif

    // 6. Thực thi request
    let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
    do {
      try handler.perform([request])
    } catch {
      reject("HANDLER_ERROR", "Failed to perform image request: \(error.localizedDescription)", error)
    }
  }

  // Bắt buộc: tên module sẽ được export sang React Native
  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
