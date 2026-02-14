'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getUser, clearUser } from '@/lib/auth';
import Button from '@/components/ui/Button';
import AIAssistant from '@/components/AIAssistant';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/auth/login');
    } else {
      setUser(currentUser);
    }
  }, [router]);

  const handleLogout = () => {
    clearUser();
    router.push('/');
  };

  const navigation = [
    { name: 'Portfolio', href: '/dashboard' },
    { name: 'Analyze', href: '/dashboard/analyze' },
    { name: 'Trading', href: '/dashboard/trading' },
    { name: 'Wallet', href: '/dashboard/wallet' },
    { name: 'Policies', href: '/dashboard/policies' },
    { name: 'Investments', href: '/dashboard/investments' },
    { name: 'Voice Agent', href: '/dashboard/voice' },
    { name: 'Calling Agent', href: '/dashboard/calling-agent' },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black text-xl font-bold uppercase">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r-4 border-black transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b-4 border-black">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-2xl font-bold uppercase">
                TensorTrade
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden font-bold text-xl"
            >
              X
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b-4 border-black">
            <div className="space-y-1">
              <div className="text-black font-bold uppercase text-sm">{user.name}</div>
              <div className="text-black text-xs">{user.email}</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-0 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-3 border-b-4 border-black font-bold uppercase text-sm ${
                    isActive
                      ? 'bg-black text-white'
                      : 'bg-white text-black hover:bg-black hover:text-white'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Settings & Logout */}
          <div className="border-t-4 border-black">
            <Link
              href="/dashboard/settings"
              className="block px-4 py-3 border-b-4 border-black font-bold uppercase text-sm bg-white text-black hover:bg-black hover:text-white"
            >
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 font-bold uppercase text-sm bg-white text-black hover:bg-black hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white border-b-4 border-black">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden font-bold text-2xl"
            >
              MENU
            </button>
            <div className="flex-1 lg:flex-none">
              <h1 className="text-2xl font-bold uppercase">
                {navigation.find(item => item.href === pathname)?.name || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                Upgrade
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 bg-white">
          {children}
        </main>
      </div>

      {/* AI Assistant */}
      <AIAssistant />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
