'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/logo';
import { Phone, MessageCircle, Menu, X, Flame, Shield, MapPin } from 'lucide-react';
import { MOCK_SETTINGS } from '@/data/mock-data';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Accueil', href: '/' },
    { label: 'Catalogue', href: '/catalogue' },
    { label: 'Commander', href: '/commander' },
    { label: 'Comment ça marche', href: '/comment-ca-marche' },
    { label: 'Zones Abidjan', href: '/zones' },
    { label: 'Devenir Partenaire', href: '/partenaire' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo de marque avec respiration */}
        <Link href="/" className="hover:opacity-95 transition-opacity mr-8 shrink-0 flex items-center">
          <Logo size="md" />
        </Link>

        {/* Liens de navigation Desktop */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-bold transition-colors ${
                  isActive
                    ? 'text-red-600'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Boutons d'Action Rapide */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Appel d'urgence */}
          <a
            href={`tel:${MOCK_SETTINGS.officialPhone.replace(/\s+/g, '')}`}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors"
            title="Appel direct pour commander"
          >
            <Phone className="w-3.5 h-3.5 text-red-600" />
            <span>{MOCK_SETTINGS.officialPhone}</span>
          </a>

          {/* Bouton WhatsApp */}
          <a
            href={`https://wa.me/${MOCK_SETTINGS.officialWhatsapp.replace(/\D/g, '')}?text=Bonjour%20SOSGAZ,%20je%20souhaite%20commander%20une%20bouteille%20de%20gaz`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl border border-emerald-200 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline">WhatsApp</span>
          </a>

          {/* CTA Commander */}
          <Link
            href="/commander"
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase px-4 py-2.5 rounded-xl transition-all shadow-md shadow-red-600/20 active:scale-95"
          >
            <Flame className="w-4 h-4" />
            <span>Commander</span>
          </Link>
        </div>

        {/* Bouton Menu Mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/commander"
            className="bg-red-600 text-white text-xs font-black uppercase px-3 py-2 rounded-xl"
          >
            Commander
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Ouvrir le menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu Déroulant Mobile */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2.5 rounded-xl text-sm font-bold ${
                pathname === link.href
                  ? 'bg-red-50 text-red-600'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <a
              href={`tel:${MOCK_SETTINGS.officialPhone.replace(/\s+/g, '')}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-800"
            >
              <Phone className="w-4 h-4 text-red-600" />
              <span>Appeler le {MOCK_SETTINGS.officialPhone}</span>
            </a>
            <a
              href={`https://wa.me/${MOCK_SETTINGS.officialWhatsapp.replace(/\D/g, '')}?text=Bonjour%20SOSGAZ,%20je%20souhaite%20commander%20une%20bouteille%20de%20gaz`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Commander via WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
