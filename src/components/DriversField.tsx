'use client';

import React, { useState } from 'react';

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

interface DriversFieldProps {
  primaryDriverInfo?: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
    maritalStatus?: string;
    state?: string;
    licenseNumber?: string;
  };
  onDriversChange: (drivers: Driver[]) => void;
  existingDrivers?: Driver[];
}

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const RELATIONSHIP_OPTIONS = [
  '(Select)', 'Insured', 'Spouse', 'Child', 'Parent', 'Sibling', 'Other Relative', 'Roommate', 'Other'
];

const DRIVER_TYPE_OPTIONS = [
  '(Select)', 'Rated', 'Listed', 'Excluded'
];

const MARITAL_STATUS_OPTIONS = [
  '(Select)', 'Single', 'Married', 'Divorced', 'Widowed', 'Separated', 'Domestic Partner'
];

const GENDER_OPTIONS = [
  '(Select)', 'Male', 'Female', 'Non-binary', 'Prefer not to say'
];

export default function DriversField({ primaryDriverInfo, onDriversChange, existingDrivers = [] }: DriversFieldProps) {
  const [drivers, setDrivers] = useState<Driver[]>(() => {
    // Always create/update the primary driver with latest info
    const primaryDriver: Driver = {
      id: 'driver_1',
      firstName: primaryDriverInfo?.firstName || '',
      middleName: '',
      lastName: primaryDriverInfo?.lastName || '',
      birthDate: primaryDriverInfo?.dateOfBirth || '',
      gender: primaryDriverInfo?.gender || '',
      maritalStatus: primaryDriverInfo?.maritalStatus || '',
      relationshipToInsured: 'Insured',
      driverType: 'Rated',
      licenseState: primaryDriverInfo?.state || '',
      licenseNumber: primaryDriverInfo?.licenseNumber || '',
      ageWhenFirstLicensed: '',
      licenseSuspended: '',
      sr22Filing: 'No',
      isPrimary: true
    };

    if (existingDrivers.length > 0) {
      // Update the first driver with primary info, keep the rest as is
      const updatedDrivers = [...existingDrivers];
      const existingPrimaryDriver = updatedDrivers.find(d => d.isPrimary) || updatedDrivers[0];
      
      if (existingPrimaryDriver) {
        // Preserve manually entered fields like ageWhenFirstLicensed and licenseSuspended
        updatedDrivers[0] = {
          ...primaryDriver,
          ageWhenFirstLicensed: existingPrimaryDriver.ageWhenFirstLicensed || '',
          licenseSuspended: existingPrimaryDriver.licenseSuspended || '',
          sr22Filing: existingPrimaryDriver.sr22Filing || 'No',
          middleName: existingPrimaryDriver.middleName || '',
        };
      }
      
      return updatedDrivers;
    }
    
    return [primaryDriver];
  });

  const [expandedDrivers, setExpandedDrivers] = useState<Set<string>>(new Set(['driver_1']));

  // Update primary driver when primaryDriverInfo changes
  React.useEffect(() => {
    if (primaryDriverInfo && drivers.length > 0) {
      const currentPrimaryDriver = drivers[0];
      const updatedPrimaryDriver: Driver = {
        ...currentPrimaryDriver,
        firstName: primaryDriverInfo.firstName || '',
        lastName: primaryDriverInfo.lastName || '',
        birthDate: primaryDriverInfo.dateOfBirth || '',
        gender: primaryDriverInfo.gender || '',
        maritalStatus: primaryDriverInfo.maritalStatus || '',
        licenseState: primaryDriverInfo.state || '',
        licenseNumber: primaryDriverInfo.licenseNumber || '',
        relationshipToInsured: 'Insured',
        driverType: 'Rated',
        isPrimary: true
      };

      // Only update if there are actual changes
      const hasChanges = 
        currentPrimaryDriver.firstName !== updatedPrimaryDriver.firstName ||
        currentPrimaryDriver.lastName !== updatedPrimaryDriver.lastName ||
        currentPrimaryDriver.birthDate !== updatedPrimaryDriver.birthDate ||
        currentPrimaryDriver.gender !== updatedPrimaryDriver.gender ||
        currentPrimaryDriver.maritalStatus !== updatedPrimaryDriver.maritalStatus ||
        currentPrimaryDriver.licenseState !== updatedPrimaryDriver.licenseState ||
        currentPrimaryDriver.licenseNumber !== updatedPrimaryDriver.licenseNumber;

      if (hasChanges) {
        const newDrivers = [updatedPrimaryDriver, ...drivers.slice(1)];
        setDrivers(newDrivers);
        onDriversChange(newDrivers);
      }
    }
  }, [primaryDriverInfo, drivers, onDriversChange]);

  const toggleDriverExpansion = (driverId: string) => {
    setExpandedDrivers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(driverId)) {
        newSet.delete(driverId);
      } else {
        newSet.add(driverId);
      }
      return newSet;
    });
  };

  const addDriver = () => {
    const newDriver: Driver = {
      id: `driver_${drivers.length + 1}`,
      firstName: '',
      middleName: '',
      lastName: '',
      birthDate: '',
      gender: '',
      maritalStatus: '',
      relationshipToInsured: '',
      driverType: '',
      licenseState: '',
      licenseNumber: '',
      ageWhenFirstLicensed: '',
      licenseSuspended: '',
      sr22Filing: 'No',
      isPrimary: false
    };
    
    const newDrivers = [...drivers, newDriver];
    setDrivers(newDrivers);
    onDriversChange(newDrivers);
    setExpandedDrivers(prev => new Set([...prev, newDriver.id]));
  };

  const removeDriver = (driverId: string) => {
    const newDrivers = drivers.filter(driver => driver.id !== driverId);
    setDrivers(newDrivers);
    onDriversChange(newDrivers);
    setExpandedDrivers(prev => {
      const newSet = new Set(prev);
      newSet.delete(driverId);
      return newSet;
    });
  };

  const updateDriver = (driverId: string, field: string, value: string) => {
    const newDrivers = drivers.map(driver => 
      driver.id === driverId ? { ...driver, [field]: value } : driver
    );
    setDrivers(newDrivers);
    onDriversChange(newDrivers);
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '20px' }}>
        <button
          onClick={addDriver}
          style={{
            backgroundColor: '#fff',
            border: '2px solid #007bff',
            color: '#007bff',
            padding: '8px 16px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ⊕ Add Driver
        </button>
      </div>

      <div style={{ 
        backgroundColor: '#e3f2fd', 
        padding: '12px', 
        borderRadius: '4px', 
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ color: '#1976d2', fontSize: '16px' }}>ℹ</span>
        <span style={{ color: '#1976d2', fontSize: '14px' }}>
          Note: All household members of driving age must be listed.
        </span>
      </div>

      {drivers.map((driver, index) => (
        <div key={driver.id} style={{ 
          border: '1px solid #ddd', 
          borderRadius: '4px', 
          marginBottom: '16px',
          backgroundColor: '#fff'
        }}>
          <div 
            style={{ 
              padding: '16px',
              backgroundColor: '#f8f9fa',
              borderBottom: expandedDrivers.has(driver.id) ? '1px solid #ddd' : 'none',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
            onClick={() => toggleDriverExpansion(driver.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>
                {expandedDrivers.has(driver.id) ? '▼' : '▶'}
              </span>
              <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Driver {index + 1}
              </span>
            </div>
            
            {!driver.isPrimary && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeDriver(driver.id);
                }}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#dc3545',
                  fontSize: '18px',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                ×
              </button>
            )}
          </div>

          {expandedDrivers.has(driver.id) && (
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    value={driver.firstName}
                    onChange={(e) => updateDriver(driver.id, 'firstName', e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Middle Name
                  </label>
                  <input
                    type="text"
                    value={driver.middleName}
                    onChange={(e) => updateDriver(driver.id, 'middleName', e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={driver.lastName}
                    onChange={(e) => updateDriver(driver.id, 'lastName', e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Birth Date
                  </label>
                  <input
                    type="date"
                    value={driver.birthDate}
                    onChange={(e) => updateDriver(driver.id, 'birthDate', e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Gender
                  </label>
                  <select
                    value={driver.gender}
                    onChange={(e) => updateDriver(driver.id, 'gender', e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  >
                    {GENDER_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Marital Status
                  </label>
                  <select
                    value={driver.maritalStatus}
                    onChange={(e) => updateDriver(driver.id, 'maritalStatus', e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  >
                    {MARITAL_STATUS_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Relationship to Insured
                  </label>
                  <select
                    value={driver.relationshipToInsured}
                    onChange={(e) => updateDriver(driver.id, 'relationshipToInsured', e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    disabled={driver.isPrimary}
                  >
                    {RELATIONSHIP_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Driver Type
                  </label>
                  <select
                    value={driver.driverType}
                    onChange={(e) => updateDriver(driver.id, 'driverType', e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  >
                    {DRIVER_TYPE_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    License State
                  </label>
                  <select
                    value={driver.licenseState}
                    onChange={(e) => updateDriver(driver.id, 'licenseState', e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  >
                    <option value="">(Select)</option>
                    {US_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Driver License Number
                  </label>
                  <input
                    type="text"
                    value={driver.licenseNumber}
                    onChange={(e) => updateDriver(driver.id, 'licenseNumber', e.target.value)}
                    style={{ width: '300px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    placeholder="Enter license number"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Age when first licensed <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="number"
                    value={driver.ageWhenFirstLicensed}
                    onChange={(e) => updateDriver(driver.id, 'ageWhenFirstLicensed', e.target.value)}
                    style={{ width: '200px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    min="14"
                    max="100"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold' }}>
                  Has this driver's license been suspended/revoked in the last 5 years? <span style={{ color: 'red' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="radio"
                      name={`licenseSuspended_${driver.id}`}
                      value="Yes"
                      checked={driver.licenseSuspended === 'Yes'}
                      onChange={(e) => updateDriver(driver.id, 'licenseSuspended', e.target.value)}
                    />
                    Yes
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="radio"
                      name={`licenseSuspended_${driver.id}`}
                      value="No"
                      checked={driver.licenseSuspended === 'No'}
                      onChange={(e) => updateDriver(driver.id, 'licenseSuspended', e.target.value)}
                    />
                    No
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold' }}>
                  SR-22 Filing
                </label>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="radio"
                      name={`sr22Filing_${driver.id}`}
                      value="Yes"
                      checked={driver.sr22Filing === 'Yes'}
                      onChange={(e) => updateDriver(driver.id, 'sr22Filing', e.target.value)}
                    />
                    Yes
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="radio"
                      name={`sr22Filing_${driver.id}`}
                      value="No"
                      checked={driver.sr22Filing === 'No'}
                      onChange={(e) => updateDriver(driver.id, 'sr22Filing', e.target.value)}
                    />
                    No
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}