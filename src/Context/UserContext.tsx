import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
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

  const fetchUserImage = useCallback(async () => {
    if (isLoading || !isAuthenticated || !account_number) {
      setUserImage(null);
      return;
    }

    setIsLoadingImage(true);
    let isMounted = true;

    try {
      const data = await getUserImage(account_number);
      if (isMounted) {
        if (data?.success && data?.user?.image) {
          const imageUrl = data.user.image.startsWith('http')
            ? data.user.image
            : `${Config.API_BASE_URL || 'http://51.79.181.161:5000'}${data.user.image}`;
          setUserImage(imageUrl);
        } else {
          setUserImage(null);
        }
      }
    } catch (error) {
      if (isMounted) {
        setUserImage(null);
      }
    } finally {
      if (isMounted) {
        setIsLoadingImage(false);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [account_number, isAuthenticated, isLoading]);

  useEffect(() => {
    fetchUserImage();
  }, [fetchUserImage]);

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
