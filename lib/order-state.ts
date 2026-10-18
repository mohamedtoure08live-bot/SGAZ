import { OrderStatus, UserRole } from '@/types';

export interface TransitionRule {
  allowedTargets: OrderStatus[];
  requiresReason?: boolean;
  requiresPartnerAndCourier?: boolean;
  adminOnly?: boolean;
}

export const ORDER_STATE_RULES: Record<OrderStatus, TransitionRule> = {
  NOUVELLE: {
    allowedTargets: ['A_CONFIRMER', 'ANNULEE'],
  },
  A_CONFIRMER: {
    allowedTargets: ['CONFIRMEE', 'ANNULEE'],
  },
  CONFIRMEE: {
    allowedTargets: ['EN_PREPARATION', 'INCIDENT', 'ANNULEE'],
  },
  EN_PREPARATION: {
    allowedTargets: ['LIVREUR_AFFECTE', 'INCIDENT', 'ANNULEE'],
    requiresPartnerAndCourier: false,
  },
  LIVREUR_AFFECTE: {
    allowedTargets: ['EN_LIVRAISON', 'INCIDENT', 'ANNULEE'],
    requiresPartnerAndCourier: true,
  },
  EN_LIVRAISON: {
    allowedTargets: ['LIVREE', 'INCIDENT', 'ANNULEE'],
  },
  INCIDENT: {
    // Peut repartir vers son état d'origine ou être annulé
    allowedTargets: ['CONFIRMEE', 'EN_PREPARATION', 'LIVREUR_AFFECTE', 'EN_LIVRAISON', 'ANNULEE'],
    requiresReason: true,
  },
  LIVREE: {
    // État final : seul un admin peut corriger en silence avec journal d'audit
    allowedTargets: [],
    adminOnly: true,
  },
  ANNULEE: {
    // État final
    allowedTargets: [],
  },
};

export interface StatusMeta {
  label: string;
  shortLabel: string;
  color: 'gray' | 'yellow' | 'blue' | 'indigo' | 'purple' | 'cyan' | 'green' | 'red' | 'amber';
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
  description: string;
}

export const STATUS_METADATA: Record<OrderStatus, StatusMeta> = {
  NOUVELLE: {
    label: 'Nouvelle commande',
    shortLabel: 'Nouvelle',
    color: 'yellow',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
    dotColor: 'bg-amber-500',
    description: 'Commande enregistrée par le client, en attente de prise en charge.',
  },
  A_CONFIRMER: {
    label: 'À confirmer (Appel requis)',
    shortLabel: 'À confirmer',
    color: 'yellow',
    badgeBg: 'bg-yellow-50',
    badgeText: 'text-yellow-800',
    badgeBorder: 'border-yellow-200',
    dotColor: 'bg-yellow-500',
    description: 'Opérateur en cours d’appel pour vérifier adresse et disponibilité.',
  },
  CONFIRMEE: {
    label: 'Confirmée',
    shortLabel: 'Confirmée',
    color: 'blue',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-800',
    badgeBorder: 'border-sky-200',
    dotColor: 'bg-sky-500',
    description: 'Commande validée par le client et le dépôt.',
  },
  EN_PREPARATION: {
    label: 'En préparation au dépôt',
    shortLabel: 'En préparation',
    color: 'indigo',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-800',
    badgeBorder: 'border-indigo-200',
    dotColor: 'bg-indigo-500',
    description: 'Bouteille vérifiée, scellée et mise à disposition par le dépôt.',
  },
  LIVREUR_AFFECTE: {
    label: 'Livreur affecté',
    shortLabel: 'Affectée',
    color: 'purple',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-800',
    badgeBorder: 'border-purple-200',
    dotColor: 'bg-purple-500',
    description: 'Livreur désigné et notifié avec bon de livraison.',
  },
  EN_LIVRAISON: {
    label: 'En cours de livraison',
    shortLabel: 'En livraison',
    color: 'cyan',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-800',
    badgeBorder: 'border-blue-200',
    dotColor: 'bg-blue-600',
    description: 'Le livreur est en route vers le repère du client.',
  },
  LIVREE: {
    label: 'Livrée & Encaissée',
    shortLabel: 'Livrée',
    color: 'green',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-200',
    dotColor: 'bg-emerald-500',
    description: 'Bouteille remise, vide récupérée et paiement perçu.',
  },
  INCIDENT: {
    label: 'Incident signalé',
    shortLabel: 'Incident',
    color: 'amber',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-800',
    badgeBorder: 'border-orange-300',
    dotColor: 'bg-orange-600',
    description: 'Problème de livraison (client injoignable, rupture, etc.).',
  },
  ANNULEE: {
    label: 'Commande annulée',
    shortLabel: 'Annulée',
    color: 'red',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-800',
    badgeBorder: 'border-red-200',
    dotColor: 'bg-red-500',
    description: 'Commande annulée avec motif obligatoire archivé.',
  },
};

/**
 * Valide si une transition d'état est autorisée selon les règles métiers
 */
export function validateStatusTransition(
  currentStatus: OrderStatus,
  targetStatus: OrderStatus,
  userRole: UserRole,
  reason?: string,
  hasPartnerAndCourier?: boolean
): { isValid: boolean; errorMessage?: string } {
  if (currentStatus === targetStatus) {
    return { isValid: false, errorMessage: 'La commande est déjà dans ce statut.' };
  }

  // Règle Livrée : Immuable sauf Admin
  if (currentStatus === 'LIVREE') {
    if (userRole !== 'admin') {
      return {
        isValid: false,
        errorMessage: 'Une commande livrée est immuable. Seul un administrateur peut la modifier avec motif et journal d’audit.',
      };
    }
  }

  // Règle Annulée : État terminal
  if (currentStatus === 'ANNULEE') {
    return {
      isValid: false,
      errorMessage: 'Une commande annulée ne peut plus changer de statut.',
    };
  }

  const rules = ORDER_STATE_RULES[currentStatus];
  if (!rules.allowedTargets.includes(targetStatus)) {
    return {
      isValid: false,
      errorMessage: `Transition interdite : impossible de passer de "${STATUS_METADATA[currentStatus].label}" à "${STATUS_METADATA[targetStatus].label}".`,
    };
  }

  // Annulation exige un motif
  if (targetStatus === 'ANNULEE' && (!reason || reason.trim().length < 5)) {
    return {
      isValid: false,
      errorMessage: 'L’annulation exige un motif clair et explicite (minimum 5 caractères).',
    };
  }

  // Incident exige un motif
  if (targetStatus === 'INCIDENT' && (!reason || reason.trim().length < 5)) {
    return {
      isValid: false,
      errorMessage: 'La déclaration d’incident exige un motif explicatif.',
    };
  }

  // Affectation requiert livreur
  if (targetStatus === 'LIVREUR_AFFECTE' && !hasPartnerAndCourier) {
    return {
      isValid: false,
      errorMessage: 'Vous devez désigner un dépôt partenaire et un livreur avant de passer à ce statut.',
    };
  }

  return { isValid: true };
}
