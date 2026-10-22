'use client';

import React, { useState } from 'react';
import { Store, Bike, CheckCircle2, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { MOCK_COMMUNES } from '@/data/mock-data';
import { submitPartnerApplicationAction } from '@/app/actions/partners';

export default function PartenairePage() {
  const [partnerType, setPartnerType] = useState<'depot' | 'livreur'>('depot');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Champs de formulaire
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [commune, setCommune] = useState('Cocody');
  const [locationDetails, setLocationDetails] = useState('');
  const [vehicleType, setVehicleType] = useState('moto');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await submitPartnerApplicationAction({
        partnerType,
        fullName,
        phone,
        commune,
        locationDetails,
        vehicleType: partnerType === 'livreur' ? vehicleType : undefined,
      });

      if (res.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(res.error || 'Une erreur est survenue lors de l’envoi de votre candidature.');
      }
    } catch {
      setErrorMessage('Impossible de joindre le serveur. Veuillez vérifier votre connexion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFullName('');
    setPhone('');
    setLocationDetails('');
    setErrorMessage(null);
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
          Augmentez votre volume de vente sans frais d&apos;inscription. Nous vous apportons des clients directement dans votre commune.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 text-center shadow-lg">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Candidature enregistrée dans Supabase !</h2>
          <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto">
            Notre responsable réseau vous contactera sous 24h ouvrées pour la vérification de vos documents et l&apos;intégration dans la plateforme.
          </p>
          <button
            onClick={handleReset}
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

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm font-semibold text-red-700">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Nom complet / Nom du gérant <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
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
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                      Commune d&apos;implantation <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={commune}
                      onChange={(e) => setCommune(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                    >
                      {MOCK_COMMUNES.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                      Adresse physique & repère exact du dépôt <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={locationDetails}
                      onChange={(e) => setLocationDetails(e.target.value)}
                      placeholder="Ex: Yopougon Maroc, Carrefour Oasis face station Total"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                      Moyen de transport <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                    >
                      <option value="moto">Moto à deux roues (avec porte-bagage adapté)</option>
                      <option value="tricycle">Tricycle motorisé</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                      Commune principale d&apos;activité <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={commune}
                      onChange={(e) => setCommune(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                    >
                      {MOCK_COMMUNES.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    Immatriculation ou précisions sur l&apos;engin <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={locationDetails}
                    onChange={(e) => setLocationDetails(e.target.value)}
                    placeholder="Ex: CI-9988-GH01 / Moto KTM avec porte-charge"
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
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-extrabold uppercase text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enregistrement en cours...</span>
                </>
              ) : (
                <>
                  <span>Envoyer ma candidature</span>
                  <ArrowRight className="w-4 h-4 text-red-500" />
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
