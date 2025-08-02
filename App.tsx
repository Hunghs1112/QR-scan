import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { AuthProvider } from './src/Context/AuthContext';
import { BankProvider } from './src/Context/BankContext';
import { TransactionProvider } from './src/Context/TransactionContext';
import { UserProvider } from './src/Context/UserContext';
import Navigation from './src/Navigation';
import NotificationHandler from './src/NotificationHandler';

const App = () => {
  // Hàm yêu cầu quyền
  const requestPermissions = async () => {
    try {
      // Quyền cần yêu cầu cho Android và iOS
      const permissions = [
        Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA,
        Platform.OS === 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        Platform.OS === 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        Platform.OS === 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
        Platform.OS === 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
        Platform.OS === 'ios' ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO,
      
      ].filter(Boolean); // Loại bỏ các quyền không hợp lệ (nếu có)

      for (const permission of permissions) {
        const result = await check(permission);
        if (result === RESULTS.DENIED) {
          await request(permission); // Hiển thị hộp thoại cấp quyền hệ thống
        } else if (result === RESULTS.BLOCKED) {
          await request(permission); // Thử yêu cầu lại để hiển thị hộp thoại hệ thống (nếu được)
        }
      }
    } catch (error) {
      console.error('Lỗi khi yêu cầu quyền:', error);
    }
  };

  // Gọi hàm yêu cầu quyền khi ứng dụng khởi động
  useEffect(() => {
    requestPermissions();
  }, []);

  return (
    <AuthProvider>
      <UserProvider>
        <BankProvider>
          <TransactionProvider>
            <Navigation />
            <NotificationHandler />
          </TransactionProvider>
        </BankProvider>
      </UserProvider>
    </AuthProvider>
  );
};

export default App;