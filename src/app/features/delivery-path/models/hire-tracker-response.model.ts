import * as faker from 'faker';
//UK latitude lies between 51 & 53 and longitudes between -2 and 2. so to make sure we only get coordinates within england
const maxLng = 1.2;
const minLng = -1.1;
const maxLat = 53;
const minLat = 51;
let dummyLocation: Location = { longitude: (Math.random() * (maxLng - minLng)) + minLng, latitude: (Math.random() * (maxLat - minLat)) + minLat };
let dummyDriverLocation: Location = { longitude: (Math.random() * (maxLng - minLng)) + minLng, latitude: (Math.random() * (maxLat - minLat)) + minLat };

export enum DeliveryStatus {
  AWAITING_PRE_HIRE_INSPECTION = "Awaiting pre-hire inspection",
  PRE_HIRE_CHECKS_COMPLETE = "Pre-hire checks complete",
  READY_FOR_DESPATCH = "Ready for despatch",
  ON_ITS_WAY = "On its way",
  YOU_ARE_OUR_NEXT_DELIVERY = "You are our next delivery",
  DELIVERY_TODAY = "Delivery today",
  DELIVERED = "Delivered",
  DELIVERY_FAILED = "Delivery failed",
  ORDER_CANCELLED = 'Order cancelled',
  DELIVERY_LEG_EXPIRED = "Delivery contact support for update"
}

export enum CollectionStatus {
  SCHEDULING_COLLECTION = 'Scheduling collection',
  COLLECTION_SCHEDULED = 'Collection scheduled',
  COLLECTED = 'Collected',
  COLLECTION_FAILED = "Collection failed",
  COLLECTION_LEG_EXPIRED = "Collection contact support for update"
}

export enum DefaultTrueStates {
  AWAITING_PRE_HIRE_INSPECTION = "Awaiting pre-hire inspection",
  PRE_HIRE_CHECKS_COMPLETE = "Pre-hire checks complete",
  READY_FOR_DESPATCH = "Ready for despatch",
  ON_ITS_WAY = "On its way",
  YOU_ARE_OUR_NEXT_DELIVERY = "You are our next delivery",
  DELIVERY_TODAY = "Delivery today"
}

export enum DefaultFalseStates {
  DELIVERED = "Delivered",
  COLLECTION_SCHEDULED = 'Collection scheduled',
  SCHEDULING_COLLECTION = 'Scheduling collection',
  COLLECTED = 'Collected',
  DELIVERY_FAILED = "Delivery failed",
  ORDER_CANCELLED = 'Order cancelled',
  COLLECTION_FAILED = "Collection failed",
  DELIVERY_LEG_EXPIRED = "Delivery contact support for update",
  COLLECTION_LEG_EXPIRED = "Collection contact support for update"
}

export enum DefaultNoETAStates {
  AWAITING_PRE_HIRE_INSPECTION = "Awaiting pre-hire inspection",
  PRE_HIRE_CHECKS_COMPLETE = "Pre-hire checks complete",
  READY_FOR_DESPATCH = "Ready for despatch"
}

export enum DefaultMapStates {
  ON_ITS_WAY = "On its way",
  YOU_ARE_OUR_NEXT_DELIVERY = "You are our next delivery"
}

export enum DefaultProofStates {
  DELIVERED = "Delivered",
  COLLECTED = "Collected"
}

export enum DefaultProblemStates {
  DELIVERY_FAILED = "Delivery failed",
  COLLECTION_FAILED = "Collection failed",
  ORDER_CANCELLED = 'Order cancelled',
  DELIVERY_LEG_EXPIRED = "Delivery contact support for update",
  COLLECTION_LEG_EXPIRED = "Collection contact support for update"
}

export enum UrlValidationStates {
  Running = "Running",
  Valid = "Valid",
  Invalid = "Invalid"
}

export enum RedStates {
  DELIVERY_FAILED = "Delivery failed",
  COLLECTION_FAILED = "Collection failed",
  ORDER_CANCELLED = 'Order cancelled',
  DELIVERY_LEG_EXPIRED = "Delivery contact support for update",
  COLLECTION_LEG_EXPIRED = "Collection contact support for update"
}

export enum GreenStates {
  PRE_HIRE_CHECKS_COMPLETE = "Pre-hire checks complete",
  READY_FOR_DESPATCH = "Ready for despatch",
  YOU_ARE_OUR_NEXT_DELIVERY = "You are our next delivery",
  DELIVERED = "Delivered",
  COLLECTION_SCHEDULED = 'Collection scheduled',
  COLLECTED = 'Collected',
}

export enum BlueStates {
  AWAITING_PRE_HIRE_INSPECTION = "Awaiting pre-hire inspection",
  ON_ITS_WAY = "On its way",
  DELIVERY_TODAY = "Delivery today",
  SCHEDULING_COLLECTION = 'Scheduling collection',
}

export interface HireTrackerResponse {
  currentStatus: {
    status: string;
    statusTimestamp: Date;
    location: Location;
    locationTimestamp: Date;
    legNumber: number;//the driver's current stop. if they've got 10 stops for the day, this will be a count of which stop they're at now
    note: string;
    route: Location[];
  };
  options: {
    viewOnMap: boolean;
    viewPoD: boolean;
    viewContactSupport: boolean;
    viewContactDriver: boolean;
    siteNearbyRadiusKm: number;
    onSuccessShowCurrentLocation: boolean;
    dataAutoRefreshSeconds: number;
  };
  deliveredAt: Date;
  deliveredLocation: Location;
  locationWhat3Words: string;
  estimatedDeliveryBetween: string;

  trackingHistory: TrackingHistory[];
  orderDetail: OrderDetail;
  depot: Depot;
  needhelp: { message: string; email: string; phoneNumber: string; };
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface OrderDetail {
  orderPlaced: Date;
  arrivingDate: Date;
  arrivingStartTime: Date;
  arrivingEndTime: Date;
  deliveryTo: {
    town: string,
    postCode: string,
    fullAddress: string,
    location: Location,
    entranceLocation: Location,
    locationWhat3Words: string,
    entranceLocationWhat3Words: string
  };
  hireOrderNumber: string;///combine these 2 with a slash
  hireOrderMob: string;
  description: string;
  itemCode: string;
  hirePeriodFrom: Date;
  hirePeriodTo: Date;
  tourLegNumber: number;//the customer's stop/leg number for the driver's trip. if the legNumber is greater than this, stop refreshing
  machineType: string;
  eCode: string;

  driverName: string;
  driverPhoneNumber: string;
  deliveryType: string;
  ETA: Date;
  collectionScheduledDate: Date;
  collectedAtDate: Date;
  collectedAt: Date;
  productImage: string;
  deliveryToSiteName: string;
  deliveryToIcon: string;
  deliveryToIconName: string;
  deliveryToMessage: string;
}

export interface Depot {
  icon: string;
  iconName: string;
  location: Location;
  name: string;
  postcode: string;
}

export interface TrackingHistory{
    timestamp: Date;
    status: string;
    location: Location;
    note: string;
}