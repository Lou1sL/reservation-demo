
import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider } from '@apollo/client';
import React from 'react';

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_API_URL,
  credentials: 'include',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export const ApolloClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);
