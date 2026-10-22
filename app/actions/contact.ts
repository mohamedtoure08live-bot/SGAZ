'use server';

import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { revalidatePath } from 'next/cache';

export interface ContactMessageInput {
  fullName: string;
  phone: string;
  orderNumber?: string;
  message: string;
}

export interface ContactMessageResult {
  success: boolean;
  message?: string;
  error?: string;
}

const localMessages: Array<ContactMessageInput & { id: string; status: string; createdAt: string }> = [
  {
    id: 'msg-001',
    fullName: 'Yao Kouassi',
    phone: '+225 07 44 55 66 77',
    orderNumber: 'SGZ-2026-000101',
    message: 'Bonjour, je souhaiterais savoir si le livreur a bien pris la route pour Riviera Palmeraie ? Merci.',
    status: 'lu',
    createdAt: new Date().toISOString(),
  },
];

/**
 * Envoie un message de contact (réclamation, question, suivi)
 */
export async function submitContactMessageAction(data: ContactMessageInput): Promise<ContactMessageResult> {
  const fullName = data.fullName?.trim();
  const phone = data.phone?.trim();
  const message = data.message?.trim();
  const orderNumber = data.orderNumber?.trim() || null;

  if (!fullName || fullName.length < 2) {
    return { success: false, error: 'Veuillez saisir votre nom complet.' };
  }
  if (!phone || phone.length < 8) {
    return { success: false, error: 'Veuillez saisir un numéro de téléphone valide.' };
  }
  if (!message || message.length < 10) {
    return { success: false, error: 'Veuillez préciser votre message (au moins 10 caractères).' };
  }

  const nowIso = new Date().toISOString();

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const payload: any = {
        full_name: fullName,
        phone,
        order_number: orderNumber,
        message,
        status: 'non_lu',
      };
      const { error } = await supabase.from('contact_messages').insert(payload);

      if (error) {
        console.error('Erreur Supabase contact_messages:', error);
      }
    }
  }

  localMessages.unshift({
    id: `msg-${Date.now()}`,
    fullName,
    phone,
    orderNumber: orderNumber || undefined,
    message,
    status: 'non_lu',
    createdAt: nowIso,
  });

  revalidatePath('/admin');

  return {
    success: true,
    message: 'Votre message a bien été transmis à la permanence SOSGAZ DOMESTIC. Nous vous répondons immédiatement par appel ou WhatsApp.',
  };
}

/**
 * Récupère les messages de contact pour l'admin
 */
export async function getContactMessagesAction() {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && !error) {
        return (data as any[]).map((m: any) => ({
          id: m.id,
          fullName: m.full_name,
          phone: m.phone,
          orderNumber: m.order_number,
          message: m.message,
          status: m.status,
          createdAt: m.created_at,
        }));
      }
    }
  }

  return localMessages;
}
