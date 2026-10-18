'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useOrders } from '@/context/order-context';
import { formatFCFA, formatDateAbidjan } from '@/lib/format';
import { StatusBadge } from '@/components/ui/badge';
import { MOCK_SETTINGS } from '@/data/mock-data';
import {
  CheckCircle2,
  Phone,
  MessageCircle,
  Clock,
  ShieldCheck,
  Flame,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { getOrderByToken, orders } = useOrders();

  // Trouver la commande par son jeton sécurisé, ou prendre la dernière créée
  const order = token ? getOrderByToken(token) : orders[0];

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">Commande introuvable</h1>
        <p className="text-slate-500 text-sm mt-2">
          Le lien de confirmation est invalide ou la commande a expiré.
        </p>
        <Link
          href="/commander"
          className="inline-block mt-6 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm"
        >
          Nouvelle commande
        </Link>
      </div>
    );
  }

  const primaryItem = order.items[0];
  const whatsappMessage = encodeURIComponent(
    `Bonjour SOSGAZ, j'ai passé la commande ${order.id} pour une bouteille ${primaryItem?.formatLabel || 'de gaz'} à ${order.commune}. Pouvez-vous me confirmer la disponibilité ?`
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Carte Principale de Confirmation */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl shadow-slate-900/5 text-center">
        {/* Icône de Réussite */}
        <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-800 mb-3">
          Numéro Unique : {order.id}
        </span>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Commande bien reçue !
        </h1>

        <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-lg mx-auto">
          Votre demande est enregistrée. Notre opérateur vérifie actuellement le stock auprès du dépôt partenaire le plus proche de votre commune.
        </p>

        {/* Badge de Statut en Direct */}
        <div className="mt-6 inline-flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Statut actuel :
          </span>
          <StatusBadge status={order.status} size="lg" />
        </div>

        {/* Boutons d'Action Rapide : WhatsApp & Téléphone */}
        <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Bouton WhatsApp Direct */}
          <a
            href={`https://wa.me/${MOCK_SETTINGS.officialWhatsapp.replace(/\D/g, '')}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/25 active:scale-98 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Accélérer sur WhatsApp</span>
          </a>

          {/* Bouton Appel Direct */}
          <a
            href={`tel:${MOCK_SETTINGS.officialPhone.replace(/\s+/g, '')}`}
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-slate-900/20 active:scale-98 transition-all"
          >
            <Phone className="w-5 h-5 text-red-500" />
            <span>Appeler l&apos;opérateur</span>
          </a>
        </div>

        {/* Chronologie des 3 Prochaines Étapes */}
        <div className="mt-10 p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-left">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-4">
            Prochaines étapes de votre livraison :
          </h3>
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center shrink-0 text-xs">
                1
              </span>
              <div>
                <strong className="text-slate-900 block">Appel de confirmation (5 minutes)</strong>
                <span className="text-slate-500">
                  L&apos;opérateur vous joint pour valider votre repère exact et bloquer la bouteille.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 text-xs">
                2
              </span>
              <div>
                <strong className="text-slate-900 block">Acheminement par coursier dédié</strong>
                <span className="text-slate-500">
                  Le livreur retire la bouteille scellée au dépôt et se dirige vers votre domicile.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 text-xs">
                3
              </span>
              <div>
                <strong className="text-slate-900 block">Contrôle du plombage & Règlement</strong>
                <span className="text-slate-500">
                  Vous inspectez le scellé de garantie, donnez la vide et réglez {formatFCFA(order.totalAmount)} en espèces.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Détails publics de la commande (Sans données privées) */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-left text-xs text-slate-600 space-y-2">
          <div className="flex justify-between">
            <span>Date & Heure :</span>
            <span className="font-semibold text-slate-900">{formatDateAbidjan(order.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span>Bouteille demandée :</span>
            <span className="font-semibold text-slate-900">
              {primaryItem?.productName} ({primaryItem?.hasEmptyBottle ? 'Recharge avec échange' : 'Premier achat'})
            </span>
          </div>
          <div className="flex justify-between">
            <span>Zone de livraison :</span>
            <span className="font-semibold text-slate-900">{order.commune} ({order.quartier})</span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 text-sm">
            <span className="font-bold text-slate-900">Total à payer à la remise :</span>
            <span className="text-xl font-black text-red-600">{formatFCFA(order.totalAmount)}</span>
          </div>
        </div>

        {/* Retour Accueil */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            ← Revenir à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Chargement de la confirmation...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
