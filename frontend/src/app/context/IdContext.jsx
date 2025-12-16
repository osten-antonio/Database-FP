'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const IdContext = createContext(undefined);

export function IdProvider({ children }) {
  const [id, setId] = useState(0);

  useEffect(()=>{

    const localId = localStorage.getItem('id') 
    if(localId){
      setId(Number(localId));
    }
  },[])
  
  // Persist token when it changes
  useEffect(() => {
    if (id) {
      localStorage.setItem('id', Number(id));
    } else {
      localStorage.removeItem('id');
    }
  }, [id]);

  const logout = () => {
    setId(0);
  };

  return (
    <IdContext.Provider value={{ id, setId, logout }}>
      {children}
    </IdContext.Provider>
  );
}

export function useId() {
  const context = useContext(IdContext);
  if (!context) throw new Error('must use within context provider');
  return context;
}