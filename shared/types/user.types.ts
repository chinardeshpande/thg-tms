export enum UserRole {
  ADMIN = 'ADMIN',
  LOGISTICS_MANAGER = 'LOGISTICS_MANAGER',
  CARRIER_OPERATOR = 'CARRIER_OPERATOR',
  FLEET_MANAGER = 'FLEET_MANAGER',
  CLIENT_USER = 'CLIENT_USER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  companyId?: string;
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface UserProfile extends User {
  company?: Company;
  permissions: string[];
}

export interface Company {
  id: string;
  name: string;
  businessId: string;
  taxId: string;
  email: string;
  phone: string;
  website?: string;
  address: Address;
  status: CompanyStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum CompanyStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED',
  INACTIVE = 'INACTIVE',
}

export interface Address {
  street: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}
