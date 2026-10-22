'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Store,
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Flame,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  SlidersHorizontal,
  Award,
  Truck,
  Check,
} from 'lucide-react';
import { MOCK_SETTINGS } from '@/data/mock-data';

interface PartnerShop {
  id: string;
  name: string;
  commune: string;
  quartier: string;
  address: string;
  landmark: string;
  phone: string;
  whatsapp: string;
  hours: string;
  rating: number;
  brands: string[];
  categories: string[];
  featuredProducts: {
    name: string;
    description: string;
    badge: string;
  }[];
  advantages: string[];
}

const PARTNER_SHOPS: PartnerShop[] = [
  {
    id: 'shop-cocody-electro',
    name: 'Ivoire Électro Confort',
    commune: 'Cocody',
    quartier: 'Angré 8e Tranche',
    address: 'Boulevard Latrille, Immeuble Horizon Blanc',
    landmark: 'À 50m de la Pharmacie des Grâces',
    phone: '+225 07 48 00 11 22',
    whatsapp: '+225 07 48 00 11 22',
    hours: 'Lun - Sam : 08h30 - 19h30',
    rating: 4.9,
    brands: ['Beko', 'Midea', 'Whirlpool', 'Nasco'],
    categories: ['gazinieres', 'fours', 'refrigerateurs', 'petit-electro'],
    featuredProducts: [
      {
        name: 'Gazinière Inox 5 Feux + Grand Four',
        description: 'Allumage automatique 1 main, tournebroche et minuterie mécanique',
        badge: 'Best-seller Ménages',
      },
      {
        name: 'Table de cuisson vitrocéramique & gaz 4 feux',
        description: 'Sécurité thermocouple coupe-gaz instantané en cas d’extinction',
        badge: 'Haut de gamme',
      },
    ],
    advantages: [
      'Garantie officielle 24 mois constructeur',
      'Option de raccordement immédiat avec livreur SOSGAZ',
      'Paiement comptant ou en 3 fois sans frais',
    ],
  },
  {
    id: 'shop-marcory-cuisson',
    name: 'Espace Cuisson & Froid Marcory',
    commune: 'Marcory',
    quartier: 'Zone 4C',
    address: 'Rue Paul Langevin, carrefour Mercedes',
    landmark: 'En face du Supermarché Cash Ivoire',
    phone: '+225 05 74 33 44 55',
    whatsapp: '+225 05 74 33 44 55',
    hours: 'Lun - Sam : 08h00 - 20h00',
    rating: 4.8,
    brands: ['Bosch', 'Samsung', 'LG', 'Tefal'],
    categories: ['gazinieres', 'fours', 'refrigerateurs', 'petit-electro'],
    featuredProducts: [
      {
        name: 'Gazinière 4 Feux Inox Semi-Professionnelle',
        description: 'Brûleurs triple couronne haute puissance, grille en fonte robuste',
        badge: 'Idéal Maquis & Chefs',
      },
      {
        name: 'Réfrigérateur Combiné No Frost 340L',
        description: 'Refroidissement ventilé, consommation basse énergie classe A+',
        badge: 'Éco-Énergie',
      },
    ],
    advantages: [
      'Showroom spacieux et démonstrations en direct',
      'Service Après-Vente (SAV) avec pièces d’origine',
      'Livraison à domicile sur Marcory, Koumassi et Treichville',
    ],
  },
  {
    id: 'shop-yopougon-maison',
    name: 'Maison & Équipement Yopougon',
    commune: 'Yopougon',
    quartier: 'Yopougon Maroc',
    address: 'Carrefour Antenne, voie principale',
    landmark: 'À côté de la station Total Maroc',
    phone: '+225 01 02 88 99 00',
    whatsapp: '+225 01 02 88 99 00',
    hours: '7j/7 : 08h00 - 19h00',
    rating: 4.7,
    brands: ['Roch', 'Nasco', 'Smart Technology', 'Binatone'],
    categories: ['gazinieres', 'petit-electro', 'refrigerateurs'],
    featuredProducts: [
      {
        name: 'Gazinière Économique 4 Feux Émaillée Noire',
        description: 'Compacte, robuste avec four à convection naturelle et couvercle en verre',
        badge: 'Rapport Qualité/Prix',
      },
      {
        name: 'Réchaud à Gaz 3 Feux de Table',
        description: 'Parfait pour bouteille B6 ou B12.5, facile à déplacer',
        badge: 'Pratique & Mobile',
      },
    ],
    advantages: [
      'Prix direct magasin très compétitifs',
      'Test d’allumage sur place avant enlèvement',
      'Tuyaux et détendeurs certifiés en stock',
    ],
  },
  {
    id: 'shop-treichville-palais',
    name: 'Comptoir Ménager Treichville',
    commune: 'Treichville',
    quartier: 'Avenue 16 / Rue 22',
    address: 'Angle Boulevard Valéry Giscard d’Estaing',
    landmark: 'Non loin du Grand Marché de Treichville',
    phone: '+225 07 11 22 33 44',
    whatsapp: '+225 07 11 22 33 44',
    hours: 'Lun - Sam : 08h30 - 18h30',
    rating: 4.9,
    brands: ['Midea', 'Beko', 'Moulinex', 'Tefal'],
    categories: ['gazinieres', 'fours', 'petit-electro'],
    featuredProducts: [
      {
        name: 'Cuisinière Mixte 3 Gaz + 1 Plaque Électrique',
        description: 'Polyvalence totale pour continuer de cuisiner en toute situation',
        badge: 'Polyvalent',
      },
      {
        name: 'Pack Électro : Micro-ondes + Blender + Bouilloire',
        description: 'Le trio incontournable pour un aménagement de cuisine express',
        badge: 'Pack Équipement',
      },
    ],
    advantages: [
      'Stock disponible immédiatement pour enlèvement ou livraison',
      'Partenaire officiel du réseau SOSGAZ depuis 2025',
      'Conseils personnalisés de techniciens expérimentés',
    ],
  },
  {
    id: 'shop-koumassi-centre',
    name: 'Palais de la Ménagère Koumassi',
    commune: 'Koumassi',
    quartier: 'Remblais / Rond-point Saint-Étienne',
    address: 'Boulevard du 7 Décembre',
    landmark: 'Face Pharmacie Saint-Étienne',
    phone: '+225 05 66 77 88 99',
    whatsapp: '+225 05 66 77 88 99',
    hours: 'Lun - Sam : 08h30 - 19h00',
    rating: 4.8,
    brands: ['Nasco', 'Roch', 'Whirlpool', 'Beko'],
    categories: ['gazinieres', 'refrigerateurs', 'petit-electro'],
    featuredProducts: [
      {
        name: 'Gazinière Inox 4 Feux avec Grill Haut & Bas',
        description: 'Porte double vitrage trempé et pieds réglables en hauteur',
        badge: 'Sécurité Maximale',
      },
      {
        name: 'Hotte Aspirante Inox 60cm',
        description: 'Filtre à charbon actif et éclairage LED pour cuisine moderne',
        badge: 'Confort Air Pur',
      },
    ],
    advantages: [
      'Large gamme adaptée à tous les budgets',
      'Raccordement de gaz vérifié avec les livreurs SOSGAZ',
      'Facture normalisée et garantie constructeur',
    ],
  },
];

import { getPartnerShopsAction } from '@/app/actions/partners';

export default function BoutiquesPage() {
  const [shops, setShops] = useState<PartnerShop[]>(PARTNER_SHOPS);
  const [selectedCommune, setSelectedCommune] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  React.useEffect(() => {
    getPartnerShopsAction()
      .then((data) => {
        if (data && data.length > 0) {
          // Fusionner avec les featuredProducts par défaut si nécessaire
          const enhanced = data.map((d: any) => {
            const fallback = PARTNER_SHOPS.find((p) => p.id === d.id) || PARTNER_SHOPS[0];
            return {
              ...d,
              featuredProducts: d.featuredProducts || fallback.featuredProducts,
            };
          });
          setShops(enhanced);
        }
      })
      .catch((err) => console.error('Erreur chargement boutiques:', err));
  }, []);

  const filteredShops = shops.filter((shop) => {
    const matchCommune = selectedCommune === 'all' || shop.commune.toLowerCase() === selectedCommune.toLowerCase();
    const matchCategory = selectedCategory === 'all' || (shop.categories && shop.categories.includes(selectedCategory));
    return matchCommune && matchCategory;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      {/* =========================================================================
          1. EN-TÊTE COMMERCIAL & PRÉSENTATION DU RÉSEAU BOUTIQUES
          ========================================================================= */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pt-14 sm:pt-20 pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-black uppercase tracking-wider mb-6">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Réseau Partenaire Électroménager & Cuisson</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.12]">
              Équipez votre cuisine,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-amber-400">
                simplifiez votre quotidien !
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed font-medium">
              Découvrez les gazinières 3, 4 et 5 feux, les fours et les appareils électroménagers proposés par nos boutiques partenaires à Abidjan. Bénéficiez d’équipements certifiés, garantis constructeur et compatibles avec le réseau de bouteilles de gaz SOSGAZ.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-200">
              <span className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-md border border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Garantie constructeur 12 à 24 mois
              </span>
              <span className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-md border border-white/10">
                <Flame className="w-4 h-4 text-amber-400" />
                Raccordement de gaz sécurisé
              </span>
              <span className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-md border border-white/10">
                <Store className="w-4 h-4 text-red-400" />
                Boutiques physiques à Abidjan
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. PACK CUISSON CLÉ EN MAIN (GAZINIÈRE + GAZ SOSGAZ)
          ========================================================================= */}
      <section id="packs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-red-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider backdrop-blur-md">
              Offre Spéciale SOSGAZ & Commerçants
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Le Pack Sérénité Cuisson : Vous achetez votre gazinière, nous vous livrons le gaz prêt à brancher !
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
              Pour tout achat d’une gazinière chez une boutique partenaire référencée ci-dessous, notre livreur peut intervenir pour vous livrer votre première bouteille de gaz (B6 ou B12.5), brancher le détendeur et effectuer un test d’étanchéité gratuit à l’eau savonneuse.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/commander"
              className="px-6 py-3.5 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-black text-xs uppercase tracking-wider text-center shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Flame className="w-4 h-4 text-red-600" />
              <span>Commander ma bouteille</span>
            </Link>
            <a
              href={`https://wa.me/${MOCK_SETTINGS.officialWhatsapp.replace(/\D/g, '')}?text=Bonjour%20SOSGAZ,%20je%20souhaite%20profiter%20du%20Pack%20Sérénité%20Cuisson`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-slate-950/40 hover:bg-slate-950/60 text-white font-black text-xs uppercase tracking-wider text-center border border-white/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-300" />
              <span>Assistance Pack sur WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. FILTRES ET ANNUAIRE DES BOUTIQUES PARTENAIRES
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Barre de filtres */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Filtre Commune */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-600" />
              <span>Filtrer par Commune</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Toutes les communes', value: 'all' },
                { label: 'Cocody', value: 'cocody' },
                { label: 'Marcory', value: 'marcory' },
                { label: 'Yopougon', value: 'yopougon' },
                { label: 'Treichville', value: 'treichville' },
                { label: 'Koumassi', value: 'koumassi' },
              ].map((commune) => (
                <button
                  key={commune.value}
                  onClick={() => setSelectedCommune(commune.value)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCommune === commune.value
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {commune.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filtre Catégorie */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
              <span>Équipements recherchés</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Tous équipements', value: 'all' },
                { label: 'Gazinières & Réchauds', value: 'gazinieres' },
                { label: 'Fours & Plaques', value: 'fours' },
                { label: 'Réfrigérateurs', value: 'refrigerateurs' },
                { label: 'Petit électroménager', value: 'petit-electro' },
              ].map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat.value
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Liste des boutiques */}
        <div className="space-y-8">
          {filteredShops.map((shop) => (
            <div
              key={shop.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md hover:shadow-xl transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Infos principales de la boutique */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Boutique Partenaire Agréée</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      ★ {shop.rating} / 5
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      {shop.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-red-600 flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>{shop.commune} — {shop.quartier}</span>
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs text-slate-600">
                    <p className="flex items-start gap-2">
                      <strong className="text-slate-800 shrink-0">Adresse :</strong>
                      <span>{shop.address}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <strong className="text-slate-800 shrink-0">Repère :</strong>
                      <span className="text-slate-900 font-semibold">{shop.landmark}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{shop.hours}</span>
                    </p>
                  </div>

                  {/* Marques distribuées */}
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                      Marques disponibles en magasin
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {shop.brands.map((brand) => (
                        <span
                          key={brand}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-black"
                        >
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions directes vers la boutique */}
                  <div className="pt-2 flex flex-wrap gap-3">
                    <a
                      href={`https://wa.me/${shop.whatsapp.replace(
                        /\D/g,
                        ''
                      )}?text=Bonjour%20${encodeURIComponent(
                        shop.name
                      )},%20je%20vous%20contacte%20depuis%20SOSGAZ%20pour%20des%20informations%20sur%20vos%20gazinières%20et%20appareils.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Boutique</span>
                    </a>

                    <a
                      href={`tel:${shop.phone.replace(/\s+/g, '')}`}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs uppercase tracking-wider transition-all"
                    >
                      <Phone className="w-4 h-4 text-red-600" />
                      <span>Appeler</span>
                    </a>
                  </div>
                </div>

                {/* Produits phares & Avantages client */}
                <div className="lg:col-span-7 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-8 pt-6 lg:pt-0">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5 mb-4">
                      <Flame className="w-4 h-4 text-red-600" />
                      <span>Modèles de gazinières & appareils phares</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      {shop.featuredProducts.map((prod, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70 hover:border-slate-300 transition-colors"
                        >
                          <span className="inline-block px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-wider mb-2">
                            {prod.badge}
                          </span>
                          <h5 className="text-sm font-black text-slate-900">
                            {prod.name}
                          </h5>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            {prod.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5 mb-3">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>Avantages exclusifs avec SOSGAZ</span>
                    </h4>

                    <ul className="space-y-2">
                      {shop.advantages.map((adv, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
                    <span>
                      Besoin d’aide pour raccorder cette gazinière ? Nos livreurs interviennent partout à {shop.commune}.
                    </span>
                    <Link
                      href="/commander"
                      className="font-bold text-red-600 hover:text-red-700 underline shrink-0"
                    >
                      Commander le gaz
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          4. APPEL À PROJETS : DEVENIR BOUTIQUE PARTENAIRE
          ========================================================================= */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-black uppercase tracking-wider text-amber-400 block mb-2">
            Commerçants & Distributeurs d’électroménager
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Vous gérez un magasin d’électroménager à Abidjan ?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Référencez gratuitement votre boutique sur SOSGAZ DOMESTIC. Touchez chaque mois des milliers d’utilisateurs abidjanais en quête de nouveaux équipements de cuisson fiables et garantis.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/partenaire"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all"
            >
              Candidater comme boutique partenaire
            </Link>
            <a
              href={`https://wa.me/${MOCK_SETTINGS.officialWhatsapp.replace(
                /\D/g,
                ''
              )}?text=Bonjour%20SOSGAZ,%20je%20suis%20gérant%20d'une%20boutique%20d'électroménager%20et%20je%20souhaite%20rejoindre%20votre%20plateforme`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider border border-white/20 transition-all"
            >
              Échanger avec le responsable réseau
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
