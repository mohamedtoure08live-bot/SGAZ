'use client';

import React, { useState } from 'react';
import { Phone, MessageCircle, Clock, AlertTriangle, CheckCircle2, Loader2, Send } from 'lucide-react';
import { MOCK_SETTINGS } from '@/data/mock-data';
import { submitContactMessageAction } from '@/app/actions/contact';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await submitContactMessageAction({
        fullName,
        phone,
        orderNumber: orderNumber || undefined,
        message,
      });

      if (res.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(res.error || 'Une erreur est survenue lors de l’envoi.');
      }
    } catch {
      setErrorMessage('Impossible de contacter le serveur. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFullName('');
    setPhone('');
    setOrderNumber('');
    setMessage('');
    setErrorMessage(null);
  };

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
          <a
            href={`tel:${MOCK_SETTINGS.officialPhone.replace(/\s+/g, '')}`}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center gap-4 hover:border-red-300 hover:shadow-md transition-all block"
            title="Appeler SOSGAZ"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400">Appel direct</h4>
              <p className="text-base font-extrabold text-slate-900 mt-0.5">{MOCK_SETTINGS.officialPhone}</p>
              <span className="text-[11px] text-slate-500">Service client ouvert 7j/7</span>
            </div>
          </a>

          {/* Carte WhatsApp */}
          <a
            href={`https://wa.me/${MOCK_SETTINGS.officialWhatsapp.replace(/\D/g, '')}?text=Bonjour%20SOSGAZ,%20je%20souhaite%20un%20renseignement`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center gap-4 hover:border-emerald-300 hover:shadow-md transition-all block"
            title="Écrire sur WhatsApp"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400">WhatsApp Officiel</h4>
              <p className="text-base font-extrabold text-slate-900 mt-0.5">{MOCK_SETTINGS.officialWhatsapp}</p>
              <span className="text-[11px] text-slate-500">Réponse moyenne en 3 minutes</span>
            </div>
          </a>

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
              <h3 className="text-xl font-bold text-slate-900">Message envoyé et enregistré dans Supabase !</h3>
              <p className="text-slate-500 text-sm mt-2">
                Notre service d&apos;assistance vous répondra dans les plus brefs délais par téléphone ou WhatsApp.
              </p>
              <button
                onClick={handleReset}
                className="mt-6 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="text-lg font-bold text-slate-900">Envoyez-nous un message</h3>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    Votre Nom complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Ex: SGZ-2026-000101"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Votre message ou question <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Précisez ici votre besoin, la localisation ou toute question relative à votre livraison..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Transmettre mon message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
