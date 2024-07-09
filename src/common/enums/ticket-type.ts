export enum TicketType {
  QUESTION = 'Question',
  INCIDENT = 'Incident',
  BILLING = 'Billing',
  PROBLEM = 'Problem',
  SERVICE = 'Service',
  OTHER = 'Other',
}

export const TicketTypes = [
  {
    id: 'Pedal Bin',
    name: 'Pedal Bin',
    ticketCode: 'PCLP',
  },
  {
    id: 'Sensor Bin',
    name: 'Sensor Bin',
    ticketCode: 'PCLS',
  },
  {
    id: 'VM-Coin+UPI',
    name: 'VM-Coin+UPI',
    ticketCode: 'PCLVC',
  },
  {
    id: 'VM-Sensor',
    name: 'VM-Sensor',
    ticketCode: 'PCLVS',
  },
  {
    id: 'Service',
    name: 'Service',
    ticketCode: 'PCLSE',
  },
  {
    id: 'Invoice/Finance',
    name: 'Invoice/Finance',
    ticketCode: 'PCLF',
  },
  {
    id: 'Refilling',
    name: 'Refilling',
    ticketCode: 'PCLR',
  },
  {
    id: 'Installation Delay',
    name: 'Installation Delay',
    ticketCode: 'PCLID',
  },
  {
    id: 'VM-RFID',
    name: 'VM-RFID',
    ticketCode: 'PCLVR',
  },
  {
    id: 'Sanitary Pads',
    name: 'Sanitary Pads',
    ticketCode: 'PCLSP',
  },
  {
    id: 'Bin Odour Issue',
    name: 'Bin Odour Issue',
    ticketCode: 'PCLBO',
  },
  {
    id: 'VAP Odour Issue',
    name: 'VAP Odour Issue',
    ticketCode: 'PCLVO',
  },
];
