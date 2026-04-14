"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Droplets } from "lucide-react";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords don't match — let's try that again.");
      return;
    }
    if (password.length < 8) {
      setError("Password needs to be at least 8 characters.");
      return;
    }
    
    const { data, error: authError } = await supabase.auth.signUp({
      email, password, options: { data: { name } }
    });

    if (authError) {
      setError(authError.message.includes("already registered") ? "Email already in use." : authError.message);
      return;
    }
    
    if (data.user) {
      await supabase.from('profiles').insert({ id: data.user.id, name });
      router.push("/log");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-[var(--color-card-bg)] p-8 rounded-[var(--radius-xl)] shadow-sm max-w-[480px] w-full border border-[var(--color-border)]">
        <div className="flex justify-center mb-6 text-[var(--color-primary-accent)]">
          <Droplets size={48} />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Welcome to NeuroTwin</h1>
        <p className="text-center text-[var(--color-text-muted)] mb-8">Let's create your account and start your wellness journey.</p>
        
        {error && (
          <div className="bg-amber-50 text-[var(--color-warning-soft)] p-3 rounded-[var(--radius-md)] mb-4 text-sm font-medium border border-[#fde68a]">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Full Name</label>
            <input required type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full border rounded-[var(--radius-md)] px-3 py-2 outline-none focus:border-[var(--color-primary-accent)] border-[var(--color-border)]" placeholder="Jane Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Email</label>
            <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full border rounded-[var(--radius-md)] px-3 py-2 outline-none focus:border-[var(--color-primary-accent)] border-[var(--color-border)]" placeholder="jane@student.edu" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Password</label>
            <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border rounded-[var(--radius-md)] px-3 py-2 outline-none focus:border-[var(--color-primary-accent)] border-[var(--color-border)]" placeholder="••••••••" />
            {password.length > 0 && (
              <div className="mt-2 h-1 w-full bg-[var(--color-border)] rounded-full overflow-hidden">
                <div className={`h-full ${password.length >= 8 ? 'bg-[var(--color-secondary-accent)]' : 'bg-[var(--color-warning-soft)]'}`} style={{ width: `${Math.min(password.length / 8 * 100, 100)}%` }}></div>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Confirm Password</label>
            <input required type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} className="w-full border rounded-[var(--radius-md)] px-3 py-2 outline-none focus:border-[var(--color-primary-accent)] border-[var(--color-border)]" placeholder="••••••••" />
          </div>
          <button type="submit" className="mt-4 bg-[var(--color-primary-accent)] text-white font-medium py-2 rounded-[var(--radius-md)] hover:opacity-90 transition">
            Create Account
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          Already have an account? <Link href="/login" className="text-[var(--color-primary-accent)] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
