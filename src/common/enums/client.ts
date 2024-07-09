export enum ClientFiles {
  PURCHASE_ORDER = 'purchase_order',
  SALES_ORDER = 'sales_order',
  AGREEMENT = 'agreement',
  WORK_AUTHORIZATION_LETTER = 'work_authorization_letter',
  EMAIL_CONFIRMATION = 'email_confirmation',
}

export enum ClientBillingFrequency {
  FORTNIGHTLY = 'Fortnightly',
  MONTHLY = 'Monthly',
  QUARTERLY = 'Quarterly',
  HALF_QUARTERLY = 'Half_quarterly',
  YEARLY = 'Yearly',
  ONE_TIME = 'One_time',
}

export const ClientBillingFrequencies = [
  {
    id: 1,
    name: 'Fortnightly',
  },
  {
    id: 2,
    name: 'Monthly',
  },
  {
    id: 3,
    name: 'Quarterly',
  },
  {
    id: 4,
    name: 'Half_quarterly',
  },
  {
    id: 5,
    name: 'Yearly',
  },
  {
    id: 6,
    name: 'One_time',
  },
];

export enum ClientCreationType {
  NEW_CLIENT = 'New-client',
  SITE_ADDITION = 'Site-addition',
  EXISTING_CLIENT = 'Existing-client',
  RENEWAL_CLIENT = 'Renewal-client',
}

export const ClientCreationTypes = [
  {
    id: 1,
    name: 'New-client',
  },
  {
    id: 2,
    name: 'Site-addition',
  },
  {
    id: 3,
    name: 'Existing-client',
  },
  {
    id: 4,
    name: 'Renewal-client',
  },
];

export enum ClientEntryType {
  INSTALLATION = 'Installation',
  DEMO = 'Demo',
}

export const ClientEntryTypes = [
  {
    id: 1,
    name: 'Installation',
  },
  {
    id: 2,
    name: 'Demo',
  },
];

export enum FHU_SERVICE_TYPE {
  WEEKLY = 'Weekly',
  DAYS_10 = '10 Days',
  FORTNIGHTLY = 'Fortnightly',
  MONTHLY = 'Monthly',
}

export const FHU_SERVICE_TYPES = [
  {
    id: 1,
    name: 'Weekly',
    period: 7,
  },
  {
    id: 2,
    name: '10 Days',
    period: 10,
  },
  {
    id: 3,
    name: 'Fortnightly',
    period: 15,
  },
  {
    id: 4,
    name: 'Monthly',
    period: 30,
  },
];

export enum ClientTypes {
  CORPORATE = 'Corporate',
  HOUSING = 'Housing',
  COMMUNITY = 'Community',
}

export const ClientType = [
  {
    id: 1,
    name: 'Corporate (Direct)',
  },
  {
    id: 2,
    name: 'Corporate (IFM)',
  },
  {
    id: 3,
    name: 'Housing (Direct)',
  },
  {
    id: 4,
    name: 'Housing (IFM)',
  },
  {
    id: 5,
    name: 'Community',
  },
];

export enum ClientPaymentTerms {
  DUE_ON_RECEIPT = 'Due on receipt',
  DAY_15 = '15 Days',
  DAY_30 = '30 Days',
  DAY_45 = '45 Days',
  DAY_60 = '60 Days',
}

export const ClientPaymentTerm = [
  {
    id: 1,
    name: 'Due on receipt',
  },
  {
    id: 2,
    name: '15 Days',
  },
  {
    id: 3,
    name: '30 Days',
  },
  {
    id: 4,
    name: '45 Days',
  },
  {
    id: 5,
    name: '60 Days',
  },
];

export enum VM_SERVICE_TYPE {
  BUYOUT = 'Buyout',
  RENTAL = 'Rental',
}

export const IndustryList = [
  {
    id: 1,
    name: 'Agriculture and Allied Industries',
  },
  {
    id: 2,
    name: 'Auto Components',
  },
  {
    id: 3,
    name: 'Automobiles',
  },
  {
    id: 4,
    name: 'Aviation',
  },
  {
    id: 5,
    name: 'Banking',
  },
  {
    id: 6,
    name: 'Biotechnology',
  },
  {
    id: 7,
    name: 'Cement',
  },
  {
    id: 8,
    name: 'Chemicals',
  },
  {
    id: 9,
    name: 'Consumer Durables',
  },
  {
    id: 10,
    name: 'Defense Manufacturing',
  },
  {
    id: 11,
    name: 'E-Commerce',
  },
  {
    id: 12,
    name: 'Education and Training',
  },
  {
    id: 13,
    name: 'Electronics System Design & Manufacturing',
  },
  {
    id: 14,
    name: 'Engineering and Capital Goods',
  },
  {
    id: 15,
    name: 'Financial Services',
  },
  {
    id: 16,
    name: 'FMCG',
  },
  {
    id: 17,
    name: 'Gems and Jewelry',
  },
  {
    id: 18,
    name: 'Healthcare',
  },
  {
    id: 19,
    name: 'Infrastructure',
  },
  {
    id: 20,
    name: 'Insurance',
  },
  {
    id: 21,
    name: 'IT & BPM',
  },
  {
    id: 22,
    name: 'Manufacturing',
  },
  {
    id: 23,
    name: 'Media and Entertainment',
  },
  {
    id: 24,
    name: 'Medical Devices',
  },
  {
    id: 25,
    name: 'Metals and Mining',
  },
  {
    id: 26,
    name: 'MSME',
  },
  {
    id: 27,
    name: 'Oil and Gas',
  },
  {
    id: 28,
    name: 'Pharmaceuticals',
  },
  {
    id: 29,
    name: 'Ports',
  },
  {
    id: 30,
    name: 'Power',
  },
  {
    id: 31,
    name: 'Railways',
  },
  {
    id: 32,
    name: 'Real Estate',
  },
  {
    id: 33,
    name: 'Renewable Energy',
  },
  {
    id: 34,
    name: 'Retail',
  },
  {
    id: 35,
    name: 'Roads',
  },
  {
    id: 36,
    name: 'Science and Technology',
  },
  {
    id: 37,
    name: 'Services',
  },
  {
    id: 38,
    name: 'Steel',
  },
  {
    id: 39,
    name: 'Telecommunications',
  },
  {
    id: 40,
    name: 'Textiles',
  },
  {
    id: 41,
    name: 'Tourism and Hospitality',
  },
];

export enum PAD_ORDER_TYPE {
  VENDING_MACHINE_PAD = 'vending_machine_pad',
  SANITARY_PAD = 'sanitary_pad',
}
