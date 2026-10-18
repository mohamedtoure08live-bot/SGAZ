'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Flame, ShieldCheck, Check, ArrowRight, Info, AlertCircle } from 'lucide-react';
import { formatFCFA } from '@/lib/format';
import { MOCK_PRODUCTS, MOCK_PRICES, MOCK_BRANDS } from '@/data/mock-data';

export default function CataloguePage() {
  const [hasEmptyBottle, setHasEmptyBottle] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');

  const filteredProducts = selectedBrand === 'all'
    ? MOCK_PRODUCTS
    : MOCK_PRODUCTS.filter((p) => p.brandId === selectedBrand);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* En-tête de page */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 block">
            Barème Officiel Côte d&apos;Ivoire
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mt-1">
            Catalogue des Bouteilles de Gaz
          </h1>
          <p className="text-slate-500 text-sm mt-2 max-w-xl">
            Tarifs réglementés en vigueur à Abidjan. Bouteilles certifiées avec bouchon scellé et contrôle d&apos;étanchéité.
          </p>
        </div>

        {/* Sélecteur Avec ou Sans Échange */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center shrink-0 self-start md:self-auto border border-slate-200/80">
          <button
            type="button"
            onClick={() => setHasEmptyBottle(true)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              hasEmptyBottle
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Avec échange (Recharge)
          </button>
          <button
            type="button"
            onClick={() => setHasEmptyBottle(false)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              !hasEmptyBottle
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sans échange (+ Consigne)
          </button>
        </div>
      </div>

      {/* Avertissement Transparence Consigne */}
      <div className="mt-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 text-xs sm:text-sm text-amber-900">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">
            {hasEmptyBottle
              ? 'Mode recharge active : Vous devez remettre une bouteille vide de même format au livreur lors de la remise.'
              : 'Mode première acquisition : Le montant affiché comprend la caution légale de la bouteille (consigne) + la première charge de gaz.'}
          </p>
          <p className="text-xs text-amber-700 mt-0.5">
            Toutes nos bouteilles proviennent exclusivement des réseaux distributeurs agréés (TotalEnergies, Petroci, Shell, Oryx).
          </p>
        </div>
      </div>

      {/* Grille des Produits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        {filteredProducts.map((product) => {
          const priceObj = MOCK_PRICES[product.id];
          const currentPrice = hasEmptyBottle
            ? priceObj?.priceWithExchange || 5500
            : priceObj?.priceWithoutExchange || 21500;

          return (
            <div
              key={product.id}
              className={`bg-white rounded-3xl p-6 sm:p-7 border-2 transition-all flex flex-col justify-between ${
                product.isPopular
                  ? 'border-red-600 shadow-xl shadow-red-500/10 relative'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-lg'
              }`}
            >
              {product.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-600 text-white shadow-sm">
                  Le Choix des Familles
                </div>
              )}

              <div>
                {/* En-tête carte */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {product.brandName}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                    {product.weightKg} kg net
                  </span>
                </div>

                {/* Nom et visuel stylisé */}
                <div className="my-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight">
                      {product.format}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      {product.formatLabel}
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-red-500/20">
                    <Flame className="w-8 h-8" />
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed min-h-[48px]">
                  {product.description}
                </p>

                {/* Points forts */}
                <ul className="mt-6 space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Bouchon scellé et plombé</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Contrôle étanchéité au départ</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Livré directement à votre étage</span>
                  </li>
                </ul>
              </div>

              {/* Prix et CTA */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-xs text-slate-500 font-semibold">
                    {hasEmptyBottle ? 'Prix recharge :' : 'Prix clé en main :'}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-red-600 tracking-tight">
                    {formatFCFA(currentPrice)}
                  </span>
                </div>

                <Link
                  href={`/commander?format=${product.format}&exchange=${hasEmptyBottle}`}
                  className={`w-full py-3.5 px-4 rounded-2xl font-black uppercase text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
                    product.isPopular
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/30'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20'
                  }`}
                >
                  <span>Commander cette bouteille</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
