'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useOrders } from '@/context/order-context';
import { RefreshCw, ExternalLink, Lock } from 'lucide-react';

function DemoBannerInner() {
  const pathname = usePathname();
  const { resetDemoData, orders } = useOrders();
  const isAdminArea = pathname?.startsWith('/admin');

  // En production stricte, désactiver complètement le bandeau de démo
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="bg-slate-900 text-white text-xs py-1.5 px-3 border-b border-slate-800 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
            Mode Simulation
          </span>
          <span className="hidden sm:inline text-slate-300">
            Abidjan • {orders.length} commandes enregistrées
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Bouton Réinitialiser les données */}
          <button
            onClick={resetDemoData}
            className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors text-[11px]"
            title="Remettre les données d'origine"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden md:inline">Réinitialiser</span>
          </button>

          {/* Lien sécurisé vers l'administration */}
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
              className="inline-flex items-center gap-1 bg-red-600/90 hover:bg-red-600 text-white font-medium px-2.5 py-0.5 rounded text-[11px] transition-colors shadow-sm"
            >
              <Lock className="w-3 h-3" />
              <span>Console Back-Office</span>
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
