'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Flame,
  Truck,
  ShieldCheck,
  Clock,
  ArrowRight,
  Phone,
  MessageCircle,
  MapPin,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { formatFCFA } from '@/lib/format';
import { MOCK_PRODUCTS, MOCK_PRICES, MOCK_COMMUNES, MOCK_SETTINGS } from '@/data/mock-data';

export default function HomePage() {
  const router = useRouter();
  const [selectedFormat, setSelectedFormat] = useState<'B6' | 'B12_5' | 'B28'>('B12_5');
  const [hasEmptyBottle, setHasEmptyBottle] = useState(true);
  const [selectedCommune, setSelectedCommune] = useState('Cocody');

  const handleQuickOrder = () => {
    router.push(`/commander?format=${selectedFormat}&exchange=${hasEmptyBottle}&commune=${encodeURIComponent(selectedCommune)}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION AVEC BANDEAU COURBÉ SIGNATURE DU MOCKUP */}
      <section className="relative bg-gradient-to-br from-[#E52020] via-[#EF3826] to-[#FF7A00] text-white pt-10 pb-28 sm:pb-36 px-4 sm:px-6 lg:px-8 rounded-b-[2.5rem] sm:rounded-b-[3.5rem] shadow-2xl shadow-red-500/20 overflow-hidden">
        {/* Cercles de fond lumineux */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            {/* Tag Flash */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-bold tracking-wide uppercase mb-6 shadow-sm">
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Votre gaz, en un clic ! • Abidjan</span>
            </div>

            {/* Titre Principal */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white drop-shadow-sm font-sans">
              Votre gaz de cuisine livré chez vous, <span className="underline decoration-amber-300 underline-offset-4 decoration-4">sans stress</span>.
            </h1>

            {/* Sous-titre */}
            <p className="mt-5 text-base sm:text-lg text-red-50 max-w-2xl font-medium leading-relaxed">
              Fini les tracasseries de bouteille vide en pleine cuisson ! Commandez sans compte, nous trouvons le dépôt le plus proche de votre quartier.
            </p>

            {/* Badges de réassurance dans le hero */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-white/90">
              <span className="flex items-center gap-1.5 bg-black/15 px-3 py-1 rounded-full backdrop-blur-xs">
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                Paiement à la livraison
              </span>
              <span className="flex items-center gap-1.5 bg-black/15 px-3 py-1 rounded-full backdrop-blur-xs">
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                Bouteille plombée d&apos;origine
              </span>
              <span className="flex items-center gap-1.5 bg-black/15 px-3 py-1 rounded-full backdrop-blur-xs">
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                Prix officiels garantis
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CARTE FLOTTANTE DE COMMANDE EXPRESS (Inspirée du mockup) */}
      <section className="-mt-16 sm:-mt-24 max-w-4xl mx-auto px-4 sm:px-6 w-full z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xl shadow-slate-900/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 block">
                Commande Express en 1 clic
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Quelle bouteille vous faut-il ?
              </h2>
            </div>

            {/* Toggle Échange / Sans Échange */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setHasEmptyBottle(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  hasEmptyBottle
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Avec échange vide
              </button>
              <button
                type="button"
                onClick={() => setHasEmptyBottle(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  !hasEmptyBottle
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sans échange (Premier achat)
              </button>
            </div>
          </div>

          {/* Choix des Formats B6 / B12.5 / B28 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {/* Format B6 */}
            <div
              onClick={() => setSelectedFormat('B6')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedFormat === 'B6'
                  ? 'border-red-600 bg-red-50/40 shadow-md shadow-red-500/10'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-500">Petite</span>
                <span className="w-5 h-5 rounded-full border-2 border-red-600 flex items-center justify-center">
                  {selectedFormat === 'B6' && <span className="w-2.5 h-2.5 rounded-full bg-red-600" />}
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg mt-2">B6 (6 kg)</h3>
              <p className="text-xs text-slate-500">Faitout de cuisine</p>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex justify-between items-baseline">
                <span className="text-xs text-slate-500">Prix :</span>
                <span className="text-base font-black text-red-600">
                  {formatFCFA(hasEmptyBottle ? 2000 : 13000)}
                </span>
              </div>
            </div>

            {/* Format B12.5 (Recommandé) */}
            <div
              onClick={() => setSelectedFormat('B12_5')}
              className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedFormat === 'B12_5'
                  ? 'border-red-600 bg-red-50/40 shadow-md shadow-red-500/10'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <span className="absolute -top-3 left-4 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-xs">
                Le plus commandé
              </span>
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-500">Standard</span>
                <span className="w-5 h-5 rounded-full border-2 border-red-600 flex items-center justify-center">
                  {selectedFormat === 'B12_5' && <span className="w-2.5 h-2.5 rounded-full bg-red-600" />}
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg mt-2">B12.5 (12.5 kg)</h3>
              <p className="text-xs text-slate-500">Format ménage classique</p>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex justify-between items-baseline">
                <span className="text-xs text-slate-500">Prix :</span>
                <span className="text-base font-black text-red-600">
                  {formatFCFA(hasEmptyBottle ? 5500 : 21500)}
                </span>
              </div>
            </div>

            {/* Format B28 */}
            <div
              onClick={() => setSelectedFormat('B28')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedFormat === 'B28'
                  ? 'border-red-600 bg-red-50/40 shadow-md shadow-red-500/10'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-500">Grande</span>
                <span className="w-5 h-5 rounded-full border-2 border-red-600 flex items-center justify-center">
                  {selectedFormat === 'B28' && <span className="w-2.5 h-2.5 rounded-full bg-red-600" />}
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg mt-2">B28 (28 kg)</h3>
              <p className="text-xs text-slate-500">Maquis & Restaurants</p>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex justify-between items-baseline">
                <span className="text-xs text-slate-500">Prix :</span>
                <span className="text-base font-black text-red-600">
                  {formatFCFA(hasEmptyBottle ? 13000 : 38000)}
                </span>
              </div>
            </div>
          </div>

          {/* Choix Commune & Bouton d'Action Direct */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-1/2">
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Votre commune à Abidjan :
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                <select
                  value={selectedCommune}
                  onChange={(e) => setSelectedCommune(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                >
                  {MOCK_COMMUNES.map((com) => (
                    <option key={com.id} value={com.name}>
                      {com.name} (Livraison dès {formatFCFA(com.standardDeliveryFee)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="w-full sm:w-1/2">
              <label className="block text-xs font-bold uppercase text-transparent mb-1 hidden sm:block">
                Action
              </label>
              <button
                type="button"
                onClick={handleQuickOrder}
                className="w-full py-3.5 px-6 rounded-xl font-black uppercase text-sm sm:text-base bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 active:scale-98 transition-all"
              >
                <span>Commander maintenant</span>
                <ArrowRight className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* WIDGET LIVREUR EN TEMPS RÉEL (Inspiré de l'écran 1 de la capture Dribbble) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full mt-12">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <Truck className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  Réseau de livreurs actif en direct
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                Livreurs disponibles à Cocody, Yopougon & Marcory
              </h3>
              <p className="text-xs text-blue-200 mt-0.5">
                Temps moyen constaté de livraison aujourd&apos;hui : <strong>35 minutes</strong>.
              </p>
            </div>
          </div>

          <Link
            href="/commander"
            className="w-full md:w-auto px-5 py-3 rounded-xl bg-white hover:bg-blue-50 text-slate-900 text-xs font-extrabold uppercase tracking-wide flex items-center justify-center gap-2 shrink-0 transition-all shadow-md active:scale-95"
          >
            <span>Lancer une course</span>
            <ArrowRight className="w-4 h-4 text-blue-600" />
          </Link>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE (3 ÉTAPES SIMPLES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600">
            Simple, rapide et sans inscription
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Votre gaz à la maison en 3 étapes
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-3">
            Aucun compte requis. Vous passez commande en 60 secondes chrono.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Étape 1 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative">
            <span className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 font-black text-lg flex items-center justify-center mb-5">
              1
            </span>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Choisissez votre bouteille & repère
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Sélectionnez votre format (B6, B12.5 ou B28), indiquez votre commune, quartier et un repère visuel clair (&quot;Face pharmacie...&quot;).
            </p>
          </div>

          {/* Étape 2 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative">
            <span className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 font-black text-lg flex items-center justify-center mb-5">
              2
            </span>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              L&apos;opérateur vérifie le dépôt voisin
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Nous vérifions instantanément la disponibilité chez le dépôt partenaire le plus proche pour vous garantir un prix officiel sans majoration abusive.
            </p>
          </div>

          {/* Étape 3 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative">
            <span className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 font-black text-lg flex items-center justify-center mb-5">
              3
            </span>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Livraison & Paiement sécurisé
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Le livreur achemine votre bouteille plombée d&apos;origine. Vous vérifiez le scellé, donnez la vide et payez en espèces à la remise.
            </p>
          </div>
        </div>
      </section>

      {/* BANNIÈRE APPEL D'URGENCE & WHATSAPP */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Besoin de gaz en urgence immédiate ?
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xl">
              Nos opérateurs sont disponibles par téléphone et sur WhatsApp 7j/7 de {MOCK_SETTINGS.serviceStartTime} à {MOCK_SETTINGS.serviceEndTime}.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <a
              href={`tel:${MOCK_SETTINGS.officialPhone.replace(/\s+/g, '')}`}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>{MOCK_SETTINGS.officialPhone}</span>
            </a>
            <a
              href={`https://wa.me/${MOCK_SETTINGS.officialWhatsapp.replace(/\D/g, '')}?text=Bonjour%20SOSGAZ,%20j'ai%20besoin%20d'une%20livraison%20urgente`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
