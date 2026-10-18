'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useOrders } from '@/context/order-context';
import { ShieldCheck, UserCheck, RefreshCw, ExternalLink } from 'lucide-react';

function DemoBannerInner() {
  const pathname = usePathname();
  const { currentRole, setCurrentRole, resetDemoData, orders } = useOrders();
  const isAdminArea = pathname?.startsWith('/admin');

  return (
    <div className="bg-slate-900 text-white text-xs py-1.5 px-3 border-b border-slate-800 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
            Mode DÉMO
          </span>
          <span className="hidden sm:inline text-slate-300">
            Données de simulation Abidjan • {orders.length} commandes actives
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Switch de Rôle */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setCurrentRole('admin')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                currentRole === 'admin'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Accès complet (tarifs, suppression, journal d'audit)"
            >
              <ShieldCheck className="w-3 h-3" />
              Admin
            </button>
            <button
              onClick={() => setCurrentRole('operateur')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                currentRole === 'operateur'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Accès opérationnel (commandes, statuts, appels)"
            >
              <UserCheck className="w-3 h-3" />
              Opérateur
            </button>
          </div>

          {/* Bouton Réinitialiser */}
          <button
            onClick={resetDemoData}
            className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors text-[11px]"
            title="Remettre les données d'origine"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden md:inline">Réinitialiser</span>
          </button>

          {/* Bascule Vue Client / Admin */}
          {isAdminArea ? (
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 font-medium text-[11px]"
            >
              Voir le Site Client
              <ExternalLink className="w-3 h-3" />
            </Link>
          ) : (
            <Link
              href="/admin/tableau-de-bord"
              className="inline-flex items-center gap-1 bg-red-600/90 hover:bg-red-600 text-white font-medium px-2 py-0.5 rounded text-[11px] transition-colors shadow-sm"
            >
              Console Back-Office
              <ExternalLink className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function DemoBanner() {
  return (
    <Suspense fallback={null}>
      <DemoBannerInner />
    </Suspense>
  );
}
