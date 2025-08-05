import { QuoteType } from '@/types/quote';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

export const quoteTypes: Record<string, QuoteType> = {
  'home-quote': {
    id: 'home-quote',
    name: 'Home Insurance Quote',
    steps: [
      {
        id: 1,
        title: 'About You & Property Information',
        description: 'Tell us about yourself and your property',
        fields: [
          {
            name: 'firstName',
            label: 'First Name',
            type: 'text',
            required: true,
            group: 'name',
            width: '35%'
          },
          {
            name: 'middleInitial',
            label: 'MI',
            type: 'text',
            placeholder: '',
            group: 'name',
            width: '12%'
          },
          {
            name: 'lastName',
            label: 'Last Name',
            type: 'text',
            required: true,
            group: 'name',
            width: '28%'
          },
          {
            name: 'suffix',
            label: 'Suffix',
            type: 'select',
            options: ['(Select)', 'Jr.', 'Sr.', 'II', 'III', 'IV'],
            group: 'name',
            width: '12%'
          },
          {
            name: 'phoneNumber',
            label: 'Phone Number',
            type: 'tel',
            placeholder: '(123) 456-7890',
            group: 'contact',
            width: '40%'
          },
          {
            name: 'emailAddress',
            label: 'Email Address',
            type: 'email',
            placeholder: 'your.email@example.com',
            group: 'contact',
            width: '50%'
          },
          {
            name: 'dateOfBirth',
            label: 'Applicant\'s Date of Birth',
            type: 'date',
            placeholder: 'mm-dd-yyyy'
          },
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
            required: true,
            group: 'address',
            width: '35%'
          },
          {
            name: 'state',
            label: 'State',
            type: 'select',
            required: true,
            options: US_STATES,
            group: 'address',
            width: '28%'
          },
          {
            name: 'zipCode',
            label: 'Zip Code',
            type: 'text',
            required: true,
            placeholder: '12345',
            group: 'address',
            width: '25%'
          },
          {
            name: 'desiredCoverageStartDate',
            label: 'Desired Coverage Start Date',
            type: 'date'
          },
          {
            name: 'policyType',
            label: 'Policy Type',
            type: 'select',
            options: ['(Select)', 'H03 or DP3', 'H04', 'H05', 'H06']
          },
          {
            name: 'currentInsurance',
            label: 'Do you currently have insurance on this property?',
            type: 'radio',
            options: ['Yes', 'No']
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
            name: 'generalPropertyInfo',
            label: 'General Property Information',
            type: 'section'
          },
          {
            name: 'homeType',
            label: 'Home Type',
            type: 'select',
            required: true,
            options: ['(Select)', 'Single-family house', 'Duplex', 'Triplex', 'Quadplex', 'Townhouse', 'Row house', 'Mobile home', 'Trailer home']
          },

          {
            name: 'yearBuilt',
            label: 'Original Year of Construction',
            type: 'text',
            required: true,
            placeholder: 'YYYY'
          },
          {
            name: 'squareFootage',
            label: 'Total Living Area Square Footage',
            type: 'text',
            required: true,
            placeholder: 'Enter square footage'
          },
          {
            name: 'constructionType',
            label: 'Construction Type',
            type: 'select',
            required: true,
            options: ['(Select)', 'EIFS (synthetic stucco)', 'Frame', 'Masonry', 'Masonry veneer', 'Mixed masonry frame (33% or less)', 'Mixed masonry frame (34% or more)', 'Superior']
          },
          {
            name: 'foundationType',
            label: 'Type of Foundation',
            type: 'select',
            required: true,
            options: ['(Select)', 'Slab', 'Basement', 'Crawlspace', 'Open partial basement', 'Peer and post, stilts']
          },
          {
            name: 'numberOfStories',
            label: 'Number of Stories',
            type: 'select',
            options: ['1', '2', '3', '4+'],
            group: 'structure',
            width: '33%'
          },
          {
            name: 'numberOfFamilies',
            label: 'Number of Families',
            type: 'select',
            options: ['1', '2', '3', '4'],
            group: 'structure',
            width: '33%'
          },
          {
            name: 'electricalCircuitAmps',
            label: 'Electrical Circuit Amps',
            type: 'select',
            options: ['(Select)', 'Less than 100', '100 to 149', '150 and above'],
            group: 'structure',
            width: '34%'
          },
          {
            name: 'roofShape',
            label: 'Roof Shape',
            type: 'select',
            options: ['(Select)', 'Gable', 'Hip', 'Flat', 'Gambrel', 'Mansard', 'Shed', 'Other'],
            group: 'roof',
            width: '50%'
          },
          {
            name: 'roofMaterial',
            label: 'Roof Material',
            type: 'select',
            options: ['(Select)', 'Clay tile', 'Cement tile', 'Shingle', 'Asbestos', 'Metal', 'Slate', 'Wood shake', 'Wood shingle', 'Tar gravel', 'Other'],
            group: 'roof',
            width: '50%'
          },
          {
            name: 'roofReplaced',
            label: 'Has your roof ever been replaced?',
            type: 'select',
            options: ['(Select)', 'Yes', 'No'],
            group: 'roofHistory',
            width: '50%'
          },
          {
            name: 'roofReplacementYear',
            label: 'What year was your roof replaced?',
            type: 'text',
            placeholder: 'YYYY',
            group: 'roofHistory',
            width: '50%'
          },
          {
            name: 'primaryPlumbingType',
            label: 'Primary Plumbing Type',
            type: 'select',
            options: ['(Select)', 'Copper', 'PEX', 'PVC', 'Other', 'Full or partial galvanized', 'Full or partial poly butylene']
          },
          {
            name: 'swimmingPool',
            label: 'Swimming Pool',
            type: 'select',
            options: ['(Select)', 'None', 'Above ground', 'In ground', 'Hot tub/spa only'],
            group: 'utilities',
            width: '50%'
          },
          {
            name: 'screenedEnclosure',
            label: 'Screened Enclosure',
            type: 'select',
            options: ['(Select)', 'Yes', 'No'],
            group: 'utilities',
            width: '50%'
          },
          {
            name: 'occupancySection',
            label: 'Occupancy',
            type: 'section'
          },
          {
            name: 'occupancy',
            label: 'Occupancy',
            type: 'select',
            options: ['(Select)', 'Owner', 'Tenant', 'Vacant', 'Unoccupied', 'Primary', 'Seasonal'],
            group: 'occupancyInfo',
            width: '50%'
          },
          {
            name: 'primaryOrSeasonal',
            label: 'Primary or Seasonal',
            type: 'select',
            options: ['(Select)', 'Primary', 'Seasonal'],
            group: 'occupancyInfo',
            width: '50%'
          },
          {
            name: 'rentalFrequency',
            label: 'Rental Frequency',
            type: 'select',
            options: ['(Select)', 'Not rented', 'Daily', '2-6 nights', 'Weekly', 'Monthly', 'Annually']
          },
          {
            name: 'securedCommunitySection',
            label: 'Security',
            type: 'section'
          },
          {
            name: 'securityPatrol24Hour',
            label: '24-Hour Security Patrol',
            type: 'checkbox',
            group: 'security',
            width: '25%'
          },
          {
            name: 'securityGates24Hour',
            label: '24-Hour Manned Security Gates',
            type: 'checkbox',
            group: 'security',
            width: '25%'
          },
          {
            name: 'singleEntryCommunity',
            label: 'Single Entry Community',
            type: 'checkbox',
            group: 'security',
            width: '25%'
          },
          {
            name: 'passkeyGates',
            label: 'Passkey Gates',
            type: 'checkbox',
            group: 'security',
            width: '25%'
          },
          {
            name: 'burglarAlarm',
            label: 'Burglar Alarm',
            type: 'select',
            options: ['(Select)', 'None', 'Non-local only', 'Central'],
            group: 'alarms',
            width: '33%'
          },
          {
            name: 'fireAlarm',
            label: 'Fire Alarm',
            type: 'select',
            options: ['(Select)', 'None', 'Non-local only', 'Central'],
            group: 'alarms',
            width: '33%'
          },
          {
            name: 'sprinklerSystem',
            label: 'Sprinkler System',
            type: 'select',
            options: ['(Select)', 'None', 'Non-partial (class A)', 'Full (class B)'],
            group: 'alarms',
            width: '34%'
          },
          {
            name: 'windMitigationSection',
            label: 'Wind Mitigation',
            type: 'section'
          },
          {
            name: 'windMitigationForm',
            label: 'Wind Mitigation Form',
            type: 'select',
            options: ['(Select)', 'Assumed Values', 'Completed Form Available'],
            group: 'windMitigation',
            width: '50%'
          },
          {
            name: 'roofCovering',
            label: 'Roof Covering',
            type: 'select',
            options: ['(Select)', 'FBC Equivalent', 'Non-FBC Equivalent'],
            group: 'windMitigation',
            width: '50%'
          },
          {
            name: 'roofDeckAttachment',
            label: 'Roof Deck Attachment',
            type: 'select',
            options: ['(Select)', '6d @ 6"/12', '8d @ 6"/12', '8d @ 6"/6', 'Reinforced Concrete'],
            group: 'windDetails',
            width: '50%'
          },
          {
            name: 'roofWallAttachment',
            label: 'Roof Wall Attachment',
            type: 'select',
            options: ['(Select)', 'Toe Nails', 'Clips', 'Single Wraps', 'Double Wraps'],
            group: 'windDetails',
            width: '50%'
          },
          {
            name: 'swr',
            label: 'SWR',
            type: 'select',
            options: ['(Select)', 'Yes SWR', 'No SWR']
          },
          {
            name: 'openingProtection',
            label: 'Opening Protection',
            type: 'select',
            options: ['(Select)', 'Class A', 'Class B', 'Class C', 'Unknown']
          }
        ]
      },
      {
        id: 3,
        title: 'Claims Information',
        description: 'Tell us about any previous losses or claims',
        fields: [
          {
            name: 'claimsInfoSection',
            label: 'Claims Info',
            type: 'section'
          },
          {
            name: 'hadLossesLast5Years',
            label: 'Have you had any losses, whether or not paid by insurance, during the last 5 years at this or any other location?',
            type: 'radio',
            required: true,
            options: ['Yes', 'No']
          },
          {
            name: 'sinkholeOrEarthMovement',
            label: 'Does the applicant or co-applicant have any knowledge of any sinkhole loss or any other earth movement loss at the insured location, including the residence premises, other structures, or grounds to be insured?',
            type: 'radio',
            required: true,
            options: ['Yes', 'No']
          },
          {
            name: 'claims',
            label: 'Claim Details',
            type: 'claims',
            options: [
              '(Select)', 'All Other', 'Contamination', 'Credit Card', 'Damage To Property Of Others',
              'Dog Bite (Liability)', 'Earthquake', 'Earth Movement', 'Extended Coverage', 'Perils',
              'Fire', 'Flood', 'Freezing Water (Including Burst Pipes)', 'Hail', 'Hurricane',
              'Liability (All Other)', 'Lightning', 'Medical Payments', 'Mysterious Disappearance',
              'Property', 'Physical Damage (All Other)', 'Slip/Fall (Liability)', 'Smoke',
              'Theft Scheduled Property', 'Theft/Burglary', 'Tornado', 'Vandalism/Malicious Mischief',
              'Water Damage', 'Wind', 'Worker\'s Compensation'
            ]
          }
        ]
      },
      {
        id: 4,
        title: 'Coverage Information',
        description: 'Select your coverage preferences',
        fields: [
          {
            name: 'dwellingLimit',
            label: 'Dwelling Limit (A)',
            type: 'currency',
            required: true,
            placeholder: 'Enter dwelling limit'
          },
          {
            name: 'otherStructures',
            label: 'Other Structures (Coverage B)',
            type: 'percentage-currency',
            baseField: 'dwellingLimit',
            percentage: 10,
            options: ['2%', '5%', '10%', '15%', '20%']
          },
          {
            name: 'personalProperty',
            label: 'Personal Property / Contents (Coverage C)',
            type: 'percentage-currency',
            baseField: 'dwellingLimit',
            percentage: 25,
            options: ['25%', '50%', '75%', '100%']
          },
          {
            name: 'lossOfUse',
            label: 'Loss of Use (Coverage D)',
            type: 'percentage-currency',
            baseField: 'dwellingLimit',
            percentage: 20,
            options: ['10%', '20%', '30%', '40%']
          },
          {
            name: 'replacementCostPersonalProperty',
            label: 'Replacement Cost on Personal Property / Contents',
            type: 'select',
            options: ['Included', 'Not Included', 'Actual Cash Value']
          },
          {
            name: 'personalLiability',
            label: 'Personal Liability',
            type: 'select',
            required: true,
            options: ['Excluded', '$100,000', '$300,000', '$400,000', '$500,000']
          },
          {
            name: 'medicalPayments',
            label: 'Medical Payments',
            type: 'select',
            required: true,
            options: ['Excluded', '2%', '5%', '10%']
          },
          {
            name: 'allOtherPerilsDeductible',
            label: 'All Other Perils Deductible',
            type: 'select',
            required: true,
            options: ['$500', '$1,000', '$2,500', '$5,000', '$10,000']
          },
          {
            name: 'hurricaneDeductible',
            label: 'Hurricane Deductible',
            type: 'percentage-currency',
            baseField: 'dwellingLimit',
            percentage: 2,
            options: ['2%', '5%', '10%']
          },
          {
            name: 'waterBackupLimit',
            label: 'Water Backup and Sump Overflow Limit',
            type: 'select',
            options: ['No Coverage', '$5,000']
          },
          {
            name: 'waterCoverage',
            label: 'Water Coverage',
            type: 'select',
            options: ['Limited - $10,000']
          },
          {
            name: 'roofCoverage',
            label: 'Roof Coverage',
            type: 'select',
            options: ['Replacement Cost-HO3 Only', 'Stated Value/BCV']
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
            required: true,
            group: 'name',
            width: '50%'
          },
          {
            name: 'lastName',
            label: 'Last Name',
            type: 'text',
            required: true,
            group: 'name',
            width: '50%'
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
          },
          {
            name: 'state',
            label: 'State (where vehicle is primarily garaged)',
            type: 'select',
            required: true,
            options: US_STATES
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
            options: ['2024', '2023', '2022', '2021', '2020', '2019', '2018', 'Older'],
            group: 'vehicle',
            width: '25%'
          },
          {
            name: 'vehicleMake',
            label: 'Vehicle Make',
            type: 'text',
            required: true,
            placeholder: 'Honda, Toyota, Ford, etc.',
            group: 'vehicle',
            width: '35%'
          },
          {
            name: 'vehicleModel',
            label: 'Vehicle Model',
            type: 'text',
            required: true,
            placeholder: 'Civic, Camry, F-150, etc.',
            group: 'vehicle',
            width: '40%'
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