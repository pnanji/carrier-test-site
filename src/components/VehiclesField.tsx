'use client';

import React, { useState } from 'react';

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

interface VehiclesFieldProps {
  onVehiclesChange: (vehicles: Vehicle[]) => void;
  existingVehicles?: Vehicle[];
}

const VEHICLE_YEARS = (() => {
  const currentYear = new Date().getFullYear();
  const years = ['(Select)'];
  for (let year = currentYear; year >= currentYear - 25; year--) {
    years.push(year.toString());
  }
  years.push('Older');
  return years;
})();

const POPULAR_MAKES = [
  '(Select)', 'Acura', 'Audi', 'BMW', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler',
  'Dodge', 'Ford', 'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jeep', 'Kia', 'Lexus',
  'Lincoln', 'Mazda', 'Mercedes-Benz', 'Mitsubishi', 'Nissan', 'Ram', 'Subaru',
  'Tesla', 'Toyota', 'Volkswagen', 'Volvo', 'Other'
];

export default function VehiclesField({ onVehiclesChange, existingVehicles = [] }: VehiclesFieldProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    if (existingVehicles.length > 0) {
      return existingVehicles;
    }
    
    // Start with one required vehicle
    return [{
      id: 'vehicle_1',
      vin: '',
      modelYear: '',
      make: '',
      model: '',
      purchaseDate: '',
      annualMileageText: '',
      annualMileageDropdown: '',
      isRentedOrLeased: ''
    }];
  });

  const [expandedVehicles, setExpandedVehicles] = useState<Set<string>>(new Set(['vehicle_1']));

  const toggleVehicleExpansion = (vehicleId: string) => {
    setExpandedVehicles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(vehicleId)) {
        newSet.delete(vehicleId);
      } else {
        newSet.add(vehicleId);
      }
      return newSet;
    });
  };

  const addVehicle = () => {
    const newVehicle: Vehicle = {
      id: `vehicle_${vehicles.length + 1}`,
      vin: '',
      modelYear: '',
      make: '',
      model: '',
      purchaseDate: '',
      annualMileageText: '',
      annualMileageDropdown: '',
      isRentedOrLeased: ''
    };
    
    const newVehicles = [...vehicles, newVehicle];
    setVehicles(newVehicles);
    onVehiclesChange(newVehicles);
    setExpandedVehicles(prev => new Set([...prev, newVehicle.id]));
  };

  const removeVehicle = (vehicleId: string) => {
    // Don't allow removing the last vehicle
    if (vehicles.length <= 1) return;
    
    const newVehicles = vehicles.filter(vehicle => vehicle.id !== vehicleId);
    setVehicles(newVehicles);
    onVehiclesChange(newVehicles);
    setExpandedVehicles(prev => {
      const newSet = new Set(prev);
      newSet.delete(vehicleId);
      return newSet;
    });
  };

  const updateVehicle = (vehicleId: string, field: string, value: string) => {
    const newVehicles = vehicles.map(vehicle => 
      vehicle.id === vehicleId ? { ...vehicle, [field]: value } : vehicle
    );
    setVehicles(newVehicles);
    onVehiclesChange(newVehicles);
  };



  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '20px' }}>
        <button
          onClick={addVehicle}
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
          ⊕ Add Vehicle
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
          At least one vehicle is required. All vehicles that will be covered under this policy must be listed.
        </span>
      </div>

      {vehicles.map((vehicle, index) => (
        <div key={vehicle.id} style={{ 
          border: '1px solid #ddd', 
          borderRadius: '4px', 
          marginBottom: '16px',
          backgroundColor: '#fff'
        }}>
          <div 
            style={{ 
              padding: '16px',
              backgroundColor: '#f8f9fa',
              borderBottom: expandedVehicles.has(vehicle.id) ? '1px solid #ddd' : 'none',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
            onClick={() => toggleVehicleExpansion(vehicle.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>
                {expandedVehicles.has(vehicle.id) ? '▼' : '▶'}
              </span>
              <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Vehicle {index + 1}
              </span>
              {vehicle.make && vehicle.model && (
                <span style={{ color: '#666', fontSize: '14px' }}>
                  - {vehicle.modelYear} {vehicle.make} {vehicle.model}
                </span>
              )}
            </div>
            
            {vehicles.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeVehicle(vehicle.id);
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

          {expandedVehicles.has(vehicle.id) && (
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  VIN (Vehicle Identification Number)
                </label>
                <input
                  type="text"
                  value={vehicle.vin}
                  onChange={(e) => updateVehicle(vehicle.id, 'vin', e.target.value.toUpperCase())}
                  style={{ 
                    width: '300px', 
                    padding: '8px', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px',
                    fontFamily: 'monospace'
                  }}
                  placeholder="17-character VIN"
                  maxLength={17}
                />
                {vehicle.vin && vehicle.vin.length !== 17 && (
                  <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                    VIN must be exactly 17 characters
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Model Year <span style={{ color: 'red' }}>*</span>
                  </label>
                  <select
                    value={vehicle.modelYear}
                    onChange={(e) => updateVehicle(vehicle.id, 'modelYear', e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  >
                    {VEHICLE_YEARS.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Make <span style={{ color: 'red' }}>*</span>
                  </label>
                  <select
                    value={vehicle.make}
                    onChange={(e) => updateVehicle(vehicle.id, 'make', e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  >
                    {POPULAR_MAKES.map(make => (
                      <option key={make} value={make}>{make}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Model <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={vehicle.model}
                    onChange={(e) => updateVehicle(vehicle.id, 'model', e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    placeholder="e.g., Civic, Camry, F-150"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Purchase Date <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="date"
                  value={vehicle.purchaseDate}
                  onChange={(e) => updateVehicle(vehicle.id, 'purchaseDate', e.target.value)}
                  style={{ width: '200px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Annual Mileage
                  </label>
                  <input
                    type="text"
                    value={vehicle.annualMileageText}
                    onChange={(e) => updateVehicle(vehicle.id, 'annualMileageText', e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    placeholder="Enter annual mileage"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Annual Mileage
                  </label>
                  <select
                    value={vehicle.annualMileageDropdown}
                    onChange={(e) => updateVehicle(vehicle.id, 'annualMileageDropdown', e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  >
                    <option value="">(Select)</option>
                    <option value="0-2,500">0 - 2,500 miles</option>
                    <option value="2,501-7,500">2,501 - 7,500 miles</option>
                    <option value="7,501-15,000">7,501 - 15,000 miles</option>
                    <option value="15,001-20,000">15,001 - 20,000 miles</option>
                    <option value="20,001-25,000">20,001 - 25,000 miles</option>
                    <option value="25,000+">Over 25,000 miles</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold' }}>
                  Is vehicle ever rented or leased to others for a fee? <span style={{ color: 'red' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="radio"
                      name={`isRentedOrLeased_${vehicle.id}`}
                      value="Yes"
                      checked={vehicle.isRentedOrLeased === 'Yes'}
                      onChange={(e) => updateVehicle(vehicle.id, 'isRentedOrLeased', e.target.value)}
                    />
                    Yes
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="radio"
                      name={`isRentedOrLeased_${vehicle.id}`}
                      value="No"
                      checked={vehicle.isRentedOrLeased === 'No'}
                      onChange={(e) => updateVehicle(vehicle.id, 'isRentedOrLeased', e.target.value)}
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