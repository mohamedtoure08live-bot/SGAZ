'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/ui/logo';
import { useOrders } from '@/context/order-context';
import { loginAction } from '@/app/actions/auth';
import { Lock, Mail, ShieldCheck, UserCheck, ArrowRight, KeyRound, AlertCircle, Loader2 } from 'lucide-react';

function AdminLoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromUrl = searchParams.get('from') || '/admin/tableau-de-bord';

  const { setCurrentRole } = useOrders();
  const [email, setEmail] = useState('sylla.admin@sosgaz.ci');
  const [password, setPassword] = useState('SosGaz@2026!Admin');
  const [totp, setTotp] = useState('849201');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFillCredentials = (role: 'admin' | 'operateur') => {
    setErrorMessage(null);
    if (role === 'admin') {
      setEmail('sylla.admin@sosgaz.ci');
      setPassword('SosGaz@2026!Admin');
      setTotp('849201');
    } else {
      setEmail('aline.op@sosgaz.ci');
      setPassword('SosGaz@2026!Op');
      setTotp('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.set('email', email);
      formData.set('password', password);
      formData.set('totp', totp);

      const res = await loginAction(formData);

      if (!res.success) {
        setErrorMessage(res.error || 'Identifiants ou mot de passe incorrects.');
        setIsLoading(false);
        return;
      }

      if (res.role === 'admin' || res.role === 'operateur') {
        setCurrentRole(res.role);
      }

      // Rediriger vers l'espace protégé
      router.push(fromUrl);
      router.refresh();
    } catch {
      setErrorMessage('Une erreur de communication est survenue lors de la connexion.');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Adresse Email Professionnelle
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5 pointer-events-none" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nom@sosgaz.ci"
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
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
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
              placeholder="6 chiffres"
              className="w-full pl-9 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-amber-400 font-mono tracking-widest focus:outline-hidden focus:border-red-500 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Vérification...</span>
            </>
          ) : (
            <>
              <span>Se Connecter</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Remplissage Rapide des Identifiants pour Tests */}
      <div className="pt-6 border-t border-slate-800">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center mb-3">
          Identifiants de Démonstration :
        </span>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleFillCredentials('admin')}
            className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-left transition-all group"
          >
            <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Profil Admin</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-tight font-mono">
              sylla.admin@sosgaz.ci
            </p>
            <p className="text-[9px] text-slate-500 mt-0.5">Mot de passe pré-rempli</p>
          </button>

          <button
            type="button"
            onClick={() => handleFillCredentials('operateur')}
            className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-left transition-all group"
          >
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
              <UserCheck className="w-4 h-4" />
              <span>Profil Opérateur</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-tight font-mono">
              aline.op@sosgaz.ci
            </p>
            <p className="text-[9px] text-slate-500 mt-0.5">Mot de passe pré-rempli</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Halo d'ambiance de fond */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="inline-block p-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md mb-4">
          <Logo size="lg" showTagline={false} />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Console d&apos;Exploitation SOSGAZ
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Accès sécurisé réservé aux administrateurs et opérateurs agréés
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Suspense fallback={<div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400 text-xs">Chargement du formulaire...</div>}>
          <AdminLoginFormContent />
        </Suspense>
      </div>
    </div>
  );
}
