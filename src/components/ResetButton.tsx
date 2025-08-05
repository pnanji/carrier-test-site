'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useFormContext } from '@/context/FormContext';

export default function ResetButton() {
  const router = useRouter();
  const { clearFormData } = useFormContext();

  const handleReset = () => {
    // Clear all form data from state and sessionStorage
    clearFormData();
    
    // Navigate back to the home page
    router.push('/');
  };

  return (
    <button 
      onClick={handleReset}
      className="reset-button"
      type="button"
      title="Clear all data and start over"
    >
      Start Over
    </button>
  );
}