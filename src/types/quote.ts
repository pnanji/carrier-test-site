export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'select' | 'checkbox' | 'radio';
  required?: boolean;
  options?: string[]; // For select, radio
  placeholder?: string;
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