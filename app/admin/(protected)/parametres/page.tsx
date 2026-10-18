'use client';

import React, { useState } from 'react';
import { useOrders } from '@/context/order-context';
import { MOCK_SETTINGS } from '@/data/mock-data';
import { Settings, Check, Clock, Phone, MessageCircle, Wallet, Shield } from 'lucide-react';

export default function AdminParametresPage() {
  const { currentRole } = useOrders();
  const [settings, setSettings] = useState(MOCK_SETTINGS);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (currentRole !== 'admin') {
    return (
      <div className="p-8 text-center text-slate-400">
        <h2 className="text-xl font-bold text-white">Accès Réservé à l&apos;Administrateur</h2>
        <p className="text-xs mt-1">Seul un administrateur peut modifier la configuration générale du service.</p>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">
            Configuration Générale
          </span>
          <h1 className="text-2xl font-black text-white">Paramètres de la Plateforme</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Horaires d&apos;ouverture, canaux de communication et règles financières de base.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase flex items-center gap-1.5 transition-all shadow-md shadow-red-600/30"
        >
          {savedSuccess ? <Check className="w-4 h-4" /> : null}
          <span>{savedSuccess ? 'Enregistré avec succès !' : 'Enregistrer'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Canaux de contact officiels */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Canaux Officiels de Communication
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                Téléphone Appel Direct (+225)
              </label>
              <input
                type="text"
                value={settings.officialPhone}
                onChange={(e) => setSettings({ ...settings, officialPhone: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                Numéro WhatsApp Officiel
              </label>
              <input
                type="text"
                value={settings.officialWhatsapp}
                onChange={(e) => setSettings({ ...settings, officialWhatsapp: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold text-emerald-400"
              />
            </div>
          </div>
        </div>

        {/* Plages Horaires */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Horaires d&apos;Activité du Service
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                Ouverture des prises de commande
              </label>
              <input
                type="text"
                value={settings.serviceStartTime}
                onChange={(e) => setSettings({ ...settings, serviceStartTime: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                Fermeture des livraisons du soir
              </label>
              <input
                type="text"
                value={settings.serviceEndTime}
                onChange={(e) => setSettings({ ...settings, serviceEndTime: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
              />
            </div>
          </div>
        </div>

        {/* Paramètres Financiers */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Commissions & Options Tarifaires
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                Commission SOSGAZ par bouteille (FCFA)
              </label>
              <input
                type="number"
                value={settings.defaultSosgazCommission}
                onChange={(e) =>
                  setSettings({ ...settings, defaultSosgazCommission: Number(e.target.value) })
                }
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                Majoration Course Express 1h-2h (FCFA)
              </label>
              <input
                type="number"
                value={settings.expressSurcharge}
                onChange={(e) =>
                  setSettings({ ...settings, expressSurcharge: Number(e.target.value) })
                }
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
