'use server';

import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { validateOrderInput, OrderInputValidation } from '@/lib/validations';
import { calculateOrderPricing } from '@/lib/pricing';
import { MOCK_COMMUNES, MOCK_PRODUCTS, MOCK_PRICES, INITIAL_ORDERS } from '@/data/mock-data';
import { Order, OrderStatus, UserRole } from '@/types';
import { revalidatePath } from 'next/cache';
import { validateStatusTransition } from '@/lib/order-state';

export interface CreateOrderResult {
  success: boolean;
  orderId?: string;
  publicToken?: string;
  confirmationUrl?: string;
  error?: string;
  validationErrors?: Record<string, string>;
}

// Mémoire locale en fallback
const localOrdersStore: Order[] = [...INITIAL_ORDERS];

function generateOrderNumber(): string {
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  return `SGZ-2026-${randomPart}`;
}

function generateSecurePublicToken(): string {
  const array = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < 16; i++) array[i] = Math.floor(Math.random() * 256);
  }
  return 'tok-' + Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Action serveur pour créer une commande de gaz
 */
export async function createOrderAction(formData: FormData | Record<string, any>): Promise<CreateOrderResult> {
  try {
    const isForm = typeof FormData !== 'undefined' && formData instanceof FormData;
    const getVal = (key: string): any => {
      if (isForm) return (formData as FormData).get(key);
      return (formData as Record<string, any>)[key];
    };

    const rawData: Partial<OrderInputValidation> = {
      customerName: getVal('customerName'),
      customerPhone: getVal('customerPhone'),
      commune: getVal('commune'),
      quartier: getVal('quartier'),
      addressLandmark: getVal('addressLandmark'),
      selectedFormat: getVal('selectedFormat'),
      hasEmptyBottle: isForm
        ? getVal('hasEmptyBottle') === 'true' || getVal('hasEmptyBottle') === 'on'
        : Boolean(getVal('hasEmptyBottle')),
      deliveryMode: getVal('deliveryMode'),
    };

    const validation = validateOrderInput(rawData);
    if (!validation.isValid || !validation.sanitizedData) {
      return {
        success: false,
        error: 'Veuillez corriger les informations du formulaire.',
        validationErrors: validation.errors,
      };
    }

    const data = validation.sanitizedData;

    const productMap: Record<string, string> = {
      B6: 'prod-b6',
      B12_5: 'prod-b12',
      B28: 'prod-b28',
    };
    const prodId = productMap[data.selectedFormat] || 'prod-b12';
    const product = MOCK_PRODUCTS.find((p) => p.id === prodId) || MOCK_PRODUCTS[1];
    const priceInfo = MOCK_PRICES[prodId];

    const unitPrice = data.hasEmptyBottle
      ? priceInfo.priceWithExchange
      : priceInfo.priceWithoutExchange;

    const communeObj = MOCK_COMMUNES.find((c) => c.name.toLowerCase() === data.commune.toLowerCase()) || MOCK_COMMUNES[0];
    const isExpress = data.deliveryMode === 'express';
    const baseDeliveryFee = isExpress ? communeObj.expressDeliveryFee : communeObj.standardDeliveryFee;

    const pricing = calculateOrderPricing(
      [{ unitPrice, quantity: 1 }],
      baseDeliveryFee,
      isExpress
    );

    const orderId = generateOrderNumber();
    const publicToken = generateSecurePublicToken();
    const nowIso = new Date().toISOString();

    // 1. Sauvegarde dans Supabase si configuré
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdminClient();
      if (supabase) {
        let customerId: string | null = null;
        try {
          const { data: customerData } = await supabase
            .from('customers')
            .insert({
              full_name: data.customerName,
              phone: data.customerPhone,
              commune: data.commune,
              quartier: data.quartier,
              address_landmark: data.addressLandmark,
            })
            .select('id')
            .single();

          if (customerData) {
            customerId = customerData.id;
          }
        } catch (e) {
          console.error('[Supabase customer error]:', e);
        }

        const { error: orderError } = await supabase.from('orders').insert({
          id: orderId,
          public_token: publicToken,
          customer_id: customerId,
          customer_name: data.customerName,
          customer_phone: data.customerPhone,
          commune: data.commune,
          quartier: data.quartier,
          address_landmark: data.addressLandmark,
          delivery_mode: data.deliveryMode,
          delivery_fee: pricing.totalDeliveryCost,
          subtotal_products: pricing.itemsSubtotal,
          total_amount: pricing.totalAmount,
          sosgaz_commission: pricing.sosgazCommission,
          partner_payout: pricing.partnerPayout,
          status: 'NOUVELLE',
          payment_mode: 'especes_livraison',
          payment_status: 'en_attente',
          is_client_notified_whatsapp: false,
          is_client_called: false,
        });

        if (orderError) {
          console.error('[Supabase insert order error]:', orderError);
        } else {
          await supabase.from('order_items').insert({
            order_id: orderId,
            product_id: product.id,
            product_name: product.name,
            format_label: product.formatLabel,
            brand_name: product.brandName,
            quantity: 1,
            has_empty_bottle: data.hasEmptyBottle,
            unit_price: unitPrice,
            total_price: unitPrice,
          });

          await supabase.from('order_status_history').insert({
            order_id: orderId,
            from_status: 'NOUVELLE',
            to_status: 'NOUVELLE',
            changed_by: 'Client Web SOSGAZ',
            author_role: 'system',
            reason: 'Création en ligne de la commande',
          });

          await supabase.from('audit_logs').insert({
            action: 'COMMANDE_CREEE',
            entity_type: 'orders',
            entity_id: orderId,
            performed_by: data.customerName,
            user_role: 'system',
            details: `Nouvelle commande enregistrée à ${data.commune} (${data.quartier}) pour ${pricing.totalAmount} FCFA.`,
          });
        }
      }
    }

    // 2. Sauvegarde locale en mémoire
    const newLocalOrder: Order = {
      id: orderId,
      publicToken,
      customer: {
        id: `cust-${Date.now()}`,
        fullName: data.customerName,
        phone: data.customerPhone,
        address: data.addressLandmark,
        commune: data.commune,
        quartier: data.quartier,
        landmark: data.addressLandmark,
      },
      items: [
        {
          id: `item-${Date.now()}`,
          productId: product.id,
          productName: product.name,
          formatLabel: product.formatLabel,
          brandName: product.brandName,
          quantity: 1,
          hasEmptyBottle: data.hasEmptyBottle,
          unitPrice,
          totalPrice: unitPrice,
        },
      ],
      commune: data.commune,
      quartier: data.quartier,
      addressLandmark: data.addressLandmark,
      deliveryMode: data.deliveryMode,
      deliveryFee: pricing.totalDeliveryCost,
      subtotalProducts: pricing.itemsSubtotal,
      totalAmount: pricing.totalAmount,
      sosgazCommission: pricing.sosgazCommission,
      partnerPayout: pricing.partnerPayout,
      status: 'NOUVELLE',
      statusHistory: [
        {
          id: `hist-${Date.now()}`,
          orderId,
          fromStatus: 'NOUVELLE',
          toStatus: 'NOUVELLE',
          timestamp: nowIso,
          changedBy: 'Client Web',
          authorRole: 'system',
          reason: 'Création de la commande',
        },
      ],
      paymentMode: 'especes_livraison',
      paymentStatus: 'en_attente',
      isClientNotifiedWhatsapp: false,
      isClientCalled: false,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    localOrdersStore.unshift(newLocalOrder);

    revalidatePath('/admin/commandes');
    revalidatePath('/admin/tableau-de-bord');

    return {
      success: true,
      orderId,
      publicToken,
      confirmationUrl: `/commande/confirmation?token=${encodeURIComponent(publicToken)}`,
    };
  } catch (err: any) {
    console.error('Erreur createOrderAction:', err);
    return {
      success: false,
      error: 'Une erreur imprévue est survenue lors de l’enregistrement de votre commande. Veuillez contacter le 07 03 03 74 04.',
    };
  }
}

/**
 * Action serveur pour récupérer les détails d'une commande par son token public sécurisé
 */
export async function getOrderByTokenAction(token: string): Promise<Order | null> {
  if (!token || typeof token !== 'string') return null;

  const cleanToken = token.trim();

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data: orderRow, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*),
          history:order_status_history(*)
        `)
        .eq('public_token', cleanToken)
        .maybeSingle();

      if (orderRow && !error) {
        const transformed: Order = {
          id: orderRow.id,
          publicToken: orderRow.public_token,
          customer: {
            id: orderRow.customer_id || 'unknown',
            fullName: orderRow.customer_name,
            phone: orderRow.customer_phone,
            address: orderRow.address_landmark,
            commune: orderRow.commune,
            quartier: orderRow.quartier,
            landmark: orderRow.address_landmark,
          },
          items: (orderRow.items || []).map((it: any) => ({
            id: it.id,
            productId: it.product_id,
            productName: it.product_name,
            formatLabel: it.format_label,
            brandName: it.brand_name,
            quantity: it.quantity,
            hasEmptyBottle: it.has_empty_bottle,
            unitPrice: it.unit_price,
            totalPrice: it.total_price,
          })),
          commune: orderRow.commune,
          quartier: orderRow.quartier,
          addressLandmark: orderRow.address_landmark,
          deliveryMode: orderRow.delivery_mode,
          deliveryFee: orderRow.delivery_fee,
          subtotalProducts: orderRow.subtotal_products,
          totalAmount: orderRow.total_amount,
          sosgazCommission: orderRow.sosgaz_commission,
          partnerPayout: orderRow.partner_payout,
          status: orderRow.status,
          partnerId: orderRow.partner_id || undefined,
          courierId: orderRow.courier_id || undefined,
          paymentMode: orderRow.payment_mode === 'especes_livraison' ? 'especes_livraison' : 'mobile_money_simulation',
          paymentStatus: orderRow.payment_status === 'paye' ? 'confirme' : 'en_attente',
          isClientNotifiedWhatsapp: orderRow.is_client_notified_whatsapp ?? false,
          isClientCalled: orderRow.is_client_called ?? false,
          incidentReason: orderRow.incident_reason || undefined,
          cancellationReason: orderRow.cancellation_reason || undefined,
          statusHistory: (orderRow.history || [])
            .sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            .map((h: any) => ({
              id: h.id,
              orderId: h.order_id,
              fromStatus: h.from_status,
              toStatus: h.to_status,
              timestamp: h.timestamp,
              changedBy: h.changed_by,
              authorRole: h.author_role === 'admin' || h.author_role === 'operateur' ? h.author_role : 'system',
              reason: h.reason || undefined,
            })),
          createdAt: orderRow.created_at,
          updatedAt: orderRow.updated_at,
        };

        return transformed;
      }
    }
  }

  const found = localOrdersStore.find((o) => o.publicToken === cleanToken);
  return found || null;
}

/**
 * Action serveur pour mettre à jour le statut d'une commande
 */
export async function updateOrderStatusAction(params: {
  orderId: string;
  newStatus: OrderStatus;
  changedBy: string;
  authorRole: UserRole;
  reason?: string;
  partnerId?: string;
  courierId?: string;
}): Promise<{ success: boolean; error?: string }> {
  const { orderId, newStatus, changedBy, authorRole, reason, partnerId, courierId } = params;

  let currentOrder: Order | null = null;

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data } = await supabase.from('orders').select('*').eq('id', orderId).maybeSingle();
      if (data) {
        currentOrder = {
          id: data.id,
          status: data.status,
          partnerId: data.partner_id || undefined,
          courierId: data.courier_id || undefined,
        } as any;
      }
    }
  }

  if (!currentOrder) {
    currentOrder = localOrdersStore.find((o) => o.id === orderId) || null;
  }

  if (!currentOrder) {
    return { success: false, error: 'Commande introuvable.' };
  }

  const validation = validateStatusTransition(
    currentOrder.status,
    newStatus,
    authorRole,
    reason,
    Boolean((partnerId || currentOrder.partnerId) && (courierId || currentOrder.courierId))
  );

  if (!validation.isValid) {
    return { success: false, error: validation.errorMessage };
  }

  const nowIso = new Date().toISOString();

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const updatePayload: any = {
        status: newStatus,
        updated_at: nowIso,
      };

      if (partnerId) updatePayload.partner_id = partnerId;
      if (courierId) updatePayload.courier_id = courierId;
      if (newStatus === 'ANNULEE' && reason) updatePayload.cancellation_reason = reason;
      if (newStatus === 'INCIDENT' && reason) updatePayload.incident_reason = reason;

      const { error: updateErr } = await supabase
        .from('orders')
        .update(updatePayload)
        .eq('id', orderId);

      if (updateErr) {
        return { success: false, error: updateErr.message };
      }

      await supabase.from('order_status_history').insert({
        order_id: orderId,
        from_status: currentOrder.status,
        to_status: newStatus,
        changed_by: changedBy,
        author_role: authorRole,
        reason: reason || null,
      });

      await supabase.from('audit_logs').insert({
        action: 'STATUT_COMMANDE_MODIFIE',
        entity_type: 'orders',
        entity_id: orderId,
        performed_by: changedBy,
        user_role: authorRole,
        details: `Passage de ${currentOrder.status} à ${newStatus}. ${reason ? 'Motif: ' + reason : ''}`,
      });
    }
  }

  const localIndex = localOrdersStore.findIndex((o) => o.id === orderId);
  if (localIndex !== -1) {
    const old = localOrdersStore[localIndex];
    localOrdersStore[localIndex] = {
      ...old,
      status: newStatus,
      partnerId: partnerId || old.partnerId,
      courierId: courierId || old.courierId,
      incidentReason: newStatus === 'INCIDENT' ? reason : old.incidentReason,
      cancellationReason: newStatus === 'ANNULEE' ? reason : old.cancellationReason,
      updatedAt: nowIso,
      statusHistory: [
        ...old.statusHistory,
        {
          id: `hist-${Date.now()}`,
          orderId,
          fromStatus: old.status,
          toStatus: newStatus,
          timestamp: nowIso,
          changedBy,
          authorRole,
          reason,
        },
      ],
    };
  }

  revalidatePath('/admin/commandes');
  revalidatePath(`/admin/commandes/${orderId}`);
  revalidatePath('/admin/tableau-de-bord');

  return { success: true };
}

/**
 * Action serveur pour récupérer toutes les commandes pour l'administration
 */
export async function getAllOrdersAction(): Promise<Order[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*),
          history:order_status_history(*)
        `)
        .order('created_at', { ascending: false });

      if (data && !error) {
        return data.map((orderRow: any): Order => ({
          id: orderRow.id,
          publicToken: orderRow.public_token,
          customer: {
            id: orderRow.customer_id || 'unknown',
            fullName: orderRow.customer_name,
            phone: orderRow.customer_phone,
            address: orderRow.address_landmark,
            commune: orderRow.commune,
            quartier: orderRow.quartier,
            landmark: orderRow.address_landmark,
          },
          items: (orderRow.items || []).map((it: any) => ({
            id: it.id,
            productId: it.product_id,
            productName: it.product_name,
            formatLabel: it.format_label,
            brandName: it.brand_name,
            quantity: it.quantity,
            hasEmptyBottle: it.has_empty_bottle,
            unitPrice: it.unit_price,
            totalPrice: it.total_price,
          })),
          commune: orderRow.commune,
          quartier: orderRow.quartier,
          addressLandmark: orderRow.address_landmark,
          deliveryMode: orderRow.delivery_mode,
          deliveryFee: orderRow.delivery_fee,
          subtotalProducts: orderRow.subtotal_products,
          totalAmount: orderRow.total_amount,
          sosgazCommission: orderRow.sosgaz_commission,
          partnerPayout: orderRow.partner_payout,
          status: orderRow.status,
          partnerId: orderRow.partner_id || undefined,
          courierId: orderRow.courier_id || undefined,
          paymentMode: orderRow.payment_mode === 'especes_livraison' ? 'especes_livraison' : 'mobile_money_simulation',
          paymentStatus: orderRow.payment_status === 'paye' ? 'confirme' : 'en_attente',
          isClientNotifiedWhatsapp: orderRow.is_client_notified_whatsapp ?? false,
          isClientCalled: orderRow.is_client_called ?? false,
          incidentReason: orderRow.incident_reason || undefined,
          cancellationReason: orderRow.cancellation_reason || undefined,
          statusHistory: (orderRow.history || [])
            .sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            .map((h: any) => ({
              id: h.id,
              orderId: h.order_id,
              fromStatus: h.from_status,
              toStatus: h.to_status,
              timestamp: h.timestamp,
              changedBy: h.changed_by,
              authorRole: h.author_role === 'admin' || h.author_role === 'operateur' ? h.author_role : 'system',
              reason: h.reason || undefined,
            })),
          createdAt: orderRow.created_at,
          updatedAt: orderRow.updated_at,
        }));
      }
    }
  }

  return localOrdersStore;
}
