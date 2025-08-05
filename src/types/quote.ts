export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'select' | 'checkbox' | 'radio' | 'section' | 'claims' | 'currency' | 'percentage-currency';
  required?: boolean;
  options?: string[]; // For select, radio
  placeholder?: string;
  group?: string; // For grouping fields together on the same line
  width?: string; // Custom width for grouped fields (e.g., '25%', '50%')
  baseField?: string; // For percentage-currency fields, which field to calculate from
  percentage?: number; // Default percentage for percentage-currency fields
}

export interface Claim {
  id: string;
  dateOfLoss: string;
  loss: string;
  amount: string;
  description: string;
}

export interface FormStep {
  id: number;
  title: string;
  description?: string;
  fields: FormField[];
}

export interface QuoteType {
  id: string;
  name: string;
  steps: FormStep[];
}

export interface FormData {
  [key: string]: string | boolean;
}