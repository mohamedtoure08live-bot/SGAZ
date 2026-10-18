/**
 * Formatage spécifique pour la Côte d'Ivoire (Abidjan)
 */

export function formatFCFA(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0 FCFA';
  }
  return new Intl.NumberFormat('fr-CI', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(amount) + ' FCFA';
}

export function formatPhoneCI(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  // Format habituel ivoirien: +225 07 00 00 00 00 ou 10 chiffres (07 00 00 00 00)
  if (cleaned.startsWith('225') && cleaned.length >= 13) {
    const num = cleaned.slice(3);
    return `+225 ${num.slice(0, 2)} ${num.slice(2, 4)} ${num.slice(4, 6)} ${num.slice(6, 8)} ${num.slice(8, 10)}`;
  }
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)}`;
  }
  return phone;
}

export function formatDateAbidjan(dateIso: string): string {
  try {
    const date = new Date(dateIso);
    return new Intl.DateTimeFormat('fr-CI', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Africa/Abidjan',
    }).format(date);
  } catch {
    return dateIso;
  }
}

export function formatTimeAgo(dateIso: string): string {
  try {
    const date = new Date(dateIso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "À l'instant";
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    return formatDateAbidjan(dateIso);
  } catch {
    return dateIso;
  }
}
