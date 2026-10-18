'use client';

import React, { useState } from 'react';
import { useOrders } from '@/context/order-context';
import { formatFCFA } from '@/lib/format';
import { MOCK_PRODUCTS, MOCK_PRICES } from '@/data/mock-data';
import { Tag, ShieldCheck, AlertCircle, Plus, Check } from 'lucide-react';

export default function AdminPrixPage() {
  const { currentRole } = useOrders();
  const [prices, setPrices] = useState(MOCK_PRICES);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (currentRole !== 'admin') {
    return (
      <div className="p-8 text-center text-slate-400">
        <h2 className="text-xl font-bold text-white">Accès Réservé à l&apos;Administrateur</h2>
        <p className="text-xs mt-1">Les opérateurs n&apos;ont pas les droits pour modifier la grille des prix réglementés.</p>
      </div>
    );
  }

  const handleUpdatePrice = (prodId: string, field: 'priceWithExchange' | 'priceWithoutExchange', val: number) => {
    setPrices((prev) => ({
      ...prev,
      [prodId]: {
        ...prev[prodId],
        [field]: val,
      },
    }));
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">
            Réglementation Officielle
          </span>
          <h1 className="text-2xl font-black text-white">Barèmes des Prix du Gaz</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Tarifs plafonnés fixés par arrêté ministériel en République de Côte d&apos;Ivoire.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase flex items-center gap-1.5 transition-all shadow-md shadow-red-600/30"
        >
          {savedSuccess ? <Check className="w-4 h-4" /> : null}
          <span>{savedSuccess ? 'Barème enregistré !' : 'Enregistrer les modifications'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_PRODUCTS.map((product) => {
          const priceObj = prices[product.id];
          return (
            <div key={product.id} className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">{product.brandName}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Officiel
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white">{product.name}</h3>
                <p className="text-xs text-slate-400">{product.formatLabel}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    Prix avec échange (FCFA)
                  </label>
                  <input
                    type="number"
                    value={priceObj?.priceWithExchange || 0}
                    onChange={(e) =>
                      handleUpdatePrice(product.id, 'priceWithExchange', Number(e.target.value))
                    }
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Recharge standard pour client avec bouteille
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    Prix sans échange (FCFA)
                  </label>
                  <input
                    type="number"
                    value={priceObj?.priceWithoutExchange || 0}
                    onChange={(e) =>
                      handleUpdatePrice(product.id, 'priceWithoutExchange', Number(e.target.value))
                    }
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Inclut la caution de consigne ({formatFCFA((priceObj?.priceWithoutExchange || 0) - (priceObj?.priceWithExchange || 0))})
                  </span>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-500">
                Date d&apos;effet : {priceObj?.effectiveDate}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
