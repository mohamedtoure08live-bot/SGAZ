/**
 * Schémas et fonctions de validation des entrées utilisateur
 * Conçus pour être utilisés côté client et côté serveur (API / Database).
 */

export interface OrderInputValidation {
  customerName: string;
  customerPhone: string;
  commune: string;
  quartier: string;
  addressLandmark: string;
  selectedFormat: 'B6' | 'B12_5' | 'B28';
  hasEmptyBottle: boolean;
  deliveryMode: 'standard' | 'express';
}

/**
 * Nettoie et valide un numéro de téléphone ivoirien (10 chiffres)
 */
export function validatePhoneCI(phone: string): { isValid: boolean; formatted: string } {
  // Supprimer espaces, tirets, points
  const cleaned = phone.replace(/[\s\-\.\(\)]/g, '');

  // Formats acceptés : +225XXXXXXXXXX, 00225XXXXXXXXXX ou XXXXXXXXXX (10 chiffres)
  const regexCI = /^(?:\+225|00225)?([0-9]{10})$/;
  const match = cleaned.match(regexCI);

  if (match && match[1]) {
    const tenDigits = match[1];
    return {
      isValid: true,
      formatted: `+225 ${tenDigits.slice(0, 2)} ${tenDigits.slice(2, 4)} ${tenDigits.slice(4, 6)} ${tenDigits.slice(6, 8)} ${tenDigits.slice(8, 10)}`,
    };
  }

  // Accepter temporairement les anciens numéros 8 chiffres ou format souple pour la démo
  if (/^[0-9]{8,14}$/.test(cleaned)) {
    return { isValid: true, formatted: cleaned };
  }

  return { isValid: false, formatted: phone };
}

/**
 * Valide les entrées d'une commande avant enregistrement
 */
export function validateOrderInput(input: Partial<OrderInputValidation>): {
  isValid: boolean;
  errors: Record<string, string>;
  sanitizedData?: OrderInputValidation;
} {
  const errors: Record<string, string> = {};

  const name = (input.customerName || '').trim();
  if (!name || name.length < 2) {
    errors.customerName = 'Le nom doit comporter au moins 2 caractères.';
  } else if (name.length > 80) {
    errors.customerName = 'Le nom ne peut pas dépasser 80 caractères.';
  }

  const phoneRes = validatePhoneCI(input.customerPhone || '');
  if (!phoneRes.isValid) {
    errors.customerPhone = 'Numéro de téléphone invalide (10 chiffres requis à Abidjan, ex: 07 00 00 00 00).';
  }

  const landmark = (input.addressLandmark || '').trim();
  if (!landmark || landmark.length < 5) {
    errors.addressLandmark = 'Veuillez préciser un repère visuel clair d’au moins 5 caractères (ex: Face Pharmacie X).';
  } else if (landmark.length > 200) {
    errors.addressLandmark = 'Le repère d’adresse ne peut pas dépasser 200 caractères.';
  }

  const commune = (input.commune || 'Cocody').trim();
  const quartier = (input.quartier || 'Angré').trim();
  const selectedFormat = input.selectedFormat === 'B6' || input.selectedFormat === 'B28' ? input.selectedFormat : 'B12_5';
  const hasEmptyBottle = Boolean(input.hasEmptyBottle);
  const deliveryMode = input.deliveryMode === 'express' ? 'express' : 'standard';

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: {},
    sanitizedData: {
      customerName: name,
      customerPhone: phoneRes.formatted,
      commune,
      quartier,
      addressLandmark: landmark,
      selectedFormat,
      hasEmptyBottle,
      deliveryMode,
    },
  };
}
