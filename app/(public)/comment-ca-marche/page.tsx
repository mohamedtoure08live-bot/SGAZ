import React from 'react';
import Link from 'next/link';
import { Flame, ShieldCheck, Clock, CheckCircle2, Phone, ArrowRight, AlertTriangle } from 'lucide-react';
import { MOCK_SETTINGS } from '@/data/mock-data';

export default function CommentCaMarchePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* En-tête */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-red-600 block">
          Guide du Service
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 mt-2">
          Comment fonctionne SOSGAZ DOMESTIC ?
        </h1>
        <p className="text-slate-500 text-sm sm:text-base mt-3">
          Le gaz de cuisine livré chez vous à Abidjan en toute sécurité, sans créer de compte et sans payer à l&apos;avance.
        </p>
      </div>

      {/* Les 4 étapes détaillées */}
      <div className="space-y-8">
        {/* Étape 1 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start gap-6">
          <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 font-black text-2xl flex items-center justify-center shrink-0">
            1
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900">
              1. Choix du gaz et du repère de livraison
            </h3>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              Sur le site web, vous choisissez votre format habituel : <strong>B6 (6 kg)</strong>, <strong>B12.5 (12.5 kg)</strong> ou <strong>B28 (28 kg)</strong>.
              Vous indiquez si vous échangez une bouteille vide (recharge simple) ou s&apos;il s&apos;agit d&apos;une nouvelle acquisition (avec consigne).
              À Abidjan, les adresses étant souvent informelles, vous renseignez simplement un <strong>repère visuel clair</strong> (&quot;À côté du maquis...&quot;, &quot;En face de la pharmacie...&quot;) et votre numéro de téléphone.
            </p>
          </div>
        </div>

        {/* Étape 2 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start gap-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 font-black text-2xl flex items-center justify-center shrink-0">
            2
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900">
              2. Vérification instantanée par l&apos;opérateur
            </h3>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              SOSGAZ ne possède ni stock central ni flotte de véhicules. Dès réception de votre commande, notre opérateur contacte le dépôt partenaire agréé le plus proche de votre commune (Cocody, Yopougon, Marcory...) pour bloquer la bouteille.
              L&apos;opérateur peut vous appeler brièvement ou vous confirmer la prise en charge par WhatsApp.
            </p>
          </div>
        </div>

        {/* Étape 3 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start gap-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 font-black text-2xl flex items-center justify-center shrink-0">
            3
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900">
              3. Acheminement par un livreur accrédité
            </h3>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              Un livreur partenaire certifié retire la bouteille au dépôt. Seules les informations strictement indispensables (prénom, repère visuel et numéro) lui sont transmises.
              En mode <strong>Express</strong>, le livreur vous rejoint dans un créneau de 1h à 2h.
            </p>
          </div>
        </div>

        {/* Étape 4 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start gap-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 font-black text-2xl flex items-center justify-center shrink-0">
            4
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900">
              4. Contrôle du scellé et règlement en espèces
            </h3>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              À son arrivée, le livreur vous présente la bouteille. Vous vérifiez le bouchon de sécurité plombé. Vous lui remettez votre bouteille vide (en cas d&apos;échange) et vous réglez en espèces le montant exact calculé lors de la commande.
              Aucun pourboire obligatoire, aucun frais caché.
            </p>
          </div>
        </div>
      </div>

      {/* Règles de sécurité */}
      <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-amber-50 border border-amber-200 text-amber-950">
        <div className="flex items-center gap-3 mb-3">
          <AlertTriangle className="w-6 h-6 text-amber-600" />
          <h3 className="font-extrabold text-base sm:text-lg">
            Recommandations de sécurité indispensables
          </h3>
        </div>
        <ul className="space-y-2 text-xs sm:text-sm text-amber-900 list-disc list-inside">
          <li>Ne jamais accepter une bouteille dont le bouchon de sécurité en plastique est déchiré ou absent.</li>
          <li>Installez toujours la bouteille dans un endroit aéré, loin de toute source d&apos;étincelle.</li>
          <li>Vérifiez régulièrement l&apos;état du tuyau à gaz et du détendeur.</li>
          <li>En cas de suspicion de fuite, ne manœuvrez aucun interrupteur électrique et appelez les pompiers au <strong>180</strong>.</li>
        </ul>
      </div>

      {/* CTA Final */}
      <div className="mt-14 text-center">
        <Link
          href="/commander"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black uppercase text-sm sm:text-base shadow-xl shadow-red-600/30 transition-all active:scale-95"
        >
          <span>Commander ma bouteille en 1 clic</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
