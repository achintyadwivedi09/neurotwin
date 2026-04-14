"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { calcReadiness } from "@/lib/scoring";
import { WeeklyChart } from "@/components/WeeklyChart";
import { Trophy, TrendingUp, NotebookPen } from "lucide-react";
import Link from "next/link";

export default function Report() {
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<any[]>([]);
  const [averages, setAverages] = useState<any>({});
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data } = await supabase.from('daily_entries').select('*').eq('user_id', session.user.id).order('date', { ascending: false }).limit(7);
    
    if (data && data.length > 0) {
      setEntries(data.reverse());
      
      const sums = data.reduce((acc, curr) => {
        acc.sleep += Number(curr.sleep_hours);
        acc.study += Number(curr.study_hours);
        acc.screen += Number(curr.screen_time);
        acc.activity += Number(curr.activity_minutes);
        acc.focus += Number(curr.focus_level);
        acc.energy += Number(curr.energy_level);
        acc.score += calcReadiness(curr);
        return acc;
      }, { sleep: 0, study: 0, screen: 0, activity: 0, focus: 0, energy: 0, score: 0 });

      const n = data.length;
      setAverages({
        sleep: (sums.sleep / n).toFixed(1),
        study: (sums.study / n).toFixed(1),
        screen: (sums.screen / n).toFixed(1),
        activity: Math.round(sums.activity / n),
        focus: (sums.focus / n).toFixed(1),
        energy: (sums.energy / n).toFixed(1),
        score: Math.round(sums.score / n)
      });

      const { data: allLogs } = await supabase.from('daily_entries').select('date').eq('user_id', session.user.id).order('date', { ascending: false });
      let currentStreak = 0;
      if (allLogs) {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
        let expects = today;
        if (allLogs[0]?.date !== today && allLogs[0]?.date !== yesterday) {
           currentStreak = 0;
        } else {
           if (allLogs[0]?.date === yesterday) expects = yesterday;
           for (const log of allLogs) {
             if (log.date === expects) {
               currentStreak++;
               const d = new Date(expects);
               d.setDate(d.getDate() - 1);
               expects = d.toISOString().split('T')[0];
             } else {
               break;
             }
           }
        }
      }
      setStreak(currentStreak);
    } // Ensure state is reset gracefully
    setLoading(false);
  };

  if (loading) return <div className="animate-pulse h-64 bg-[var(--color-border)] rounded-[var(--radius-xl)] opacity-50 m-4 max-w-xl mx-auto"></div>;

  if (entries.length < 3) {
    return (
      <div className="flex flex-col items-center justify-center p-8 mt-12 bg-[var(--color-card-bg)] rounded-[var(--radius-xl)] shadow-sm max-w-lg mx-auto border border-[var(--color-border)] text-center">
        <div className="w-16 h-16 bg-[#eef2ff] text-[#4338ca] rounded-full flex items-center justify-center mb-6">
          <NotebookPen size={32} />
        </div>
        <h2 className="text-xl font-bold mb-2">Keep going!</h2>
        <p className="text-[var(--color-text-muted)] mb-6">You need at least 3 days of data to see your weekly report. Your consistency is key to unlocking insights.</p>
        <Link href="/log" className="bg-[var(--color-primary-accent)] text-white px-6 py-2 rounded-[var(--radius-md)] text-sm font-medium hover:opacity-90 transition">
          Log today
        </Link>
      </div>
    );
  }

  const chartData = entries.map(l => ({
    day: new Date(l.date).toLocaleDateString('en-US', { weekday: 'short' }),
    score: calcReadiness(l),
    sleep: Number(l.sleep_hours),
    study: Number(l.study_hours),
    screen: Number(l.screen_time)
  }));

  let encouragement = "You're building solid momentum.";
  if (averages.sleep < 6) encouragement = "Focusing slightly more on your sleep schedule next week could genuinely elevate everything else.";
  if (averages.score > 75) encouragement = "Your rhythm is excellent. Keep doing what you're doing.";

  return (
    <div className="pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Weekly Report</h1>
        <p className="text-[var(--color-text-muted)]">Your last 7 reported days at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[var(--color-card-bg)] p-6 rounded-[var(--radius-xl)] shadow-sm border border-[var(--color-border)] relative overflow-hidden">
          <div className="absolute -right-6 -top-6 text-[#fefce8] opacity-50 pointer-events-none">
            <Trophy size={120} />
          </div>
          <h2 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Consistency Streak</h2>
          <div className="flex items-baseline gap-2 mt-4 relative z-10">
            <span className="text-4xl font-bold text-[var(--color-warning-soft)]">{streak}</span>
            <span className="text-[var(--color-text-muted)] font-medium">days</span>
          </div>
        </div>

        <div className="bg-[var(--color-card-bg)] p-6 rounded-[var(--radius-xl)] shadow-sm border border-[var(--color-border)]">
           <h2 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Summary</h2>
           <p className="text-sm text-[var(--color-text-primary)] leading-relaxed mt-2">
             This week your average sleep was <strong>{averages.sleep} hrs</strong> and your readiness score averaged <strong>{averages.score}</strong>. {encouragement}
           </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
        {[
          { label: 'Avg Sleep', value: averages.sleep, unit: 'hrs' },
          { label: 'Avg Study', value: averages.study, unit: 'hrs' },
          { label: 'Avg Screen', value: averages.screen, unit: 'hrs' },
          { label: 'Avg Activity', value: averages.activity, unit: 'min' },
          { label: 'Avg Energy', value: averages.energy, unit: '/ 10' },
          { label: 'Avg Focus', value: averages.focus, unit: '/ 10' },
        ].map((m, i) => (
          <div key={i} className="bg-[var(--color-card-bg)] p-4 rounded-[var(--radius-xl)] shadow-sm border border-[var(--color-border)] text-center flex flex-col justify-center">
            <h3 className="text-xs font-medium text-[var(--color-text-muted)] mb-1">{m.label}</h3>
            <p className="text-xl font-bold text-[var(--color-text-primary)]">{m.value}<span className="text-xs font-normal ml-1">{m.unit}</span></p>
          </div>
        ))}
      </div>

      <div className="bg-[var(--color-card-bg)] p-6 rounded-[var(--radius-xl)] shadow-sm border border-[var(--color-border)] mb-8">
        <div className="flex items-center gap-2 mb-6 text-[var(--color-primary-accent)]">
          <TrendingUp size={20} />
          <h2 className="font-bold text-[var(--color-text-primary)]">Readiness Trend</h2>
        </div>
        <div className="h-64">
           <WeeklyChart data={chartData.map(d=>({...d, energy: d.score, focus: 0}))} type="line" />
        </div>
      </div>
    </div>
  );
}
