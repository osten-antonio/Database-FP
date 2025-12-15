'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const TokenContext = createContext(undefined);

export function TokenProvider({ children }) {
  const [token, setToken] = useState('');

  useEffect(()=>{
    // Try both 'token' and 'access_token' keys for backwards compatibility
    const localToken = localStorage.getItem('access_token') || localStorage.getItem('token');
    if(localToken){
      setToken(localToken);
    }
  },[])
  
  // Persist token when it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('access_token', token);
      localStorage.setItem('token', token); // For backwards compatibility
    } else {
      // Clear from localStorage if token is cleared
      localStorage.removeItem('access_token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [token]);

  const logout = () => {
    setToken('');
  };

  return (
    <TokenContext.Provider value={{ token, setToken, logout }}>
      {children}
    </TokenContext.Provider>
  );
}

export function useToken() {
  const context = useContext(TokenContext);
  if (!context) throw new Error('must use within context provider');
  return context;
}