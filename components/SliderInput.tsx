"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

export function SliderInput({ 
  label, icon, min, max, step, unit, value, onChange, helperText 
}: {
  label: string; icon: ReactNode; min: number; max: number; step: number; unit: string; value: number; onChange: (val: number) => void; helperText?: string;
}) {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-[var(--color-card-bg)] rounded-[var(--radius-xl)] shadow-sm border border-[var(--color-border)] mb-4"
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2 text-[var(--color-text-primary)] font-medium">
          <span className="text-[var(--color-primary-accent)]">{icon}</span>
          {label}
        </div>
        <motion.div 
          key={value}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          className="font-bold text-[var(--color-text-primary)]"
        >
          {value} {unit}
        </motion.div>
      </div>

      <div className="relative w-full h-8 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full opacity-0 cursor-pointer h-full z-10"
          aria-label={label}
        />
        
        <div className="w-full h-1 bg-[var(--color-border)] rounded-full relative pointer-events-none">
          <div 
            className="absolute top-0 left-0 h-full rounded-full bg-[var(--color-primary-accent)]"
            style={{ width: `${percent}%` }}
          />
          <div 
            className="absolute top-1/2 -mt-2.5 w-5 h-5 rounded-full bg-[var(--color-primary-accent)] shadow flex items-center justify-center transition-shadow"
            style={{ left: `calc(${percent}% - 10px)` }}
          />
        </div>
      </div>
      
      {helperText && (
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">{helperText}</p>
      )}
    </motion.div>
  );
}
