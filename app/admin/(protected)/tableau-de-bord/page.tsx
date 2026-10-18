'use client';

import React from 'react';
import Link from 'next/link';
import { useOrders } from '@/context/order-context';
import { formatFCFA, formatDateAbidjan, formatPhoneCI } from '@/lib/format';
import { StatusBadge } from '@/components/ui/badge';
import {
  ShoppingCart,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Phone,
  MessageCircle,
  TrendingUp,
  Wallet,
  Users,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { orders, markClientInformed } = useOrders();

  // Calculs KPIs en temps réel
  const totalOrders = orders.length;
  const urgentOrders = orders.filter((o) => o.status === 'NOUVELLE' || o.status === 'A_CONFIRMER');
  const deliveredOrders = orders.filter((o) => o.status === 'LIVREE');
  const incidentOrders = orders.filter((o) => o.status === 'INCIDENT');
  const activeDeliveries = orders.filter((o) => o.status === 'EN_LIVRAISON');

  const partnerSalesTotal = deliveredOrders.reduce((sum, o) => sum + o.partnerPayout, 0);
  const sosgazRevenueTotal = deliveredOrders.reduce(
    (sum, o) => sum + o.deliveryFee + o.sosgazCommission,
    0
  );

  const successRate = totalOrders > 0
    ? Math.round((deliveredOrders.length / (totalOrders - urgentOrders.length || 1)) * 100)
    : 100;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* En-tête du Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Tableau de Bord des Opérations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Supervision en temps réel des commandes, livraisons et dépôts partenaires à Abidjan.
          </p>
        </div>

        <Link
          href="/admin/commandes"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-red-600/30 transition-all self-start sm:self-auto"
        >
          <span>Gérer le pipeline</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Alerte Urgence si commandes en attente */}
      {urgentOrders.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
            <div>
              <h3 className="text-sm font-bold text-amber-300">
                {urgentOrders.length} commande(s) urgente(s) en attente de vérification
              </h3>
              <p className="text-xs text-amber-200/80 mt-0.5">
                Vérifiez la disponibilité au dépôt et appelez les clients sans délai.
              </p>
            </div>
          </div>
          <Link
            href="/admin/commandes?status=NOUVELLE"
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wide transition-colors self-start sm:self-auto"
          >
            Traiter maintenant
          </Link>
        </div>
      )}

      {/* GRILLE DES 6 CARTES KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 : Commandes du jour */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Total Commandes</span>
            <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-3">{totalOrders}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Dont {urgentOrders.length} à confirmer
          </span>
        </div>

        {/* KPI 2 : En cours de livraison */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>En Livraison Directe</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-3">{activeDeliveries.length}</p>
          <span className="text-[11px] text-blue-400 mt-1 block font-medium">
            Coursiers en route
          </span>
        </div>

        {/* KPI 3 : Revenu SOSGAZ (Strictement séparé) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Revenu SOSGAZ</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-3">
            {formatFCFA(sosgazRevenueTotal)}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Livraison + Commissions
          </span>
        </div>

        {/* KPI 4 : Ventes Partenaires (Dépôts) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Reversé Dépôts</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-300 mt-3">
            {formatFCFA(partnerSalesTotal)}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Valeur nette du gaz vendu
          </span>
        </div>
      </div>

      {/* TABLEAU DES COMMANDES URGENTES EN ATTENTE */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Commandes Requérant une Action Immédiate
            </h2>
            <p className="text-xs text-slate-400">
              Appelez le client ou envoyez un message WhatsApp pour valider la disponibilité.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {urgentOrders.length} en attente
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">ID Commande</th>
                <th className="py-3 px-3">Client & Tél</th>
                <th className="py-3 px-3">Commune & Repère</th>
                <th className="py-3 px-3">Bouteille</th>
                <th className="py-3 px-3">Montant</th>
                <th className="py-3 px-3">Statut</th>
                <th className="py-3 px-3 text-right">Actions Directes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {urgentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Aucune commande urgente en attente. Tout est sous contrôle !
                  </td>
                </tr>
              ) : (
                urgentOrders.map((order) => {
                  const item = order.items[0];
                  return (
                    <tr key={order.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-red-400">
                        <Link href={`/admin/commandes/${order.id}`} className="hover:underline">
                          {order.id}
                        </Link>
                      </td>
                      <td className="py-3 px-3">
                        <strong className="text-white block">{order.customer.fullName}</strong>
                        <span className="text-slate-400">{formatPhoneCI(order.customer.phone)}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-white font-medium block">{order.commune}</span>
                        <span className="text-slate-400 italic line-clamp-1">{order.addressLandmark}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-white font-semibold block">{item?.productName}</span>
                        <span className="text-slate-400 text-[10px]">
                          {item?.hasEmptyBottle ? 'Recharge' : 'Consigne incluse'}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-white">
                        {formatFCFA(order.totalAmount)}
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={order.status} size="sm" />
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Appel */}
                          <a
                            href={`tel:${order.customer.phone.replace(/\s+/g, '')}`}
                            onClick={() => markClientInformed(order.id, 'call')}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                            title="Appeler le client"
                          >
                            <Phone className="w-3.5 h-3.5 text-red-400" />
                          </a>

                          {/* WhatsApp */}
                          <a
                            href={`https://wa.me/${order.customer.phone.replace(/\D/g, '')}?text=Bonjour%20${encodeURIComponent(order.customer.fullName)},%20SOSGAZ%20au%20sujet%20de%20votre%20commande%20${order.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => markClientInformed(order.id, 'whatsapp')}
                            className="p-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 transition-colors"
                            title="Envoyer un message WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>

                          {/* Ouvrir dossier */}
                          <Link
                            href={`/admin/commandes/${order.id}`}
                            className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] transition-colors"
                          >
                            Ouvrir
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
