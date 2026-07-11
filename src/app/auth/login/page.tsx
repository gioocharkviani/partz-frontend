'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Car, Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { authApi, saveAuth } from '@/lib/api';
import { refreshSocketAuth } from '@/lib/socket';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      saveAuth(res.access_token, res.user);
      refreshSocketAuth();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-teal-wash flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal flex items-center justify-center">
              <Car size={22} className="text-white" />
            </div>
            <span className="text-2xl font-black text-dark">partz<span className="text-teal">.ge</span></span>
          </Link>
          <h1 className="text-2xl font-black text-dark">Welcome back</h1>
          <p className="text-muted text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl p-8 card-shadow">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="field-label mb-2">Email Address</label>
              <div className="input-wrap">
                <span className="input-icon"><Mail size={15} /></span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="field-label">Password</label>
                <Link href="/auth/forgot-password" className="text-xs text-teal font-semibold hover:text-teal-dark transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="input-wrap">
                <span className="input-icon"><Lock size={15} /></span>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="input-end hover:text-dark transition-colors">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base justify-center rounded-xl"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={17} /></>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cream-dark" />
            </div>
            <div className="relative text-center">
              <span className="bg-white px-3 text-xs text-navy/40">or continue with</span>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-3 py-3 border-2 border-cream-dark rounded-xl text-sm font-semibold text-navy hover:border-navy/30 transition-colors">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-teal font-bold hover:text-teal-dark transition-colors">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
