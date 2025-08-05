'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { quoteTypes } from '@/config/quoteTypes';
import { FormProvider, useFormContext } from '@/context/FormContext';

interface SummaryPageProps {
  params: {
    quoteType: string;
  };
}

function SummaryContent({ params }: SummaryPageProps) {
  const router = useRouter();
  const { formData, clearFormData } = useFormContext();

  const quoteType = quoteTypes[params.quoteType];

  if (!quoteType) {
    return (
      <div className="container">
        <h1>Quote Type Not Found</h1>
        <p>The requested quote type was not found.</p>
        <button onClick={() => router.push('/')}>
          Return to Home
        </button>
      </div>
    );
  }

  // Calculate a mock premium based on form data
  const calculatePremium = () => {
    let basePremium = params.quoteType === 'home-quote' ? 1200 : 800;
    
    // Add some variation based on form data for realism
    const dataString = JSON.stringify(formData);
    const variation = dataString.length * 3; // Simple hash-like variation
    return basePremium + (variation % 400);
  };

  const premium = calculatePremium();

  const handleStartOver = () => {
    clearFormData();
    router.push('/');
  };

  const handleEditQuote = () => {
    router.push(`/${params.quoteType}/step/1`);
  };

  return (
    <div className="container">
      <h1>Quote Summary</h1>
      <h2>{quoteType.name}</h2>

      <div className="form-section">
        <h3>Your Information</h3>
        
        {quoteType.steps.map(step => (
          <div key={step.id} style={{ marginBottom: '20px' }}>
            <h4>{step.title}</h4>
            {step.fields.map(field => {
              const value = formData[field.name];
              if (value) {
                return (
                  <p key={field.name}>
                    <strong>{field.label}:</strong> {value.toString()}
                  </p>
                );
              }
              return null;
            })}
          </div>
        ))}
      </div>

      <div className="form-section" style={{ 
        border: '2px solid #2196F3', 
        padding: '20px', 
        backgroundColor: '#f8f9fa' 
      }}>
        <h3>Your Quote</h3>
        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
          Annual Premium: ${premium.toLocaleString()}
        </p>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Monthly Premium: ${(premium / 12).toFixed(2)}
        </p>
        <p style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
          This quote is valid for 30 days. Actual premium may vary based on underwriting review.
        </p>
      </div>

      <div className="navigation">
        <button onClick={handleEditQuote}>
          Edit Quote
        </button>
        <button onClick={handleStartOver} style={{ backgroundColor: '#f44336', color: 'white' }}>
          Start New Quote
        </button>
      </div>
    </div>
  );
}

export default function SummaryPage({ params }: SummaryPageProps) {
  return (
    <FormProvider quoteType={params.quoteType}>
      <SummaryContent params={params} />
    </FormProvider>
  );
}