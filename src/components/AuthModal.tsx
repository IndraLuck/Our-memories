import React, { useState } from 'react';
import { X, Lock, Mail, Key, UserCheck, Heart, UserPlus, LogIn, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { signInUser, signUpUser, acceptNotebookInvite, getSupabaseClient } from '../utils/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserEmail?: string | null;
  onAuthSuccess: (email: string) => void;
  onSignOut: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUserEmail,
  onAuthSuccess,
  onSignOut,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'signin' | 'signup' | 'join'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const client = getSupabaseClient();
    if (!client) {
      setError('Please configure your Supabase URL & Anon Key in Settings before signing in.');
      setLoading(false);
      return;
    }

    try {
      if (mode === 'signup') {
        const { data, error: err } = await signUpUser(email.trim(), password, client);
        if (err) throw err;
        if (data.user) {
          setMessage('Account created! Please check your email for confirmation if required, or sign in.');
          setMode('signin');
        }
      } else if (mode === 'signin') {
        const { data, error: err } = await signInUser(email.trim(), password, client);
        if (err) throw err;
        if (data.user?.email) {
          onAuthSuccess(data.user.email);
          onClose();
        }
      } else if (mode === 'join') {
        const result = await acceptNotebookInvite(inviteCode.trim(), client);
        if (!result.success) {
          throw new Error(result.error || 'Failed to accept invitation');
        }
        setMessage('Successfully joined your partner’s shared notebook!');
        setTimeout(() => onClose(), 1500);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-auth-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 id="modal-auth-title" className="font-serif text-lg font-bold text-stone-900 dark:text-stone-50">
                {currentUserEmail ? 'Shared Account' : 'Sign In to Shared Notebook'}
              </h2>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                Private digital sanctuary for two
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* If user is already logged in */}
        {currentUserEmail ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>Signed in as <strong>{currentUserEmail}</strong></span>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                Sign Out
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold shadow-sm"
              >
                Back to Notebook
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Mode Selector */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`py-1.5 rounded-lg transition-colors ${
                  mode === 'signin'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`py-1.5 rounded-lg transition-colors ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => setMode('join')}
                className={`py-1.5 rounded-lg transition-colors ${
                  mode === 'join'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                Join Partner
              </button>
            </div>

            {/* Error or Success Notice */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {message && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'join' ? (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Partner Invite Code
                  </label>
                  <input
                    type="text"
                    required
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="e.g. LOVE-8K2A1X"
                    className="w-full h-10 px-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm tracking-wider uppercase font-mono focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  />
                  <p className="text-[11px] text-stone-400 pt-1">
                    Ask your partner to generate this code in their notebook Settings.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full h-10 px-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-10 px-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 rounded-xl bg-stone-900 dark:bg-rose-600 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all hover:bg-stone-800"
              >
                <span>{loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Join Notebook'}</span>
              </button>
            </form>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 underline underline-offset-2"
              >
                Continue in Local / Offline Mode
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
