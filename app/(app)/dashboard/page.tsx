"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { calcReadiness, getScoreLabel } from "@/lib/scoring";
import { getRecommendations } from "@/lib/recommendations";
import { ReadinessRing } from "@/components/ReadinessRing";
import { RecommendationCard } from "@/components/RecommendationCard";
import { WeeklyChart } from "@/components/WeeklyChart";
import { BookOpen, Moon, Smartphone, Activity } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [entry, setEntry] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [weekData, setWeekData] = useState<any[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    
    // get user profile
    const { data: profile } = await supabase.from('profiles').select('name').eq('id', session.user.id).single();
    if (profile) setName(profile.name.split(' ')[0]);

    const dateStr = new Date().toISOString().split('T')[0];
    
    // Get last 7 days
    const { data: logs } = await supabase.from('daily_entries').select('*').eq('user_id', session.user.id).order('date', { ascending: false }).limit(7);
    
    if (logs) {
      const today = logs.find(l => l.date === dateStr);
      if (today) {
        setEntry(today);
        setScore(calcReadiness(today));
      }
      
      const chartData = logs.map(l => ({
        day: new Date(l.date).toLocaleDateString('en-US', { weekday: 'short' }),
        study: Number(l.study_hours),
        sleep: Number(l.sleep_hours),
        screen: Number(l.screen_time),
        energy: Number(l.energy_level),
        focus: Number(l.focus_level),
        readiness: calcReadiness(l)
      })).reverse();
      setWeekData(chartData);
    }
    
    setLoading(false);
  };

  const getTimeOfDay = () => {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 18) return 'afternoon';
    return 'evening';
  };

  if (loading) return <div className="animate-pulse h-64 bg-[var(--color-border)] rounded-[var(--radius-xl)] opacity-50 m-4 max-w-xl mx-auto"></div>;

  const recs = entry ? getRecommendations(entry) : [];

  return (
    <div className="pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Good {getTimeOfDay()}, {name || 'there'}</h1>
        <p className="text-[var(--color-text-muted)]">Here's a snapshot of how you've been taking care of yourself.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1 bg-[var(--color-card-bg)] p-6 rounded-[var(--radius-xl)] shadow-sm border border-[var(--color-border)] flex flex-col items-center justify-center text-center">
          {entry ? (
            <>
              <ReadinessRing score={score} size="lg" />
              <p className="mt-6 text-sm font-medium text-[var(--color-text-primary)] px-4 leading-relaxed">{getScoreLabel(score)}</p>
            </>
          ) : (
             <div className="py-8 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full border-4 border-dashed border-[var(--color-border)] flex items-center justify-center mb-4 text-[var(--color-text-muted)] font-bold text-xl">?</div>
              <p className="text-[var(--color-text-muted)] text-sm mb-4">No data for today yet.</p>
              <Link href="/log" className="bg-[var(--color-primary-accent)] text-white px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium hover:opacity-90 transition">Log today</Link>
             </div>
          )}
        </div>
        
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
           {[
             { label: 'Sleep', value: entry?.sleep_hours || 0, unit: 'hrs', icon: Moon, color: 'text-indigo-500' },
             { label: 'Study', value: entry?.study_hours || 0, unit: 'hrs', icon: BookOpen, color: 'text-blue-500' },
             { label: 'Screen Time', value: entry?.screen_time || 0, unit: 'hrs', icon: Smartphone, color: 'text-orange-500' },
             { label: 'Activity', value: entry?.activity_minutes || 0, unit: 'min', icon: Activity, color: 'text-green-500' },
           ].map((metric, i) => (
             <div key={i} className="bg-[var(--color-card-bg)] p-4 rounded-[var(--radius-xl)] shadow-sm border border-[var(--color-border)] flex flex-col justify-between">
               <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm font-medium mb-4">
                 <metric.icon size={16} className={metric.color} />
                 {metric.label}
               </div>
               <div className="text-2xl font-bold flex items-baseline gap-1">
                 {metric.value} <span className="text-sm font-medium text-[var(--color-text-muted)]">{metric.unit}</span>
               </div>
             </div>
           ))}
        </div>
      </div>

      {recs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">Insights & Suggestions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recs.map((rec, i) => (
              <motion.div key={i} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: i*0.1}}>
                <RecommendationCard icon={rec.icon} message={rec.message} type={rec.type} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {weekData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--color-card-bg)] p-5 rounded-[var(--radius-xl)] shadow-sm border border-[var(--color-border)]">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-4">Time Distribution (7 Days)</h3>
            <WeeklyChart data={weekData} type="bar" />
          </div>
          <div className="bg-[var(--color-card-bg)] p-5 rounded-[var(--radius-xl)] shadow-sm border border-[var(--color-border)]">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-4">Energy & Focus (7 Days)</h3>
            <WeeklyChart data={weekData} type="line" />
          </div>
        </div>
      )}
    </div>
  );
}
