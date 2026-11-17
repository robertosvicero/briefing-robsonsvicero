import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      // Se ainda não configurou as chaves reais, salva uma sessão demo para permitir visualizar o painel
      sessionStorage.setItem('demo_admin_auth', 'true');
      navigate('/admin');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (data.session) {
        navigate('/admin');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao autenticar. Verifique seus dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      <Navbar showBack />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-surface-200">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-accent-50 text-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-accent-200">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-navy-900">Acesso Restrito</h1>
            <p className="text-xs sm:text-sm text-ink-500 mt-1">
              Painel de Gestão de Briefings — Robson Svicero
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-1.5">E-mail</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-600"
                  placeholder="admin@robsonsvicero.com.br"
                />
                <Mail className="w-4 h-4 text-ink-300 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-1.5">Senha</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-600"
                  placeholder="••••••••"
                />
                <Lock className="w-4 h-4 text-ink-300 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent-600 hover:bg-accent-700 text-white font-semibold text-sm shadow-md shadow-accent-600/20 disabled:opacity-50 transition-all"
            >
              {loading ? 'Entrando...' : 'Acessar Painel'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-ink-500 mt-6">
            Acesso reservado exclusivamente para o administrador do projeto.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};
