import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
// import LibUploadCodeBank, { multiply, pickImage } from './modules/lib-upLoad-code-bank';
import { launchImageLibrary } from 'react-native-image-picker';
import { scanFromPath } from 'react-native-lib-scan-code-bank';

type Props = {}

const App = (props: Props) => {

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

        if (Platform.OS == 'android' && imageUri) {
          const codes = await scanFromPath(imageUri);

          if (!codes?.length) {
            console.log('Mã QR không hợp lệ!');
            return [];
          }

          console.log("codes", codes);


        }

      }

    } catch (error) {
      console.log('Error in handleImageSelection:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App</Text>

      <TouchableOpacity style={styles.button} onPress={() => handleImageSelection(false)}>
        <Text style={styles.buttonText}>Chọn ảnh từ thư viện</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  title: {
    fontSize: 20, marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff', fontSize: 16,
  },
});

export const optionsImagerLIB: any = {
  selectionLimit: 1,  // Giới hạn 1 ảnh để giảm tải
  mediaType: 'photo',
  maxWidth: 800,      // Giảm độ phân giải ảnh
  maxHeight: 800,     // Giảm kích thước ảnh để tăng tốc xử lý
  includeBase64: false, // Không chuyển đổi Base64 để tiết kiệm bộ nhớ
};