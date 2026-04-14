"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Droplets } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError("We couldn't find that combination — want to try again?");
      return;
    }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-[var(--color-card-bg)] p-8 rounded-[var(--radius-xl)] shadow-sm max-w-[400px] w-full border border-[var(--color-border)]">
        <div className="flex justify-center mb-6 text-[var(--color-primary-accent)]">
          <Droplets size={48} />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
        <p className="text-center text-[var(--color-text-muted)] mb-8">Log in to check-in with your day.</p>
        
        {error && (
          <div className="bg-amber-50 text-[var(--color-warning-soft)] p-3 rounded-[var(--radius-md)] mb-4 text-sm font-medium border border-[#fde68a]">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Email</label>
            <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full border rounded-[var(--radius-md)] px-3 py-2 outline-none focus:border-[var(--color-primary-accent)] border-[var(--color-border)]" placeholder="jane@student.edu" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Password</label>
            <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border rounded-[var(--radius-md)] px-3 py-2 outline-none focus:border-[var(--color-primary-accent)] border-[var(--color-border)]" placeholder="••••••••" />
          </div>
          <button type="submit" className="mt-4 bg-[var(--color-primary-accent)] text-white font-medium py-2 rounded-[var(--radius-md)] hover:opacity-90 transition">
            Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          New here? <Link href="/register" className="text-[var(--color-primary-accent)] hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
