export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'admin' | 'operateur' | 'depot' | 'livreur';

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

export type BottleFormat = 'B6' | 'B12_5' | 'B28';
export type DeliveryMode = 'standard' | 'express';
export type VehicleType = 'moto' | 'tricycle';
export type CourierStatus = 'disponible' | 'en_course' | 'inactif';
export type PaymentMode =
  | 'especes_livraison'
  | 'orange_money'
  | 'mtn_momo'
  | 'wave'
  | 'moov_money';
export type PaymentStatus = 'en_attente' | 'paye' | 'rembourse';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: UserRole;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: UserRole;
          full_name: string;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: UserRole;
          full_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      brands: {
        Row: {
          id: string;
          name: string;
          code: string;
          color: string;
          logo_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          code: string;
          color: string;
          logo_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          color?: string;
          logo_url?: string | null;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          brand_id: string | null;
          name: string;
          format: BottleFormat;
          format_label: string;
          weight_kg: number;
          description: string | null;
          image_url: string | null;
          color: string;
          is_popular: boolean;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          brand_id?: string | null;
          name: string;
          format: BottleFormat;
          format_label: string;
          weight_kg: number;
          description?: string | null;
          image_url?: string | null;
          color: string;
          is_popular?: boolean;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          brand_id?: string | null;
          name?: string;
          format?: BottleFormat;
          format_label?: string;
          weight_kg?: number;
          description?: string | null;
          image_url?: string | null;
          color?: string;
          is_popular?: boolean;
          is_active?: boolean;
          created_at?: string;
        };
      };
      product_prices: {
        Row: {
          id: string;
          product_id: string;
          price_with_exchange: number;
          price_without_exchange: number;
          effective_date: string;
          is_official: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          product_id: string;
          price_with_exchange: number;
          price_without_exchange: number;
          effective_date?: string;
          is_official?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          price_with_exchange?: number;
          price_without_exchange?: number;
          effective_date?: string;
          is_official?: boolean;
          created_at?: string;
        };
      };
      communes: {
        Row: {
          id: string;
          name: string;
          standard_delivery_fee: number;
          express_delivery_fee: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          standard_delivery_fee?: number;
          express_delivery_fee?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          standard_delivery_fee?: number;
          express_delivery_fee?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      quartiers: {
        Row: {
          id: string;
          commune_id: string;
          name: string;
          delivery_fee_override: number | null;
          estimated_minutes: number;
          created_at: string;
        };
        Insert: {
          id: string;
          commune_id: string;
          name: string;
          delivery_fee_override?: number | null;
          estimated_minutes?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          commune_id?: string;
          name?: string;
          delivery_fee_override?: number | null;
          estimated_minutes?: number;
          created_at?: string;
        };
      };
      partner_depots: {
        Row: {
          id: string;
          name: string;
          manager_name: string;
          phone: string;
          whatsapp: string;
          commune: string;
          address: string;
          stock_b6: number;
          stock_b12: number;
          stock_b28: number;
          is_validated: boolean;
          rating: number;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          manager_name: string;
          phone: string;
          whatsapp: string;
          commune: string;
          address: string;
          stock_b6?: number;
          stock_b12?: number;
          stock_b28?: number;
          is_validated?: boolean;
          rating?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          manager_name?: string;
          phone?: string;
          whatsapp?: string;
          commune?: string;
          address?: string;
          stock_b6?: number;
          stock_b12?: number;
          stock_b28?: number;
          is_validated?: boolean;
          rating?: number;
          created_at?: string;
        };
      };
      couriers: {
        Row: {
          id: string;
          full_name: string;
          phone: string;
          whatsapp: string;
          vehicle_type: VehicleType;
          vehicle_plate: string;
          assigned_communes: string[];
          status: CourierStatus;
          is_validated: boolean;
          total_deliveries: number;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          phone: string;
          whatsapp: string;
          vehicle_type?: VehicleType;
          vehicle_plate: string;
          assigned_communes?: string[];
          status?: CourierStatus;
          is_validated?: boolean;
          total_deliveries?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string;
          whatsapp?: string;
          vehicle_type?: VehicleType;
          vehicle_plate?: string;
          assigned_communes?: string[];
          status?: CourierStatus;
          is_validated?: boolean;
          total_deliveries?: number;
          created_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          full_name: string;
          phone: string;
          commune: string;
          quartier: string | null;
          address_landmark: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          phone: string;
          commune: string;
          quartier?: string | null;
          address_landmark: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string;
          commune?: string;
          quartier?: string | null;
          address_landmark?: string;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          public_token: string;
          customer_id: string | null;
          customer_name: string;
          customer_phone: string;
          commune: string;
          quartier: string;
          address_landmark: string;
          delivery_mode: DeliveryMode;
          delivery_fee: number;
          subtotal_products: number;
          total_amount: number;
          sosgaz_commission: number;
          partner_payout: number;
          status: OrderStatus;
          partner_id: string | null;
          courier_id: string | null;
          payment_mode: PaymentMode;
          payment_status: PaymentStatus;
          is_client_notified_whatsapp: boolean;
          is_client_called: boolean;
          incident_reason: string | null;
          cancellation_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          public_token?: string;
          customer_id?: string | null;
          customer_name: string;
          customer_phone: string;
          commune: string;
          quartier: string;
          address_landmark: string;
          delivery_mode?: DeliveryMode;
          delivery_fee: number;
          subtotal_products: number;
          total_amount: number;
          sosgaz_commission?: number;
          partner_payout: number;
          status?: OrderStatus;
          partner_id?: string | null;
          courier_id?: string | null;
          payment_mode?: PaymentMode;
          payment_status?: PaymentStatus;
          is_client_notified_whatsapp?: boolean;
          is_client_called?: boolean;
          incident_reason?: string | null;
          cancellation_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          public_token?: string;
          customer_id?: string | null;
          customer_name?: string;
          customer_phone?: string;
          commune?: string;
          quartier?: string;
          address_landmark?: string;
          delivery_mode?: DeliveryMode;
          delivery_fee?: number;
          subtotal_products?: number;
          total_amount?: number;
          sosgaz_commission?: number;
          partner_payout?: number;
          status?: OrderStatus;
          partner_id?: string | null;
          courier_id?: string | null;
          payment_mode?: PaymentMode;
          payment_status?: PaymentStatus;
          is_client_notified_whatsapp?: boolean;
          is_client_called?: boolean;
          incident_reason?: string | null;
          cancellation_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          format_label: string;
          brand_name: string;
          quantity: number;
          has_empty_bottle: boolean;
          unit_price: number;
          total_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          product_name: string;
          format_label: string;
          brand_name: string;
          quantity?: number;
          has_empty_bottle?: boolean;
          unit_price: number;
          total_price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          product_name?: string;
          format_label?: string;
          brand_name?: string;
          quantity?: number;
          has_empty_bottle?: boolean;
          unit_price?: number;
          total_price?: number;
          created_at?: string;
        };
      };
      order_status_history: {
        Row: {
          id: string;
          order_id: string;
          from_status: OrderStatus;
          to_status: OrderStatus;
          changed_by: string;
          author_role: string;
          reason: string | null;
          timestamp: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          from_status: OrderStatus;
          to_status: OrderStatus;
          changed_by: string;
          author_role: string;
          reason?: string | null;
          timestamp?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          from_status?: OrderStatus;
          to_status?: OrderStatus;
          changed_by?: string;
          author_role?: string;
          reason?: string | null;
          timestamp?: string;
        };
      };
      partner_shops: {
        Row: {
          id: string;
          name: string;
          commune: string;
          quartier: string;
          address: string;
          landmark: string;
          phone: string;
          whatsapp: string;
          hours: string;
          rating: number;
          brands: string[];
          categories: string[];
          advantages: string[];
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          commune: string;
          quartier: string;
          address: string;
          landmark: string;
          phone: string;
          whatsapp: string;
          hours: string;
          rating?: number;
          brands?: string[];
          categories?: string[];
          advantages?: string[];
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          commune?: string;
          quartier?: string;
          address?: string;
          landmark?: string;
          phone?: string;
          whatsapp?: string;
          hours?: string;
          rating?: number;
          brands?: string[];
          categories?: string[];
          advantages?: string[];
          is_active?: boolean;
          created_at?: string;
        };
      };
      partner_applications: {
        Row: {
          id: string;
          partner_type: string;
          full_name: string;
          phone: string;
          commune: string;
          location_details: string | null;
          vehicle_type: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          partner_type: string;
          full_name: string;
          phone: string;
          commune: string;
          location_details?: string | null;
          vehicle_type?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          partner_type?: string;
          full_name?: string;
          phone?: string;
          commune?: string;
          location_details?: string | null;
          vehicle_type?: string | null;
          status?: string;
          created_at?: string;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          full_name: string;
          phone: string;
          order_number: string | null;
          message: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          phone: string;
          order_number?: string | null;
          message: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string;
          order_number?: string | null;
          message?: string;
          status?: string;
          created_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          action: string;
          entity_type: string;
          entity_id: string;
          performed_by: string;
          user_role: string;
          details: string | null;
          timestamp: string;
        };
        Insert: {
          id?: string;
          action: string;
          entity_type: string;
          entity_id: string;
          performed_by: string;
          user_role: string;
          details?: string | null;
          timestamp?: string;
        };
        Update: {
          id?: string;
          action?: string;
          entity_type?: string;
          entity_id?: string;
          performed_by?: string;
          user_role?: string;
          details?: string | null;
          timestamp?: string;
        };
      };
      app_settings: {
        Row: {
          id: string;
          official_phone: string;
          official_whatsapp: string;
          service_start_time: string;
          service_end_time: string;
          express_surcharge: number;
          default_sosgaz_commission: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          official_phone?: string;
          official_whatsapp?: string;
          service_start_time?: string;
          service_end_time?: string;
          express_surcharge?: number;
          default_sosgaz_commission?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          official_phone?: string;
          official_whatsapp?: string;
          service_start_time?: string;
          service_end_time?: string;
          express_surcharge?: number;
          default_sosgaz_commission?: number;
          updated_at?: string;
        };
      };
    };
  };
}
