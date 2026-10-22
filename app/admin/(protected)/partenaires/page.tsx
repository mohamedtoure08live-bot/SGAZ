'use client';

import React, { useState, useEffect } from 'react';
import { useOrders } from '@/context/order-context';
import { MOCK_PARTNERS } from '@/data/mock-data';
import { getPartnerApplicationsAction } from '@/app/actions/partners';
import { getContactMessagesAction } from '@/app/actions/contact';
import {
  Store,
  Phone,
  MessageCircle,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  Clock,
  Inbox,
  Bike,
} from 'lucide-react';
import { formatDateAbidjan } from '@/lib/format';

export default function AdminPartenairesPage() {
  const { currentRole } = useOrders();
  const [activeTab, setActiveTab] = useState<'depots' | 'candidatures' | 'messages'>('depots');
  const [applications, setApplications] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([getPartnerApplicationsAction(), getContactMessagesAction()])
      .then(([apps, msgs]) => {
        setApplications(apps || []);
        setMessages(msgs || []);
      })
      .catch((err) => console.error('Erreur chargement admin partenaires:', err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">
            Gestion du Réseau & Relations
          </span>
          <h1 className="text-2xl font-black text-white">Dépôts, Candidatures & Messages</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Supervision du maillage territorial et traitement des demandes d&apos;adhésion partenaires.
          </p>
        </div>

        {/* Onglets */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('depots')}
            className={`px-3 py-2 rounded-xl transition-all ${
              activeTab === 'depots' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dépôts Agréés ({MOCK_PARTNERS.length})
          </button>
          <button
            onClick={() => setActiveTab('candidatures')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'candidatures' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Candidatures</span>
            {applications.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-white/20 text-white text-[10px] flex items-center justify-center font-black">
                {applications.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'messages' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Messages Support</span>
            {messages.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] flex items-center justify-center font-black">
                {messages.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Onglet 1 : Dépôts Agréés */}
      {activeTab === 'depots' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_PARTNERS.map((partner) => (
            <div key={partner.id} className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-amber-400">{partner.commune}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Vérifié
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{partner.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Gérant : {partner.managerName}</p>
              </div>

              <div className="text-xs text-slate-400 space-y-1.5">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                  <span>{partner.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{partner.phone}</span>
                </div>
              </div>

              {/* Stocks déclarés */}
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Stocks disponibles déclarés :
                </span>
                <div className="flex justify-between text-slate-300">
                  <span>B6 (6 kg) :</span>
                  <strong className="text-white">{partner.stockAvailable['prod-b6'] || 0}</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>B12.5 (12.5 kg) :</span>
                  <strong className="text-white">{partner.stockAvailable['prod-b12'] || 0}</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>B28 (28 kg) :</span>
                  <strong className="text-white">{partner.stockAvailable['prod-b28'] || 0}</strong>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-slate-400">Note partenaire :</span>
                <span className="text-amber-400 font-bold">★ {partner.rating} / 5.0</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Onglet 2 : Candidatures Partenaires reçues (Supabase) */}
      {activeTab === 'candidatures' && (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-950 border border-slate-800 text-slate-400">
              <Inbox className="w-10 h-10 mx-auto mb-2 text-slate-600" />
              <p className="font-bold text-sm">Aucune candidature en attente</p>
              <p className="text-xs text-slate-500 mt-1">
                Les nouvelles candidatures soumises sur la page Partenaires apparaîtront ici.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applications.map((app) => (
                <div key={app.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      app.partnerType === 'depot'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {app.partnerType === 'depot' ? <Store className="w-3 h-3" /> : <Bike className="w-3 h-3" />}
                      Candidature {app.partnerType === 'depot' ? 'Dépôt' : 'Livreur'}
                    </span>
                    <span className="text-[10px] text-slate-400">{formatDateAbidjan(app.createdAt)}</span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white">{app.fullName}</h4>
                    <p className="text-xs text-slate-400">Commune : <strong className="text-slate-200">{app.commune}</strong></p>
                  </div>

                  {app.locationDetails && (
                    <p className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800/80">
                      &quot;{app.locationDetails}&quot;
                    </p>
                  )}

                  <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-xs">
                    <a
                      href={`tel:${app.phone.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 font-bold"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{app.phone}</span>
                    </a>

                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300">
                      En attente d&apos;audit
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Onglet 3 : Messages Support Reçus (Supabase) */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-950 border border-slate-800 text-slate-400">
              <Inbox className="w-10 h-10 mx-auto mb-2 text-slate-600" />
              <p className="font-bold text-sm">Aucun message de réclamation</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <strong className="text-white font-bold">{msg.fullName}</strong>
                      {msg.orderNumber && (
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-amber-400">
                          {msg.orderNumber}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500">{formatDateAbidjan(msg.createdAt)}</span>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                    {msg.message}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <a
                      href={`https://wa.me/${msg.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[11px]"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>Répondre sur WhatsApp ({msg.phone})</span>
                    </a>

                    <span className="text-[10px] text-slate-500 uppercase font-mono">
                      Statut: {msg.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
