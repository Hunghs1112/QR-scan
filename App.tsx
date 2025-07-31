  import React from 'react';
  import { AuthProvider } from './src/Context/AuthContext';
  import { BankProvider } from './src/Context/BankContext';
  import { TransactionProvider } from './src/Context/TransactionContext';
  import Navigation from './src/Navigation';
  import NotificationHandler from './src/NotificationHandler';
  import { UserProvider } from './src/Context/UserContext';

  const App = () => {
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