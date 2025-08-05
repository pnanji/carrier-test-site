'use client';

import React from 'react';

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

interface CoverageFieldProps {
  formData: Record<string, any>;
  onFieldChange: (fieldName: string, value: string | boolean) => void;
}

const POLICY_LEVEL_COVERAGES = [
  {
    name: 'bodilyInjury',
    label: 'Bodily Injury',
    options: ['25/50', '50/100', '100/200', '100/300', '250/500', '500/1000']
  },
  {
    name: 'combinedSingleLimits',
    label: 'Combined Single Limits',
    options: ['No Coverage', '$50,000', '$100,000', '$200,000', '$300,000', '$500,000', '$1,000,000']
  },
  {
    name: 'propertyDamageLiability',
    label: 'Property Damage Liability',
    options: ['25,000', '50,000', '100,000', '200,000', '300,000', '500,000']
  },
  {
    name: 'uninsuredMotorist',
    label: 'Uninsured/Underinsured Motorist',
    options: ['25/50', '50/100', '100/200', '100/300', '250/500', '500/1000']
  },
  {
    name: 'firstAccidentForgiveness',
    label: 'First Accident Forgiveness',
    options: ['No Coverage', 'Included']
  },
  {
    name: 'extendedNonOwnedCoverage',
    label: 'Extended Non-Owned Coverage',
    options: ['No Coverage', 'Included']
  },
  {
    name: 'medicalPayments',
    label: 'Medical Payments',
    options: ['No Coverage', '1,000', '2,500', '5,000', '10,000', '25,000']
  }
];

const VEHICLE_COVERAGES = [
  {
    name: 'uninsuredMotoristsPropertyDamage',
    label: 'Uninsured/Underinsured Motorists Property Damage',
    options: ['No Coverage', '$3,500', '$5,000', '$10,000', '$15,000', '$25,000']
  },
  {
    name: 'collision',
    label: 'Collision',
    options: ['No Coverage', '$250 Deductible', '$500 Deductible', '$1000 Deductible', '$2500 Deductible']
  },
  {
    name: 'comprehensive',
    label: 'Comprehensive',
    options: ['No Coverage', '$250 Deductible', '$500 Deductible', '$1000 Deductible', '$2500 Deductible']
  },
  {
    name: 'autoLoanLease',
    label: 'Auto Loan/Lease',
    options: ['No Coverage', 'Included']
  },
  {
    name: 'roadsideAssistance',
    label: 'Roadside Assistance',
    options: ['No Coverage', '75', '100', '150', '200']
  },
  {
    name: 'customizingEquipment',
    label: 'Customizing Equipment',
    options: ['No Coverage', 'Included/1000', 'Included/2500', 'Included/5000']
  },
  {
    name: 'customAudioSystem',
    label: 'Custom Audio System',
    options: ['No Coverage', 'Included/1000', 'Included/2500', 'Included/5000']
  },
  {
    name: 'transportationExpense',
    label: 'Transportation Expense',
    options: ['No Coverage', '20 day/600 max', '30 day/900 max', '45 day/1350 max']
  },
  {
    name: 'autoReplacement',
    label: 'Auto Replacement',
    options: ['No Coverage', 'Included']
  },
  {
    name: 'originalEquipmentManufacturers',
    label: 'Original Equipment Manufacturers Coverage',
    options: ['No Coverage', 'Included']
  },
  {
    name: 'mexicoCoverage',
    label: 'Mexico Coverage',
    options: ['No Coverage', 'Included']
  },
  {
    name: 'rideSharing',
    label: 'Ride Sharing',
    options: ['No Coverage', 'Included']
  },
  {
    name: 'portableElectronicMedia',
    label: 'Portable Electronic Media',
    options: ['No Coverage', 'Included']
  },
  {
    name: 'tripInterruption',
    label: 'Trip Interruption',
    options: ['No Coverage', 'Included']
  },
  {
    name: 'diminishingDeductible',
    label: 'Diminishing Deductible',
    options: ['No Coverage', 'Included']
  }
];

export default function CoverageField({ formData, onFieldChange }: CoverageFieldProps) {
  // Parse vehicles from form data
  const vehicles: Vehicle[] = React.useMemo(() => {
    if (formData.vehicles) {
      try {
        return JSON.parse(formData.vehicles as string);
      } catch (e) {
        console.error('Error parsing vehicles data:', e);
        return [];
      }
    }
    return [];
  }, [formData.vehicles]);

  // Set default values for required policy coverages
  React.useEffect(() => {
    const defaults: Record<string, string> = {};
    
    // Set defaults if values don't exist
    if (!formData.bodilyInjury) defaults.bodilyInjury = '100/300';
    if (!formData.combinedSingleLimits) defaults.combinedSingleLimits = 'No Coverage';
    if (!formData.propertyDamageLiability) defaults.propertyDamageLiability = '50,000';
    if (!formData.uninsuredMotorist) defaults.uninsuredMotorist = '100/300';
    if (!formData.firstAccidentForgiveness) defaults.firstAccidentForgiveness = 'No Coverage';
    if (!formData.extendedNonOwnedCoverage) defaults.extendedNonOwnedCoverage = 'No Coverage';
    if (!formData.medicalPayments) defaults.medicalPayments = '5,000';

    // Set defaults for vehicle coverages for each vehicle
    vehicles.forEach((vehicle) => {
      VEHICLE_COVERAGES.forEach((coverage) => {
        const fieldName = `${coverage.name}_${vehicle.id}`;
        if (!formData[fieldName]) {
          if (coverage.name === 'collision' || coverage.name === 'comprehensive') {
            defaults[fieldName] = '1000 Deductible';
          } else if (coverage.name === 'roadsideAssistance') {
            defaults[fieldName] = '75';
          } else if (coverage.name === 'customizingEquipment' || coverage.name === 'customAudioSystem') {
            defaults[fieldName] = 'Included/1000';
          } else if (coverage.name === 'transportationExpense') {
            defaults[fieldName] = '20 day/600 max';
          } else {
            defaults[fieldName] = 'No Coverage';
          }
        }
      });
    });

    if (Object.keys(defaults).length > 0) {
      Object.entries(defaults).forEach(([key, value]) => {
        onFieldChange(key, value);
      });
    }
  }, [vehicles, formData, onFieldChange]);

  return (
    <div style={{ marginTop: '20px' }}>
      {/* Auto Policy Coverages Selection */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ 
          color: '#4a90e2', 
          marginBottom: '20px', 
          fontSize: '18px', 
          fontWeight: 'bold' 
        }}>
          Auto Policy Coverages Selection
        </h3>
        
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          border: '1px solid #ddd'
        }}>
          <tbody>
            {POLICY_LEVEL_COVERAGES.map((coverage, index) => (
              <tr key={coverage.name} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                <td style={{ 
                  padding: '12px', 
                  border: '1px solid #ddd',
                  fontWeight: 'normal'
                }}>
                  {coverage.label}
                </td>
                <td style={{ 
                  padding: '12px', 
                  border: '1px solid #ddd' 
                }}>
                  <select
                    value={formData[coverage.name] || coverage.options[0]}
                    onChange={(e) => onFieldChange(coverage.name, e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '8px', 
                      border: '1px solid #ccc', 
                      borderRadius: '4px' 
                    }}
                  >
                    {coverage.options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vehicle Coverages Selection */}
      {vehicles.length > 0 && (
        <div>
          <h3 style={{ 
            color: '#4a90e2', 
            marginBottom: '20px', 
            fontSize: '18px', 
            fontWeight: 'bold' 
          }}>
            Vehicle Coverages Selection
          </h3>
          
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
                fontWeight: 'bold'
              }}>
                Coverage Type
              </div>
              {vehicles.map((vehicle, index) => (
                <div key={vehicle.id} style={{ 
                  padding: '12px', 
                  textAlign: 'center',
                  borderRight: index < vehicles.length - 1 ? '1px solid #ddd' : 'none',
                  fontWeight: 'bold'
                }}>
                  <div>{index + 1}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {vehicle.modelYear} {vehicle.make} {vehicle.model}
                  </div>
                </div>
              ))}
            </div>

            {/* Coverage Rows */}
            {VEHICLE_COVERAGES.map((coverage, rowIndex) => (
              <div key={coverage.name} style={{ 
                display: 'grid', 
                gridTemplateColumns: `300px repeat(${vehicles.length}, 1fr)`,
                backgroundColor: rowIndex % 2 === 0 ? '#f9f9f9' : 'white',
                borderBottom: rowIndex < VEHICLE_COVERAGES.length - 1 ? '1px solid #ddd' : 'none'
              }}>
                <div style={{ 
                  padding: '12px', 
                  borderRight: '1px solid #ddd',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {coverage.label}
                  {/* Add info icon for some coverages */}
                  {['roadsideAssistance', 'customizingEquipment', 'customAudioSystem', 'transportationExpense', 'autoReplacement', 'mexicoCoverage', 'rideSharing', 'portableElectronicMedia', 'tripInterruption'].includes(coverage.name) && (
                    <span style={{ 
                      marginLeft: '8px', 
                      color: '#666', 
                      fontSize: '12px',
                      cursor: 'help'
                    }}>
                      ⓘ
                    </span>
                  )}
                </div>
                {vehicles.map((vehicle, vehicleIndex) => (
                  <div key={`${coverage.name}_${vehicle.id}`} style={{ 
                    padding: '8px', 
                    borderRight: vehicleIndex < vehicles.length - 1 ? '1px solid #ddd' : 'none'
                  }}>
                    <select
                      value={formData[`${coverage.name}_${vehicle.id}`] || coverage.options[0]}
                      onChange={(e) => onFieldChange(`${coverage.name}_${vehicle.id}`, e.target.value)}
                      style={{ 
                        width: '100%', 
                        padding: '6px', 
                        border: '1px solid #ccc', 
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}
                    >
                      {coverage.options.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {vehicles.length === 0 && (
        <div style={{ 
          backgroundColor: '#fff3cd', 
          color: '#856404', 
          padding: '16px', 
          borderRadius: '4px',
          border: '1px solid #ffeaa7'
        }}>
          <strong>No vehicles found.</strong> Please complete the Vehicle Information step first to configure vehicle-specific coverages.
        </div>
      )}
    </div>
  );
}