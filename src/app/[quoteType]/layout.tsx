'use client';

import { FormProvider } from '@/context/FormContext';
import ResetButton from '@/components/ResetButton';
import { use } from 'react';

interface QuoteLayoutProps {
  children: React.ReactNode;
  params: Promise<{ quoteType: string }>;
}

export default function QuoteLayout({ children, params }: QuoteLayoutProps) {
  const { quoteType } = use(params);

  return (
    <FormProvider quoteType={quoteType}>
      <div className="quote-layout">
        <ResetButton />
        {children}
      </div>
    </FormProvider>
  );
}