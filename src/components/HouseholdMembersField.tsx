'use client';

import React from 'react';

interface HouseholdMember {
  id: string;
  name: string;
  relationship: string;
  gender: string;
  birthdate: string;
  selected?: boolean;
}

interface HouseholdVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  selected?: boolean;
}

interface HouseholdMembersFieldProps {
  onDriverSelectionChange: (driverId: string, selected: boolean) => void;
  onVehicleSelectionChange: (vehicleId: string, selected: boolean) => void;
  onRelationshipChange: (driverId: string, relationship: string) => void;
  formData: Record<string, unknown>;
  namedInsuredInfo?: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
  };
}

const SAMPLE_DRIVERS: HouseholdMember[] = [
  {
    id: 'driver1',
    name: 'SARAH THOMPSON',
    relationship: '<Select>',
    gender: 'Female',
    birthdate: '**/*/1985'
  },
  {
    id: 'driver2',
    name: 'MICHAEL RODRIGUEZ',
    relationship: '<Select>',
    gender: 'Male',
    birthdate: '**/*/2005'
  },
  {
    id: 'driver3',
    name: 'JESSICA CHEN',
    relationship: '<Select>',
    gender: 'Female',
    birthdate: '**/*/1992'
  }
];

const SAMPLE_VEHICLES: HouseholdVehicle[] = [
  {
    id: 'vehicle1',
    make: 'TOYOTA',
    model: 'CAMRY SE',
    year: 2021,
    vin: '4T1G11AK5MU123456'
  },
  {
    id: 'vehicle2',
    make: 'HONDA',
    model: 'CR-V EX',
    year: 2020,
    vin: '2HKRW2H85LH654321'
  },
  {
    id: 'vehicle3',
    make: 'FORD',
    model: 'F-150 XLT',
    year: 2019,
    vin: '1FTEW1EP5KFC987654'
  }
];

const RELATIONSHIP_OPTIONS = [
  '<Select>',
  'Resident Spouse/Partner/Relative',
  'Child',
  'Roommate',
  'Does not live at the address',
  'Duplicate Operator',
  'Unknown - Customer does not know this operator',
  'Deceased',
  'Other'
];

export default function HouseholdMembersField({ 
  onDriverSelectionChange: _onDriverSelectionChange, 
  onVehicleSelectionChange,
  onRelationshipChange,
  formData,
  namedInsuredInfo 
}: HouseholdMembersFieldProps) {

  // Derive selected vehicles from formData
  const selectedVehicles = SAMPLE_VEHICLES
    .map(vehicle => vehicle.id)
    .filter(vehicleId => formData[`selectedVehicle_${vehicleId}`]);

  const handleVehicleSelection = (vehicleId: string, selected: boolean) => {
    onVehicleSelectionChange(vehicleId, selected);
  };

  const handleRelationshipChange = (driverId: string, relationship: string) => {
    onRelationshipChange(driverId, relationship);
  };

  return (
    <div style={{ marginTop: '30px' }}>
      {/* People in Household Section */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ marginBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>People in Household</h3>
        <p style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>
          We found these other potential people in the household. Please indicate their relationship to the insured if any.
        </p>
        
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '180px 80px 100px 240px',
            backgroundColor: '#f5f5f5',
            borderBottom: '1px solid #ddd',
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '12px'
          }}>
            <div>Name</div>
            <div>Gender</div>
            <div>Birthdate</div>
            <div>*Relationship To Insured</div>
          </div>
          
          {/* Named Insured Row */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '180px 80px 100px 240px',
            borderBottom: '1px solid #ddd',
            padding: '12px',
            fontSize: '14px',
            backgroundColor: '#fff'
          }}>
            <div style={{ fontWeight: 'bold' }}>
              {namedInsuredInfo?.firstName && namedInsuredInfo?.lastName 
                ? `${namedInsuredInfo.firstName.toUpperCase()} ${namedInsuredInfo.lastName.toUpperCase()}`
                : 'NAMED INSURED'}
            </div>
            <div>{namedInsuredInfo?.gender || 'Male'}</div>
            <div>{namedInsuredInfo?.dateOfBirth || '**/*/****'}</div>
            <div>
              <select style={{ width: '100%', padding: '4px', border: '1px solid #ccc' }} defaultValue="Named insured">
                <option>Named insured</option>
              </select>
            </div>
          </div>

          {/* Suggested Drivers */}
          {SAMPLE_DRIVERS.map((driver) => (
            <div key={driver.id} style={{ 
              display: 'grid', 
              gridTemplateColumns: '180px 80px 100px 240px',
              borderBottom: '1px solid #ddd',
              padding: '12px',
              fontSize: '14px',
              backgroundColor: '#fff'
            }}>
              <div style={{ fontWeight: 'bold' }}>{driver.name}</div>
              <div>{driver.gender}</div>
              <div>{driver.birthdate}</div>
              <div>
                <select 
                  style={{ width: '100%', padding: '4px', border: '1px solid #ccc' }} 
                  value={(formData[`relationship_${driver.id}`] as string) || '<Select>'}
                  onChange={(e) => handleRelationshipChange(driver.id, e.target.value)}
                >
                  {RELATIONSHIP_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vehicles in Household Section */}
      <div>
        <h3 style={{ marginBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>Vehicles in Household</h3>
        <p style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>
          Select vehicles to include them in the policy. You can add, modify and delete vehicles later on the Vehicles screen.
        </p>
        
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '100px 90px 150px 70px 190px',
            backgroundColor: '#f5f5f5',
            borderBottom: '1px solid #ddd',
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '12px'
          }}>
            <div>Include in Policy?</div>
            <div>Make</div>
            <div>Model</div>
            <div>Year</div>
            <div>VIN</div>
          </div>
          
          {/* Vehicle Rows */}
          {SAMPLE_VEHICLES.map((vehicle) => (
            <div key={vehicle.id} style={{ 
              display: 'grid', 
              gridTemplateColumns: '100px 90px 150px 70px 190px',
              borderBottom: '1px solid #ddd',
              padding: '12px',
              fontSize: '14px',
              backgroundColor: selectedVehicles.includes(vehicle.id) ? '#f9f9f9' : '#fff'
            }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <input
                  type="checkbox"
                  checked={selectedVehicles.includes(vehicle.id)}
                  onChange={(e) => handleVehicleSelection(vehicle.id, e.target.checked)}
                />
              </div>
              <div>{vehicle.make}</div>
              <div>{vehicle.model}</div>
              <div>{vehicle.year}</div>
              <div>{vehicle.vin}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <strong>Note:</strong> Fields designated with an(*) are required fields.
      </div>
    </div>
  );
}