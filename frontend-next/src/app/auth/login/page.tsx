'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import { setUser } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (email && password) {
        setUser({
          id: '1',
          email: email,
          name: email.split('@')[0]
        });
        router.push('/dashboard');
      } else {
        setError('Please enter valid credentials');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white text-black font-mono flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Link href="/" className="inline-flex items-center text-sm font-bold uppercase mb-8 hover:underline decoration-2 text-gray-600 hover:text-black transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Mainframe
        </Link>

        <div className="border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white relative">
          <div className="absolute top-0 left-0 bg-orange-600 text-white px-4 py-1 text-sm font-bold uppercase border-b-2 border-r-2 border-black">
            Secure Access
          </div>

          <div className="mt-8 mb-8 text-center">
             <div className="inline-block border-2 border-black p-4 mb-4 bg-gray-100">
                <span className="text-3xl font-black tracking-tighter uppercase">
                    Tensor<span className="text-orange-600">Trade</span>
                </span>
             </div>
            <h1 className="text-4xl font-black uppercase mb-2">Identify</h1>
            <p className="font-bold text-gray-500 uppercase text-sm">
              Enter credentials to access the terminal.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-black uppercase mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-black font-bold focus:outline-none focus:ring-0 focus:border-orange-600 transition-colors placeholder:text-gray-300 placeholder:uppercase"
                  placeholder="USER@DOMAIN.COM"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-black uppercase">
                    Password
                </label>
                <Link href="/auth/forgot-password" className="text-xs font-bold uppercase text-gray-500 hover:text-black underline decoration-1">
                    Reset Code?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-black font-bold focus:outline-none focus:ring-0 focus:border-orange-600 transition-colors placeholder:text-gray-300 placeholder:uppercase"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-500 p-3 text-red-600 text-sm font-bold uppercase flex items-center">
                <span className="mr-2">⚠️</span> {error}
              </div>
            )}

            <button
              type="submit" 
              className="w-full text-xl font-black uppercase bg-black text-white border-4 border-black py-4 hover:bg-white hover:text-black transition-all shadow-[6px_6px_0px_0px_#FF5722] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Access Terminal'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t-2 border-black text-center">
            <p className="font-bold text-gray-500 uppercase text-sm">
              New User?{' '}
              <Link href="/auth/signup" className="text-orange-600 hover:text-black hover:underline decoration-2">
                Initialize Account
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-xs font-bold text-gray-400 uppercase">
          System ID: TENSOR-NODE-01 // v2.4.1
        </div>
      </div>
    </div>
  );
}
