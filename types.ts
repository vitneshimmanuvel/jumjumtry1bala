
export enum PackageType {
  BASIC = 'BASIC',
  FAMILY = 'FAMILY',
  PREMIUM = 'PREMIUM',
  LUXURY = 'LUXURY',
  EVENT = 'EVENT'
}

export interface GuestPackage {
  type: PackageType;
  name: string;
  price: number;
  amenities: string[];
  color: string;
}

export interface Transaction {
  id: string;
  timestamp: Date;
  description: string;
  amount: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  type: 'CREDIT' | 'DEBIT';
  category?: string;
}

export interface Room {
  id: string;
  number: string;
  type: 'DELUXE' | 'SUITE' | 'FAMILY' | 'DORM';
  status: 'AVAILABLE' | 'OCCUPIED' | 'CLEANING';
  currentGuestId?: string;
  price: number;
  amenities: string[]; // e.g., 'Mini Fridge', 'Balcony'
}

export interface FoodOrder {
  id: string;
  guestId: string;
  guestName: string;
  items: string;
  status: 'PENDING' | 'PREPARING' | 'DELIVERED' | 'CANCELLED';
  amount: number;
  timestamp: Date;
}

export interface Guest {
  id: string;
  name: string;
  phone: string;
  packageType: PackageType;
  walletBalance: number;
  advancePaid: number;
  qrCode: string;
  checkInTime: Date;
  checkOutTime?: Date;
  status: 'ACTIVE' | 'CHECKED_OUT' | 'PENDING_PAYMENT';
  transactions: Transaction[];
  roomNumber?: string;
}

export interface Amenity {
  id: string;
  name: { en: string; ta: string };
  icon: string;
  basePrice: number;
  category: 'FUN' | 'FOOD' | 'WELLNESS' | 'FACILITY' | 'SPORTS' | 'SAFETY';
  includedIn: PackageType[];
}

export type AppView = 'MOBILE' | 'ADMIN';
export type AdminSubView = 'OVERVIEW' | 'ROOMS' | 'FOOD' | 'AMENITIES' | 'BILLING';
