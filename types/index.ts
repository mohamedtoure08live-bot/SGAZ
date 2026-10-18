export type OrderStatus =
  | 'NOUVELLE'
  | 'A_CONFIRMER'
  | 'CONFIRMEE'
  | 'EN_PREPARATION'
  | 'LIVREUR_AFFECTE'
  | 'EN_LIVRAISON'
  | 'LIVREE'
  | 'INCIDENT'
  | 'ANNULEE';

export type UserRole = 'admin' | 'operateur';

export type BottleFormat = 'B6' | 'B12_5' | 'B28';

export interface Brand {
  id: string;
  name: string;
  code: string;
  logoUrl?: string;
  color: string;
}

export interface Product {
  id: string;
  brandId: string;
  brandName: string;
  name: string;
  format: BottleFormat;
  formatLabel: string;
  weightKg: number;
  description: string;
  imageUrl: string;
  color: string;
  isPopular?: boolean;
}

export interface ProductPrice {
  id: string;
  productId: string;
  priceWithExchange: number; // Ex: 5 500 FCFA
  priceWithoutExchange: number; // Ex: 20 000 FCFA (avec consigne)
  effectiveDate: string;
  isOfficial: boolean;
}

export interface Commune {
  id: string;
  name: string;
  standardDeliveryFee: number;
  expressDeliveryFee: number;
  isActive: boolean;
  quartiers: Quartier[];
}

export interface Quartier {
  id: string;
  communeId: string;
  name: string;
  deliveryFeeOverride?: number;
  estimatedMinutes: number;
}

export interface PartnerDepot {
  id: string;
  name: string;
  managerName: string;
  phone: string;
  whatsapp: string;
  commune: string;
  address: string;
  stockAvailable: Record<string, number>; // productId -> quantity
  isValidated: boolean;
  rating: number;
}

export interface Courier {
  id: string;
  fullName: string;
  phone: string;
  whatsapp: string;
  vehicleType: 'moto' | 'tricycle';
  vehiclePlate: string;
  assignedCommunes: string[];
  isValidated: boolean;
  status: 'disponible' | 'en_course' | 'inactif';
  totalDeliveries: number;
}

export interface Customer {
  id: string;
  fullName: string;
  phone: string; // Ex: +225 07 00 00 00 00
  address: string;
  commune: string;
  quartier: string;
  landmark: string; // Repère obligatoire à Abidjan
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  formatLabel: string;
  brandName: string;
  quantity: number;
  hasEmptyBottle: boolean; // Avec échange ou sans échange
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string; // Ex: SGZ-2026-000123
  publicToken: string; // Jeton non devinable pour page publique de confirmation
  idempotencyKey?: string;
  customer: Customer;
  items: OrderItem[];
  commune: string;
  quartier: string;
  addressLandmark: string;
  deliveryMode: 'standard' | 'express';
  deliveryFee: number;
  subtotalProducts: number;
  totalAmount: number;
  sosgazCommission: number;
  partnerPayout: number;
  status: OrderStatus;
  previousStatus?: OrderStatus;
  cancellationReason?: string;
  incidentReason?: string;
  partnerId?: string;
  partnerName?: string;
  courierId?: string;
  courierName?: string;
  courierPhone?: string;
  isClientNotifiedWhatsapp: boolean;
  isClientCalled: boolean;
  paymentMode: 'especes_livraison' | 'mobile_money_simulation';
  paymentStatus: 'en_attente' | 'confirme' | 'annule';
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
  statusHistory: OrderStatusHistory[];
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
  changedBy: string; // "Opérateur (Koffi)", "Admin (Sylla)", "Système"
  authorRole: UserRole | 'system';
  reason?: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  performedBy: string;
  userRole: UserRole;
  details: string;
  timestamp: string;
}

export interface AppSettings {
  serviceStartTime: string; // "06:00"
  serviceEndTime: string;   // "21:30"
  officialPhone: string;    // "+225 27 22 00 00 00"
  officialWhatsapp: string; // "+225 07 00 11 22 33"
  defaultSosgazCommission: number; // Ex: 500 FCFA
  isExpressDeliveryEnabled: boolean;
  expressSurcharge: number; // Ex: 1000 FCFA
}
