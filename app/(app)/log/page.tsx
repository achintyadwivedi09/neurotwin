"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { SliderInput } from "@/components/SliderInput";
import { CustomHabitModal } from "@/components/CustomHabitModal";
import { useRouter } from "next/navigation";
import { BookOpen, Moon, Smartphone, Activity, GraduationCap, Target, Zap, Plus, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function LogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Base metrics
  const [study, setStudy] = useState(0);
  const [sleep, setSleep] = useState(0);
  const [screen, setScreen] = useState(0);
  const [activity, setActivity] = useState(0);
  const [college, setCollege] = useState(0);
  const [focus, setFocus] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [notes, setNotes] = useState("");
  
  // Custom Habits
  const [customHabits, setCustomHabits] = useState<any[]>([]);
  const [habitValues, setHabitValues] = useState<Record<string, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [date]);

  const loadData = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    setUserId(session.user.id);

    const { data: entry } = await supabase.from('daily_entries').select('*').eq('user_id', session.user.id).eq('date', date).single();
    if (entry) {
      setStudy(entry.study_hours);
      setSleep(entry.sleep_hours);
      setScreen(entry.screen_time);
      setActivity(entry.activity_minutes);
      setCollege(entry.college_hours);
      setFocus(entry.focus_level);
      setEnergy(entry.energy_level);
      setNotes(entry.notes || "");
      setIsUpdate(true);
    } else {
      setStudy(0); setSleep(0); setScreen(0); setActivity(0); setCollege(0); setFocus(5); setEnergy(5); setNotes("");
      setIsUpdate(false);
    }

    const { data: habits } = await supabase.from('custom_habits').select('*').eq('user_id', session.user.id);
    setCustomHabits(habits || []);

    const { data: logs } = await supabase.from('custom_habit_logs').select('*').eq('user_id', session.user.id).eq('date', date);
    const values: Record<string, number> = {};
    logs?.forEach((l: any) => values[l.habit_id] = l.value);
    setHabitValues(values);
    
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const entryData = {
      user_id: userId,
      date,
      study_hours: study,
      sleep_hours: sleep,
      screen_time: screen,
      activity_minutes: activity,
      college_hours: college,
      focus_level: focus,
      energy_level: energy,
      notes
    };

    if (isUpdate) {
      await supabase.from('daily_entries').update(entryData).eq('user_id', userId).eq('date', date);
    } else {
      await supabase.from('daily_entries').insert(entryData);
    }

    for (const habit of customHabits) {
      if (habitValues[habit.id] !== undefined) {
        await supabase.from('custom_habit_logs').upsert({
          habit_id: habit.id,
          user_id: userId,
          date,
          value: habitValues[habit.id]
        }, { onConflict: 'habit_id,date' });
      }
    }

    setShowConfetti(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  const addCustomHabit = async (name: string, type: 'time' | 'score') => {
    const { data } = await supabase.from('custom_habits').insert({ user_id: userId, name, habit_type: type }).select().single();
    if (data) {
      setCustomHabits([...customHabits, data]);
      setHabitValues({...habitValues, [data.id]: type === 'time' ? 0 : 1});
    }
    setIsModalOpen(false);
  };

  if (loading) return <div className="animate-pulse h-64 bg-[var(--color-border)] rounded-[var(--radius-xl)] opacity-50 m-4 max-w-xl mx-auto"></div>;

  return (
    <div className="relative pb-12">
      {showConfetti && (
        <motion.div initial={{scale:0}} animate={{scale:30, opacity:0}} transition={{duration:1}} className="fixed inset-0 m-auto w-10 h-10 bg-[var(--color-secondary-accent)] rounded-full z-50 pointer-events-none" />
      )}
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">How's your day going?</h1>
        <p className="text-[var(--color-text-muted)]">Take a moment to log your day. No judgment here.</p>
        <div className="mt-4 flex items-center gap-2">
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-1.5 text-sm bg-[var(--color-card-bg)] shadow-sm outline-none" />
          {isUpdate && <span className="text-xs font-medium text-[var(--color-primary-accent)] bg-[#f0f9ff] px-2 py-1 rounded-[var(--radius-md)]">Entry exists</span>}
        </div>
      </div>

      <div className="max-w-xl space-y-2">
        <SliderInput label="Study hours" icon={<BookOpen size={18}/>} min={0} max={12} step={0.5} unit="hrs" value={study} onChange={setStudy} helperText="Time spent on academics, assignments, or self-study" />
        <SliderInput label="Sleep duration" icon={<Moon size={18}/>} min={0} max={12} step={0.5} unit="hrs" value={sleep} onChange={setSleep} helperText="How many hours did you sleep last night?" />
        <SliderInput label="Screen time" icon={<Smartphone size={18}/>} min={0} max={16} step={0.5} unit="hrs" value={screen} onChange={setScreen} helperText="Phone, laptop, TV — all screens combined" />
        <SliderInput label="Physical activity" icon={<Activity size={18}/>} min={0} max={180} step={5} unit="min" value={activity} onChange={setActivity} helperText="Walk, gym, sports, yoga — any movement counts" />
        <SliderInput label="College / School" icon={<GraduationCap size={18}/>} min={0} max={10} step={0.5} unit="hrs" value={college} onChange={setCollege} helperText="Time spent in classes, labs, or on campus" />
        <SliderInput label="Focus level" icon={<Target size={18}/>} min={1} max={10} step={1} unit="/ 10" value={focus} onChange={setFocus} helperText="How focused did you feel today? Be honest with yourself." />
        <SliderInput label="Energy level" icon={<Zap size={18}/>} min={1} max={10} step={1} unit="/ 10" value={energy} onChange={setEnergy} helperText="Your overall energy from morning to now" />
      </div>

      <div className="max-w-xl mt-8">
        <h2 className="text-lg font-bold mb-4 font-inter text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2 flex justify-between items-center">
          Your custom habits
          <button onClick={()=>setIsModalOpen(true)} className="text-sm font-medium text-[var(--color-primary-accent)] flex items-center gap-1 hover:underline">
            <Plus size={16}/> Add Habit
          </button>
        </h2>
        {customHabits.length === 0 && (
           <p className="text-sm text-[var(--color-text-muted)] mb-4 text-center p-4 bg-[var(--color-card-bg)] rounded-[var(--radius-xl)] border border-[var(--color-border)] border-dashed">No custom habits yet. Track reading, meditation, water intake, etc.</p>
        )}
        <div className="space-y-2">
          {customHabits.map(h => (
            <SliderInput 
              key={h.id} 
              label={h.name} 
              icon={<Info size={18}/>} 
              min={h.habit_type==='score'?1:0} 
              max={h.habit_type==='score'?10:8} 
              step={h.habit_type==='score'?1:0.5} 
              unit={h.habit_type==='score'?"/ 10":"hrs"} 
              value={habitValues[h.id] || (h.habit_type==='score'?1:0)} 
              onChange={val => setHabitValues({...habitValues, [h.id]: val})} 
            />
          ))}
        </div>
      </div>

      <div className="max-w-xl mt-8">
        <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Anything else on your mind today? (optional)</label>
        <textarea 
          maxLength={300}
          value={notes} 
          onChange={e=>setNotes(e.target.value)} 
          className="w-full h-24 border border-[var(--color-border)] rounded-[var(--radius-xl)] p-3 outline-none shadow-sm focus:border-[var(--color-primary-accent)] bg-[var(--color-card-bg)] resize-none"
          placeholder="I felt really anxious before the exam, but the afternoon walk helped..."
        />
      </div>

      <div className="max-w-xl mt-8 mb-8 relative">
        {(sleep === 0 || study === 0 || screen === 0) && (
          <div className="mb-4 text-sm text-[var(--color-warning-soft)] bg-amber-50 p-3 rounded-[var(--radius-md)] flex gap-2 items-center border border-amber-100">
            <Info size={18} className="shrink-0"/> <span>Leaving sliders at 0? Just double check before saving.</span>
          </div>
        )}
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="w-full bg-[var(--color-primary-accent)] text-white font-medium py-3 rounded-[var(--radius-xl)] shadow transition hover:opacity-90 disabled:opacity-50"
        >
          {saving ? 'Saving...' : isUpdate ? "Update today's check-in" : "Save today's check-in"}
        </button>
      </div>

      <CustomHabitModal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} onSave={addCustomHabit} />
    </div>
  );
}
