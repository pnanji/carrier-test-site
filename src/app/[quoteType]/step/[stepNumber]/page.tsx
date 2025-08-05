'use client';

import React, { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { quoteTypes } from '@/config/quoteTypes';
import { useFormContext } from '@/context/FormContext';
import FormField from '@/components/FormField';
import FieldGroup from '@/components/FieldGroup';
import HouseholdMembersField from '@/components/HouseholdMembersField';
import DriversField from '@/components/DriversField';
import VehiclesField from '@/components/VehiclesField';
import CoverageField from '@/components/CoverageField';

// Driver type from DriversField component
interface Driver {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  maritalStatus: string;
  relationshipToInsured: string;
  driverType: string;
  licenseState: string;
  licenseNumber: string;
  ageWhenFirstLicensed: string;
  licenseSuspended: string;
  sr22Filing: string;
  isPrimary?: boolean;
}

// Vehicle type from VehiclesField component
interface Vehicle {
  id: string;
  vin: string;
  modelYear: string;
  make: string;
  model: string;
  purchaseDate: string;
  annualMileageText: string;
  annualMileageDropdown: string;
  isRentedOrLeased: string;
}

interface QuoteStepPageProps {
  params: Promise<{
    quoteType: string;
    stepNumber: string;
  }>;
}

function StepContent({ params }: QuoteStepPageProps) {
  const router = useRouter();
  const { formData, updateFormData } = useFormContext();
  const [errors, setErrors] = useState<string[]>([]);





  const { quoteType: quoteTypeParam, stepNumber: stepNumberParam } = use(params);
  const quoteType = quoteTypes[quoteTypeParam];
  const stepNumber = parseInt(stepNumberParam);
  const currentStep = quoteType?.steps.find(step => step.id === stepNumber);

  // Initialize default values for required fields in coverage step
  useEffect(() => {
    if (currentStep && currentStep.title === 'Coverage Information') {
      const defaultValues: Record<string, string> = {};
      
      // Set default values for required fields that don't have values yet
      currentStep.fields.forEach(field => {
        if (field.required && !formData[field.name]) {
          if (field.name === 'personalLiability') {
            defaultValues[field.name] = '$300,000';
          } else if (field.name === 'medicalPayments') {
            defaultValues[field.name] = '5%';
          } else if (field.name === 'allOtherPerilsDeductible') {
            defaultValues[field.name] = '$1,000';
          }
        }
      });

      if (Object.keys(defaultValues).length > 0) {
        updateFormData(defaultValues);
      }
    }
  }, [currentStep, formData, updateFormData]);

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
    
    // Standard field validation
    currentStep.fields.forEach(field => {
      // Skip validation for section headers
      if (field.type === 'section') return;
      
      if (field.required && !formData[field.name]) {
        newErrors.push(`${field.label} is required`);
      }
    });

    // Special validation for Vehicle Information step
    if (quoteTypeParam === 'auto-quote' && stepNumber === 4 && currentStep.title === 'Vehicle Information') {
      if (formData.vehicles) {
        try {
          const vehiclesData = JSON.parse(formData.vehicles as string);
          
          if (!vehiclesData || vehiclesData.length === 0) {
            newErrors.push('At least one vehicle is required');
          } else {
            vehiclesData.forEach((vehicle: Vehicle, index: number) => {
              const vehicleNumber = index + 1;
              
              if (!vehicle.modelYear || vehicle.modelYear === '(Select)') {
                newErrors.push(`Vehicle ${vehicleNumber}: Model Year is required`);
              }
              if (!vehicle.make || vehicle.make === '(Select)') {
                newErrors.push(`Vehicle ${vehicleNumber}: Make is required`);
              }
              if (!vehicle.model || vehicle.model.trim() === '') {
                newErrors.push(`Vehicle ${vehicleNumber}: Model is required`);
              }
            });
          }
        } catch {
          newErrors.push('Vehicle information is invalid');
        }
      } else {
        newErrors.push('At least one vehicle is required');
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      const nextStep = stepNumber + 1;
      const nextStepExists = quoteType.steps.some(step => step.id === nextStep);
      
      if (nextStepExists) {
        router.push(`/${quoteTypeParam}/step/${nextStep}`);
      } else {
        // Go to summary page
        router.push(`/${quoteTypeParam}/summary`);
      }
    }
  };

  const handlePrevious = () => {
    if (stepNumber > 1) {
      router.push(`/${quoteTypeParam}/step/${stepNumber - 1}`);
    } else {
      router.push('/');
    }
  };

  const handleGetReplacementCost = () => {
    // Generate a random dwelling limit between $200,000 and $800,000
    const randomAmount = Math.floor(Math.random() * (800000 - 200000 + 1)) + 200000;
    const formattedAmount = randomAmount.toLocaleString('en-US');
    
    // Auto-fill the dwelling limit and update dependent fields, including defaults for required fields
    updateFormData({
      dwellingLimit: formattedAmount,
      otherStructures: '10', // 10% of dwelling limit
      personalProperty: '50', // 50% of dwelling limit  
      lossOfUse: '20', // 20% of dwelling limit
      hurricaneDeductible: '2', // 2% of dwelling limit
      // Set defaults for required fields if they don't have values
      ...((!formData.personalLiability) && { personalLiability: '$300,000' }),
      ...((!formData.medicalPayments) && { medicalPayments: '5%' }),
      ...((!formData.allOtherPerilsDeductible) && { allOtherPerilsDeductible: '$1,000' })
    });
  };

  const handleDriverSelectionChange = (driverId: string, selected: boolean) => {
    // Update form data for persistence
    updateFormData({ [`selectedDriver_${driverId}`]: selected });
  };

  const handleVehicleSelectionChange = (vehicleId: string, selected: boolean) => {
    // Update form data for persistence
    updateFormData({ [`selectedVehicle_${vehicleId}`]: selected });
  };

  const handleDriversChange = (updatedDrivers: Driver[]) => {
    // Store drivers data in form context for persistence
    updateFormData({ drivers: JSON.stringify(updatedDrivers) });
  };

  const handleVehiclesChange = (updatedVehicles: Vehicle[]) => {
    // Store vehicles data in form context for persistence
    updateFormData({ vehicles: JSON.stringify(updatedVehicles) });
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

        {/* Add Get/Edit Replacement Cost button for home insurance coverage step only */}
        {quoteTypeParam === 'home-quote' && currentStep.title === 'Coverage Information' && (
          <div style={{ margin: '20px 0', textAlign: 'center' }}>
            <button 
              type="button"
              onClick={handleGetReplacementCost}
              style={{
                backgroundColor: '#5cb3f5',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Get/Edit Replacement Cost
            </button>
          </div>
        )}

        {errors.length > 0 && (
          <div style={{ color: 'red', marginBottom: '20px' }}>
            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Special rendering for Household Members step in auto-quote */}
        {quoteTypeParam === 'auto-quote' && stepNumber === 2 && currentStep.title === 'Household Members' ? (
          <HouseholdMembersField
            onDriverSelectionChange={handleDriverSelectionChange}
            onVehicleSelectionChange={handleVehicleSelectionChange}
            onRelationshipChange={(driverId, relationship) => updateFormData({ [`relationship_${driverId}`]: relationship })}
            formData={formData}
            namedInsuredInfo={{
              firstName: formData.firstName as string,
              lastName: formData.lastName as string,
              dateOfBirth: formData.dateOfBirth as string,
              gender: formData.gender as string
            }}
          />
        ) : quoteTypeParam === 'auto-quote' && stepNumber === 3 && currentStep.title === 'Drivers' ? (
          <DriversField
            primaryDriverInfo={{
              firstName: formData.firstName as string,
              lastName: formData.lastName as string,
              dateOfBirth: formData.dateOfBirth as string,
              gender: formData.gender as string,
              maritalStatus: formData.maritalStatus as string,
              state: formData.state as string,
              licenseNumber: formData.licenseNumber as string
            }}
            onDriversChange={handleDriversChange}
            existingDrivers={formData.drivers ? JSON.parse(formData.drivers as string) : []}
          />
        ) : quoteTypeParam === 'auto-quote' && stepNumber === 4 && currentStep.title === 'Vehicle Information' ? (
          <VehiclesField
            onVehiclesChange={handleVehiclesChange}
            existingVehicles={formData.vehicles ? JSON.parse(formData.vehicles as string) : []}
          />
        ) : quoteTypeParam === 'auto-quote' && stepNumber === 5 && currentStep.title === 'Coverage Information' ? (
          <CoverageField
            formData={formData}
            onFieldChange={handleFieldChange}
          />
        ) : (
          (() => {
            const fieldGroups: Record<string, typeof currentStep.fields> = {};
            const ungroupedFields: typeof currentStep.fields = [];

            // Group fields by their group property
            currentStep.fields.forEach(field => {
              if (field.group) {
                if (!fieldGroups[field.group]) {
                  fieldGroups[field.group] = [];
                }
                fieldGroups[field.group].push(field);
              } else {
                ungroupedFields.push(field);
              }
            });

            const elements: React.ReactNode[] = [];

            // Render fields in their original order, respecting groups
            currentStep.fields.forEach((field) => {
              if (field.group) {
                // Check if this is the first field in this group
                const groupFields = fieldGroups[field.group];
                const isFirstInGroup = groupFields[0] === field;
                
                if (isFirstInGroup) {
                  elements.push(
                    <FieldGroup
                      key={`group-${field.group}`}
                      fields={groupFields}
                      formData={formData}
                      onFieldChange={handleFieldChange}
                    />
                  );
                }
              } else {
                elements.push(
                  <FormField
                    key={field.name}
                    field={field}
                    value={formData[field.name] || ''}
                    onChange={(value) => handleFieldChange(field.name, value)}
                    formData={formData}
                  />
                );
              }
            });

            return elements;
          })()
        )}
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
  return <StepContent params={params} />;
}