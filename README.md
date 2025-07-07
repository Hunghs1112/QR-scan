nếu lỗi CMAKE chạy rm -rf android/app/.cxx

Ở thư mục gốc của ứng dụng, gõ lệnh sau :

npx create-react-native-library@latest <Tên package>

ở đây mình đặt là

# "react-native-lib-scan-image-code-bank": "file:./modules/lib-scan-image-code-bank",

trong file /ScanCode/modules/lib-scan-image-code-bank/android/build.gradle thêm

# implementation 'com.google.android.gms:play-services-mlkit-barcode-scanning:18.3.1'

android/app/build.gradle thêm.

# Còn lại cấu hình như bình thường

dependencies {
...
implementation 'com.google.mlkit:barcode-scanning:17.3.0'
implementation 'com.google.android.gms:play-services-mlkit-barcode-scanning:18.3.1'

}

#build lỗi thì thêm

<!-- packagingOptions {
            pickFirst "lib/armeabi-v7a/libc++_shared.so"
            pickFirst "lib/arm64-v8a/libc++_shared.so"
            pickFirst "lib/x86/libc++_shared.so"
            pickFirst "lib/x86_64/libc++_shared.so"
        } -->
