import React from 'react';
import Link from 'next/link';
import { MapPin, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatFCFA } from '@/lib/format';
import { MOCK_COMMUNES } from '@/data/mock-data';

export default function ZonesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs font-bold uppercase tracking-wider text-red-600 block">
          Couverture Géographique
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
          Communes & Quartiers Desservis à Abidjan
        </h1>
        <p className="text-slate-500 text-sm mt-3">
          Nous étendons progressivement notre réseau de dépôts partenaires pour couvrir l&apos;ensemble du district autonome d&apos;Abidjan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_COMMUNES.map((commune) => (
          <div
            key={commune.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900">{commune.name}</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active
                </span>
              </div>

              <div className="my-4 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Frais standard :</span>
                  <span className="font-bold text-slate-900">{formatFCFA(commune.standardDeliveryFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frais express (1h-2h) :</span>
                  <span className="font-bold text-blue-700">{formatFCFA(commune.expressDeliveryFee)}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Quartiers prioritaires :
                </span>
                <ul className="space-y-1 text-xs text-slate-700">
                  {commune.quartiers.map((q) => (
                    <li key={q.id} className="flex items-center justify-between">
                      <span>• {q.name}</span>
                      <span className="text-[11px] text-slate-400">~{q.estimatedMinutes} min</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link
                href={`/commander?commune=${encodeURIComponent(commune.name)}`}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center bg-slate-100 hover:bg-red-600 hover:text-white text-slate-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Commander à {commune.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
