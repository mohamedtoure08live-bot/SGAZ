'use client';

import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, MapPin, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { MOCK_SETTINGS } from '@/data/mock-data';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs font-bold uppercase tracking-wider text-red-600 block">
          Support & Assistance
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
          Contactez SOSGAZ DOMESTIC
        </h1>
        <p className="text-slate-500 text-sm mt-3">
          Une question sur une commande en cours, une réclamation ou un renseignement commercial ? Notre équipe à Abidjan est à votre écoute 7j/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coordonnées Directes (5 colonnes) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Carte Téléphone */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400">Appel direct</h4>
              <p className="text-base font-extrabold text-slate-900 mt-0.5">{MOCK_SETTINGS.officialPhone}</p>
              <span className="text-[11px] text-slate-500">Service client ouvert 7j/7</span>
            </div>
          </div>

          {/* Carte WhatsApp */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400">WhatsApp Officiel</h4>
              <p className="text-base font-extrabold text-slate-900 mt-0.5">{MOCK_SETTINGS.officialWhatsapp}</p>
              <span className="text-[11px] text-slate-500">Réponse moyenne en 3 minutes</span>
            </div>
          </div>

          {/* Carte Horaires */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400">Plages de livraison</h4>
              <p className="text-base font-extrabold text-slate-900 mt-0.5">
                {MOCK_SETTINGS.serviceStartTime} – {MOCK_SETTINGS.serviceEndTime}
              </p>
              <span className="text-[11px] text-slate-500">Du Lundi au Dimanche inclus</span>
            </div>
          </div>

          {/* Sécurité Urgence */}
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Urgence Fuite ou Incendie :</strong> SOSGAZ n&apos;est pas un service de secours d&apos;urgence. En cas de sinistre avéré, contactez immédiatement le <strong>180 (Sapeurs-Pompiers Militaires)</strong>.
            </div>
          </div>
        </div>

        {/* Formulaire de Message (7 colonnes) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Message envoyé avec succès</h3>
              <p className="text-slate-500 text-sm mt-2">
                Notre service d&apos;assistance vous répondra dans les plus brefs délais.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-5"
            >
              <h3 className="text-lg font-bold text-slate-900">Envoyez-nous un message</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    Votre Nom complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Kouamé David"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    Téléphone / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+225 07 00 00 00 00"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Numéro de commande (si applicable)
                </label>
                <input
                  type="text"
                  placeholder="Ex: SGZ-2026-000105"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Votre message ou réclamation <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Décrivez votre situation ou votre demande..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold uppercase text-sm tracking-wide transition-all"
              >
                Transmettre au support
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
