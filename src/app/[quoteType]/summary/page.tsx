'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { quoteTypes } from '@/config/quoteTypes';
import { useFormContext } from '@/context/FormContext';

interface SummaryPageProps {
  params: Promise<{
    quoteType: string;
  }>;
}

function SummaryContent({ params }: SummaryPageProps) {
  const router = useRouter();
  const { formData, clearFormData } = useFormContext();

  const { quoteType: quoteTypeParam } = use(params);
  const quoteType = quoteTypes[quoteTypeParam];

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
    const basePremium = quoteTypeParam === 'home-quote' ? 1200 : 800;
    
    // Add some variation based on form data for realism
    const dataString = JSON.stringify(formData);
    const variation = dataString.length * 3; // Simple hash-like variation
    return basePremium + (variation % 400);
  };

  const premium = calculatePremium();

  // Calculate term dates
  const calculateTermDates = () => {
    const startDate = formData.desiredCoverageStartDate ? 
      new Date(formData.desiredCoverageStartDate as string) : 
      new Date();
    
    const endDate = new Date(startDate);
    
    // Home quotes: 1 year apart, Auto quotes: 6 months apart
    if (quoteTypeParam === 'home-quote') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 6);
    }
    
    return {
      start: startDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      end: endDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };
  };

  const termDates = calculateTermDates();

  // Get coverage information
  const getCoverageInfo = () => {
    const coverageStep = quoteType.steps.find(step => step.title === 'Coverage Information');
    if (!coverageStep) return null;

    return coverageStep.fields
      .filter(field => field.type !== 'section' && formData[field.name])
      .map(field => ({
        label: field.label,
        value: formData[field.name],
        type: field.type,
        baseField: field.baseField
      }));
  };

  const coverageInfo = getCoverageInfo();

  // Format coverage value for display
  const formatCoverageValue = (field: any) => {
    if (field.type === 'percentage-currency' && field.baseField) {
      const baseValue = formData[field.baseField] as string || '0';
      const numericBase = parseFloat(baseValue.replace(/[^0-9.]/g, ''));
      const percentage = parseFloat(field.value as string || '0');
      const calculatedAmount = (numericBase * percentage / 100).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
      return `${field.value}% (${calculatedAmount})`;
    }
    return field.value?.toString() || '';
  };

  const handleStartOver = () => {
    clearFormData();
    router.push('/');
  };

  const handleBackToCoverage = () => {
    // Go back to the last step (coverage page)
    const lastStepNumber = quoteType.steps.length;
    router.push(`/${quoteTypeParam}/step/${lastStepNumber}`);
  };

  return (
    <div className="container">
      <h1>Quote Summary</h1>
      <h2>{quoteType.name}</h2>

      {/* Premium and Term Information */}
      <div className="form-section" style={{ 
        border: '2px solid #2196F3', 
        padding: '20px', 
        backgroundColor: '#f8f9fa',
        marginBottom: '20px'
      }}>
        <h3>Your Quote</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
          <div>
            <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 5px 0' }}>
              Total Premium: ${premium.toLocaleString()}
            </p>
            <p style={{ fontSize: '14px', color: '#666', margin: '0' }}>
              {quoteTypeParam === 'home-quote' ? 'Annual' : 'Semi-Annual'} Premium
            </p>
          </div>
          <div>
            <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 5px 0' }}>
              Policy Term
            </p>
            <p style={{ fontSize: '14px', margin: '0' }}>
              <strong>Start:</strong> {termDates.start}
            </p>
            <p style={{ fontSize: '14px', margin: '0' }}>
              <strong>End:</strong> {termDates.end}
            </p>
          </div>
        </div>
        <p style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
          This quote is valid for 30 days. Actual premium may vary based on underwriting review.
        </p>
      </div>

      {/* Coverage Summary */}
      {coverageInfo && coverageInfo.length > 0 && (
        <div className="form-section" style={{ marginBottom: '20px' }}>
          <h3>Coverage Summary</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '15px' 
          }}>
            {coverageInfo.map((coverage, index) => (
              <div key={index} style={{ 
                padding: '12px', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                backgroundColor: '#fafafa'
              }}>
                <p style={{ 
                  fontWeight: 'bold', 
                  margin: '0 0 5px 0',
                  fontSize: '14px',
                  color: '#333'
                }}>
                  {coverage.label}
                </p>
                <p style={{ 
                  margin: '0',
                  fontSize: '16px',
                  color: '#2c5aa0',
                  fontWeight: '500'
                }}>
                  {formatCoverageValue(coverage)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Information Summary (Basic Info Only) */}
      <div className="form-section" style={{ marginBottom: '20px' }}>
        <h3>Policy Holder Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          {[
            { key: 'firstName', label: 'First Name' },
            { key: 'lastName', label: 'Last Name' },
            { key: 'phoneNumber', label: 'Phone Number' },
            { key: 'emailAddress', label: 'Email Address' },
            { key: 'streetAddress', label: 'Property Address' },
            { key: 'city', label: 'City' },
            { key: 'state', label: 'State' },
            { key: 'zipCode', label: 'Zip Code' }
          ].map(item => {
            const value = formData[item.key];
            if (value) {
              return (
                <div key={item.key}>
                  <p style={{ fontWeight: 'bold', margin: '0 0 2px 0', fontSize: '12px', color: '#666' }}>
                    {item.label}
                  </p>
                  <p style={{ margin: '0', fontSize: '14px' }}>
                    {value.toString()}
                  </p>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>

      <div className="navigation">
        <button onClick={handleBackToCoverage}>
          Back
        </button>
        <button onClick={handleStartOver} style={{ backgroundColor: '#f44336', color: 'white' }}>
          Start New Quote
        </button>
      </div>
    </div>
  );
}

export default function SummaryPage({ params }: SummaryPageProps) {
  return <SummaryContent params={params} />;
}