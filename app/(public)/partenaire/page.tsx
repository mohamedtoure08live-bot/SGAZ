'use client';

import React, { useState } from 'react';
import { Store, Bike, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { MOCK_COMMUNES } from '@/data/mock-data';

export default function PartenairePage() {
  const [partnerType, setPartnerType] = useState<'depot' | 'livreur'>('depot');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-red-600 block">
          Rejoindre le Réseau SOSGAZ
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
          Devenez Dépôt Partenaire ou Livreur
        </h1>
        <p className="text-slate-500 text-sm mt-3">
          Augmentez votre volume de vente sans frais d&apos;inscription. Nous vous apportons des clients directement dans votre quartier.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 text-center shadow-lg">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Candidature enregistrée !</h2>
          <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto">
            Notre responsable réseau vous contactera sous 24h ouvrées pour la vérification de vos documents et l&apos;intégration dans la plateforme.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-6 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase"
          >
            Nouvelle demande
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md">
          {/* Sélecteur de Type */}
          <div className="grid grid-cols-2 gap-4 p-1.5 bg-slate-100 rounded-2xl mb-8">
            <button
              type="button"
              onClick={() => setPartnerType('depot')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                partnerType === 'depot'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Store className="w-4 h-4 text-red-600" />
              <span>Dépôt de Gaz Agréé</span>
            </button>

            <button
              type="button"
              onClick={() => setPartnerType('livreur')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                partnerType === 'livreur'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bike className="w-4 h-4 text-blue-600" />
              <span>Livreur / Coursier Moto</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Nom complet / Nom du gérant <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Kouamé Jean"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Numéro de Téléphone / WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+225 07 00 00 00 00"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>

            {partnerType === 'depot' ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                      Nom commercial du Dépôt <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Dépôt Gaz Grâce Divine"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                      Commune d&apos;implantation <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold">
                      {MOCK_COMMUNES.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    Adresse physique & repère exact du dépôt <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Yopougon Maroc, Carrefour Oasis face station Total"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                      Moyen de transport <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold">
                      <option value="moto">Moto à deux roues (avec porte-bagage adapté)</option>
                      <option value="tricycle">Tricycle motorisé</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                      Commune principale d&apos;activité <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold">
                      {MOCK_COMMUNES.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    Numéro d&apos;immatriculation de l&apos;engin <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: CI-9988-GH01"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </>
            )}

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Conformément à nos règles de sécurité, chaque dépôt et livreur fait l&apos;objet d&apos;une visite de contrôle et d&apos;une validation préalable par l&apos;administrateur avant toute transmission de commande.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold uppercase text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>Envoyer ma candidature</span>
              <ArrowRight className="w-4 h-4 text-red-500" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
