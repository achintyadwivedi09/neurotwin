"use client";
import { useState, useEffect } from "react";
import { calcReadiness, calcPredictedInsights } from "@/lib/scoring";
import { ReadinessRing } from "@/components/ReadinessRing";
import { SliderInput } from "@/components/SliderInput";
import { Smartphone, Moon, BookOpen, Activity, ArrowRight, Lightbulb } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Predictor() {
  const [baseEntry, setBaseEntry] = useState<any>({
    study_hours: 4, sleep_hours: 7, screen_time: 5, activity_minutes: 30, focus_level: 6, energy_level: 6
  });

  const [simEntry, setSimEntry] = useState<any>({...baseEntry});
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const dateStr = new Date().toISOString().split('T')[0];
        supabase.from('daily_entries').select('*').eq('user_id', session.user.id).eq('date', dateStr).single().then(({data}) => {
          if (data) {
            setBaseEntry(data);
            setSimEntry(data);
          }
        });
      }
    });
  }, []);

  const baseScore = calcReadiness(baseEntry);
  const simScore = calcReadiness(simEntry);
  const diff = simScore - baseScore;
  const insights = calcPredictedInsights(baseEntry, simEntry);

  return (
    <div className="pb-12">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">What If? Sandbox</h1>
        <p className="text-[var(--color-text-muted)]">Adjust the sliders below to see how changes to your day directly impact your readiness score.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-3/5 space-y-2">
          <SliderInput label="Study hours" icon={<BookOpen size={18}/>} min={0} max={12} step={0.5} unit="hrs" value={simEntry.study_hours} onChange={v => setSimEntry({...simEntry, study_hours: v})} />
          <SliderInput label="Sleep duration" icon={<Moon size={18}/>} min={0} max={12} step={0.5} unit="hrs" value={simEntry.sleep_hours} onChange={v => setSimEntry({...simEntry, sleep_hours: v})} />
          <SliderInput label="Screen time" icon={<Smartphone size={18}/>} min={0} max={16} step={0.5} unit="hrs" value={simEntry.screen_time} onChange={v => setSimEntry({...simEntry, screen_time: v})} />
          <SliderInput label="Physical activity" icon={<Activity size={18}/>} min={0} max={180} step={5} unit="min" value={simEntry.activity_minutes} onChange={v => setSimEntry({...simEntry, activity_minutes: v})} />
        </div>

        <div className="w-full md:w-2/5">
          <div className="bg-[var(--color-card-bg)] sticky top-8 p-6 rounded-[var(--radius-xl)] shadow-lg border border-[var(--color-border)]">
            <h2 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-6 text-center">Projected Readiness</h2>
            
            <div className="flex justify-center relative mb-8">
               <ReadinessRing score={simScore} size="lg" />
               {diff !== 0 && (
                 <div className={`absolute -right-2 top-0 px-2 py-1 rounded-[var(--radius-md)] text-xs font-bold ${diff > 0 ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#fef3c7] text-[#b45309]'}`}>
                   {diff > 0 ? '+' : ''}{diff} pts
                 </div>
               )}
            </div>

            <div className="space-y-3 border-t border-[var(--color-border)] pt-4">
              {insights.map((insight, i) => (
                <div key={i} className="flex gap-3 text-sm text-[var(--color-text-primary)]">
                  <Lightbulb size={16} className="shrink-0 text-[var(--color-warning-soft)] mt-0.5" />
                  <p className="leading-snug text-[var(--color-text-muted)]">{insight}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-center text-xs text-[var(--color-text-muted)] gap-1 items-center bg-[#f8fafc] p-2 rounded">
              Today's Score: <span className="font-bold text-[var(--color-text-primary)]">{baseScore}</span> <ArrowRight size={12} /> Predicted: <span className="font-bold text-[var(--color-text-primary)]">{simScore}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
