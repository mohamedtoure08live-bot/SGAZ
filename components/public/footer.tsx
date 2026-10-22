import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { ShieldCheck, Phone, MessageCircle, MapPin, AlertTriangle } from 'lucide-react';
import { MOCK_SETTINGS } from '@/data/mock-data';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Colonne 1 : Présentation de marque */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" inverted={true} />
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm mt-3">
              Le premier service digital de livraison express de gaz domestique à Abidjan.
              Commandez votre recharge ou votre première bouteille sans compte en 1 clic.
              Paiement à la livraison après vérification du plombage.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Bouteilles d&apos;origine certifiées
              </span>
            </div>
          </div>

          {/* Colonne 2 : Liens Rapides */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Service
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/catalogue" className="hover:text-white transition-colors">
                  Catalogue & Tarifs officiels
                </Link>
              </li>
              <li>
                <Link href="/commander" className="hover:text-white transition-colors">
                  Commander en ligne (Sans compte)
                </Link>
              </li>
              <li>
                <Link href="/boutiques" className="hover:text-white transition-colors">
                  Boutiques & Électroménager
                </Link>
              </li>
              <li>
                <Link href="/comment-ca-marche" className="hover:text-white transition-colors">
                  Comment ça marche ?
                </Link>
              </li>
              <li>
                <Link href="/zones" className="hover:text-white transition-colors">
                  Communes & Quartiers desservis
                </Link>
              </li>
              <li>
                <Link href="/partenaire" className="hover:text-white transition-colors">
                  Rejoindre comme Dépôt ou Livreur
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Communes Abidjan */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Zones Desservies
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>Cocody (Angré, Palmeraie, 2 Plateaux)</li>
              <li>Yopougon (Maroc, Niangon, Bel Air)</li>
              <li>Marcory (Zone 4, Résidentiel)</li>
              <li>Koumassi & Treichville</li>
              <li>Plateau (Affaires & Cités)</li>
              <li className="pt-1 text-red-400 font-semibold">
                + Autres communes en cours
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Assistance & Urgences */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Assistance Immédiate
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <span>{MOCK_SETTINGS.officialPhone}</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{MOCK_SETTINGS.officialWhatsapp} (WhatsApp)</span>
              </li>
              <li className="text-[11px] text-slate-500">
                Horaires : 7j/7 de {MOCK_SETTINGS.serviceStartTime} à {MOCK_SETTINGS.serviceEndTime}
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="inline-block text-[11px] text-slate-500 hover:text-slate-300 underline"
                >
                  Accès Espace Exploitation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Avertissement de sécurité GPL & Mentions Légales */}
        <div className="mt-12 pt-8 border-t border-slate-900 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex items-start gap-2.5 text-xs text-slate-500">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p>
              <strong>Sécurité GPL :</strong> SOSGAZ DOMESTIC est un service de mise en relation et de livraison.
              En cas de fuite de gaz ou d&apos;urgence incendie, composez immédiatement le <strong>180 (Sapeurs-Pompiers Militaires)</strong>.
              Tarifs plafonnés conformes au barème officiel de la République de Côte d&apos;Ivoire.
            </p>
          </div>

          <div className="flex flex-wrap items-center md:justify-end gap-4 text-xs text-slate-500">
            <Link href="/legal/cgv" className="hover:text-slate-300">
              CGV
            </Link>
            <span>•</span>
            <Link href="/legal/confidentialite" className="hover:text-slate-300">
              Confidentialité & ARTCI
            </Link>
            <span>•</span>
            <span>© 2026 SOSGAZ DOMESTIC. Tous droits réservés.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
