'use client';

import React from 'react';
import { useOrders } from '@/context/order-context';
import { MOCK_COURIERS } from '@/data/mock-data';
import { Bike, Phone, MessageCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AdminLivreursPage() {
  const { currentRole } = useOrders();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">
            Flotte Indépendante Agréée
          </span>
          <h1 className="text-2xl font-black text-white">Livreurs & Coursiers</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Livreurs tiers vérifiés pour l&apos;acheminement des bouteilles de gaz à Abidjan.
            {currentRole === 'operateur' && ' (Consultation seule pour votre profil)'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_COURIERS.map((courier) => (
          <div key={courier.id} className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-blue-400 uppercase">
                {courier.vehicleType === 'moto' ? 'Moto 2 roues' : 'Tricycle'} • {courier.vehiclePlate}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  courier.status === 'disponible'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {courier.status === 'disponible' ? 'Disponible' : 'En course'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-base shrink-0">
                <Bike className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{courier.fullName}</h3>
                <span className="text-xs text-slate-400">{courier.phone}</span>
              </div>
            </div>

            <div className="text-xs text-slate-400 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">
                Communes affectées :
              </span>
              <div className="flex flex-wrap gap-1">
                {courier.assignedCommunes.map((com) => (
                  <span key={com} className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 text-[10px]">
                    {com}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Total courses :</span>
              <span className="text-white font-bold">{courier.totalDeliveries} livraisons</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
