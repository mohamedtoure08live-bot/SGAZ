'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/logo';
import { useOrders } from '@/context/order-context';
import { Lock, Mail, ShieldCheck, UserCheck, ArrowRight, KeyRound } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { setCurrentRole } = useOrders();
  const [email, setEmail] = useState('sylla.admin@sosgaz.ci');
  const [password, setPassword] = useState('••••••••••••');
  const [totp, setTotp] = useState('849 201');

  const handleLoginAs = (role: 'admin' | 'operateur') => {
    setCurrentRole(role);
    router.push('/admin/tableau-de-bord');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Halo d'ambiance de fond */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="inline-block p-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md mb-4">
          <Logo size="lg" showTagline={false} />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Console d&apos;Exploitation SOSGAZ
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Accès sécurisé réservé aux administrateurs et opérateurs agréés
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLoginAs('admin');
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Adresse Email Professionnelle
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-hidden focus:border-red-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Mot de Passe Sécurisé
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-hidden focus:border-red-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Code 2FA (Double Authentification)
                </label>
                <span className="text-[10px] text-amber-400 font-bold uppercase">
                  Requis pour Admin
                </span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={totp}
                  onChange={(e) => setTotp(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-amber-400 font-mono tracking-widest focus:outline-hidden focus:border-red-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Se Connecter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Accès Démo Rapide */}
          <div className="pt-6 border-t border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center mb-3">
              Connexion Rapide Mode Démo :
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleLoginAs('admin')}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-left transition-all group"
              >
                <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                  Accès total (tarifs, finances, journal d&apos;audit)
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleLoginAs('operateur')}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-left transition-all group"
              >
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                  <UserCheck className="w-4 h-4" />
                  <span>Opérateur</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                  Traitement commandes, affectations, statuts
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
