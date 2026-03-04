package com.libscanimagecodebank

import android.graphics.BitmapFactory
import android.net.Uri
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.google.mlkit.vision.barcode.BarcodeScannerOptions
import com.google.mlkit.vision.barcode.BarcodeScanning
import com.google.mlkit.vision.barcode.common.Barcode
import com.google.mlkit.vision.common.InputImage
import java.io.File
import java.io.FileNotFoundException

class LibScanImageCodeBankModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
        return NAME
    }

    // Example method
    // See https://reactnative.dev/docs/native-modules-android
    @ReactMethod
    fun multiply(a: Double, b: Double, promise: Promise) {
        promise.resolve(a * b)
    }

  @ReactMethod
    fun scanFromPath(pathURI: String, promise: Promise) {
        try {
            // Cấu hình máy quét mã vạch hỗ trợ nhiều loại mã vạch
            val scannerOptions = BarcodeScannerOptions.Builder()
                .setBarcodeFormats(
                    Barcode.FORMAT_QR_CODE,   // Mã QR
//                    Barcode.FORMAT_AZTEC,     // Mã Aztec
                     Barcode.FORMAT_CODE_128   // Mã vạch chuẩn CODE_128
                )
                .build()

            // Loại bỏ tiền tố "file:" nếu có và kiểm tra tệp hình ảnh
            val filePath = pathURI.removePrefix("file:")
            val imageFile = File(filePath).takeIf { it.exists() }
                ?: throw FileNotFoundException("Không thể tìm thấy tệp hình ảnh từ đường dẫn: $pathURI")

            // Chuyển đổi hình ảnh sang InputImage
            val inputImage = InputImage.fromFilePath(reactApplicationContext, Uri.fromFile(imageFile))

            // Khởi tạo máy quét và xử lý kết quả
            BarcodeScanning.getClient(scannerOptions).process(inputImage)
                .addOnSuccessListener { barcodes ->
                    val scannedCodes = barcodes.mapNotNull { it.displayValue }
                    promise.resolve(Arguments.fromList(scannedCodes)) // Trả kết quả
                }
                .addOnFailureListener { exception ->
                    promise.reject("SCAN_FAILED", exception.localizedMessage, exception)
                }
        } catch (e: Exception) {
            promise.reject("ERROR", e.localizedMessage, e)
        }
    } 


  companion object {
    const val NAME = "LibScanImageCodeBank"
  }
}
