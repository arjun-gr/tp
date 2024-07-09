export enum ServiceStatus {
  PLANNED = 'Planned',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  ONGOING = 'Ongoing',
  RESCHEDULED = 'Rescheduled',
}

export enum ServiceFiles {
  FHU_SIGNED_COLLECTION_REPORT_CARD = 'fhu_collection_report_card',
  FHU_SIGNED_SERVICE_CARD = 'fhu_service_card',
  FHU_SIGNED_REPORT_CARD = 'fhu_report_card',
  FHU_SIGNED_ACKNOWLEDGED_INVOICE = 'fhu_acknowledged_invoice',
  FHU_SIGNED_DELIVERY_CHALLAN = 'fhu_delivery_challan',

  SIGNED_ACKNOWLEDGED_INVOICE = 'signed_acknowledged_invoice',
  SIGNED_COLLECTION_DELIVERY_CHALLAN = 'signed_collection_delivery_challan',
  INTRO_MAIL_FROM_SALES_TEAM = 'into_mail_from_sales_team',
  ACK_MAIL_FROM_OPERATIONS_TEAM = 'ack_mail_from_operations_team',

  VM_SALES_ORDER = 'vm_sales_order',
  VM_SIGNED_DELIVERY_CHALLAN = 'vm_delivery_challan',
  VM_SIGNED_SERVICE_CARD = 'vm_service_card',
  VM_SIGNED_REPORT_CARD = 'vm_report_card',
  VM_SIGNED_ACKNOWLEDGED_INVOICE = 'vm_acknowledged_invoice',

  VM_PAD_SIGNED_ACKNOWLEDGED_INVOICE = 'vm_pads_acknowledged_invoice',
  VM_PAD_SIGNED_DELIVERY_CHALLAN = 'vm_pads_delivery_challan',
  VM_PAD_SIGNED_REPORT_CARD = 'vm_pads_report_card',

  SANITARY_PAD_SIGNED_ACKNOWLEDGED_INVOICE = 'sanitary_pad_acknowledged_invoice',
  SANITARY_PAD_SIGNED_DELIVERY_CHALLAN = 'sanitary_pad_delivery_challan',
  SANITARY_PAD_SIGNED_REPORT_CARD = 'sanitary_pad_report_card',
}

export enum ServiceType {
  INSTALLATION = 'Installation',
  SERVICE = 'Servicing',
  DEMO = 'Demo',
}

export const SERVICE_CARD_FILE_LIST = [
  ServiceFiles.FHU_SIGNED_REPORT_CARD,
  ServiceFiles.VM_SIGNED_REPORT_CARD,
  ServiceFiles.VM_PAD_SIGNED_REPORT_CARD,
  ServiceFiles.SANITARY_PAD_SIGNED_REPORT_CARD,
];

export const INVOICE_FILE_LIST = [
  ServiceFiles.FHU_SIGNED_ACKNOWLEDGED_INVOICE,
  ServiceFiles.VM_SIGNED_ACKNOWLEDGED_INVOICE,
  ServiceFiles.SANITARY_PAD_SIGNED_ACKNOWLEDGED_INVOICE,
  ServiceFiles.VM_PAD_SIGNED_ACKNOWLEDGED_INVOICE,
];
