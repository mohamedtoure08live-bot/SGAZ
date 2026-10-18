'use client';

import React from 'react';
import { useOrders } from '@/context/order-context';
import { formatFCFA } from '@/lib/format';
import { BarChart3, Download, TrendingUp, Wallet, ShieldCheck, Lock } from 'lucide-react';

export default function AdminRapportsPage() {
  const { currentRole, orders } = useOrders();

  if (currentRole !== 'admin') {
    return (
      <div className="p-8 text-center text-slate-400">
        <h2 className="text-xl font-bold text-white">Accès Réservé à l&apos;Administrateur</h2>
        <p className="text-xs mt-1">Les données financières et rapports comptables sont réservés aux administrateurs.</p>
      </div>
    );
  }

  const deliveredOrders = orders.filter((o) => o.status === 'LIVREE');
  const partnerSalesTotal = deliveredOrders.reduce((sum, o) => sum + o.partnerPayout, 0);
  const deliveryFeesTotal = deliveredOrders.reduce((sum, o) => sum + o.deliveryFee, 0);
  const commissionsTotal = deliveredOrders.reduce((sum, o) => sum + o.sosgazCommission, 0);
  const totalSosgazRevenue = deliveryFeesTotal + commissionsTotal;
  const totalTurnover = partnerSalesTotal + totalSosgazRevenue;

  const exportFinancialCSV = () => {
    const headers = ['ID Commande', 'Date', 'Total Client FCFA', 'Part Dépôt FCFA', 'Livraison SOSGAZ FCFA', 'Commission SOSGAZ FCFA', 'Revenu Total SOSGAZ FCFA'];
    const rows = deliveredOrders.map((o) => [
      o.id,
      o.deliveredAt || o.createdAt,
      o.totalAmount,
      o.partnerPayout,
      o.deliveryFee,
      o.sosgazCommission,
      o.deliveryFee + o.sosgazCommission,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rapport_financier_sosgaz_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">
            Comptabilité & Métriques
          </span>
          <h1 className="text-2xl font-black text-white">Rapports Financiers</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Séparation rigoureuse entre les ventes des dépôts et le revenu propre de SOSGAZ.
          </p>
        </div>

        <button
          onClick={exportFinancialCSV}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase flex items-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Exporter Rapport Financier (CSV)</span>
        </button>
      </div>

      {/* 3 Cartes Financières Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Encaissé Client */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Volume d&apos;Affaires Global
          </span>
          <p className="text-3xl font-black text-white mt-2">{formatFCFA(totalTurnover)}</p>
          <span className="text-xs text-slate-400 mt-1 block">
            {deliveredOrders.length} livraisons certifiées
          </span>
        </div>

        {/* Part Dépôts Partenaires */}
        <div className="bg-slate-950 border border-amber-500/30 rounded-3xl p-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Wallet className="w-4 h-4" />
            <span>Ventes Dépôts Partenaires</span>
          </span>
          <p className="text-3xl font-black text-amber-300 mt-2">{formatFCFA(partnerSalesTotal)}</p>
          <span className="text-xs text-slate-400 mt-1 block">
            Montant reversé aux dépôts de gaz
          </span>
        </div>

        {/* Revenu SOSGAZ */}
        <div className="bg-slate-950 border border-emerald-500/30 rounded-3xl p-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" />
            <span>Revenu Net SOSGAZ</span>
          </span>
          <p className="text-3xl font-black text-emerald-400 mt-2">{formatFCFA(totalSosgazRevenue)}</p>
          <div className="mt-2 text-[11px] text-slate-400 space-y-0.5">
            <div>• Frais de livraison : {formatFCFA(deliveryFeesTotal)}</div>
            <div>• Commissions bouteilles : {formatFCFA(commissionsTotal)}</div>
          </div>
        </div>
      </div>

      {/* Tableau détaillé des commandes livrées */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h2 className="text-base font-bold text-white mb-4">Lignes Comptables des Commandes Livrées</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">ID Commande</th>
                <th className="py-3 px-3">Commune</th>
                <th className="py-3 px-3">Dépôt</th>
                <th className="py-3 px-3">Total Client</th>
                <th className="py-3 px-3">Part Dépôt</th>
                <th className="py-3 px-3">Livraison SOSGAZ</th>
                <th className="py-3 px-3">Commission</th>
                <th className="py-3 px-3 text-right">Revenu SOSGAZ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {deliveredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-900/40">
                  <td className="py-3 px-3 font-mono font-bold text-red-400">{o.id}</td>
                  <td className="py-3 px-3 text-white">{o.commune}</td>
                  <td className="py-3 px-3 text-slate-300">{o.partnerName || 'Dépôt partenaire'}</td>
                  <td className="py-3 px-3 font-bold text-white">{formatFCFA(o.totalAmount)}</td>
                  <td className="py-3 px-3 text-amber-300 font-semibold">{formatFCFA(o.partnerPayout)}</td>
                  <td className="py-3 px-3 text-slate-300">{formatFCFA(o.deliveryFee)}</td>
                  <td className="py-3 px-3 text-slate-300">{formatFCFA(o.sosgazCommission)}</td>
                  <td className="py-3 px-3 text-right font-black text-emerald-400">
                    {formatFCFA(o.deliveryFee + o.sosgazCommission)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
