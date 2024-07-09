export enum AwarenessCampEmpType {
  FEMALE_EMPLOYEE = 'female_employees',
  HOUSEKEEPING_STAFF = 'housekeeping_staff',
  BOTH = 'Both',
}

export enum AwarenessCampStatus {
  // ON_GOING = 'On going',
  PLANNED = 'Planned',
  COMPLETED = 'Completed',
  REJECT = 'Reject',
  CANCELLED = 'Cancelled',
}

export enum AwarenessCampClientStatus {
  OPEN = 'Open',
  CLOSED = 'Closed',
  RESOLVED = 'Resolved',
}

export const AwarenessCampEmployeeType = [
  {
    id: 1,
    name: 'female_employees',
  },
  {
    id: 2,
    name: 'housekeeping_staff',
  },
  {
    id: 3,
    name: 'both',
  },
];

export const AwarenessCampStatusList = [
  {
    id: AwarenessCampStatus.PLANNED,
    name: AwarenessCampStatus.PLANNED,
  },
  {
    id: AwarenessCampStatus.COMPLETED,
    name: AwarenessCampStatus.COMPLETED,
  },
  {
    id: AwarenessCampStatus.CANCELLED,
    name: AwarenessCampStatus.CANCELLED,
  },
];
