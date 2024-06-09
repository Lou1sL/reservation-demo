
import React, { useState } from 'react';
import { ApolloClientProvider } from './ApolloClient';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {

  return (
    <ApolloClientProvider>
      <div>
        <h1>Reservation System</h1>
        <Dashboard onLoginSuccess={()=>{}} onLogoutSuccess={()=>{}}/>
      </div>
    </ApolloClientProvider>
  );
};

export default App;