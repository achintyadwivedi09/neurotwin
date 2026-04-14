"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Trash2, Edit3, Settings as SettingsIcon, AtSign, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { calcReadiness } from "@/lib/scoring";

export default function Settings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [habits, setHabits] = useState<any[]>([]);
  
  const [deleteTarget, setDeleteTarget] = useState<{id: string, type: 'entry' | 'habit'} | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: p } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
    setProfile({...p, email: session.user.email});

    const { data: e } = await supabase.from('daily_entries').select('*').eq('user_id', session.user.id).order('date', { ascending: false }).limit(14);
    setEntries(e || []);

    const { data: h } = await supabase.from('custom_habits').select('*').eq('user_id', session.user.id);
    setHabits(h || []);

    setLoading(false);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    
    if (deleteTarget.type === 'entry') {
      await supabase.from('daily_entries').delete().eq('id', deleteTarget.id);
      setEntries(entries.filter(e => e.id !== deleteTarget.id));
    } else {
      await supabase.from('custom_habits').delete().eq('id', deleteTarget.id);
      setHabits(habits.filter(h => h.id !== deleteTarget.id));
    }
    setDeleteTarget(null);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-[var(--color-primary-accent)] w-8 h-8"/></div>;

  return (
    <div className="pb-12 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings & Data</h1>
        <p className="text-[var(--color-text-muted)]">Manage your account and historical logs.</p>
      </div>

      <div className="bg-[var(--color-card-bg)] p-6 rounded-[var(--radius-xl)] shadow-sm border border-[var(--color-border)] mb-8">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-[var(--color-border)] pb-2">
          <SettingsIcon size={18} className="text-[var(--color-primary-accent)]" /> Account Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-4">
          <div>
            <p className="text-[var(--color-text-muted)] mb-1">Name</p>
            <p className="font-medium text-[var(--color-text-primary)] px-3 py-2 bg-gray-50 rounded border border-[var(--color-border)]">{profile?.name}</p>
          </div>
          <div>
            <p className="text-[var(--color-text-muted)] mb-1">Email</p>
            <p className="font-medium text-[var(--color-text-primary)] px-3 py-2 bg-gray-50 rounded border border-[var(--color-border)] flex items-center gap-2"><AtSign size={14} className="text-gray-400"/> {profile?.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-card-bg)] rounded-[var(--radius-xl)] shadow-sm border border-[var(--color-border)] mb-8 overflow-hidden">
        <div className="p-4 border-b border-[var(--color-border)] bg-[#f8fafc]">
          <h2 className="text-lg font-bold">Recent Entries (Last 14 days)</h2>
        </div>
        <div className="divide-y divide-[var(--color-border)] max-h-96 overflow-y-auto">
          {entries.length === 0 ? (
            <p className="p-6 text-center text-sm text-[var(--color-text-muted)]">No logs found.</p>
          ) : React.Children.toArray(entries.map(e => (
            <div className="p-4 flex items-center justify-between hover:bg-[#f8fafc] transition">
              <div>
                <p className="font-medium text-[var(--color-text-primary)]">{e.date}</p>
                <div className="text-xs text-[var(--color-text-muted)] flex gap-3 mt-1">
                  <span>Score: {calcReadiness(e)}</span>
                  <span>Sleep: {e.sleep_hours}hr</span>
                  <span>Study: {e.study_hours}hr</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setDeleteTarget({id: e.id, type: 'entry'})} className="p-2 text-rose-500 hover:bg-rose-50 rounded transition">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )))}
        </div>
      </div>

      <div className="bg-[var(--color-card-bg)] rounded-[var(--radius-xl)] shadow-sm border border-[var(--color-border)] overflow-hidden">
         <div className="p-4 border-b border-[var(--color-border)] bg-[#f8fafc]">
          <h2 className="text-lg font-bold">Custom Habits</h2>
        </div>
        <ul className="divide-y divide-[var(--color-border)]">
          {habits.length === 0 ? (
            <p className="p-6 text-center text-sm text-[var(--color-text-muted)]">No custom habits found.</p>
          ) : React.Children.toArray(habits.map(h => (
            <li className="p-4 flex items-center justify-between hover:bg-[#f8fafc] transition">
              <div>
                <p className="font-medium text-[var(--color-text-primary)]">{h.name}</p>
                <p className="text-xs text-[var(--color-text-muted)] uppercase mt-0.5">{h.habit_type}</p>
              </div>
              <button onClick={() => setDeleteTarget({id: h.id, type: 'habit'})} className="px-3 py-1 text-xs font-medium text-rose-600 bg-rose-50 rounded hover:bg-rose-100 transition border border-rose-100">
                Delete
              </button>
            </li>
          )))}
        </ul>
      </div>

      <ConfirmDialog 
        isOpen={!!deleteTarget}
        title={`Delete ${deleteTarget?.type === 'entry' ? 'Log Entry' : 'Habit'}`}
        message={`Are you sure you want to remove this ${deleteTarget?.type}? This can't be undone.`}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
