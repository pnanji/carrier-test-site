'use client';

import React from 'react';
import { FormField as FormFieldType } from '@/types/quote';
import FormField from './FormField';

interface FieldGroupProps {
  fields: FormFieldType[];
  formData: Record<string, string | boolean>;
  onFieldChange: (fieldName: string, value: string | boolean) => void;
}

export default function FieldGroup({ fields, formData, onFieldChange }: FieldGroupProps) {
  return (
    <div className="form-group-row">
      {fields.map(field => {
        const widthClass = field.width ? `width-${field.width.replace('%', '')}` : '';
        const formattedWidthClass = widthClass ? `form-group-item ${widthClass}` : 'form-group-item';
        return (
          <div key={field.name} className={formattedWidthClass}>
            <FormField
              field={field}
              value={formData[field.name] || ''}
              onChange={(value) => onFieldChange(field.name, value)}
              formData={formData}
            />
          </div>
        );
      })}
    </div>
  );
}