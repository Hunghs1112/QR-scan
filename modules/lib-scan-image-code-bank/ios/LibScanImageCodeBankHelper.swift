import Foundation
import UIKit
import Vision
import React // ✅ Bắt buộc để dùng RCTPromiseResolveBlock

// @objc(CameraImageProcessor)
// class CameraImageProcessor: NSObject {
    
//     @objc static func multiply(a: Double, b: Double) -> NSNumber {
//         return NSNumber(value: a * b)
//     }

//     // Add more logic here later
// }


@objc(LibScanImageCodeBankHelper)
public class LibScanImageCodeBankHelper: NSObject {

     
    @objc(multiply:b:)
    public static func multiply(_ a: Double, b: Double) -> NSNumber {
        return NSNumber(value: a * b)
    }

    @objc(scanFromPath:resolve:reject:)
    public static func scanFromPath(
        path: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {

        // print("pathpathpath",path)
        
        //1. Load image từ đường dẫn
        guard let url = URL(string: path),
              let data = try? Data(contentsOf: url),
              let image = UIImage(data: data),
              let cgImage = image.cgImage else {
            reject("IMAGE_ERROR", "Cannot load or convert image from path: \(path)", nil)
            return
        }

        // 2. Request để detect barcode
        let request = VNDetectBarcodesRequest { request, error in
            if let error = error {
                reject("VISION_ERROR", "Error in barcode detection: \(error.localizedDescription)", error)
                return
            }

            guard let results = request.results as? [VNBarcodeObservation], !results.isEmpty else {
                reject("NO_RESULT", "No barcode found in image", nil)
                return
            }

            let codes = results.compactMap { $0.payloadStringValue }
            resolve(codes)
        }

        // 3. Cấu hình loại barcode cần detect
        request.symbologies = [VNBarcodeSymbology.qr, VNBarcodeSymbology.code128]

        // 4. Xử lý trong simulator (tùy Apple yêu cầu)
        #if targetEnvironment(simulator)
        request.revision = VNDetectBarcodesRequestRevision1
        #endif

        // 5. Thực thi request
        let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
        do {
            try handler.perform([request])
        } catch {
            reject("HANDLER_ERROR", "Failed to perform image request: \(error.localizedDescription)", error)
        }
    
    }

}