import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getUserImage } from '../utils/apiService';
import Config from 'react-native-config';

interface UserContextType {
  userImage: string | null;
  setUserImage: (image: string | null) => void;
  isLoadingImage: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { account_number, isAuthenticated, isLoading } = useAuth();
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  useEffect(() => {
    const fetchUserImage = async () => {
      console.log('UserContext: Starting fetchUserImage', { isAuthenticated, account_number, isLoading });
      if (isLoading) {
        console.log('UserContext: Skipping fetch, AuthContext is still loading');
        return;
      }
      if (isAuthenticated && account_number) {
        setIsLoadingImage(true);
        try {
          console.log('UserContext: Fetching image for account_number:', account_number);
          const data = await getUserImage(account_number);
          console.log('UserContext: getUserImage response:', data);
          if (data.success && data.user.image) {
            const imageUrl = data.user.image.startsWith('http')
              ? data.user.image
              : `${Config.API_BASE_URL || 'http://51.79.181.161:5000'}${data.user.image}`;
            console.log('UserContext: Constructed imageUrl:', imageUrl);
            setUserImage(imageUrl);
          } else {
            console.log('UserContext: No image found or request unsuccessful:', data);
            setUserImage(null);
          }
        } catch (error) {
          console.error('UserContext: Failed to fetch user image:', error);
          setUserImage(null);
        } finally {
          setIsLoadingImage(false);
          console.log('UserContext: fetchUserImage completed, isLoadingImage:', false);
        }
      } else {
        console.log('UserContext: Skipping fetch, not authenticated or no account_number');
        setUserImage(null);
      }
    };

    fetchUserImage();
  }, [account_number, isAuthenticated, isLoading]);

  return (
    <UserContext.Provider value={{ userImage, setUserImage, isLoadingImage }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};