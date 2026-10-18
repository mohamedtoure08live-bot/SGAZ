'use client';

import React from 'react';
import { useOrders } from '@/context/order-context';
import { MOCK_PARTNERS } from '@/data/mock-data';
import { Store, Phone, MessageCircle, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AdminPartenairesPage() {
  const { currentRole } = useOrders();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">
            Réseau Dépôts Agréés
          </span>
          <h1 className="text-2xl font-black text-white">Dépôts Partenaires</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Comptoirs GPL partenaires détenant les stocks de bouteilles officielles.
            {currentRole === 'operateur' && ' (Consultation seule pour votre profil)'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_PARTNERS.map((partner) => (
          <div key={partner.id} className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-amber-400">{partner.commune}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Vérifié
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">{partner.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Gérant : {partner.managerName}</p>
            </div>

            <div className="text-xs text-slate-400 space-y-1.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                <span>{partner.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{partner.phone}</span>
              </div>
            </div>

            {/* Stocks déclarés */}
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Stocks disponibles déclarés :
              </span>
              <div className="flex justify-between text-slate-300">
                <span>B6 (6 kg) :</span>
                <strong className="text-white">{partner.stockAvailable['prod-b6'] || 0}</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>B12.5 (12.5 kg) :</span>
                <strong className="text-white">{partner.stockAvailable['prod-b12'] || 0}</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>B28 (28 kg) :</span>
                <strong className="text-white">{partner.stockAvailable['prod-b28'] || 0}</strong>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-400">Note partenaire :</span>
              <span className="text-amber-400 font-bold">★ {partner.rating} / 5.0</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
