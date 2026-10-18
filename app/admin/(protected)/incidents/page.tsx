'use client';

import React from 'react';
import Link from 'next/link';
import { useOrders } from '@/context/order-context';
import { formatFCFA, formatDateAbidjan } from '@/lib/format';
import { StatusBadge } from '@/components/ui/badge';
import { AlertOctagon, Phone, MessageCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AdminIncidentsPage() {
  const { orders } = useOrders();
  const incidents = orders.filter((o) => o.status === 'INCIDENT');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
            Gestion des Réclamations & Blocages
          </span>
          <h1 className="text-2xl font-black text-white">Registre des Incidents</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Commandes bloquées nécessitant une intervention de l&apos;opérateur (client injoignable, rupture, etc.).
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
          {incidents.length} incident(s) en cours
        </span>
      </div>

      {incidents.length === 0 ? (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">Aucun incident ouvert</h3>
          <p className="text-xs text-slate-400 mt-1">Toutes les livraisons se déroulent normalement.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {incidents.map((order) => (
            <div key={order.id} className="bg-slate-950 border border-amber-500/30 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono font-black text-red-400">{order.id}</span>
                <span className="text-xs text-slate-400">{formatDateAbidjan(order.updatedAt)}</span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white">{order.customer.fullName}</h4>
                <p className="text-xs text-slate-400">
                  {order.commune} ({order.quartier}) • {order.customer.phone}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs">
                <strong className="block text-[10px] uppercase font-bold text-amber-400 mb-1">
                  Cause déclarée de l&apos;incident :
                </strong>
                &quot;{order.incidentReason}&quot;
              </div>

              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Statut d&apos;origine mémorisé :</span>
                <span className="font-bold text-white">{order.previousStatus || 'CONFIRMEE'}</span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-sm font-black text-white">{formatFCFA(order.totalAmount)}</span>
                <Link
                  href={`/admin/commandes/${order.id}`}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase flex items-center gap-1.5 transition-colors"
                >
                  <span>Traiter l&apos;incident</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
