'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useOrders } from '@/context/order-context';
import { Logo } from '@/components/ui/logo';
import {
  LayoutDashboard,
  ShoppingCart,
  Flame,
  Tag,
  MapPin,
  Store,
  Bike,
  AlertOctagon,
  BarChart3,
  ScrollText,
  Settings,
  ShieldCheck,
  UserCheck,
  Menu,
  X,
  ExternalLink,
  Lock,
} from 'lucide-react';

function AdminProtectedContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentRole, setCurrentRole, orders } = useOrders();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'NOUVELLE' || o.status === 'A_CONFIRMER'
  ).length;

  const incidentsCount = orders.filter((o) => o.status === 'INCIDENT').length;

  const navItems = [
    {
      label: 'Tableau de bord',
      href: '/admin/tableau-de-bord',
      icon: LayoutDashboard,
      roles: ['admin', 'operateur'],
    },
    {
      label: 'Commandes',
      href: '/admin/commandes',
      icon: ShoppingCart,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      badgeColor: 'bg-red-600 text-white',
      roles: ['admin', 'operateur'],
    },
    {
      label: 'Incidents & Litiges',
      href: '/admin/incidents',
      icon: AlertOctagon,
      badge: incidentsCount > 0 ? incidentsCount : undefined,
      badgeColor: 'bg-amber-600 text-white',
      roles: ['admin', 'operateur'],
    },
    {
      label: 'Dépôts Partenaires',
      href: '/admin/partenaires',
      icon: Store,
      roles: ['admin', 'operateur'], // Opérateur en lecture seule
    },
    {
      label: 'Livreurs Tiers',
      href: '/admin/livreurs',
      icon: Bike,
      roles: ['admin', 'operateur'], // Opérateur en lecture seule
    },
    {
      label: 'Bouteilles & Formats',
      href: '/admin/produits',
      icon: Flame,
      roles: ['admin', 'operateur'],
    },
    {
      label: 'Barèmes de Prix',
      href: '/admin/prix',
      icon: Tag,
      roles: ['admin'], // Admin uniquement
    },
    {
      label: 'Zones & Frais',
      href: '/admin/zones',
      icon: MapPin,
      roles: ['admin'], // Admin uniquement
    },
    {
      label: 'Rapports & Finances',
      href: '/admin/rapports',
      icon: BarChart3,
      roles: ['admin'], // Admin uniquement
    },
    {
      label: 'Journal d’Audit',
      href: '/admin/journal',
      icon: ScrollText,
      roles: ['admin'], // Admin uniquement
    },
    {
      label: 'Paramètres Généraux',
      href: '/admin/parametres',
      icon: Settings,
      roles: ['admin'], // Admin uniquement
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex text-slate-100 font-sans">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-slate-950 border-r border-slate-800 p-5 shrink-0">
        {/* Logo Officiel Haute Visibilité */}
        <div className="pb-6 border-b border-slate-800/80">
          <Link href="/admin/tableau-de-bord" className="block group">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xl shadow-black/30 group-hover:shadow-red-500/20 group-hover:border-red-300 transition-all flex items-center justify-center">
              <Logo size="lg" />
            </div>
          </Link>
          <div className="mt-3.5 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Console d&apos;Exploitation
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                currentRole === 'admin'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}
            >
              {currentRole === 'admin' ? 'Profil Admin' : 'Profil Opérateur'}
            </span>
          </div>
        </div>

        {/* Navigation principale */}
        <nav className="flex-1 mt-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const isRestricted = !item.roles.includes(currentRole);

            if (isRestricted) {
              return (
                <div
                  key={item.href}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-900/30 cursor-not-allowed select-none"
                  title="Accès réservé aux Administrateurs"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-slate-600" />
                    <span>{item.label}</span>
                  </div>
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-white text-red-600' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bas de sidebar : Profil & Switch */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Test des permissions :
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCurrentRole('admin')}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold text-center transition-all ${
                  currentRole === 'admin'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setCurrentRole('operateur')}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold text-center transition-all ${
                  currentRole === 'operateur'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                Opérateur
              </button>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-850 transition-colors"
          >
            <span>Accéder au site public</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL + TOPBAR */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900 overflow-x-hidden">
        {/* Topbar Mobile & Desktop */}
        <header className="h-16 bg-slate-950 border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-2.5">
              <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm lg:hidden flex items-center justify-center">
                <Logo size="sm" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-white leading-tight">
                  SOSGAZ DOMESTIC
                </h2>
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block sm:hidden">
                  Console d&apos;Exploitation
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                • Supervision en temps réel Abidjan
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-300 font-medium">Système connecté</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 text-white font-bold text-xs flex items-center justify-center">
                {currentRole === 'admin' ? 'AD' : 'OP'}
              </div>
              <div className="hidden md:block text-left">
                <span className="text-xs font-bold text-white block leading-tight">
                  {currentRole === 'admin' ? 'M. Sylla' : 'Aline K.'}
                </span>
                <span className="text-[10px] text-slate-400 uppercase">
                  {currentRole === 'admin' ? 'Administrateur' : 'Opératrice'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Menu Déroulant Mobile */}
        {sidebarOpen && (
          <div className="lg:hidden bg-slate-950 border-b border-slate-800 p-4 space-y-2">
            {navItems.map((item) => {
              const isRestricted = !item.roles.includes(currentRole);
              if (isRestricted) return null;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold ${
                    pathname === item.href
                      ? 'bg-red-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-500 text-white font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* Vue Page */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 text-slate-400 flex items-center justify-center text-xs">Chargement de la console...</div>}>
      <AdminProtectedContent>{children}</AdminProtectedContent>
    </Suspense>
  );
}
