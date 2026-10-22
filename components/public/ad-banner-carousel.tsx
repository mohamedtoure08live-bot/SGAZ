'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Store,
  PhoneCall,
  Clock,
  Layers,
} from 'lucide-react';

interface Slide {
  id: string;
  badge: {
    icon: typeof Sparkles;
    text: string;
    color: string;
  };
  title: string;
  highlightedText?: string;
  description: string;
  primaryCta: {
    label: string;
    href: string;
    icon: typeof ShoppingBag;
  };
  secondaryCta?: {
    label: string;
    href: string;
    icon?: typeof ArrowRight;
    isExternal?: boolean;
  };
  image: string;
  imageAlt: string;
  floatingBadges: {
    title: string;
    subtitle: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  }[];
  bullets: string[];
}

const SLIDES: Slide[] = [
  {
    id: 'slide-gazinieres-electromenager',
    badge: {
      icon: Sparkles,
      text: 'Offres Partenaires • Équipements de Cuisine',
      color: 'bg-red-500/15 text-red-300 border-red-500/30',
    },
    title: 'Équipez votre cuisine,',
    highlightedText: 'simplifiez votre quotidien !',
    description:
      'Découvrez les gazinières et appareils électroménagers proposés par nos boutiques partenaires. Profitez d’équipements fiables, garantis constructeur et prêts pour le raccordement au gaz à Abidjan.',
    primaryCta: {
      label: 'Découvrir les boutiques',
      href: '/boutiques',
      icon: ShoppingBag,
    },
    secondaryCta: {
      label: 'Nos offres combinées',
      href: '/boutiques#packs',
      icon: ArrowRight,
    },
    image: '/images/banner-electromenager.jpg',
    imageAlt: 'Gazinière moderne en inox avec four et appareils électroménagers',
    floatingBadges: [
      {
        title: 'Gazinières 3, 4 & 5 feux',
        subtitle: 'Inox & allumage automatique',
        position: 'top-left',
      },
      {
        title: 'Garantie 12 à 24 mois',
        subtitle: 'Boutiques partenaires certifiées',
        position: 'bottom-right',
      },
    ],
    bullets: [
      'Gazinières inox avec four haute puissance',
      'Fours, micro-ondes & réfrigérateurs de grandes marques',
      'Raccordement de votre bouteille SOSGAZ offert',
    ],
  },
  {
    id: 'slide-pack-cuisson',
    badge: {
      icon: Flame,
      text: 'Pack Confort Cuisson • Solution Clé en Main',
      color: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    },
    title: 'Nouvelle gazinière ?',
    highlightedText: 'Votre gaz livré & raccordé !',
    description:
      'Achetez votre appareil chez nos revendeurs agréés et profitez immédiatement d’une bouteille de gaz neuve scellée livrée à domicile avec test d’étanchéité offert par nos livreurs experts.',
    primaryCta: {
      label: 'Découvrir les boutiques',
      href: '/boutiques',
      icon: ShoppingBag,
    },
    secondaryCta: {
      label: 'Commander une recharge',
      href: '/commander',
      icon: ArrowRight,
    },
    image: '/images/boutique-electromenager.jpg',
    imageAlt: 'Showroom de boutiques partenaires électroménager et gazinières à Abidjan',
    floatingBadges: [
      {
        title: 'Pack Tout-en-Un',
        subtitle: 'Appareil + Bouteille + Raccordement',
        position: 'top-right',
      },
      {
        title: 'Sécurité Maximale',
        subtitle: 'Test d’étanchéité certifié',
        position: 'bottom-left',
      },
    ],
    bullets: [
      'Plus de 15 boutiques référencées à Abidjan',
      'Marques de référence : Beko, Whirlpool, Midea, Nasco',
      'Livraison groupée de votre équipement et de votre gaz',
    ],
  },
  {
    id: 'slide-espace-commercants',
    badge: {
      icon: Store,
      text: 'Réseau Professionnel • Boutiques & Commerçants',
      color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    },
    title: 'Vous vendez des appareils',
    highlightedText: 'électroménagers à Abidjan ?',
    description:
      'Rejoignez notre réseau de boutiques partenaires et exposez vos gazinières, réfrigérateurs et accessoires auprès de milliers de ménages abidjanais qui commandent leur gaz quotidiennement.',
    primaryCta: {
      label: 'Devenir boutique partenaire',
      href: '/partenaire',
      icon: Store,
    },
    secondaryCta: {
      label: 'Consulter l’annuaire',
      href: '/boutiques',
      icon: ArrowRight,
    },
    image: '/images/boutique-electromenager.jpg',
    imageAlt: 'Partenariat commerçants électroménager SOSGAZ',
    floatingBadges: [
      {
        title: 'Visibilité Directe',
        subtitle: 'Clients qualifiés sur votre zone',
        position: 'top-left',
      },
      {
        title: 'Adhésion Rapide',
        subtitle: 'Intégration sans complexité',
        position: 'bottom-right',
      },
    ],
    bullets: [
      'Mise en avant sur notre plateforme et réseaux',
      'Synergie naturelle entre gaz domestique et matériel de cuisson',
      'Accompagnement par l’équipe commerciale SOSGAZ',
    ],
  },
];

export function AdBannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Défilement automatique toutes les 7 secondes si pas en pause
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Gestion du swipe sur tactile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diffX = touchStartX.current - touchEndX.current;
    if (diffX > 50) {
      nextSlide();
    } else if (diffX < -50) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentSlide = SLIDES[currentIndex];
  const BadgeIcon = currentSlide.badge.icon;
  const PrimaryCtaIcon = currentSlide.primaryCta.icon;
  const SecondaryCtaIcon = currentSlide.secondaryCta?.icon;

  return (
    <section
      aria-label="Publicités et boutiques partenaires"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Conteneur principal avec ombre et style premium */}
      <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl sm:rounded-[2.5rem] border border-slate-800/90 shadow-2xl shadow-slate-950/40 overflow-hidden">
        {/* Lueur d'ambiance dynamique */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-40" />

        {/* Grille responsive 2 colonnes : Contenu publicitaire + Visuel commercial */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center p-6 sm:p-10 lg:p-14">
          {/* Colonne gauche : Contenu éditorial et commercial */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5 sm:space-y-6">
            {/* Tag publicitaire dynamique */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border backdrop-blur-md transition-colors ${currentSlide.badge.color}`}
              >
                <BadgeIcon className="w-4 h-4" />
                <span>{currentSlide.badge.text}</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-400 bg-white/5 border border-white/10">
                <Store className="w-3.5 h-3.5 text-amber-400" />
                <span>Boutiques d’Abidjan</span>
              </span>
            </div>

            {/* Titre publicitaire accrocheur */}
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12]">
                {currentSlide.title}{' '}
                {currentSlide.highlightedText && (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-amber-400 block sm:inline">
                    {currentSlide.highlightedText}
                  </span>
                )}
              </h2>
            </div>

            {/* Description publicitaire claire et vendeuse */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              {currentSlide.description}
            </p>

            {/* Points forts / Avantages clés sous forme de puces */}
            <div className="space-y-2.5 pt-1">
              {currentSlide.bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>

            {/* Actions commerciales (Boutons d'action) */}
            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href={currentSlide.primaryCta.href}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-red-600/30 hover:shadow-red-600/50 active:scale-95 transition-all group"
              >
                <PrimaryCtaIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>{currentSlide.primaryCta.label}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              {currentSlide.secondaryCta && (
                <Link
                  href={currentSlide.secondaryCta.href}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-bold text-xs sm:text-sm uppercase tracking-wider active:scale-95 transition-all backdrop-blur-md"
                >
                  {SecondaryCtaIcon && <SecondaryCtaIcon className="w-4 h-4 text-amber-300" />}
                  <span>{currentSlide.secondaryCta.label}</span>
                </Link>
              )}
            </div>
          </div>

          {/* Colonne droite : Visuel publicitaire haute qualité adapté au commerce */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              {/* Cadre de l'image avec bordure lumineuse et coins arrondis */}
              <div className="relative aspect-[16/10] sm:aspect-[16/11] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-slate-900 group">
                <Image
                  src={currentSlide.image}
                  alt={currentSlide.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  priority={currentIndex === 0}
                />

                {/* Dégradé subtil pour la lisibilité et l'intégration */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 pointer-events-none" />

                {/* Badges flottants commerciaux (Positionnés sur l'image) */}
                {currentSlide.floatingBadges.map((badge, idx) => {
                  const posClass =
                    badge.position === 'top-left'
                      ? 'top-3 left-3 sm:top-4 sm:left-4'
                      : badge.position === 'top-right'
                      ? 'top-3 right-3 sm:top-4 sm:right-4'
                      : badge.position === 'bottom-left'
                      ? 'bottom-3 left-3 sm:bottom-4 sm:left-4'
                      : 'bottom-3 right-3 sm:bottom-4 sm:right-4';

                  return (
                    <div
                      key={idx}
                      className={`absolute ${posClass} bg-slate-950/85 backdrop-blur-md border border-white/20 rounded-xl px-3 py-1.5 sm:px-3.5 sm:py-2 shadow-lg max-w-[200px] pointer-events-none`}
                    >
                      <p className="text-[11px] sm:text-xs font-black text-white leading-tight">
                        {badge.title}
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-amber-300 font-medium leading-tight mt-0.5">
                        {badge.subtitle}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Étiquette d'assurance sous l'image */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Produits neufs sous garantie
                </span>
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Compatible gaz butane CI
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Barre de Contrôle & Pagination du carrousel */}
        <div className="relative z-10 px-6 sm:px-10 lg:px-14 pb-6 pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Indicateurs de progression / Puces de pagination */}
          <div className="flex items-center gap-2">
            {SLIDES.map((slide, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={slide.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`transition-all duration-300 rounded-full h-2.5 ${
                    isActive
                      ? 'w-8 bg-gradient-to-r from-red-500 to-amber-400'
                      : 'w-2.5 bg-slate-700 hover:bg-slate-600'
                  }`}
                  aria-label={`Aller au slide ${idx + 1}`}
                />
              );
            })}
            <span className="text-[11px] text-slate-400 font-bold ml-2">
              0{currentIndex + 1} / 0{SLIDES.length}
            </span>
          </div>

          {/* Navigation Précédent / Suivant & Pause */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-[11px] text-slate-400 mr-2">
              Faites défiler pour voir nos partenaires
            </span>

            <button
              onClick={prevSlide}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors"
              aria-label="Slide précédent"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={nextSlide}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors"
              aria-label="Slide suivant"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
