'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useOrders } from '@/context/order-context';
import { formatFCFA, formatDateAbidjan, formatPhoneCI } from '@/lib/format';
import { StatusBadge } from '@/components/ui/badge';
import { ORDER_STATE_RULES, STATUS_METADATA } from '@/lib/order-state';
import { OrderStatus } from '@/types';
import { MOCK_PARTNERS, MOCK_COURIERS } from '@/data/mock-data';
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  User,
  Home,
  Flame,
  Truck,
  Store,
  Clock,
  Send,
  Lock,
  RotateCcw,
} from 'lucide-react';

export function OrderDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const {
    getOrder,
    updateOrderStatus,
    assignPartnerAndCourier,
    declareIncident,
    resolveIncident,
    cancelOrder,
    markClientInformed,
    currentRole,
  } = useOrders();

  const order = getOrder(id);

  // États pour les modales d'action
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [incidentReason, setIncidentReason] = useState('');

  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [resolveReason, setResolveReason] = useState('Contact rétabli avec le client, livraison en cours');

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState(MOCK_PARTNERS[0].id);
  const [selectedCourierId, setSelectedCourierId] = useState(MOCK_COURIERS[0].id);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <h1 className="text-2xl font-black text-white">Commande introuvable</h1>
        <p className="text-slate-400 text-xs mt-2">L&apos;identifiant demandé n&apos;existe pas ou a été archivé.</p>
        <Link
          href="/admin/commandes"
          className="inline-block mt-4 px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs"
        >
          Retour aux commandes
        </Link>
      </div>
    );
  }

  const primaryItem = order.items[0];

  const handleSimpleTransition = (target: OrderStatus) => {
    setErrorMessage(null);
    const result = updateOrderStatus(order.id, target);
    if (!result.success) {
      setErrorMessage(result.error || 'Erreur lors du changement de statut.');
    }
  };

  const handleConfirmCancel = () => {
    if (!cancelReason.trim() || cancelReason.trim().length < 5) {
      alert('Veuillez spécifier un motif clair (minimum 5 caractères).');
      return;
    }
    const result = cancelOrder(order.id, cancelReason);
    if (result.success) {
      setIsCancelModalOpen(false);
      setCancelReason('');
    } else {
      setErrorMessage(result.error || 'Impossible d’annuler la commande.');
    }
  };

  const handleConfirmIncident = () => {
    if (!incidentReason.trim() || incidentReason.trim().length < 5) {
      alert('Veuillez décrire la cause de l’incident.');
      return;
    }
    const result = declareIncident(order.id, incidentReason);
    if (result.success) {
      setIsIncidentModalOpen(false);
      setIncidentReason('');
    } else {
      setErrorMessage(result.error || 'Impossible de déclarer l’incident.');
    }
  };

  const handleConfirmResolveIncident = () => {
    const result = resolveIncident(order.id, resolveReason);
    if (result.success) {
      setIsResolveModalOpen(false);
    } else {
      setErrorMessage(result.error || 'Impossible de lever l’incident.');
    }
  };

  const handleConfirmAssign = () => {
    const result = assignPartnerAndCourier(order.id, selectedPartnerId, selectedCourierId);
    if (result.success) {
      setIsAssignModalOpen(false);
    } else {
      setErrorMessage(result.error || 'Impossible d’affecter le dépôt et le livreur.');
    }
  };

  const courierWhatsappMsg = encodeURIComponent(
    `SOSGAZ MISSION [${order.id}]\nClient : ${order.customer.fullName}\nTél : ${order.customer.phone}\nLieu : ${order.commune} - ${order.quartier}\nRepère : ${order.addressLandmark}\nBouteille : ${primaryItem?.productName} (${primaryItem?.hasEmptyBottle ? 'Recharge vide' : 'Consigne incluse'})\nMontant à percevoir : ${formatFCFA(order.totalAmount)} en espèces.`
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Barre de retour et En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/commandes"
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black text-white font-mono">
                {order.id}
              </span>
              <StatusBadge status={order.status} size="md" />
            </div>
            <span className="text-xs text-slate-400 mt-0.5 block">
              Enregistrée le {formatDateAbidjan(order.createdAt)} • Jeton public : {order.publicToken}
            </span>
          </div>
        </div>

        {/* Bouton de contact direct */}
        <div className="flex items-center gap-2">
          <a
            href={`tel:${order.customer.phone.replace(/\s+/g, '')}`}
            onClick={() => markClientInformed(order.id, 'call')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              order.isClientCalled
                ? 'bg-slate-800 text-slate-300'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-md'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{order.isClientCalled ? 'Client Déjà Appelé' : 'Appeler Client'}</span>
          </a>

          <a
            href={`https://wa.me/${order.customer.phone.replace(/\D/g, '')}?text=Bonjour%20${encodeURIComponent(order.customer.fullName)},%20SOSGAZ%20au%20sujet%20de%20votre%20commande%20${order.id}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => markClientInformed(order.id, 'whatsapp')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Client</span>
          </a>
        </div>
      </div>

      {/* Message d'erreur éventuel */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-white hover:underline">
            Fermer
          </button>
        </div>
      )}

      {/* BANDEAU MACHINE À ÉTATS FINIS */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-lg">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
          Contrôle Machine à États Finis (Rôle actif : {currentRole.toUpperCase()}) :
        </span>

        <div className="flex flex-wrap items-center gap-2.5">
          {order.status === 'NOUVELLE' && (
            <button
              onClick={() => handleSimpleTransition('A_CONFIRMER')}
              className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-slate-950 text-xs font-black uppercase tracking-wider shadow-sm transition-all"
            >
              1. Passer à &quot;À Confirmer&quot; (Appel en cours)
            </button>
          )}

          {order.status === 'A_CONFIRMER' && (
            <button
              onClick={() => handleSimpleTransition('CONFIRMEE')}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all"
            >
              2. Confirmer la commande (Stock validé)
            </button>
          )}

          {order.status === 'CONFIRMEE' && (
            <button
              onClick={() => handleSimpleTransition('EN_PREPARATION')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all"
            >
              3. Transmettre au Dépôt (En préparation)
            </button>
          )}

          {order.status === 'EN_PREPARATION' && (
            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>4. Affecter Dépôt & Coursier</span>
            </button>
          )}

          {order.status === 'LIVREUR_AFFECTE' && (
            <button
              onClick={() => handleSimpleTransition('EN_LIVRAISON')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>5. Bouteille récupérée (En livraison)</span>
            </button>
          )}

          {order.status === 'EN_LIVRAISON' && (
            <button
              onClick={() => handleSimpleTransition('LIVREE')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>6. Clôturer : Livrée & Encaissée</span>
            </button>
          )}

          {['CONFIRMEE', 'EN_PREPARATION', 'LIVREUR_AFFECTE', 'EN_LIVRAISON'].includes(order.status) && (
            <button
              onClick={() => setIsIncidentModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-600/30 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-600/50 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Signaler un incident</span>
            </button>
          )}

          {order.status === 'INCIDENT' && (
            <button
              onClick={() => setIsResolveModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Résoudre l&apos;incident (Reprendre la course)</span>
            </button>
          )}

          {order.status !== 'LIVREE' && order.status !== 'ANNULEE' && (
            <button
              onClick={() => setIsCancelModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 text-xs font-bold transition-all"
            >
              Annuler avec motif...
            </button>
          )}

          {order.status === 'LIVREE' && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
              <span>État final certifié. Aucune modification en silence autorisée.</span>
            </div>
          )}

          {order.status === 'ANNULEE' && (
            <div className="text-xs text-red-400 font-bold bg-red-950/60 px-3 py-1.5 rounded-xl border border-red-800">
              Commande annulée • Motif : {order.cancellationReason}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLONNE GAUCHE (7 COLONNES) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Fiche Client & Repère */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Fiche Client & Destination
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Nom du client :</span>
                <strong className="text-white text-sm">{order.customer.fullName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Numéro d&apos;appel :</span>
                <strong className="text-white text-sm">{formatPhoneCI(order.customer.phone)}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Commune & Quartier :</span>
                <span className="text-white font-medium">{order.commune} ({order.quartier})</span>
              </div>
              <div>
                <span className="text-slate-400 block">Mode de livraison :</span>
                <span className="font-bold text-amber-400 uppercase">
                  {order.deliveryMode === 'express' ? '⚡ Express (1h à 2h)' : 'Standard'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block mb-0.5">
                Repère visuel obligatoire indiqué par le client :
              </span>
              <p className="text-sm font-semibold text-white">
                &quot;{order.addressLandmark}&quot;
              </p>
            </div>
          </div>

          {/* Dépôt Partenaire & Livreur */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Logistique & Affectation
              </h3>
              {order.status !== 'LIVREE' && order.status !== 'ANNULEE' && (
                <button
                  onClick={() => setIsAssignModalOpen(true)}
                  className="text-xs font-bold text-red-400 hover:text-red-300 underline"
                >
                  {order.partnerId ? 'Modifier l’affectation' : 'Affecter maintenant'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Store className="w-4 h-4 text-amber-400" />
                  <span className="font-bold uppercase text-[10px]">Dépôt Agréé :</span>
                </div>
                <strong className="text-white block">
                  {order.partnerName || 'Aucun dépôt assigné'}
                </strong>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Truck className="w-4 h-4 text-blue-400" />
                  <span className="font-bold uppercase text-[10px]">Livreur Tiers :</span>
                </div>
                <strong className="text-white block">
                  {order.courierName || 'Aucun coursier assigné'}
                </strong>
                {order.courierPhone && (
                  <span className="text-slate-400 text-[11px] block mt-0.5">
                    {order.courierPhone}
                  </span>
                )}
              </div>
            </div>

            {order.courierPhone && (
              <a
                href={`https://wa.me/${order.courierPhone.replace(/\D/g, '')}?text=${courierWhatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-700/80 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Envoyer le bon de course au livreur par WhatsApp</span>
              </a>
            )}
          </div>

          {/* Chronologie et Journal */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Historique et Traçabilité des Changements de Statut
            </h3>

            <div className="space-y-3">
              {order.statusHistory.map((hist, index) => (
                <div key={hist.id || index} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <div className="flex-1 pb-3 border-b border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <strong className="text-white">
                        {STATUS_METADATA[hist.toStatus]?.label || hist.toStatus}
                      </strong>
                      <span className="text-[10px] text-slate-400">
                        {formatDateAbidjan(hist.timestamp)}
                      </span>
                    </div>
                    <span className="text-slate-400 text-[11px] block">
                      Par : {hist.changedBy}
                    </span>
                    {hist.reason && (
                      <p className="text-slate-300 italic text-[11px] mt-1 bg-slate-900/60 p-2 rounded-lg">
                        &quot;{hist.reason}&quot;
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLONNE DROITE (5 COLONNES) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Comptabilité & Répartition
            </h3>

            <div className="space-y-3 text-xs border-b border-slate-800 pb-4">
              <div className="flex justify-between text-slate-400">
                <span>Bouteille ({primaryItem?.productName})</span>
                <span className="text-white font-bold">{formatFCFA(order.subtotalProducts)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Acheminement client ({order.commune})</span>
                <span className="text-white font-bold">{formatFCFA(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-slate-800 text-sm">
                <span className="font-extrabold text-white">Montant Total Client :</span>
                <span className="text-xl font-black text-red-500">{formatFCFA(order.totalAmount)}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Part Dépôt Partenaire
                  </span>
                  <span className="text-amber-400 font-bold text-sm">
                    {formatFCFA(order.partnerPayout)}
                  </span>
                </div>
                <Store className="w-5 h-5 text-slate-600 mt-1" />
              </div>

              <div className="flex justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Revenu SOSGAZ (Livraison + Com.)
                  </span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {formatFCFA(order.deliveryFee + order.sosgazCommission)}
                  </span>
                </div>
                <Flame className="w-5 h-5 text-slate-600 mt-1" />
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 italic">
              Règlement en espèces à percevoir par le livreur lors de la livraison.
            </div>
          </div>
        </div>
      </div>

      {/* Modale Annulation */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">Annuler la commande {order.id}</h3>
            <p className="text-xs text-slate-400">
              Conformément aux règles de gestion, toute annulation exige un motif explicite consigné dans le journal d&apos;audit.
            </p>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Motif de l&apos;annulation <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Ex: Client injoignable après 4 tentatives, ou client a déjà acheté ailleurs..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Fermer
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
              >
                Confirmer l&apos;annulation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale Incident */}
      {isIncidentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-amber-400">Signaler un Incident</h3>
            <p className="text-xs text-slate-400">
              L&apos;état d&apos;origine ({order.status}) sera mémorisé pour pouvoir y revenir dès que le problème sera levé.
            </p>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Nature du problème <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={incidentReason}
                onChange={(e) => setIncidentReason(e.target.value)}
                placeholder="Ex: Panne de moto du livreur à 500m, ou numéro client occupé, ou rupture inopinée au dépôt..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsIncidentModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Fermer
              </button>
              <button
                type="button"
                onClick={handleConfirmIncident}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
              >
                Enregistrer l&apos;incident
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale Résolution */}
      {isResolveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-emerald-400">Lever l&apos;Incident</h3>
            <p className="text-xs text-slate-400">
              La commande reviendra à son statut d&apos;origine : <strong>{order.previousStatus || 'CONFIRMEE'}</strong>.
            </p>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Comment l&apos;incident a-t-il été résolu ? <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={resolveReason}
                onChange={(e) => setResolveReason(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsResolveModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmResolveIncident}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                Reprendre la livraison
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale Affectation */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">Affectation Dépôt & Coursier</h3>
            <p className="text-xs text-slate-400">
              Sélectionnez le dépôt qui prépare la bouteille et le livreur qui se charge du transport.
            </p>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Dépôt Partenaire ({order.commune})
              </label>
              <select
                value={selectedPartnerId}
                onChange={(e) => setSelectedPartnerId(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold"
              >
                {MOCK_PARTNERS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.commune}) • Stock B12: {p.stockAvailable['prod-b12'] || 0}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                Livreur Tiers Agréé
              </label>
              <select
                value={selectedCourierId}
                onChange={(e) => setSelectedCourierId(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold"
              >
                {MOCK_COURIERS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.fullName} ({c.vehicleType} {c.vehiclePlate}) • {c.status}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmAssign}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
              >
                Valider l&apos;affectation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
