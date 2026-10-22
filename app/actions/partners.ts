'use server';

import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { PARTNER_SHOPS, MOCK_DEPOTS, MOCK_COURIERS } from '@/data/mock-data';
import { revalidatePath } from 'next/cache';

export interface PartnerApplicationInput {
  partnerType: 'depot' | 'livreur';
  fullName: string;
  phone: string;
  commune: string;
  locationDetails?: string;
  vehicleType?: string;
}

export interface PartnerApplicationResult {
  success: boolean;
  message?: string;
  error?: string;
}

// Mémoire locale de session pour les candidatures
const localApplications: Array<PartnerApplicationInput & { id: string; status: string; createdAt: string }> = [
  {
    id: 'app-001',
    partnerType: 'depot',
    fullName: 'Koffi Emmanuel',
    phone: '+225 07 12 34 56 78',
    commune: 'Cocody',
    locationDetails: 'Angré 8ème tranche, carrefour prière',
    status: 'en_attente',
    createdAt: new Date().toISOString(),
  },
];

/**
 * Action serveur pour soumettre une candidature partenaire (Dépôt ou Livreur)
 */
export async function submitPartnerApplicationAction(data: PartnerApplicationInput): Promise<PartnerApplicationResult> {
  const fullName = data.fullName?.trim();
  const phone = data.phone?.trim();
  const commune = data.commune?.trim();

  if (!fullName || fullName.length < 3) {
    return { success: false, error: 'Veuillez saisir votre nom complet.' };
  }
  if (!phone || phone.length < 8) {
    return { success: false, error: 'Veuillez saisir un numéro de téléphone valide.' };
  }
  if (!commune) {
    return { success: false, error: 'Veuillez sélectionner votre commune d’activité.' };
  }

  const nowIso = new Date().toISOString();

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const payload: any = {
        partner_type: data.partnerType,
        full_name: fullName,
        phone,
        commune,
        location_details: data.locationDetails?.trim() || null,
        vehicle_type: data.vehicleType || null,
        status: 'en_attente',
      };
      const { error } = await supabase.from('partner_applications').insert(payload);

      if (error) {
        console.error('Erreur Supabase partner_applications:', error);
      }
    }
  }

  localApplications.unshift({
    id: `app-${Date.now()}`,
    partnerType: data.partnerType,
    fullName,
    phone,
    commune,
    locationDetails: data.locationDetails?.trim(),
    vehicleType: data.vehicleType,
    status: 'en_attente',
    createdAt: nowIso,
  });

  revalidatePath('/admin/partenaires');

  return {
    success: true,
    message: 'Votre candidature a bien été enregistrée ! Notre équipe vous contactera sous 24 à 48 heures.',
  };
}

/**
 * Action serveur pour récupérer les candidatures partenaires
 */
export async function getPartnerApplicationsAction() {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('partner_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && !error) {
        return (data as any[]).map((d: any) => ({
          id: d.id,
          partnerType: d.partner_type,
          fullName: d.full_name,
          phone: d.phone,
          commune: d.commune,
          locationDetails: d.location_details,
          vehicleType: d.vehicle_type,
          status: d.status,
          createdAt: d.created_at,
        }));
      }
    }
  }

  return localApplications;
}

/**
 * Action serveur pour récupérer les boutiques d'électroménager & gazinières partenaires
 */
export async function getPartnerShopsAction() {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('partner_shops')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (data && !error && data.length > 0) {
        return (data as any[]).map((s: any) => ({
          id: s.id,
          name: s.name,
          commune: s.commune,
          quartier: s.quartier,
          address: s.address,
          landmark: s.landmark,
          phone: s.phone,
          whatsapp: s.whatsapp,
          hours: s.hours,
          rating: Number(s.rating) || 4.8,
          brands: s.brands || [],
          categories: s.categories || [],
          advantages: s.advantages || [],
        }));
      }
    }
  }

  return PARTNER_SHOPS;
}

/**
 * Récupère les dépôts partenaires
 */
export async function getPartnerDepotsAction() {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('partner_depots')
        .select('*')
        .order('name');

      if (data && !error && data.length > 0) {
        return (data as any[]).map((d: any) => ({
          id: d.id,
          name: d.name,
          managerName: d.manager_name,
          phone: d.phone,
          whatsapp: d.whatsapp,
          commune: d.commune,
          address: d.address,
          stockB6: d.stock_b6,
          stockB12: d.stock_b12,
          stockB28: d.stock_b28,
          isValidated: d.is_validated,
          rating: Number(d.rating),
          createdAt: d.created_at,
        }));
      }
    }
  }

  return MOCK_DEPOTS;
}

/**
 * Récupère les livreurs
 */
export async function getCouriersAction() {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('couriers')
        .select('*')
        .order('full_name');

      if (data && !error && data.length > 0) {
        return (data as any[]).map((c: any) => ({
          id: c.id,
          fullName: c.full_name,
          phone: c.phone,
          whatsapp: c.whatsapp,
          vehicleType: c.vehicle_type,
          vehiclePlate: c.vehicle_plate,
          assignedCommunes: c.assigned_communes,
          status: c.status,
          isValidated: c.is_validated,
          totalDeliveries: c.total_deliveries,
          createdAt: c.created_at,
        }));
      }
    }
  }

  return MOCK_COURIERS;
}
