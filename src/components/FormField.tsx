'use client';

import React from 'react';
import { FormField as FormFieldType } from '@/types/quote';
import ClaimsField from './ClaimsField';

interface FormFieldProps {
  field: FormFieldType;
  value: string | boolean;
  onChange: (value: string | boolean) => void;
  formData?: Record<string, string | boolean>;
}

export default function FormField({ field, value, onChange, formData }: FormFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (field.type === 'checkbox') {
      onChange((e.target as HTMLInputElement).checked);
    } else {
      onChange(e.target.value);
    }
  };

  const requiredSymbol = field.required ? ' *' : '';

  // Handle section headers
  if (field.type === 'section') {
    return (
      <div className="form-section-header" data-section={field.name}>
        <h3>{field.label}</h3>
      </div>
    );
  }

  // Handle claims field
  if (field.type === 'claims') {
    return <ClaimsField field={field} />;
  }

  // Handle currency field
  if (field.type === 'currency') {
    return (
      <div className="form-group">
        <label htmlFor={field.name}>
          {field.label}{requiredSymbol}
        </label>
        <input
          type="text"
          id={field.name}
          name={field.name}
          value={value as string || ''}
          onChange={handleChange}
          placeholder={field.placeholder}
          required={field.required}
        />
      </div>
    );
  }

  // Handle percentage-currency field (percentage input with calculated dollar amount)
  if (field.type === 'percentage-currency') {
    const baseValue = formData && field.baseField ? 
      parseFloat((formData[field.baseField] as string || '0').replace(/[^0-9.]/g, '')) : 0;
    const percentageValue = parseFloat(value as string || field.percentage?.toString() || '0');
    const calculatedAmount = (baseValue * percentageValue / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });

    return (
      <div className="form-group percentage-currency-group">
        <label htmlFor={field.name}>
          {field.label}{requiredSymbol}
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            id={field.name}
            name={field.name}
            value={value as string || field.percentage?.toString() || ''}
            onChange={handleChange}
            required={field.required}
            style={{ width: '120px' }}
          >
            {field.options?.map((option) => (
              <option key={option} value={option.replace('%', '')}>
                {option}
              </option>
            ))}
          </select>
          <span style={{ fontWeight: 'bold', color: '#333' }}>
            {calculatedAmount}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="form-group">
      {field.type !== 'checkbox' && (
        <label htmlFor={field.name}>
          {field.label}{requiredSymbol}
        </label>
      )}
      
      {field.type === 'text' || field.type === 'email' || field.type === 'tel' || field.type === 'date' ? (
        <input
          type={field.type}
          id={field.name}
          name={field.name}
          value={value as string || ''}
          onChange={handleChange}
          placeholder={field.placeholder}
          required={field.required}
        />
      ) : field.type === 'select' ? (
        <select
          id={field.name}
          name={field.name}
          value={value as string || ''}
          onChange={handleChange}
          required={field.required}
        >
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : field.type === 'checkbox' ? (
        <label>
          <input
            type="checkbox"
            id={field.name}
            name={field.name}
            checked={value as boolean || false}
            onChange={handleChange}
          />
          {' '}{field.label}{requiredSymbol}
        </label>
      ) : field.type === 'radio' ? (
        <div>
          {field.options?.map((option) => (
            <label key={option}>
              <input
                type="radio"
                name={field.name}
                value={option}
                checked={value === option}
                onChange={handleChange}
              />
              {' '}{option}
            </label>
          ))}
        </div>
      ) : null}
    </div>
  );
}