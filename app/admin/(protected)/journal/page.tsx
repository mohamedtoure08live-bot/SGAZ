'use client';

import React from 'react';
import { useOrders } from '@/context/order-context';
import { formatDateAbidjan } from '@/lib/format';
import { ScrollText, ShieldCheck, Lock } from 'lucide-react';

export default function AdminJournalPage() {
  const { currentRole, auditLogs } = useOrders();

  if (currentRole !== 'admin') {
    return (
      <div className="p-8 text-center text-slate-400">
        <h2 className="text-xl font-bold text-white">Accès Réservé à l&apos;Administrateur</h2>
        <p className="text-xs mt-1">Le journal d&apos;audit légal des opérations est strictement réservé aux administrateurs.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">
          Traçabilité Immuable
        </span>
        <h1 className="text-2xl font-black text-white">Journal d&apos;Audit des Opérations</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Historique inaltérable de chaque modification de statut, création de commande, annulation ou ajustement.
        </p>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="space-y-4">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-4 text-xs">
              <div className="w-9 h-9 rounded-xl bg-slate-800 text-red-400 flex items-center justify-center shrink-0">
                <ScrollText className="w-4 h-4" />
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-red-400">{log.action}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      {log.entityType} • {log.entityId}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {formatDateAbidjan(log.timestamp)}
                  </span>
                </div>

                <p className="text-white text-xs mt-1.5 font-medium">{log.details}</p>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Auteur : <strong>{log.performedBy}</strong> ({log.userRole.toUpperCase()})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
