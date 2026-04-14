"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Droplets, LayoutDashboard, FileEdit, TrendingUp, BarChart, Settings, LogOut } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push("/login");
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) router.push("/login");
    });
    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center p-4"><div className="animate-pulse w-8 h-8 rounded-full bg-[var(--color-primary-accent)]"></div></div>;

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navs = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Log Day', path: '/log', icon: FileEdit },
    { name: 'Predictor', path: '/predictor', icon: TrendingUp },
    { name: 'Report', path: '/report', icon: BarChart },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-[calc(100vh-2px)] flex-col sm:flex-row bg-[var(--color-page-bg)]">
      {/* Sidebar */}
      <aside className="w-full sm:w-64 bg-[var(--color-card-bg)] border-b sm:border-r border-[var(--color-border)] p-4 flex flex-col justify-between hidden sm:flex shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-8 px-2 text-[var(--color-primary-accent)]">
            <Droplets size={28} />
            <span className="font-bold text-xl text-[var(--color-text-primary)]">NeuroTwin</span>
          </div>
          <nav className="flex flex-col gap-1">
            {navs.map(n => (
              <Link key={n.path} href={n.path} className={`flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-sm font-medium transition ${pathname === n.path ? 'bg-[#f0f9ff] text-[var(--color-primary-accent)]' : 'text-[var(--color-text-muted)] hover:bg-[#f8fafc]'}`}>
                <n.icon size={18} />
                {n.name}
              </Link>
            ))}
          </nav>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-sm font-medium text-[var(--color-text-muted)] hover:bg-[#f8fafc] transition mt-4 w-full text-left">
          <LogOut size={18} />
          Sign Out
        </button>
      </aside>
      
      {/* Mobile nav */}
      <nav className="sm:hidden fixed bottom-0 w-full bg-[var(--color-card-bg)] border-t border-[var(--color-border)] flex justify-around p-2 z-40">
        {navs.slice(0, 4).map(n => (
          <Link key={n.path} href={n.path} className={`flex flex-col items-center gap-1 p-2 rounded ${pathname === n.path ? 'text-[var(--color-primary-accent)]' : 'text-[var(--color-text-muted)]'}`}>
            <n.icon size={20} />
            <span className="text-[10px] font-medium">{n.name}</span>
          </Link>
        ))}
        <Link href="/settings" className={`flex flex-col items-center gap-1 p-2 rounded ${pathname === '/settings' ? 'text-[var(--color-primary-accent)]' : 'text-[var(--color-text-muted)]'}`}>
          <Settings size={20} />
          <span className="text-[10px] font-medium">Settings</span>
        </Link>
      </nav>

      <main className="flex-1 p-4 sm:p-8 pb-24 sm:pb-8 overflow-y-auto w-full max-w-5xl mx-auto">
        {children}
      </main>
    </div>
  );
}
