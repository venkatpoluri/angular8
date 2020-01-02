export enum NetworkTypes {
  "BASIC" = 1,
  "2G" = 2,
  "3G" = 3,
  "LTE" = 4,
  "DTAC" = 520005,
  "DTN" = 520018
}

export enum SubscriberClasses {
  "INDIVIDUAL" = 1,
  "VIP" = 3,
  "STAFF" = 4,
  "CORPORATE" = 5
}
export enum SubscriberTypes {
  "PREPAID" = 1,
  "POSTPAID" = 2
}

export enum DiscountRules {
  "Global discount WeekDay" = 901,
  "Global discount DateRange" = 902,
  "Global discount BetweenRange" = 903,
  "Segment Based" = 8101,
  "Promo Based" = 8201,
  "Calendar Based WeekDay" = 8301,
  "Calendar Based DateRange" = 8302,
  "Calendar Based BetweenRange" = 8303,
  "Usage Based" = 8401,
  "Renewal Cycle" = 8501,
  "Profile Based" = 8601,
  "CC Full Discount" = 8701
}

export enum userclass {
  "INDIVIDUAL" = 1,
  "CORPORATE" = 2,
  "VIP" = 3,
  "STAFF" = 4,
  "ALL" = 5
}
export enum ScheduleContentTypes {
  "MusicAlbum" = 1,
  "MusicChannel" = 2,
  "Bundle" = 3,
  "ToneGroup" = 4,
  "Content" = 5
}
export enum channel {
  'USSD' = "3"
}
export enum ProfileStatus {
  'Inactive' = 0,
  'Active' = 1,
  'On Hold' = 2,
  'Barred' = 3,
  'Churn Out' = 4
}
export enum RBTStatus {
  'HLR in progress' = '-2',
  'Charging in progress' = '-1',
  'Active' = '1',
  'InActive' = '0',
  'Grace' = '2',
  'Parking' = '3',
  'Parking ' = '10',
  'In Process' = '8',
  'Grace (Partial)' = '11',
  'Parking (Partial)' = '12',
  "HLR De activation in process" = '101',
  "HLR activation in process" = '201'
}
export enum hlrProcessState {
  'Pending' = 0,
  'In Process' = 1,
  'Success' = 6,
  'Failed' = 7
}

export const SHOW_MENU = {
  profile: 1,
  activations: 0,
  subscriptions: 0,
  chargingtransactions: 0,
  messagingtransactions: 0,
  smstransactions: 0,
  refunds: 0,
  ussdtransactions: 0,
  campaigntransactions: 0,
  webaoctransactions: 0,
  vmstransactions: 0,
  mcntransactions: 0,
  blocklist: 0,
  whitelist: 0,
  dnd: 0
};


export const planUserStatus = {
  '1000': 'NOT REGISTERED',
  '-1': '',
  '0': 'REGISTERED',
  '1': 'ACTIVE',
  '2': 'ACTIVATION PENDING',
  '3': 'RENEWAL INITIATED',
  '4': 'MIGRATED',
  '5': 'PAUSE/ON HOLD',
  '6': 'GRACE',
  '7': 'PARKING',
  '8': 'DEREG',
  '9': 'UNSUBSCRIBED',
  '11': 'DEACTIVATED',
  '12': 'REGISTRATION PENDING',
  '16': 'MNP',
  '61': 'GRACE PARTIAL',
  '71': 'PARKING PARTIAL',
  '13': 'BILLING RETRY ERROR',
  '14': 'ACTIVATION RETRY IN PROGRESS',
  '15': 'REGISTRATION_RETRY IN PROGRESS',
  '17': 'ACTIVATION PARTIAL',
  '18': 'ACTIVATION PARTIAL IN PROGS',
  '20': 'PICKED FOR REG PENDING',
  '21': 'PICKED FOR ACT PENDING',
  '22': 'PICKED FOR RENEWAL',
  '23': 'PICKED FOR ACT PARTIAL',
  '24': 'Q INSERTION FAILED',
  '25': 'DE ACTIVATION IN PROGRESS',
  '28': 'RENEWAL INTERNAL ERROR',
  '30': 'UN SUBSCRIPTION END OF CYCLE',
  '31': 'PICKED FOR UN SUBSCRIPTION EOC',
  '32': 'PARTNER ACT PENDING',
  '33': 'FREE TRAIL ACTIVATION',
  '34': 'PROMOTIONAL',
  '35': 'REGISTRATION FAILED',
  '36': 'ACTIVATION FAILED',
  '101': 'HLR De activation in process',
  '201': 'HLR activation in process'
}

export const planSubStatus = {
  '-1000': '',
  '-1': '',
  '0': '',
  '1': 'ACTIVE',
  '2': 'ACTIVATION PENDING',
  '3': 'RENEWAL INITIATED',
  '4': 'MIGRATED',
  '5': 'PAUSE/ON HOLD',
  '6': 'GRACE',
  '7': 'PARKING',
  '8': 'DEREG',
  '9': 'UNSUBSCRIBED',
  '11': 'DEACTIVATED',
  '12': 'REGISTRATION PENDING',
  '16': 'MNP',
  '61': 'GRACE PARTIAL',
  '71': 'PARKING PARTIAL',
  '13': 'BILLING RETRY ERROR',
  '14': 'ACTIVATION RETRY IN PROGRESS',
  '15': 'REGISTRATION_RETRY IN PROGRESS',
  '17': 'ACTIVATION PARTIAL',
  '18': 'ACTIVATION PARTIAL IN PROGS',
  '20': 'PICKED FOR REG PENDING',
  '21': 'PICKED FOR ACT PENDING',
  '22': 'PICKED FOR RENEWAL',
  '23': 'PICKED FOR ACT PARTIAL',
  '24': 'Q INSERTION FAILED',
  '25': 'DE ACTIVATION IN PROGRESS',
  '28': 'RENEWAL INTERNAL ERROR',
  '32': 'PARTNER ACT PENDING',
  '30': 'UN SUBSCRIPTION END OF CYCLE',
  '31': 'PICKED FOR UN SUBSCRIPTION EOC',
  '33': 'FREE TRAIL ACTIVATION',
  '34': 'PROMOTIONAL',
  '35': 'REGISTRATION FAILED',
  '36': 'ACTIVATION FAILED',
  '101': 'HLR De activation in process',
  '201': 'HLR activation in process'
}

export const GetProductTypes = {
  '1': 'Normal',
  '2': 'Free Trail',
  '3': 'Promotions',
  '4': 'Once Off',
  '5': 'Session Charge',
  '6': 'Zero Rate',
  '7': 'Top Up'
}

export const AllowedChannels = {
  '1': 'SMS',
  '2': '',
  '3': 'USSD',
  '4': 'IVR',
  '6': 'WAP',
  '7': 'APP',
  '8': 'WEB',
  '10': 'CCARE',
  '11': 'GBE',
  '12': 'CRM'
}
export const SubscriberClass = {
  '1': 'INDIVIDUAL',
  '2': 'VIP',
  '3': 'CORPORATE',
  '4': 'STAFF'
}

export const NetworkType = {
  '1': 'BASIC',
  '2': '2G',
  '3': '3G',
  '4': 'LTE',
  '520005': 'DTAC',
  '520018': 'DTN'
}
export const SubscriberType = {
  '1': 'PREPAID',
  '2': 'POSTPAID'
}

export const ChargeType = {
  '1': 'PPU',
  '2': 'Subscription',
  '3':'BUNDLE'
}

export const PriceModel = {
  '1': 'Standard',
  '2': 'Profile'
}

export enum UnSubMode {
  "Immediate" = 1,
  "End of Life Cycle2G" = 2
}
