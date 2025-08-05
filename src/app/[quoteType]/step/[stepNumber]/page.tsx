'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { quoteTypes } from '@/config/quoteTypes';
import { FormProvider, useFormContext } from '@/context/FormContext';
import FormField from '@/components/FormField';

interface QuoteStepPageProps {
  params: {
    quoteType: string;
    stepNumber: string;
  };
}

function StepContent({ params }: QuoteStepPageProps) {
  const router = useRouter();
  const { formData, updateFormData } = useFormContext();
  const [errors, setErrors] = useState<string[]>([]);

  const quoteType = quoteTypes[params.quoteType];
  const stepNumber = parseInt(params.stepNumber);
  const currentStep = quoteType?.steps.find(step => step.id === stepNumber);

  if (!quoteType || !currentStep) {
    return (
      <div className="container">
        <h1>Quote Type Not Found</h1>
        <p>The requested quote type or step was not found.</p>
        <button onClick={() => router.push('/')}>
          Return to Home
        </button>
      </div>
    );
  }

  const handleFieldChange = (fieldName: string, value: string | boolean) => {
    updateFormData({ [fieldName]: value });
    // Remove any existing errors for this field
    setErrors(prev => prev.filter(error => !error.includes(fieldName)));
  };

  const validateStep = () => {
    const newErrors: string[] = [];
    
    currentStep.fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors.push(`${field.label} is required`);
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      const nextStep = stepNumber + 1;
      const nextStepExists = quoteType.steps.some(step => step.id === nextStep);
      
      if (nextStepExists) {
        router.push(`/${params.quoteType}/step/${nextStep}`);
      } else {
        // Go to summary page
        router.push(`/${params.quoteType}/summary`);
      }
    }
  };

  const handlePrevious = () => {
    if (stepNumber > 1) {
      router.push(`/${params.quoteType}/step/${stepNumber - 1}`);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="container">
      <div className="step-indicator">
        <h1>{quoteType.name}</h1>
        <p>Step {stepNumber} of {quoteType.steps.length}: {currentStep.title}</p>
      </div>

      <div className="form-section">
        <h2>{currentStep.title}</h2>
        {currentStep.description && <p>{currentStep.description}</p>}

        {errors.length > 0 && (
          <div style={{ color: 'red', marginBottom: '20px' }}>
            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {currentStep.fields.map(field => (
          <FormField
            key={field.name}
            field={field}
            value={formData[field.name] || ''}
            onChange={(value) => handleFieldChange(field.name, value)}
          />
        ))}
      </div>

      <div className="navigation">
        <button onClick={handlePrevious}>
          {stepNumber === 1 ? 'Back to Home' : 'Previous'}
        </button>
        <button onClick={handleNext}>
          {stepNumber === quoteType.steps.length ? 'Get Quote' : 'Next'}
        </button>
      </div>
    </div>
  );
}

export default function QuoteStepPage({ params }: QuoteStepPageProps) {
  return (
    <FormProvider quoteType={params.quoteType}>
      <StepContent params={params} />
    </FormProvider>
  );
}