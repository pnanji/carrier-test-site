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
    let basePremium = quoteTypeParam === 'home-quote' ? 1200 : 800;
    
    // For auto insurance, calculate based on vehicles and coverage
    if (quoteTypeParam === 'auto-quote') {
      try {
        const vehicles = formData.vehicles ? JSON.parse(formData.vehicles as string) : [];
        basePremium = 600; // Base premium per vehicle
        basePremium *= vehicles.length; // Multiply by number of vehicles
        
        // Add premium based on coverage selections
        if (typeof formData.bodilyInjury === 'string' && formData.bodilyInjury.includes('100/300')) basePremium += 150;
        if (typeof formData.propertyDamageLiability === 'string' && parseInt(formData.propertyDamageLiability.replace(/[,]/g, '')) >= 100000) basePremium += 100;
        if (formData.medicalPayments && formData.medicalPayments !== 'No Coverage') basePremium += 50;
        
        // Add premium for comprehensive/collision on vehicles
        vehicles.forEach((vehicle: Record<string, unknown>) => {
          const collisionCoverage = formData[`collision_${vehicle.id}`];
          const comprehensiveCoverage = formData[`comprehensive_${vehicle.id}`];
          
          if (typeof collisionCoverage === 'string' && !collisionCoverage.includes('No Coverage')) basePremium += 300;
          if (typeof comprehensiveCoverage === 'string' && !comprehensiveCoverage.includes('No Coverage')) basePremium += 200;
        });
        
      } catch (e) {
        console.error('Error calculating auto premium:', e);
      }
    }
    
    // Add some variation based on form data for realism
    const dataString = JSON.stringify(formData);
    const variation = dataString.length * 2; // Simple hash-like variation
    return basePremium + (variation % 300);
  };

  const premium = calculatePremium();

  // Calculate term dates
  const calculateTermDates = () => {
    const startDateField = quoteTypeParam === 'home-quote' ? 'desiredCoverageStartDate' : 'effectiveDate';
    const startDate = formData[startDateField] ? 
      new Date(formData[startDateField] as string) : 
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

  // Get vehicle information for auto quotes
  const getVehicleInfo = () => {
    if (quoteTypeParam !== 'auto-quote') return [];
    
    try {
      return formData.vehicles ? JSON.parse(formData.vehicles as string) : [];
    } catch (e) {
      console.error('Error parsing vehicles data:', e);
      return [];
    }
  };

  // Get coverage information
  const getCoverageInfo = () => {
    if (quoteTypeParam === 'auto-quote') {
      // Auto insurance coverage data is stored directly in formData
      const policyLevelCoverages = [
        { key: 'bodilyInjury', label: 'Bodily Injury' },
        { key: 'combinedSingleLimits', label: 'Combined Single Limits' },
        { key: 'propertyDamageLiability', label: 'Property Damage Liability' },
        { key: 'uninsuredMotorist', label: 'Uninsured/Underinsured Motorist' },
        { key: 'firstAccidentForgiveness', label: 'First Accident Forgiveness' },
        { key: 'extendedNonOwnedCoverage', label: 'Extended Non-Owned Coverage' },
        { key: 'medicalPayments', label: 'Medical Payments' }
      ];

      return policyLevelCoverages
        .filter(coverage => formData[coverage.key])
        .map(coverage => ({
          label: coverage.label,
          value: formData[coverage.key]
        }));
    } else {
      // Home insurance coverage logic (existing)
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
    }
  };

  // Get vehicle-specific coverage information for auto quotes
  const getVehicleCoverageInfo = () => {
    if (quoteTypeParam !== 'auto-quote') return {};
    
    const vehicles = getVehicleInfo();
    const vehicleCoverageTypes = [
      { key: 'uninsuredMotoristsPropertyDamage', label: 'Uninsured/Underinsured Motorists Property Damage' },
      { key: 'collision', label: 'Collision' },
      { key: 'comprehensive', label: 'Comprehensive' },
      { key: 'autoLoanLease', label: 'Auto Loan/Lease' },
      { key: 'roadsideAssistance', label: 'Roadside Assistance' },
      { key: 'customizingEquipment', label: 'Customizing Equipment' },
      { key: 'customAudioSystem', label: 'Custom Audio System' },
      { key: 'transportationExpense', label: 'Transportation Expense' },
      { key: 'autoReplacement', label: 'Auto Replacement' },
      { key: 'originalEquipmentManufacturers', label: 'Original Equipment Manufacturers Coverage' },
      { key: 'mexicoCoverage', label: 'Mexico Coverage' },
      { key: 'rideSharing', label: 'Ride Sharing' },
      { key: 'portableElectronicMedia', label: 'Portable Electronic Media' },
      { key: 'tripInterruption', label: 'Trip Interruption' },
      { key: 'diminishingDeductible', label: 'Diminishing Deductible' }
    ];

    const vehicleCoverages: Record<string, Array<Record<string, unknown>>> = {};
    
    vehicles.forEach((vehicle: Record<string, unknown>) => {
      vehicleCoverages[vehicle.id as string] = vehicleCoverageTypes
        .filter(coverage => formData[`${coverage.key}_${vehicle.id as string}`])
        .map(coverage => ({
          label: coverage.label,
          value: formData[`${coverage.key}_${vehicle.id as string}`]
        }));
    });

    return vehicleCoverages;
  };

  const vehicles = getVehicleInfo();
  const coverageInfo = getCoverageInfo();
  const vehicleCoverageInfo = getVehicleCoverageInfo();

  // Format coverage value for display
  const formatCoverageValue = (field: Record<string, unknown>) => {
    if (field.type === 'percentage-currency' && field.baseField) {
      const baseValue = formData[field.baseField as string] as string || '0';
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

      {/* Vehicle Information for Auto Insurance */}
      {quoteTypeParam === 'auto-quote' && vehicles.length > 0 && (
        <div className="form-section" style={{ marginBottom: '20px' }}>
          <h3>Vehicle Information</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '15px' 
          }}>
            {vehicles.map((vehicle: Record<string, unknown>, index: number) => (
              <div key={vehicle.id as string} style={{ 
                padding: '15px', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                backgroundColor: '#fafafa'
              }}>
                <h4 style={{ 
                  margin: '0 0 10px 0',
                  fontSize: '16px',
                  color: '#2c5aa0'
                }}>
                  Vehicle {index + 1}
                </h4>
                <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                  <p style={{ margin: '0 0 3px 0' }}>
                    <strong>Year/Make/Model:</strong> {vehicle.modelYear as string} {vehicle.make as string} {vehicle.model as string}
                  </p>
                  <p style={{ margin: '0 0 3px 0' }}>
                    <strong>VIN:</strong> {vehicle.vin as string}
                  </p>
                  {!!vehicle.purchaseDate && (
                    <p style={{ margin: '0 0 3px 0' }}>
                      <strong>Purchase Date:</strong> {new Date(vehicle.purchaseDate as string).toLocaleDateString()}
                    </p>
                  )}
                  {!!vehicle.annualMileageDropdown && (
                    <p style={{ margin: '0' }}>
                      <strong>Annual Mileage:</strong> {vehicle.annualMileageDropdown as string}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coverage Summary */}
      {coverageInfo && coverageInfo.length > 0 && (
        <div className="form-section" style={{ marginBottom: '20px' }}>
          <h3>{quoteTypeParam === 'auto-quote' ? 'Policy-Level Coverage Summary' : 'Coverage Summary'}</h3>
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

      {/* Vehicle-Specific Coverage Summary for Auto Insurance */}
      {quoteTypeParam === 'auto-quote' && vehicles.length > 0 && (
        <div className="form-section" style={{ marginBottom: '20px' }}>
          <h3>Vehicle Coverage Summary</h3>
          <div style={{ 
            border: '1px solid #ddd',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            {/* Vehicle Headers */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: `300px repeat(${vehicles.length}, 1fr)`,
              backgroundColor: '#f8f9fa',
              borderBottom: '1px solid #ddd'
            }}>
              <div style={{ 
                padding: '12px', 
                borderRight: '1px solid #ddd',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                Coverage Type
              </div>
              {vehicles.map((vehicle: Record<string, unknown>, index: number) => (
                <div key={vehicle.id as string} style={{ 
                  padding: '12px', 
                  textAlign: 'center',
                  borderRight: index < vehicles.length - 1 ? '1px solid #ddd' : 'none',
                  fontWeight: 'bold',
                  fontSize: '12px'
                }}>
                  <div>Vehicle {index + 1}</div>
                  <div style={{ fontSize: '10px', color: '#666' }}>
                    {vehicle.modelYear as string} {vehicle.make as string} {vehicle.model as string}
                  </div>
                </div>
              ))}
            </div>

            {/* Coverage Rows */}
            {Object.keys(vehicleCoverageInfo).length > 0 && 
              vehicleCoverageInfo[vehicles[0]?.id as string]?.map((coverage: Record<string, unknown>, rowIndex: number) => (
                <div key={coverage.label as string} style={{ 
                  display: 'grid', 
                  gridTemplateColumns: `300px repeat(${vehicles.length}, 1fr)`,
                  backgroundColor: rowIndex % 2 === 0 ? '#f9f9f9' : 'white',
                  borderBottom: '1px solid #eee'
                }}>
                  <div style={{ 
                    padding: '8px 12px', 
                    borderRight: '1px solid #ddd',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '12px'
                  }}>
                    {coverage.label as string}
                  </div>
                  {vehicles.map((vehicle: Record<string, unknown>, vehicleIndex: number) => {
                    const vehicleCoverage = vehicleCoverageInfo[vehicle.id as string]?.find(
                      (vc: Record<string, unknown>) => vc.label === coverage.label
                    );
                    return (
                      <div key={`${coverage.label}_${vehicle.id}`} style={{ 
                        padding: '8px', 
                        borderRight: vehicleIndex < vehicles.length - 1 ? '1px solid #ddd' : 'none',
                        fontSize: '11px',
                        color: '#2c5aa0',
                        fontWeight: '500'
                      }}>
                        {(vehicleCoverage?.value as string) || 'No Coverage'}
                      </div>
                    );
                  })}
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* Policy Holder Information Summary */}
      <div className="form-section" style={{ marginBottom: '20px' }}>
        <h3>Policy Holder Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          {(quoteTypeParam === 'auto-quote' ? [
            { key: 'firstName', label: 'First Name' },
            { key: 'lastName', label: 'Last Name' },
            { key: 'dateOfBirth', label: 'Date of Birth' },
            { key: 'gender', label: 'Gender' },
            { key: 'maritalStatus', label: 'Marital Status' },
            { key: 'licenseNumber', label: 'Driver License Number' },
            { key: 'ratingState', label: 'Rating State' },
            { key: 'state', label: 'Vehicle Garaged State' },
            { key: 'occupation', label: 'Occupation' },
            { key: 'education', label: 'Education Level' }
          ] : [
            { key: 'firstName', label: 'First Name' },
            { key: 'lastName', label: 'Last Name' },
            { key: 'phoneNumber', label: 'Phone Number' },
            { key: 'emailAddress', label: 'Email Address' },
            { key: 'streetAddress', label: 'Property Address' },
            { key: 'city', label: 'City' },
            { key: 'state', label: 'State' },
            { key: 'zipCode', label: 'Zip Code' }
          ]).map(item => {
            const value = formData[item.key];
            if (value) {
              return (
                <div key={item.key}>
                  <p style={{ fontWeight: 'bold', margin: '0 0 2px 0', fontSize: '12px', color: '#666' }}>
                    {item.label}
                  </p>
                  <p style={{ margin: '0', fontSize: '14px' }}>
                    {item.key === 'dateOfBirth' && value ? 
                      new Date(value.toString()).toLocaleDateString() : 
                      value.toString()
                    }
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