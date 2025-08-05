'use client';

import React, { useState } from 'react';
import { FormField as FormFieldType, Claim } from '@/types/quote';
import { useFormContext } from '@/context/FormContext';

interface ClaimsFieldProps {
  field: FormFieldType;
}

export default function ClaimsField({ field }: ClaimsFieldProps) {
  const { formData, updateFormData } = useFormContext();
  const [claims, setClaims] = useState<Claim[]>([]);

  // Check if user answered "Yes" to having losses
  const hadLosses = formData['hadLossesLast5Years'] === 'Yes';

  // Load existing claims from formData on mount
  React.useEffect(() => {
    if (formData.claims && typeof formData.claims === 'string') {
      try {
        const parsedClaims = JSON.parse(formData.claims);
        setClaims(parsedClaims);
      } catch (error) {
        console.error('Error parsing claims data:', error);
      }
    }
  }, [formData.claims]);

  // Clear claims when user changes from "Yes" to "No"
  React.useEffect(() => {
    if (!hadLosses && claims.length > 0) {
      setClaims([]);
      updateFormData({ claims: JSON.stringify([]) });
    }
  }, [hadLosses, claims.length, updateFormData]);

  const addClaim = () => {
    const newClaim: Claim = {
      id: Date.now().toString(),
      dateOfLoss: '',
      loss: '',
      amount: '',
      description: ''
    };
    const updatedClaims = [...claims, newClaim];
    setClaims(updatedClaims);
    updateFormData({ claims: JSON.stringify(updatedClaims) });
  };

  const updateClaim = (id: string, field: keyof Claim, value: string) => {
    const updatedClaims = claims.map(claim =>
      claim.id === id ? { ...claim, [field]: value } : claim
    );
    setClaims(updatedClaims);
    updateFormData({ claims: JSON.stringify(updatedClaims) });
  };

  const removeClaim = (id: string) => {
    const updatedClaims = claims.filter(claim => claim.id !== id);
    setClaims(updatedClaims);
    updateFormData({ claims: JSON.stringify(updatedClaims) });
  };

  if (!hadLosses) {
    return null;
  }

  return (
    <div className="claims-section">
      <div className="claims-header">
        <h4>Loss History Details</h4>
        <button 
          type="button" 
          onClick={addClaim}
          className="add-claim-btn"
        >
          Add Claim
        </button>
      </div>

      {claims.map((claim, index) => (
        <div key={claim.id} className="claim-entry">
          <div className="claim-header">
            <h5>Claim {index + 1}</h5>
            <button 
              type="button" 
              onClick={() => removeClaim(claim.id)}
              className="remove-claim-btn"
            >
              Remove
            </button>
          </div>

          <div className="claim-fields">
            <div className="form-group-row">
              <div className="form-group-item width-25">
                <label>Date Of Loss *</label>
                <input
                  type="date"
                  value={claim.dateOfLoss}
                  onChange={(e) => updateClaim(claim.id, 'dateOfLoss', e.target.value)}
                  placeholder="mm-dd-yyyy"
                />
              </div>
              <div className="form-group-item width-35">
                <label>Loss *</label>
                <select
                  value={claim.loss}
                  onChange={(e) => updateClaim(claim.id, 'loss', e.target.value)}
                >
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group-item width-25">
                <label>Amount *</label>
                <input
                  type="text"
                  value={claim.amount}
                  onChange={(e) => updateClaim(claim.id, 'amount', e.target.value)}
                  placeholder="$0.00"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                value={claim.description}
                onChange={(e) => updateClaim(claim.id, 'description', e.target.value)}
                placeholder="Enter description of loss"
              />
            </div>
          </div>
        </div>
      ))}

      {claims.length === 0 && (
        <div className="no-claims">
          <p>Click "Add Claim" to enter loss history details.</p>
        </div>
      )}
    </div>
  );
}