import React from 'react';
import { AuthProvider } from './src/Context/AuthContext';
import { BankProvider } from './src/Context/BankContext';
import { TransactionProvider } from './src/Context/TransactionContext';
import Navigation from './src/Navigation';
import NotificationHandler from './src/NotificationHandler';

const App = () => {
  return (
    <AuthProvider>
      <BankProvider>
        <TransactionProvider>
          <Navigation />
          <NotificationHandler />
        </TransactionProvider>
      </BankProvider>
    </AuthProvider>
  );
};

export default App;