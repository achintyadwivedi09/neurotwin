"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function CustomHabitModal({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: (name: string, type: 'time' | 'score') => void }) {
  const [name, setName] = useState("");
  const [type, setType] = useState<'time' | 'score'>('time');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D3142]/40 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[var(--color-card-bg)] w-full max-w-[400px] rounded-[var(--radius-xl)] p-6 shadow-xl"
          >
            <h2 className="text-xl font-bold mb-4">Add Custom Habit</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Habit Name</label>
              <input 
                type="text" 
                maxLength={30}
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="e.g. Reading, Meditation"
                className="w-full border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 outline-none focus:border-[var(--color-primary-accent)]"
              />
            </div>
            <div className="mb-6 flex gap-2">
              <button 
                onClick={() => setType('time')}
                className={`flex-1 py-2 rounded-[var(--radius-md)] text-sm font-medium border ${type === 'time' ? 'bg-[var(--color-primary-accent)] text-white border-transparent' : 'bg-transparent text-[var(--color-text-primary)] border-[var(--color-border)]'}`}
              >
                Time-based (hrs)
              </button>
              <button 
                onClick={() => setType('score')}
                className={`flex-1 py-2 rounded-[var(--radius-md)] text-sm font-medium border ${type === 'score' ? 'bg-[var(--color-primary-accent)] text-white border-transparent' : 'bg-transparent text-[var(--color-text-primary)] border-[var(--color-border)]'}`}
              >
                Score-based (/ 10)
              </button>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition">Cancel</button>
              <button 
                onClick={() => {
                  if (name.trim()) onSave(name.trim(), type);
                  setName("");
                }}
                disabled={!name.trim()}
                className="px-4 py-2 text-sm font-medium bg-[var(--color-secondary-accent)] text-white rounded-[var(--radius-md)] disabled:opacity-50 transition"
              >
                Save Habit
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
