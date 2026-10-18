import { OrderItem } from '@/types';

export interface PricingBreakdown {
  itemsSubtotal: number;
  deliveryFee: number;
  expressSurcharge: number;
  totalDeliveryCost: number;
  totalAmount: number;
  sosgazCommission: number;
  partnerPayout: number;
}

/**
 * Moteur de calcul côté serveur / récapitulatif
 * Le total est toujours certifié par cette fonction
 */
export function calculateOrderPricing(
  items: Array<{ unitPrice: number; quantity: number }>,
  baseDeliveryFee: number,
  isExpress: boolean,
  expressSurchargeAmount = 1000,
  commissionPerBottle = 500
): PricingBreakdown {
  const itemsSubtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const totalBottles = items.reduce((sum, item) => sum + item.quantity, 0);

  const expressSurcharge = isExpress ? expressSurchargeAmount : 0;
  const totalDeliveryCost = baseDeliveryFee + expressSurcharge;
  const totalAmount = itemsSubtotal + totalDeliveryCost;

  // Modèle financier SOSGAZ :
  // Revenu SOSGAZ = Total livraison + Commission par bouteille
  const sosgazCommission = totalBottles * commissionPerBottle;
  const partnerPayout = Math.max(0, itemsSubtotal - sosgazCommission);

  return {
    itemsSubtotal,
    deliveryFee: baseDeliveryFee,
    expressSurcharge,
    totalDeliveryCost,
    totalAmount,
    sosgazCommission,
    partnerPayout,
  };
}
