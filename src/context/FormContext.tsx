'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FormData } from '@/types/quote';

interface FormContextType {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  clearFormData: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
}

interface FormProviderProps {
  children: ReactNode;
  quoteType: string;
}

export function FormProvider({ children, quoteType }: FormProviderProps) {
  const [formData, setFormData] = useState<FormData>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedData = sessionStorage.getItem(`quote-${quoteType}`);
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setFormData(parsedData);
        } catch (error) {
          console.error('Error parsing stored form data:', error);
          // Clear corrupted data
          sessionStorage.removeItem(`quote-${quoteType}`);
        }
      }
      setIsLoaded(true);
    }
  }, [quoteType]);

  // Save data to sessionStorage whenever formData changes (but only after initial load)
  useEffect(() => {
    if (typeof window !== 'undefined' && isLoaded) {
      try {
        sessionStorage.setItem(`quote-${quoteType}`, JSON.stringify(formData));
      } catch (error) {
        console.error('Error saving form data to sessionStorage:', error);
      }
    }
  }, [formData, quoteType, isLoaded]);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => {
      const newData = { ...prev };
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          newData[key] = value;
        }
      });
      return newData;
    });
  };

  const clearFormData = () => {
    setFormData({});
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(`quote-${quoteType}`);
    }
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData, clearFormData }}>
      {children}
    </FormContext.Provider>
  );
}