// API Configuration
// Note: Backend uses versioned endpoints (v1)
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';

// Application Constants
export const APP_NAME = 'THG TMS';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Transportation Management System';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Date/Time Formats
export const DATE_FORMAT = 'MMM dd, yyyy';
export const DATETIME_FORMAT = 'MMM dd, yyyy HH:mm';
export const TIME_FORMAT = 'HH:mm';

// Shipment Status
export const SHIPMENT_STATUS = {
  PENDING: 'pending',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  DELAYED: 'delayed',
  EXCEPTION: 'exception',
} as const;

export const SHIPMENT_STATUS_LABELS = {
  [SHIPMENT_STATUS.PENDING]: 'Pending',
  [SHIPMENT_STATUS.PICKED_UP]: 'Picked Up',
  [SHIPMENT_STATUS.IN_TRANSIT]: 'In Transit',
  [SHIPMENT_STATUS.OUT_FOR_DELIVERY]: 'Out for Delivery',
  [SHIPMENT_STATUS.DELIVERED]: 'Delivered',
  [SHIPMENT_STATUS.CANCELLED]: 'Cancelled',
  [SHIPMENT_STATUS.DELAYED]: 'Delayed',
  [SHIPMENT_STATUS.EXCEPTION]: 'Exception',
} as const;

export const SHIPMENT_STATUS_COLORS = {
  [SHIPMENT_STATUS.PENDING]: 'bg-gray-100 text-gray-800',
  [SHIPMENT_STATUS.PICKED_UP]: 'bg-blue-100 text-blue-800',
  [SHIPMENT_STATUS.IN_TRANSIT]: 'bg-indigo-100 text-indigo-800',
  [SHIPMENT_STATUS.OUT_FOR_DELIVERY]: 'bg-purple-100 text-purple-800',
  [SHIPMENT_STATUS.DELIVERED]: 'bg-green-100 text-green-800',
  [SHIPMENT_STATUS.CANCELLED]: 'bg-red-100 text-red-800',
  [SHIPMENT_STATUS.DELAYED]: 'bg-yellow-100 text-yellow-800',
  [SHIPMENT_STATUS.EXCEPTION]: 'bg-orange-100 text-orange-800',
} as const;

// Carrier Status
export const CARRIER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
} as const;

export const CARRIER_STATUS_LABELS = {
  [CARRIER_STATUS.ACTIVE]: 'Active',
  [CARRIER_STATUS.INACTIVE]: 'Inactive',
  [CARRIER_STATUS.SUSPENDED]: 'Suspended',
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  DISPATCHER: 'dispatcher',
  DRIVER: 'driver',
  CUSTOMER: 'customer',
} as const;

export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Administrator',
  [USER_ROLES.MANAGER]: 'Manager',
  [USER_ROLES.DISPATCHER]: 'Dispatcher',
  [USER_ROLES.DRIVER]: 'Driver',
  [USER_ROLES.CUSTOMER]: 'Customer',
} as const;

// Route Status
export const ROUTE_STATUS = {
  PLANNED: 'planned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Currency
export const DEFAULT_CURRENCY = 'USD';
export const CURRENCY_SYMBOL = '$';

// Distance Units
export const DISTANCE_UNIT = 'miles';

// Weight Units
export const WEIGHT_UNIT = 'lbs';

// Map Configuration
export const DEFAULT_MAP_CENTER = { lat: 39.8283, lng: -98.5795 }; // Center of USA
export const DEFAULT_MAP_ZOOM = 4;

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_PREFERENCES: 'userPreferences',
  THEME: 'theme',
} as const;

// Toast/Notification Durations (ms)
export const TOAST_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
  WARNING: 4000,
  INFO: 3000,
} as const;

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
] as const;

// Debounce/Throttle Delays (ms)
export const SEARCH_DEBOUNCE_DELAY = 300;
export const AUTOSAVE_DEBOUNCE_DELAY = 1000;

// Analytics Time Ranges
export const TIME_RANGES = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  LAST_7_DAYS: 'last_7_days',
  LAST_30_DAYS: 'last_30_days',
  LAST_90_DAYS: 'last_90_days',
  THIS_MONTH: 'this_month',
  LAST_MONTH: 'last_month',
  THIS_YEAR: 'this_year',
  CUSTOM: 'custom',
} as const;
