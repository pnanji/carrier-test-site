'use client';

import React from 'react';
import { FormField as FormFieldType } from '@/types/quote';

interface FormFieldProps {
  field: FormFieldType;
  value: string | boolean;
  onChange: (value: string | boolean) => void;
}

export default function FormField({ field, value, onChange }: FormFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (field.type === 'checkbox') {
      onChange((e.target as HTMLInputElement).checked);
    } else {
      onChange(e.target.value);
    }
  };

  const requiredSymbol = field.required ? ' *' : '';

  return (
    <div className="form-group">
      <label htmlFor={field.name}>
        {field.label}{requiredSymbol}
      </label>
      
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
          {' '}{field.label}
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