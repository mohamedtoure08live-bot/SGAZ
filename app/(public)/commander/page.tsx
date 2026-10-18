'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useOrders } from '@/context/order-context';
import { formatFCFA } from '@/lib/format';
import { calculateOrderPricing } from '@/lib/pricing';
import { ChoiceCard } from '@/components/public/choice-card';
import { OrderSummaryCard } from '@/components/public/order-summary-card';
import { MOCK_PRODUCTS, MOCK_PRICES, MOCK_COMMUNES, MOCK_SETTINGS } from '@/data/mock-data';
import {
  Flame,
  Clock,
  Truck,
  MapPin,
  Home,
  User,
  Phone,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

function CommanderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createOrder } = useOrders();

  // Étape courante (1 = Choix bouteille & délai, 2 = Adresse & finalisation)
  const [step, setStep] = useState<1 | 2>(1);

  // Initialisation synchronisée avec searchParams
  const urlFormat = searchParams.get('format');
  const validFormat = urlFormat === 'B6' || urlFormat === 'B12_5' || urlFormat === 'B28' ? urlFormat : 'B12_5';
  const urlExchange = searchParams.get('exchange');
  const validExchange = urlExchange !== null ? urlExchange === 'true' : true;
  const urlCommune = searchParams.get('commune');
  const matchedCommune = urlCommune
    ? MOCK_COMMUNES.find((c) => c.name.toLowerCase() === urlCommune.toLowerCase())
    : null;

  // État du formulaire
  const [selectedFormat, setSelectedFormat] = useState<'B6' | 'B12_5' | 'B28'>(validFormat);
  const [hasEmptyBottle, setHasEmptyBottle] = useState<boolean>(validExchange);
  const [deliveryMode, setDeliveryMode] = useState<'standard' | 'express'>('express');
  const [communeId, setCommuneId] = useState<string>(matchedCommune?.id || 'com-cocody');
  const [quartierName, setQuartierName] = useState<string>(
    matchedCommune?.quartiers[0]?.name || 'Angré (8e / 9e Tranche, Château)'
  );
  const [landmark, setLandmark] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const activeProduct = MOCK_PRODUCTS.find((p) => p.format === selectedFormat) || MOCK_PRODUCTS[1];
  const priceObj = MOCK_PRICES[activeProduct.id];
  const unitPrice = hasEmptyBottle
    ? priceObj?.priceWithExchange || 5500
    : priceObj?.priceWithoutExchange || 21500;

  const currentCommune = MOCK_COMMUNES.find((c) => c.id === communeId) || MOCK_COMMUNES[0];
  const isExpress = deliveryMode === 'express';

  // Calcul certifié des montants
  const pricing = calculateOrderPricing(
    [{ unitPrice, quantity: 1 }],
    currentCommune.standardDeliveryFee,
    isExpress,
    MOCK_SETTINGS.expressSurcharge,
    MOCK_SETTINGS.defaultSosgazCommission
  );

  const handleNextStep = () => {
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousStep = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitOrder = async () => {
    if (!landmark.trim() || !customerPhone.trim() || !customerName.trim()) {
      alert('Veuillez remplir votre nom, votre numéro et un repère visuel précis.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulation latence réseau
      await new Promise((resolve) => setTimeout(resolve, 600));

      const newOrder = createOrder({
        customerName,
        customerPhone,
        commune: currentCommune.name,
        quartier: quartierName,
        addressLandmark: landmark,
        deliveryMode,
        deliveryFee: pricing.totalDeliveryCost,
        subtotalProducts: pricing.itemsSubtotal,
        totalAmount: pricing.totalAmount,
        sosgazCommission: pricing.sosgazCommission,
        partnerPayout: pricing.partnerPayout,
        items: [
          {
            id: `item-${activeProduct.id}`,
            productId: activeProduct.id,
            productName: activeProduct.name,
            formatLabel: activeProduct.formatLabel,
            brandName: activeProduct.brandName,
            quantity: 1,
            hasEmptyBottle,
            unitPrice,
            totalPrice: unitPrice,
          },
        ],
      });

      router.push(`/commande/confirmation?token=${newOrder.publicToken}`);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      alert('Une erreur est survenue lors de la création de la commande.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Stepper moderne */}
      <div className="max-w-2xl mx-auto mb-8 sm:mb-12">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 h-1 bg-slate-200 -z-0 -translate-y-1/2" />
          <div
            className={`absolute left-0 top-1/2 h-1 bg-red-600 -z-0 -translate-y-1/2 transition-all duration-300 ${
              step === 1 ? 'w-1/2' : 'w-full'
            }`}
          />

          {/* Étape 1 */}
          <div className="flex flex-col items-center relative z-10">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                step >= 1
                  ? 'bg-red-600 text-white ring-4 ring-red-100'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              1
            </div>
            <span className="text-xs font-bold mt-1.5 text-slate-800">
              Bouteille & Créneau
            </span>
          </div>

          {/* Étape 2 */}
          <div className="flex flex-col items-center relative z-10">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                step === 2
                  ? 'bg-red-600 text-white ring-4 ring-red-100'
                  : 'bg-white border-2 border-slate-300 text-slate-500'
              }`}
            >
              2
            </div>
            <span className="text-xs font-bold mt-1.5 text-slate-800">
              Adresse & Confirmation
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* COLONNE GAUCHE : FORMULAIRE ÉTAPE PAR ÉTAPE (7 colonnes) */}
        <div className="lg:col-span-7 space-y-8">
          {step === 1 ? (
            /* =================== ÉTAPE 1 : CHOIX DU GAZ ET CRÉNEAU =================== */
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                  Étape 1 sur 2
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  Choisissez votre bouteille de gaz
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Tous nos prix sont certifiés et conformes au barème officiel de l&apos;État.
                </p>
              </div>

              {/* Toggle Échange */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Avez-vous une bouteille vide à échanger ?
                  </h4>
                  <p className="text-xs text-slate-500">
                    Échange d&apos;une bouteille vide identique à la livraison
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setHasEmptyBottle(true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      hasEmptyBottle
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Oui (Recharge)
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasEmptyBottle(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      !hasEmptyBottle
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Non (1er achat)
                  </button>
                </div>
              </div>

              {/* Sélection Format de Bouteille (ChoiceCards) */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Format souhaité :
                </label>
                <div className="space-y-3">
                  <ChoiceCard
                    id="b12_5"
                    title="B12.5 kg (Ménage Standard)"
                    subtitle="Format le plus utilisé dans les foyers ivoiriens"
                    badge="Recommandé"
                    priceTag={`${formatFCFA(hasEmptyBottle ? 5500 : 21500)}`}
                    icon={<Flame className="w-6 h-6" />}
                    selected={selectedFormat === 'B12_5'}
                    onSelect={() => setSelectedFormat('B12_5')}
                  />
                  <ChoiceCard
                    id="b6"
                    title="B6 kg (Faitout)"
                    subtitle="Pratique pour célibataires, étudiants et d'appoint"
                    priceTag={`${formatFCFA(hasEmptyBottle ? 2000 : 13000)}`}
                    icon={<Flame className="w-5 h-5 text-amber-500" />}
                    selected={selectedFormat === 'B6'}
                    onSelect={() => setSelectedFormat('B6')}
                  />
                  <ChoiceCard
                    id="b28"
                    title="B28 kg (Grand Format Professionnel)"
                    subtitle="Conçu pour les maquis, restaurants et grandes concessions"
                    priceTag={`${formatFCFA(hasEmptyBottle ? 13000 : 38000)}`}
                    icon={<Flame className="w-7 h-7 text-slate-700" />}
                    selected={selectedFormat === 'B28'}
                    onSelect={() => setSelectedFormat('B28')}
                  />
                </div>
              </div>

              {/* Choix du délai (Fidèle à l'écran 2 du mockup) */}
              <div className="space-y-3 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Quand avez-vous besoin du gaz ?
                  </label>
                  <span className="text-[11px] font-medium text-slate-500">
                    Dispo 06h00 - 21h30
                  </span>
                </div>
                <div className="space-y-3">
                  <ChoiceCard
                    id="express"
                    title="Urgent (1h à 2h)"
                    subtitle="Attribution prioritaire au coursier le plus proche"
                    badge="Express"
                    priceTag="+1 000 FCFA"
                    icon={<Clock className="w-6 h-6 text-blue-600" />}
                    selected={deliveryMode === 'express'}
                    onSelect={() => setDeliveryMode('express')}
                  />
                  <ChoiceCard
                    id="standard"
                    title="Standard (Dans la demi-journée)"
                    subtitle="Livraison programmée selon les tournées de quartier"
                    priceTag="Frais ordinaires"
                    icon={<Truck className="w-6 h-6 text-slate-600" />}
                    selected={deliveryMode === 'standard'}
                    onSelect={() => setDeliveryMode('standard')}
                  />
                </div>
              </div>

              {/* Bouton Suivant */}
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full py-4 rounded-2xl font-black uppercase text-sm sm:text-base bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 active:scale-98 transition-all"
              >
                <span>Continuer vers l&apos;adresse de livraison</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            /* =================== ÉTAPE 2 : ADRESSE, REPÈRE ET CONTACT =================== */
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                    Étape 2 sur 2
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                    Où devons-nous livrer ?
                  </h1>
                </div>
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Modifier le format</span>
                </button>
              </div>

              {/* Commune et Quartier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    Commune <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                    <select
                      value={communeId}
                      onChange={(e) => {
                        const newId = e.target.value;
                        setCommuneId(newId);
                        const match = MOCK_COMMUNES.find((c) => c.id === newId);
                        if (match && match.quartiers.length > 0) {
                          setQuartierName(match.quartiers[0].name);
                        }
                      }}
                      className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                    >
                      {MOCK_COMMUNES.map((com) => (
                        <option key={com.id} value={com.id}>
                          {com.name} ({formatFCFA(com.standardDeliveryFee)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    Quartier / Cité <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={quartierName}
                    onChange={(e) => setQuartierName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                  >
                    {currentCommune.quartiers.map((q) => (
                      <option key={q.id} value={q.name}>
                        {q.name} (~{q.estimatedMinutes} min)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Repère Visuel Obligatoire (Spécificité Abidjan) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase text-slate-600">
                    Repère Visuel Précis <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] font-bold text-red-600">
                    Obligatoire à Abidjan
                  </span>
                </div>
                <div className="relative">
                  <Home className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Ex: En face de la pharmacie des Grâces, portail marron, 2e étage"
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Permet au livreur de trouver immédiatement votre domicile sans vous déranger au téléphone.
                </p>
              </div>

              {/* Contact : Nom & Téléphone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    Votre Nom ou Prénom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ex: Kouamé David"
                      className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                    Téléphone (Orange, MTN, Moov) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+225 07 00 00 00 00"
                      className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Réassurance paiement */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-3 text-xs text-emerald-900">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  <strong>Zéro avance exigée.</strong> Vous réglez la totalité en espèces à la livraison après avoir inspecté le plombage d&apos;origine.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* COLONNE DROITE : RÉCAPITULATIF TRANSPARENT TYPE TICKET (5 colonnes) */}
        <div className="lg:col-span-5 sticky top-28">
          <OrderSummaryCard
            bottleName={activeProduct.name}
            bottleWeight={activeProduct.formatLabel}
            brandName={activeProduct.brandName}
            hasEmptyBottle={hasEmptyBottle}
            unitPrice={unitPrice}
            commune={currentCommune.name}
            quartier={quartierName}
            landmark={landmark}
            deliveryMode={deliveryMode}
            deliveryFee={currentCommune.standardDeliveryFee}
            expressSurcharge={MOCK_SETTINGS.expressSurcharge}
            totalAmount={pricing.totalAmount}
            customerName={customerName}
            customerPhone={customerPhone}
            onSubmit={step === 1 ? handleNextStep : handleSubmitOrder}
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}

export default function CommanderPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Chargement du formulaire...</div>}>
      <CommanderContent />
    </Suspense>
  );
}
