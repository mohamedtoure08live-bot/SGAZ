import React from 'react';
import { formatFCFA } from '@/lib/format';
import { Clock, Home, Flame, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

interface OrderSummaryCardProps {
  bottleName: string;
  bottleWeight: string;
  brandName: string;
  hasEmptyBottle: boolean;
  unitPrice: number;
  commune: string;
  quartier: string;
  landmark: string;
  deliveryMode: 'standard' | 'express';
  deliveryFee: number;
  expressSurcharge: number;
  totalAmount: number;
  customerName?: string;
  customerPhone?: string;
  onSubmit: () => void;
  isLoading?: boolean;
}

export function OrderSummaryCard({
  bottleName,
  bottleWeight,
  brandName,
  hasEmptyBottle,
  unitPrice,
  commune,
  quartier,
  landmark,
  deliveryMode,
  deliveryFee,
  expressSurcharge,
  totalAmount,
  customerName,
  customerPhone,
  onSubmit,
  isLoading = false,
}: OrderSummaryCardProps) {
  const isExpress = deliveryMode === 'express';
  const totalDelivery = deliveryFee + (isExpress ? expressSurcharge : 0);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xl shadow-slate-200/50 flex flex-col gap-5">
      {/* En-tête Récapitulatif */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
            Détail de la commande
          </span>
          <h3 className="text-xl font-extrabold text-slate-900">
            Récapitulatif transparent
          </h3>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100">
          Sans compte
        </span>
      </div>

      {/* Carte Service / Délai */}
      <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              {isExpress ? 'Livraison Express (1h à 2h)' : 'Livraison Standard'}
            </h4>
            <p className="text-xs text-slate-500">
              {isExpress
                ? 'Priorité immédiate sur le coursier le plus proche'
                : 'Livraison dans la demi-journée'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
            {formatFCFA(totalDelivery)}
          </span>
        </div>
      </div>

      {/* Carte Lieu & Repère */}
      <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70 flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
          <Home className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900">
              {commune || 'Commune non choisie'} {quartier ? `• ${quartier}` : ''}
            </h4>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            <strong className="text-slate-800">Repère : </strong>
            {landmark ? (
              <span className="text-red-700 font-semibold">{landmark}</span>
            ) : (
              <span className="italic text-slate-400">À renseigner ci-contre</span>
            )}
          </p>
          {customerPhone && (
            <p className="text-xs text-slate-500 mt-0.5">
              Contact : {customerName} ({customerPhone})
            </p>
          )}
        </div>
      </div>

      {/* Carte Bouteille */}
      <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-red-100/70 text-red-600 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              {bottleName} ({bottleWeight})
            </h4>
            <p className="text-xs text-slate-500">
              Marque : {brandName} • {hasEmptyBottle ? 'Avec échange de bouteille vide' : 'Sans échange (+ consigne incluse)'}
            </p>
          </div>
        </div>
        <span className="text-sm font-bold text-slate-900">
          {formatFCFA(unitPrice)}
        </span>
      </div>

      {/* Décomposition des Coûts */}
      <div className="space-y-2 pt-2 border-t border-slate-100 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Recharge GPL ({bottleWeight})</span>
          <span className="font-semibold">{formatFCFA(unitPrice)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Frais d’acheminement {commune ? `(${commune})` : ''}</span>
          <span className="font-semibold">{formatFCFA(totalDelivery)}</span>
        </div>
        {!hasEmptyBottle && (
          <div className="flex justify-between text-amber-700 text-xs bg-amber-50 p-2 rounded-lg">
            <span>Caution de consigne de bouteille</span>
            <span className="font-bold">Incluse dans le prix</span>
          </div>
        )}
        <div className="flex justify-between items-baseline pt-3 border-t border-slate-200">
          <div>
            <span className="text-base font-extrabold text-slate-900 block">Total à payer</span>
            <span className="text-[11px] text-slate-500 font-medium">Paiement en espèces à la livraison</span>
          </div>
          <span className="text-2xl font-black text-red-600 tracking-tight">
            {formatFCFA(totalAmount)}
          </span>
        </div>
      </div>

      {/* Réassurance de sécurité */}
      <div className="flex items-center gap-2 p-3 bg-slate-100/80 rounded-xl text-slate-600 text-xs">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Bouteille plombée d&apos;origine vérifiée avant paiement. Pas d&apos;avance demandée.</span>
      </div>

      {/* Bouton d'action Carbone Foncé (Style Dribbble Mockup) */}
      <button
        onClick={onSubmit}
        disabled={isLoading || !landmark || !commune || !customerPhone}
        className={`w-full py-4 rounded-2xl font-black tracking-wide uppercase text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg ${
          isLoading || !landmark || !commune || !customerPhone
            ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
            : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/30 hover:shadow-xl active:scale-[0.99]'
        }`}
      >
        {isLoading ? (
          <span>Vérification de la commande...</span>
        ) : (
          <>
            <span>Commander mon gaz</span>
            <ArrowRight className="w-5 h-5 text-red-500" />
          </>
        )}
      </button>

      {(!landmark || !customerPhone) && (
        <p className="text-center text-xs text-amber-600 font-medium">
          Veuillez renseigner votre repère et votre numéro pour finaliser.
        </p>
      )}
    </div>
  );
}
