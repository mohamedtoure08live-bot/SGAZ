'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
  AlertTriangle,
  Award,
  ChevronRight,
  Shield,
  HelpCircle,
  Layers,
  Check,
} from 'lucide-react';
import { formatFCFA } from '@/lib/format';
import { MOCK_COMMUNES, MOCK_SETTINGS, MOCK_BRANDS } from '@/data/mock-data';
import { AdBannerCarousel } from '@/components/public/ad-banner-carousel';

export default function HomePage() {
  const router = useRouter();
  const [selectedFormat, setSelectedFormat] = useState<'B6' | 'B12_5' | 'B28'>('B12_5');
  const [hasEmptyBottle, setHasEmptyBottle] = useState(true);
  const [selectedCommuneId, setSelectedCommuneId] = useState('com-cocody');

  // Tarifs officiels
  const prices = {
    B6: {
      withExchange: 2000,
      withoutExchange: 13000,
      title: 'B6 (6 kg)',
      sub: 'Petite cuisine & faitout',
      weight: '6 kg',
      tag: 'Économique',
    },
    B12_5: {
      withExchange: 5500,
      withoutExchange: 21500,
      title: 'B12.5 (12.5 kg)',
      sub: 'Format standard des familles',
      weight: '12.5 kg',
      tag: 'Le plus commandé',
    },
    B28: {
      withExchange: 13000,
      withoutExchange: 38000,
      title: 'B28 (28 kg)',
      sub: 'Restaurants, maquis & traiteurs',
      weight: '28 kg',
      tag: 'Professionnel',
    },
  };

  const currentCommune = MOCK_COMMUNES.find((c) => c.id === selectedCommuneId) || MOCK_COMMUNES[0];
  const currentPriceConfig = prices[selectedFormat];
  const bottlePrice = hasEmptyBottle
    ? currentPriceConfig.withExchange
    : currentPriceConfig.withoutExchange;
  const deliveryFee = currentCommune.standardDeliveryFee;
  const totalPrice = bottlePrice + deliveryFee;

  const handleQuickOrder = () => {
    router.push(
      `/commander?format=${selectedFormat}&exchange=${hasEmptyBottle}&commune=${encodeURIComponent(
        currentCommune.name
      )}`
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* =========================================================================
          1. HERO SECTION : EXPÉRIENCE VISUELLE FORTE & WIDGET DE COMMANDE
          ========================================================================= */}
      <section className="relative bg-gradient-to-br from-[#E52020] via-[#EF3826] to-[#FF7A00] text-white pt-8 sm:pt-14 pb-32 sm:pb-44 px-4 sm:px-6 lg:px-8 rounded-b-[2.5rem] sm:rounded-b-[4rem] shadow-2xl shadow-red-600/25 overflow-hidden">
        {/* Lueurs et formes d'ambiance */}
        <div className="absolute -top-32 -right-32 w-[30rem] h-[30rem] rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-96 h-96 rounded-full bg-amber-400/25 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-full bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Tagline d'ancrage local */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-xs sm:text-sm font-bold tracking-wide uppercase mb-6 shadow-sm">
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
              <span>Votre gaz, en un clic ! • Partout à Abidjan</span>
            </div>

            {/* Titre Principal orienté bénéfice */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white drop-shadow-sm">
              Votre gaz de cuisine livré en{' '}
              <span className="relative inline-block whitespace-nowrap">
                <span className="underline decoration-amber-300 underline-offset-8 decoration-4 sm:decoration-8">
                  30 minutes
                </span>
              </span>{' '}
              dans votre cuisine.
            </h1>

            {/* Sous-titre rassurant */}
            <p className="mt-6 text-base sm:text-xl text-red-50 max-w-2xl font-medium leading-relaxed">
              Fini les pannes en pleine préparation de repas ! Commandez sans compte, nous
              dispatchons le dépôt agréé le plus proche de votre quartier.
            </p>

            {/* Badges de Réassurance Officielle */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-bold text-white/95">
              <span className="flex items-center gap-2 bg-black/25 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                Prix officiels de l&apos;État (Côte d&apos;Ivoire)
              </span>
              <span className="flex items-center gap-2 bg-black/25 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                Bouteilles plombées d&apos;origine
              </span>
              <span className="flex items-center gap-2 bg-black/25 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 shadow-xs">
                <Clock className="w-4 h-4 text-amber-300" />
                Paiement à la livraison
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. WIDGET DE COMMANDE EXPRESS CONNECTÉ & SIMULATEUR EN DIRECT
          ========================================================================= */}
      <section className="-mt-24 sm:-mt-32 max-w-5xl mx-auto px-4 sm:px-6 w-full z-20">
        <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 border border-slate-200/90 shadow-2xl shadow-slate-900/15">
          {/* En-tête de la carte */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                <span className="text-xs font-black uppercase tracking-wider text-red-600">
                  Simulateur & Commande Express
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Quelle bouteille vous faut-il aujourd&apos;hui ?
              </h2>
            </div>

            {/* Toggle Échange Vide / Nouvel Achat */}
            <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl self-start sm:self-auto border border-slate-200/70">
              <button
                type="button"
                onClick={() => setHasEmptyBottle(true)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
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
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                  !hasEmptyBottle
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sans échange (Consigne)
              </button>
            </div>
          </div>

          {/* Grille des Formats (B6, B12.5, B28) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {(['B6', 'B12_5', 'B28'] as const).map((fmt) => {
              const conf = prices[fmt];
              const isSelected = selectedFormat === fmt;
              const price = hasEmptyBottle ? conf.withExchange : conf.withoutExchange;

              return (
                <div
                  key={fmt}
                  onClick={() => setSelectedFormat(fmt)}
                  className={`relative p-5 rounded-3xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-red-600 bg-red-50/40 shadow-lg shadow-red-500/10'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  {fmt === 'B12_5' && (
                    <span className="absolute -top-3 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-xs">
                      {conf.tag}
                    </span>
                  )}

                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-500">{conf.weight}</span>
                    <span
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected ? 'border-red-600 bg-red-50' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <span className="w-3 h-3 rounded-full bg-red-600" />}
                    </span>
                  </div>

                  <h3 className="font-black text-slate-900 text-lg sm:text-xl mt-3">{conf.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{conf.sub}</p>

                  <div className="mt-5 pt-4 border-t border-slate-200/60 flex justify-between items-baseline">
                    <span className="text-xs font-medium text-slate-500">
                      {hasEmptyBottle ? 'Recharge :' : 'Bouteille neuve :'}
                    </span>
                    <span className="text-lg font-black text-red-600">{formatFCFA(price)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sélecteur de Commune + Calcul Récapitulatif + CTA */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Choix de la Commune */}
            <div className="lg:col-span-5">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                Votre commune de livraison à Abidjan :
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-red-600 absolute left-3.5 top-3.5 pointer-events-none" />
                <select
                  value={selectedCommuneId}
                  onChange={(e) => setSelectedCommuneId(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:bg-white transition-all shadow-xs"
                >
                  {MOCK_COMMUNES.map((com) => (
                    <option key={com.id} value={com.id}>
                      {com.name} (Livraison dès {formatFCFA(com.standardDeliveryFee)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Récapitulatif Tarifaire en Direct */}
            <div className="lg:col-span-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <div className="text-[11px] text-slate-500 flex justify-between">
                <span>Gaz :</span>
                <span className="font-bold text-slate-800">{formatFCFA(bottlePrice)}</span>
              </div>
              <div className="text-[11px] text-slate-500 flex justify-between mt-1">
                <span>Livraison ({currentCommune.name}) :</span>
                <span className="font-bold text-slate-800">{formatFCFA(deliveryFee)}</span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-xs font-black text-slate-700">Total :</span>
                <span className="text-base font-black text-red-600">{formatFCFA(totalPrice)}</span>
              </div>
            </div>

            {/* Bouton d'Action Direct */}
            <div className="lg:col-span-4">
              <button
                type="button"
                onClick={handleQuickOrder}
                className="w-full py-4 px-6 rounded-2xl font-black uppercase text-sm sm:text-base bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20 active:scale-98 transition-all group"
              >
                <span>Commander maintenant</span>
                <ArrowRight className="w-5 h-5 text-red-500 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. CARROUSEL PUBLICITAIRE & OFFRES BOUTIQUES PARTENAIRES (GAZINIÈRES & ÉLECTROMÉNAGER)
          ========================================================================= */}
      <AdBannerCarousel />

      {/* =========================================================================
          4. SECTION PARTENAIRES OFFICIELS & ÉCOSYSTÈME DE CONFIANCE (LOGOS FOURNIS)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black uppercase tracking-wider mb-3">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Confiance & Partenariats Stratégiques</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Ils nous font confiance & soutiennent notre déploiement
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            SOSGAZ DOMESTIC s&apos;associe aux acteurs de référence du tissu urbain, économique et
            sportif en Côte d&apos;Ivoire pour vous apporter un service fiable, transparent et
            sécurisé.
          </p>
        </div>

        {/* Grille des 3 Partenaires avec leurs vrais logos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Partenaire 1 : MyGuide Côte d'Ivoire */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-md hover:shadow-xl transition-all flex flex-col items-center text-center group">
            <div className="w-full h-36 relative mb-6 flex items-center justify-center bg-slate-50/70 rounded-2xl p-4 border border-slate-100 group-hover:border-slate-200 transition-colors">
              <Image
                src="/images/partner-myguide.jpg"
                alt="Logo Partenaire MyGuide Côte d'Ivoire"
                width={240}
                height={120}
                className="max-h-28 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 mb-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Guide Urbain de Référence</span>
            </div>
            <h3 className="text-lg font-black text-slate-900">MyGuide Côte d&apos;Ivoire</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              Le guide de référence urbain à Abidjan.
            </p>
          </div>

          {/* Partenaire 2 : EPARGNANT */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-md hover:shadow-xl transition-all flex flex-col items-center text-center group">
            <div className="w-full h-36 relative mb-6 flex items-center justify-center bg-[#0d1b33] rounded-2xl p-4 border border-slate-800 group-hover:border-slate-700 transition-colors">
              <Image
                src="/images/partner-epargnant.jpg"
                alt="Logo Partenaire EPARGNANT"
                width={200}
                height={120}
                className="max-h-28 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Éducation Financière</span>
            </div>
            <h3 className="text-lg font-black text-slate-900">EPARGNANT</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              Le meilleur modèle d&apos;éducation financière, parfait pour réaliser vos rêves.
            </p>
          </div>

          {/* Partenaire 3 : ACAS-FOOT */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-md hover:shadow-xl transition-all flex flex-col items-center text-center group">
            <div className="w-full h-36 relative mb-6 flex items-center justify-center bg-slate-950 rounded-2xl p-4 border border-slate-800 group-hover:border-slate-700 transition-colors">
              <Image
                src="/images/partner-acas.jpg"
                alt="Logo Partenaire ACAS-FOOT"
                width={200}
                height={120}
                className="max-h-28 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 mb-2">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Insertion Par Le Sport</span>
            </div>
            <h3 className="text-lg font-black text-slate-900">ACAS-FOOT</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              Formation et insertion professionnelle des jeunes par le football.
            </p>
          </div>
        </div>

        {/* Bandeau des Marques Officielles de Bouteilles supportées */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold shrink-0">
              <Flame className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                100% Marques Agréées en Côte d&apos;Ivoire
              </h4>
              <p className="text-xs text-slate-500">
                Toutes nos recharges proviennent des dépôts officiels certifiés.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-6">
            {MOCK_BRANDS.map((brand) => (
              <span
                key={brand.id}
                className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-slate-700 shadow-2xs"
              >
                {brand.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. SECTION PROBLÈME / DOULEUR : LA GALÈRE DE LA BOUTEILLE VIDE À ABIDJAN
          ========================================================================= */}
      <section className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Texte Éditorial Fort */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-black uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>La réalité du quotidien à Abidjan</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.15]">
                12h45 : Le repas est sur le feu...{' '}
                <span className="text-red-500">et la flamme s&apos;éteint</span>.
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Tout le monde a déjà vécu cette galère à Abidjan : porter une bouteille de gaz lourde
                de 12.5 kg sous le soleil, marcher jusqu&apos;au dépôt le plus proche, trouver le
                rideau fermé ou faire face à une rupture soudaine de stock.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="w-6 h-6 rounded-lg bg-red-500/20 text-red-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    ✕
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300">
                    <strong>Le calvaire du transport :</strong> Les chauffeurs de taxi ou de
                    wôrô-wôrô refusent souvent d&apos;embarquer les bouteilles de gaz dans le coffre.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="w-6 h-6 rounded-lg bg-red-500/20 text-red-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    ✕
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300">
                    <strong>Les prix spéculatifs abusifs :</strong> En soirée ou le dimanche,
                    certains revendeurs informels doublent le prix officiel en toute illégalité.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="w-6 h-6 rounded-lg bg-red-500/20 text-red-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    ✕
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300">
                    <strong>Le doute sur le plombage :</strong> Le risque d&apos;acheter une
                    bouteille mal remplie ou non scellée d&apos;usine.
                  </p>
                </div>
              </div>
            </div>

            {/* La Réponse SOSGAZ */}
            <div className="lg:col-span-6 bg-gradient-to-br from-slate-800 to-slate-850 p-8 sm:p-10 rounded-3xl border border-slate-700 shadow-2xl relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/30">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-400 block">
                    La Solution Digitale
                  </span>
                  <h3 className="text-xl font-black text-white">Avec SOSGAZ, restez chez vous</h3>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Dès votre commande passée, notre système alerte le dépôt partenaire le plus proche de
                votre rue. Un livreur professionnel prend en charge votre bouteille neuve plombée et
                vient vous la livrer directement à votre porte.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/80">
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700">
                  <span className="text-2xl font-black text-amber-400">30-45</span>
                  <span className="text-xs text-slate-400 block font-bold uppercase mt-1">
                    Minutes en moyenne
                  </span>
                </div>
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700">
                  <span className="text-2xl font-black text-emerald-400">100%</span>
                  <span className="text-xs text-slate-400 block font-bold uppercase mt-1">
                    Plombé d&apos;origine
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/commander"
                  className="w-full py-4 px-6 rounded-2xl font-black uppercase text-sm bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all active:scale-95"
                >
                  <span>Passer ma commande express</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. SECTION FONCTIONNALITÉS & VALEUR RÉELLE DU PRODUIT
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-wider text-red-600">
            Conçu pour vous simplifier la vie
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
            Pourquoi des milliers de foyers abidjanais choisissent SOSGAZ ?
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-3 leading-relaxed">
            Une technologie simple et efficace, connectée au réseau réel des dépôts de gaz de chaque
            commune d&apos;Abidjan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors shadow-xs">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">
              Commande en 60s sans compte
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Aucun mot de passe à retenir. Votre numéro de téléphone, votre commune et un repère
              visuel suffisent pour déclencher la course.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition-colors shadow-xs">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">
              Bouteilles 100% Plombées d&apos;Usine
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Nous refusons le marché informel. Chaque bouteille livrée dispose du scellé plastique
              officiel d&apos;origine garantissant le poids exact.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-xs">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">
              Tarifs Officiels de l&apos;État
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Respect scrupuleux des prix fixés par la République de Côte d&apos;Ivoire (2 000 FCFA
              en B6, 5 500 FCFA en B12.5) + frais de livraison clairs dès 1 000 FCFA.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-xs">
              <Truck className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">
              Livreurs Formés & Attentionnés
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Nos livreurs montent les escaliers, déposent la bouteille dans votre cuisine et vous
              aident à fixer le détendeur sur simple demande.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. SECTION « COMMENT ÇA MARCHE » (3 ÉTAPES CLAIRES)
          ========================================================================= */}
      <section className="bg-slate-100/70 border-y border-slate-200/70 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-red-600">
              Processus Ultra-Fluide
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
              Votre gaz à la maison en 3 étapes simples
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-3">
              De votre smartphone à votre réchaud en moins de trois quarts d&apos;heure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Étape 1 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs relative flex flex-col">
              <span className="w-12 h-12 rounded-2xl bg-red-600 text-white font-black text-xl flex items-center justify-center mb-6 shadow-md shadow-red-600/20">
                01
              </span>
              <h3 className="text-xl font-black text-slate-900 mb-3">
                Sélectionnez format & repère
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed flex-1">
                Choisissez votre bouteille (B6, B12.5 ou B28), indiquez votre commune, quartier et un
                repère visuel bien connu à Abidjan (&quot;Face Pharmacie Saint-Jean&quot;,
                &quot;Carrefour Duncan&quot;).
              </p>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-red-600">
                <Check className="w-4 h-4" />
                <span>60 secondes chrono</span>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs relative flex flex-col">
              <span className="w-12 h-12 rounded-2xl bg-amber-500 text-white font-black text-xl flex items-center justify-center mb-6 shadow-md shadow-amber-500/20">
                02
              </span>
              <h3 className="text-xl font-black text-slate-900 mb-3">
                Dispatch immédiat au dépôt voisin
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed flex-1">
                Notre algorithme localise le dépôt partenaire le plus proche ayant du stock certifié
                disponible. Le livreur motorisé de la zone récupère votre bouteille scellée.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-amber-600">
                <Check className="w-4 h-4" />
                <span>Vérification du stock réel</span>
              </div>
            </div>

            {/* Étape 3 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs relative flex flex-col">
              <span className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center mb-6 shadow-md shadow-emerald-600/20">
                03
              </span>
              <h3 className="text-xl font-black text-slate-900 mb-3">
                Livraison, contrôle & paiement
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed flex-1">
                Le livreur vous appelle à l&apos;arrivée. Vous vérifiez le plombage d&apos;origine,
                remettez votre bouteille vide et réglez en espèces ou Mobile Money sur place.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-emerald-600">
                <Check className="w-4 h-4" />
                <span>Paiement après vérification</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. SECTION EXPLORATEUR DE ZONES À ABIDJAN
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-slate-950 text-white rounded-3xl sm:rounded-[3rem] p-8 sm:p-14 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-red-400 block mb-2">
              Couverture Grand Abidjan
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Vos communes et quartiers desservis en direct
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Cliquez sur votre commune pour découvrir les quartiers couverts et commander
              instantanément.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_COMMUNES.map((commune) => (
              <div
                key={commune.id}
                className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-white">{commune.name}</h3>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Actif
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                    {commune.quartiers.map((q) => q.name).join(', ')}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Dès{' '}
                    <strong className="text-white font-bold">
                      {formatFCFA(commune.standardDeliveryFee)}
                    </strong>
                  </span>
                  <Link
                    href={`/commander?commune=${encodeURIComponent(commune.name)}`}
                    className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 group"
                  >
                    <span>Commander</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <span>
              Vous habitez une zone non listée ? Nous ouvrons régulièrement de nouveaux dépôts.
            </span>
            <Link
              href="/zones"
              className="font-bold text-white hover:text-red-400 underline transition-colors"
            >
              Voir la carte complète des zones
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. SECTION SÉCURITÉ & RECOMMANDATIONS OFFICIELLES GPL
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Sécurité GPL & Recommandations Officielles
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Gardez toujours votre bouteille en position verticale. Vérifiez l&apos;étanchéité du
                détendeur avec de l&apos;eau savonneuse (jamais avec une allumette). En cas d&apos;urgence
                ou de fuite suspecte, appelez immédiatement les Sapeurs-Pompiers Militaires au{' '}
                <strong className="text-slate-900 underline">180</strong>.
              </p>
            </div>
          </div>
          <a
            href="tel:180"
            className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black uppercase tracking-wider shrink-0 transition-colors"
          >
            Urgence Pompiers : 180
          </a>
        </div>
      </section>

      {/* =========================================================================
          9. SECTION CTA FINALE DE CONVERSION
          ========================================================================= */}
      <section className="bg-gradient-to-br from-red-600 via-red-600 to-amber-600 text-white py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider mb-6">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Service Client Disponible 7j/7</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ne laissez plus une panne de gaz gâcher votre repas.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-red-100 max-w-2xl mx-auto leading-relaxed">
            Commandez en ligne en 1 minute chrono ou contactez nos équipes directement sur WhatsApp
            pour une prise en charge immédiate.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/commander"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-black text-sm uppercase tracking-wider shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Flame className="w-5 h-5 text-red-600" />
              <span>Commander ma bouteille</span>
            </Link>

            <a
              href={`https://wa.me/${MOCK_SETTINGS.officialWhatsapp.replace(
                /\D/g,
                ''
              )}?text=Bonjour%20SOSGAZ,%20j'ai%20besoin%20d'une%20livraison%20urgente`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm uppercase tracking-wider shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 border border-emerald-500/40"
            >
              <MessageCircle className="w-5 h-5 text-emerald-300" />
              <span>Assistance WhatsApp Direct</span>
            </a>
          </div>

          <p className="text-xs text-red-200 mt-6">
            Paiement en espèces ou Mobile Money à la livraison • Bouteilles plombées certifiées
          </p>
        </div>
      </section>
    </div>
  );
}
