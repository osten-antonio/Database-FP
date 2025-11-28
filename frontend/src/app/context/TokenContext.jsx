'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const TokenContext = createContext(undefined);

export function TokenProvider({ children }) {
  const [token, setToken] = useState('');

  useEffect(()=>{
    const localToken = localStorage.getItem('token');
    if(localToken){
      setToken(localToken);
    }
  },[])
  

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  );
}

export function useToken() {
  const context = useContext(TokenContext);
  if (!context) throw new Error('must use within context provider');
  return context;
}