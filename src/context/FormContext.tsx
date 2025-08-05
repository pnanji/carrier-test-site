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

  // Load data from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedData = sessionStorage.getItem(`quote-${quoteType}`);
      if (storedData) {
        try {
          setFormData(JSON.parse(storedData));
        } catch (error) {
          console.error('Error parsing stored form data:', error);
        }
      }
    }
  }, [quoteType]);

  // Save data to sessionStorage whenever formData changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`quote-${quoteType}`, JSON.stringify(formData));
    }
  }, [formData, quoteType]);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
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