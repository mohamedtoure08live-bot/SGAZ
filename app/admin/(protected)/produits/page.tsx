'use client';

import React from 'react';
import { MOCK_PRODUCTS, MOCK_BRANDS } from '@/data/mock-data';
import { Flame, ShieldCheck } from 'lucide-react';

export default function AdminProduitsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">
            Catalogue Référence
          </span>
          <h1 className="text-2xl font-black text-white">Bouteilles & Formats de Gaz</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Gestion des formats (B6, B12.5, B28) et des distributeurs agréés en Côte d&apos;Ivoire.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_PRODUCTS.map((p) => (
          <div key={p.id} className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">{p.brandName}</span>
              <span className="text-xs font-bold text-amber-400">{p.weightKg} kg</span>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-500 flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-black text-white">{p.name}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{p.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>Robinetterie :</span>
              <span className="text-white font-bold">Standard 20mm</span>
            </div>
          </div>
        ))}
      </div>

      {/* Marques agréées */}
      <div className="mt-8 pt-8 border-t border-slate-800">
        <h3 className="text-sm font-bold uppercase text-slate-400 mb-4">Marques Distributeurs Agréées</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {MOCK_BRANDS.map((b) => (
            <div key={b.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-sm font-bold text-white block">{b.name}</span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{b.code}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
