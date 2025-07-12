import { AppState, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { launchImageLibrary } from 'react-native-image-picker';
import { Camera, useCameraDevice, useCameraFormat, useCodeScanner } from 'react-native-vision-camera';
import { decodeQR } from './Encoding';
import { scanFromPath, multiply } from 'react-native-lib-scan-image-code-bank';

type Props = {}

const App = (props: Props) => {
    const device = useCameraDevice('back')
    const front = useCameraDevice('front');
    const [checkCamera, setCheckCamera] = useState<boolean>(true);
    const appState = useRef(AppState.currentState);
    const [appStateStatus, setAppStateStatus] = useState(appState.current);
    const [isScanning, setIsScanning] = useState<boolean>(true); // Trạng thái quét mã
    const [light, setLight] = useState<boolean>(false);



    // const result = multiply(4, 3);
    // console.log("multiplys", result);

    const [accountInfo, setAccountInfo] = useState<{
        bankCode: string;
        bankName: string;
        accountNumber: string;
        merchantName: string;
        amount: string;
        ownerName: string;
    } | null>(null);


    const format = useCameraFormat(device, [
        { videoStabilizationMode: 'auto' },
        { photoAspectRatio: 4 / 3 },
        { videoAspectRatio: 4 / 3 },
        { photoResolution: 'max' },
    ]);

    const [currentCamera, setCurrentCamera] = useState<any>(device);

    const handleImageSelection = async (usCheckBase64: boolean) => {
        try {
            const response = await launchImageLibrary(optionsImagerLIB);
            console.log("response", response);

            if (response.didCancel) { return []; }
            // Handle cancellation, if necessary
            if (response.errorCode) { return []; }
            // Handle error when selecting the image
            if (response?.assets) {
                const selectedImage = response.assets[0];

                const imageUri = selectedImage.uri;

                if (Platform.OS === 'android' && imageUri) {
                    const codes = await scanFromPath(imageUri);

                    if (!codes?.length) {
                        console.log('Mã QR không hợp lệ!');
                        return [];
                    }
                    const parsed = decodeQR(codes[0]);

                    if (!parsed.valid) {
                        console.log(parsed.message);
                        return [];
                    }

                    await fetchDataFromQR(parsed);

                    console.log("✅ Mã QR hợp lệ");
                    console.log("🔢 BIN:", parsed.bin);
                    console.log("🌐 Quốc gia:", parsed.nation);
                    console.log("🏦 Ngân hàng:", parsed.bankName);
                    console.log("🔤 Bank code:", parsed.bankCode);
                    console.log("🔢 Số tài khoản:", parsed.accountNumber);
                    console.log("👤 Tên người nhận:", parsed.merchantName);
                    console.log("💰 Số tiền:", parsed.amount ? parsed.amount + " VND" : "Không có");

                } else {
                    if (Platform.OS === 'ios' && imageUri) {
                        console.log("imageUri", imageUri);

                        const codes = await scanFromPath(imageUri);
                        if (!codes?.length) {
                            console.log('Mã QR không hợp lệ!');
                            return [];
                        }
                        const parsed = decodeQR(codes[0]);

                        if (!parsed.valid) {
                            console.log(parsed.message);
                            return [];
                        }

                        await fetchDataFromQR(parsed);

                        console.log("✅ Mã QR hợp lệ");
                        console.log("🔢 BIN:", parsed.bin);
                        console.log("🌐 Quốc gia:", parsed.nation);
                        console.log("🏦 Ngân hàng:", parsed.bankName);
                        console.log("🔤 Bank code:", parsed.bankCode);
                        console.log("🔢 Số tài khoản:", parsed.accountNumber);
                        console.log("👤 Tên người nhận:", parsed.merchantName);
                        console.log("💰 Số tiền:", parsed.amount ? parsed.amount + " VND" : "Không có");

                    }

                }

            }

        } catch (error) {
            console.log('Error in handleImageSelection:', error);
        }
    };

    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13'],
        onCodeScanned: async (codes: any) => {
            if (!isScanning) { return; } // Nếu không ở trạng thái quét, bỏ qua
            const firstCode = codes[0]; // Lấy mã đầu tiên trong danh sách


            const codeValue = firstCode?.value || firstCode?.data; // Thường chứa giá trị thực của mã
            if (codeValue) {
                try {
                    const parsed = decodeQR(codeValue);
                    setIsScanning(false); // Dừng quét sau khi xử lý mã

                    console.log("firstCodefirstCodefirstCode", parsed);

                    console.log("✅ Mã QR hợp lệ");
                    console.log("🔢 BIN:", parsed.bin);
                    console.log("🌐 Quốc gia:", parsed.nation);
                    console.log("🏦 Ngân hàng:", parsed.bankName);
                    console.log("🔤 Bank code:", parsed.bankCode);
                    console.log("🔢 Số tài khoản:", parsed.accountNumber);
                    console.log("👤 Tên người nhận:", parsed.merchantName);
                    console.log("💰 Số tiền:", parsed.amount ? parsed.amount + " VND" : "Không có");


                    await fetchDataFromQR(parsed); // bạn tự định nghĩa hàm này
                    // setAccountInfo(response.data); // cập nhật UI
                    //gọi api ở đây

                } catch (error) {
                    // showMessage('Mã QR không hợp lệ');
                    setIsScanning(true);
                }
            }


        },
    });

    const fetchDataFromQR = async (parsed: any) => {
        let ownerName = "Không tìm thấy";

        const response = await fetch("https://api.banklookup.net", {
            method: "POST",
            headers: {
                "x-api-key": "ed351838-70fa-4f85-bb51-56a108f43a4fkey",
                "x-api-secret": "905e3313-a086-426e-8274-7bc999415d0asecret",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                bank: parsed.bankCode,
                account: parsed.accountNumber,
            }),
        });

        console.log("responseresponseresponseresponse", response);


        const json = await response.json();
        if (json.success && json.data?.ownerName) {
            ownerName = json.data.ownerName;
        }

        setAccountInfo({
            bankCode: parsed.bankCode || "",
            bankName: parsed.bankName ?? "Không rõ",
            accountNumber: parsed.accountNumber || "",
            merchantName: parsed.merchantName ?? "",
            amount: parsed.amount ?? "",
            ownerName,
        });

    }
    return (
        <SafeAreaView style={styles.container}>
            {device && checkCamera && (
                <View style={styles.cameraWrapper}>
                    <Camera
                        style={styles.camera}
                        device={device}
                        isActive={appStateStatus === 'active'}
                        enableZoomGesture
                        {...props}
                        codeScanner={codeScanner}
                        torch={light ? 'on' : 'off'}
                        fps={30}
                        photoQualityBalance="speed"
                        format={format}
                    />
                </View>
            )}
            <View style={styles.buttonWrapper}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleImageSelection(false)}
                >
                    <Text style={styles.buttonText}>Chọn ảnh từ thư viện</Text>
                </TouchableOpacity>
            </View>
            {!isScanning && (
                <View style={styles.retryWrapper}>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => setIsScanning(true)}
                    >
                        <Text style={styles.retryText}>Quét lại</Text>
                    </TouchableOpacity>
                </View>
            )}

            {accountInfo && (
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        Ngân hàng: {accountInfo.bankName} ({accountInfo.bankCode})
                    </Text>
                    <Text style={styles.infoText}>
                        Số tài khoản: {accountInfo.accountNumber}
                    </Text>
                    <Text style={styles.infoText}>
                        Chủ tài khoản: {accountInfo.ownerName}
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );

};

export default App;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 10,
    },
    cameraWrapper: {
        flex: 0.6,
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    camera: {
        flex: 1,
    },
    buttonWrapper: {
        padding: 16,
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    infoBox: {
        marginTop: 16,
        marginHorizontal: 16,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#f2f2f2',
        borderRadius: 12,
    },
    infoText: {
        fontSize: 15,
        marginBottom: 6,
        color: '#222',
    },
    retryWrapper: {
        alignItems: 'center',
        marginTop: 12,
    },
    retryButton: {
        backgroundColor: '#28a745',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    retryText: {
        color: 'white',
        fontSize: 15,
    },

});

export const optionsImagerLIB: any = {
    selectionLimit: 1,  // Giới hạn 1 ảnh để giảm tải
    mediaType: 'photo',
    maxWidth: 800,      // Giảm độ phân giải ảnh
    maxHeight: 800,     // Giảm kích thước ảnh để tăng tốc xử lý
    includeBase64: false, // Không chuyển đổi Base64 để tiết kiệm bộ nhớ
};