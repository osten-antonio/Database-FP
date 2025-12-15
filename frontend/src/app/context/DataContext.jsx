'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/axios';

const DataContext = createContext(undefined);

export function DataProvider({ children }) {
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [customersRes, categoriesRes, suppliersRes] = await Promise.all([
        api.get('/customer'),
        api.get('/category'),
        api.get('/supplier')
      ]);
      
      if (customersRes.status >= 200 && customersRes.status <= 300) {
        
        setCustomers(customersRes.data || []);
      }
      if (categoriesRes.status >= 200 && categoriesRes.status <= 300) {
        setCategories(categoriesRes.data || []);
      }
      if (suppliersRes.status >= 200 && suppliersRes.status <= 300) {
        setSuppliers(suppliersRes.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataContext.Provider value={{ customers, categories, suppliers, loading, refetch: fetchAllData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('must use within DataProvider');
  return context;
}
