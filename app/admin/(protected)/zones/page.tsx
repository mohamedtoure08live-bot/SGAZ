'use client';

import React, { useState } from 'react';
import { useOrders } from '@/context/order-context';
import { formatFCFA } from '@/lib/format';
import { MOCK_COMMUNES } from '@/data/mock-data';
import { MapPin, Plus, Check } from 'lucide-react';

export default function AdminZonesPage() {
  const { currentRole } = useOrders();
  const [communes, setCommunes] = useState(MOCK_COMMUNES);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (currentRole !== 'admin') {
    return (
      <div className="p-8 text-center text-slate-400">
        <h2 className="text-xl font-bold text-white">Accès Réservé à l&apos;Administrateur</h2>
        <p className="text-xs mt-1">Seul un administrateur peut modifier le périmètre des zones et les tarifs de livraison.</p>
      </div>
    );
  }

  const handleFeeChange = (id: string, field: 'standardDeliveryFee' | 'expressDeliveryFee', val: number) => {
    setCommunes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: val } : c))
    );
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
            Logistique Urbaine Abidjan
          </span>
          <h1 className="text-2xl font-black text-white">Zones & Frais de Livraison</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Paramétrage des frais de course par commune et repli sur les quartiers.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase flex items-center gap-1.5 transition-all shadow-md shadow-red-600/30"
        >
          {savedSuccess ? <Check className="w-4 h-4" /> : null}
          <span>{savedSuccess ? 'Frais enregistrés !' : 'Enregistrer la grille'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communes.map((commune) => (
          <div key={commune.id} className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                <h3 className="font-extrabold text-white text-base">{commune.name}</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                Active
              </span>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  Frais Standard (FCFA)
                </label>
                <input
                  type="number"
                  value={commune.standardDeliveryFee}
                  onChange={(e) =>
                    handleFeeChange(commune.id, 'standardDeliveryFee', Number(e.target.value))
                  }
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  Frais Express 1h-2h (FCFA)
                </label>
                <input
                  type="number"
                  value={commune.expressDeliveryFee}
                  onChange={(e) =>
                    handleFeeChange(commune.id, 'expressDeliveryFee', Number(e.target.value))
                  }
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold text-blue-400"
                />
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Quartiers ({commune.quartiers.length}) :
                </span>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {commune.quartiers.map((q) => q.name).join(', ')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
