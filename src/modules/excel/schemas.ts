import { array, number, object, string } from 'yup';

export let fhuSchema = object({
  productId: number().required(),
  quantity: number().required().positive().integer(),
  serviceCost: number().required().positive(),
  totalServiceCost: number().required().positive(),
  serviceType: string().required(),
});

export let vmSchema = object({
  productId: number().required(),
  quantity: number().required().positive().integer(),
  rentalAmount: number().required().positive(),
  buyoutAmount: number().required().positive(),
  totalServiceCost: number().required().positive().integer(),
  deploymentType: string().required(),
  serviceType: string().required(),
});

export let vmPadsSchema = object({
  padBrand: string().required(),
  quantity: number().required().positive().integer(),
  cost: number().required().positive(),
  totalCost: number().required().positive().integer(),
});

export let sanitaryPadsSchema = object({
  padBrand: string().required(),
  quantity: number().required().positive().integer(),
  cost: number().required().positive(),
  totalCost: number().required().positive().integer(),
});

export let vendingMachineSchema = object({
  simNumber: number().required().positive().integer(),
  simBrand: string().required(),
  quantity: number().required().positive().integer(),
  price: number().required().positive(),
});

export let spocSchema = object({
  name: string().required(),
});

const TextConstants = {
  Rental: 'Rental',
  BuyOut: 'Buyout',
};

export const AddClientSchema = object().shape({
  // name: string().required(),
  // logoId: array().required(TextConstants.PleaseUploadLogo),
  clientType: string().required(),
  industryType: string().required(),
  // entryType: string().required(TextConstants.PleaseSelectEntryType),
  // creationType: string().required(TextConstants.PleaseSelectCreationType),
  // city: number().required(),
  branchName: string().required(),
  billingAddress: string().required(),
  siteAddress: string().required(),
  billingAddressPincode: string()
    .matches(/^[0-9]+$/, 'Please enter only digits')
    .min(6, 'Please enter exactly 6 digits')
    .max(6, 'Please enter exactly 6 digits'),
  siteAddressPincode: string()
    .matches(/^[0-9]+$/, 'Please enter only digits')
    .min(6, 'Please enter exactly 6 digits')
    .max(6, 'Please enter exactly 6 digits'),
  // gstNumber: string().required(TextConstants.PleaseEnterGstNumber),
  soNumber: string().required(),
  // poNumber: string().required(TextConstants.PleaseEnterPoNumber),
  paymentTerms: string().required(),
  billingFaq: string().required(),
  soReceivedDate: string().required(),
  contractStartDate: string().required(),
  contractEndDate: string().required(),
  femaleCount: number().required(),

  salesLead: string().required(),
  spoc: array().of(
    object().shape({
      name: string().required(),
      email: string().email(),
      phoneNumber: string().matches(/^[0-9]+$/, 'Please enter only digits'),
    }),
  ),
  simRecharge: array().of(
    object().shape({
      quantity: string().required(),
      price: string().required(),
      totalAmount: string().required(),
    }),
  ),
  sanitaryPads: array().of(
    object().shape({
      padBrand: string().required(),
      quantity: number().required(),
      cost: string(),
      totalCost: string(),
    }),
  ),
  vmPads: array().of(
    object().shape({
      padBrand: string().required(),
      quantity: number().required(),
      cost: string(),
      totalCost: string(),
    }),
  ),
  femaleHygieneUnit: array().of(
    object().shape({
      productId: string().required(),
      quantity: number().required(),
      serviceType: string().required(),
      serviceCost: number().required(),
    }),
  ),
  vendingMachine: array().of(
    object().shape({
      productId: string().required(),
      quantity: number().required(),
      deploymentType: string().required(),
      serviceType: string().when(['deploymentType'], (availableData, field) => {
        return availableData?.length &&
          availableData[0]?.toLowerCase() == TextConstants.Rental.toLowerCase()
          ? field.required()
          : field.nullable();
      }),
      rentalAmount: number().when(['serviceType'], (availableData, field) => {
        return availableData?.length &&
          availableData[0]?.toLowerCase() == TextConstants.Rental.toLowerCase()
          ? field.required()
          : field.nullable();
      }),
      buyoutAmount: string().when(['serviceType'], (availableData, field) => {
        return availableData?.length &&
          availableData[0]?.toLowerCase() == TextConstants.BuyOut.toLowerCase()
          ? field.required()
          : field.nullable();
      }),
      // refillingQuantity: string().optional(),
      // .required(TextConstants.PleaseEnterRefillingQuantity),
      // refillingAmount: string().optional(),
      // .required(TextConstants.PleaseEnterRefillingAmount),
    }),
  ),
});
