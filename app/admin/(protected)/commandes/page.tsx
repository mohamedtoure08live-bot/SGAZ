'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useOrders } from '@/context/order-context';
import { formatFCFA, formatDateAbidjan, formatPhoneCI } from '@/lib/format';
import { StatusBadge } from '@/components/ui/badge';
import { OrderStatus } from '@/types';
import {
  Search,
  Filter,
  Phone,
  MessageCircle,
  Eye,
  PlusCircle,
  Download,
  Flame,
  AlertTriangle,
} from 'lucide-react';
import { MOCK_COMMUNES } from '@/data/mock-data';

function CommandesContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') as OrderStatus | null;

  const { orders, markClientInformed } = useOrders();
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus || 'ALL');
  const [communeFilter, setCommuneFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== 'ALL' && order.status !== statusFilter) return false;
    if (communeFilter !== 'ALL' && order.commune !== communeFilter) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchId = order.id.toLowerCase().includes(term);
      const matchName = order.customer.fullName.toLowerCase().includes(term);
      const matchPhone = order.customer.phone.replace(/\D/g, '').includes(term.replace(/\D/g, ''));
      const matchLandmark = order.addressLandmark.toLowerCase().includes(term);
      if (!matchId && !matchName && !matchPhone && !matchLandmark) return false;
    }
    return true;
  });

  const exportCSV = () => {
    const headers = ['ID Commande', 'Date', 'Client', 'Telephone', 'Commune', 'Repere', 'Statut', 'Total FCFA'];
    const rows = filteredOrders.map((o) => [
      o.id,
      o.createdAt,
      `"${o.customer.fullName}"`,
      `"${o.customer.phone}"`,
      o.commune,
      `"${o.addressLandmark.replace(/"/g, '""')}"`,
      o.status,
      o.totalAmount,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `commandes_sosgaz_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Registre des Commandes
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Pipeline dynamique de traitement et d&apos;affectation des bouteilles de gaz.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter CSV</span>
          </button>
          <Link
            href="/commander"
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Simuler commande</span>
          </Link>
        </div>
      </div>

      {/* Barre de Recherche et Filtres */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Recherche texte */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par ID (SGZ-2026-...), nom client, téléphone ou repère..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-red-500"
            />
          </div>

          {/* Filtre par Commune */}
          <div className="md:col-span-3">
            <select
              value={communeFilter}
              onChange={(e) => setCommuneFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 font-bold focus:outline-hidden focus:border-red-500"
            >
              <option value="ALL">Toutes les communes</option>
              {MOCK_COMMUNES.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Filtre par Statut */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 font-bold focus:outline-hidden focus:border-red-500"
            >
              <option value="ALL">Tous les statuts ({orders.length})</option>
              <option value="NOUVELLE">Nouvelle</option>
              <option value="A_CONFIRMER">À confirmer</option>
              <option value="CONFIRMEE">Confirmée</option>
              <option value="EN_PREPARATION">En préparation</option>
              <option value="LIVREUR_AFFECTE">Livreur affecté</option>
              <option value="EN_LIVRAISON">En livraison</option>
              <option value="LIVREE">Livrée</option>
              <option value="INCIDENT">Incident</option>
              <option value="ANNULEE">Annulée</option>
            </select>
          </div>
        </div>

        {/* Pilules de Statut rapides */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'ALL', label: 'Toutes' },
            { id: 'NOUVELLE', label: 'Nouvelles' },
            { id: 'A_CONFIRMER', label: 'À confirmer' },
            { id: 'CONFIRMEE', label: 'Confirmées' },
            { id: 'EN_LIVRAISON', label: 'En livraison' },
            { id: 'LIVREE', label: 'Livrées' },
            { id: 'INCIDENT', label: 'Incidents' },
            { id: 'ANNULEE', label: 'Annulées' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setStatusFilter(pill.id)}
              className={`px-3 py-1.5 rounded-lg font-bold text-[11px] whitespace-nowrap transition-all ${
                statusFilter === pill.id
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table des Commandes */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-950/60">
                <th className="py-3.5 px-4">ID Commande</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Localisation & Repère</th>
                <th className="py-3.5 px-4">Bouteille</th>
                <th className="py-3.5 px-4">Montant</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    Aucune commande ne correspond aux critères sélectionnés.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const item = order.items[0];
                  return (
                    <tr key={order.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-red-400">
                        <Link href={`/admin/commandes/${order.id}`} className="hover:underline">
                          {order.id}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        {formatDateAbidjan(order.createdAt)}
                      </td>
                      <td className="py-3.5 px-4">
                        <strong className="text-white block">{order.customer.fullName}</strong>
                        <span className="text-slate-400">{formatPhoneCI(order.customer.phone)}</span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="text-white font-medium block">
                          {order.commune} ({order.quartier})
                        </span>
                        <span className="text-slate-400 italic text-[11px] line-clamp-1">
                          {order.addressLandmark}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-white font-semibold block">{item?.productName}</span>
                        <span className="text-slate-400 text-[10px]">
                          {item?.hasEmptyBottle ? 'Recharge' : 'Consigne'} • {order.deliveryMode === 'express' ? 'Express' : 'Standard'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-black text-white whitespace-nowrap">
                        {formatFCFA(order.totalAmount)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={order.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`tel:${order.customer.phone.replace(/\s+/g, '')}`}
                            onClick={() => markClientInformed(order.id, 'call')}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                            title="Appeler"
                          >
                            <Phone className="w-3.5 h-3.5 text-red-400" />
                          </a>
                          <a
                            href={`https://wa.me/${order.customer.phone.replace(/\D/g, '')}?text=Bonjour%20${encodeURIComponent(order.customer.fullName)},%20SOSGAZ%20au%20sujet%20de%20votre%20commande%20${order.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => markClientInformed(order.id, 'whatsapp')}
                            className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-400"
                            title="WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                          <Link
                            href={`/admin/commandes/${order.id}`}
                            className="p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold"
                            title="Ouvrir le dossier complet"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function CommandesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Chargement des commandes...</div>}>
      <CommandesContent />
    </Suspense>
  );
}
