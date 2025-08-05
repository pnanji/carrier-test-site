import { QuoteType } from '@/types/quote';

export const quoteTypes: Record<string, QuoteType> = {
  'home-quote': {
    id: 'home-quote',
    name: 'Home Insurance Quote',
    steps: [
      {
        id: 1,
        title: 'Property Address',
        description: 'What is Your Property Address?',
        fields: [
          {
            name: 'streetAddress',
            label: 'Street Address',
            type: 'text',
            required: true,
            placeholder: 'Enter your street address'
          },
          {
            name: 'addressLine2',
            label: 'Address Line 2',
            type: 'text',
            placeholder: 'Apartment, suite, etc. (optional)'
          },
          {
            name: 'city',
            label: 'City',
            type: 'text',
            required: true
          },
          {
            name: 'state',
            label: 'State',
            type: 'select',
            required: true,
            options: ['FL', 'AL', 'GA', 'TX', 'CA', 'NY', 'Other']
          },
          {
            name: 'zipCode',
            label: 'Zip Code',
            type: 'text',
            required: true,
            placeholder: '12345'
          },
          {
            name: 'desiredCoverageStartDate',
            label: 'Desired Coverage Start Date',
            type: 'date',
            required: true
          },
          {
            name: 'policyType',
            label: 'Policy Type',
            type: 'select',
            required: true,
            options: ['(Select)', 'Homeowners', 'Condo', 'Renters', 'Townhome']
          },
          {
            name: 'newConstruction',
            label: 'Check box if New Construction and home less than 30 days old',
            type: 'checkbox'
          }
        ]
      },
      {
        id: 2,
        title: 'Property Information',
        description: 'Tell us about your property',
        fields: [
          {
            name: 'yearBuilt',
            label: 'Year Built',
            type: 'text',
            required: true,
            placeholder: 'YYYY'
          },
          {
            name: 'homeType',
            label: 'Home Type',
            type: 'select',
            required: true,
            options: ['Single Family', 'Townhome', 'Condo', 'Mobile Home', 'Other']
          },
          {
            name: 'squareFootage',
            label: 'Square Footage',
            type: 'text',
            required: true,
            placeholder: 'Approximate square feet'
          },
          {
            name: 'bedrooms',
            label: 'Number of Bedrooms',
            type: 'select',
            required: true,
            options: ['1', '2', '3', '4', '5', '6+']
          },
          {
            name: 'bathrooms',
            label: 'Number of Bathrooms',
            type: 'select',
            required: true,
            options: ['1', '1.5', '2', '2.5', '3', '3.5', '4+']
          }
        ]
      },
      {
        id: 3,
        title: 'Coverage Information',
        description: 'Select your coverage preferences',
        fields: [
          {
            name: 'dwellingCoverage',
            label: 'Dwelling Coverage Amount',
            type: 'select',
            required: true,
            options: ['$100,000', '$150,000', '$200,000', '$250,000', '$300,000', '$400,000', '$500,000+']
          },
          {
            name: 'personalProperty',
            label: 'Personal Property Coverage',
            type: 'select',
            required: true,
            options: ['$25,000', '$50,000', '$75,000', '$100,000', '$150,000']
          },
          {
            name: 'deductible',
            label: 'Deductible',
            type: 'select',
            required: true,
            options: ['$500', '$1,000', '$2,500', '$5,000', '$10,000']
          },
          {
            name: 'liabilityCoverage',
            label: 'Liability Coverage',
            type: 'select',
            required: true,
            options: ['$100,000', '$300,000', '$500,000', '$1,000,000']
          }
        ]
      }
    ]
  },
  'auto-quote': {
    id: 'auto-quote',
    name: 'Auto Insurance Quote',
    steps: [
      {
        id: 1,
        title: 'Driver Information',
        description: 'Tell us about the primary driver',
        fields: [
          {
            name: 'firstName',
            label: 'First Name',
            type: 'text',
            required: true
          },
          {
            name: 'lastName',
            label: 'Last Name',
            type: 'text',
            required: true
          },
          {
            name: 'dateOfBirth',
            label: 'Date of Birth',
            type: 'date',
            required: true
          },
          {
            name: 'licenseNumber',
            label: 'Driver License Number',
            type: 'text',
            required: true
          }
        ]
      },
      {
        id: 2,
        title: 'Vehicle Information',
        description: 'Tell us about your vehicle',
        fields: [
          {
            name: 'vehicleYear',
            label: 'Vehicle Year',
            type: 'select',
            required: true,
            options: ['2024', '2023', '2022', '2021', '2020', '2019', '2018', 'Older']
          },
          {
            name: 'vehicleMake',
            label: 'Vehicle Make',
            type: 'text',
            required: true,
            placeholder: 'Honda, Toyota, Ford, etc.'
          },
          {
            name: 'vehicleModel',
            label: 'Vehicle Model',
            type: 'text',
            required: true,
            placeholder: 'Civic, Camry, F-150, etc.'
          },
          {
            name: 'vin',
            label: 'VIN (Vehicle Identification Number)',
            type: 'text',
            required: true,
            placeholder: '17-character VIN'
          }
        ]
      }
    ]
  }
};