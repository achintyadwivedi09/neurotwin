"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function ReadinessRing({ score, size = 'lg' }: { score: number, size?: 'sm' | 'lg' }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const radius = size === 'lg' ? 60 : 30;
  const strokeWidth = size === 'lg' ? 12 : 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const color = score >= 80 ? 'var(--color-secondary-accent)' : score >= 40 ? 'var(--color-primary-accent)' : 'var(--color-warning-soft)';

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={radius * 2 + strokeWidth * 2}
        height={radius * 2 + strokeWidth * 2}
        className="transform -rotate-90"
      >
        <circle
          stroke="var(--color-border)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
        />
        {mounted && (
          <motion.circle
            stroke={color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            r={radius}
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
          />
        )}
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className={`font-bold ${size === 'lg' ? 'text-4xl' : 'text-xl'}`} style={{ color: "var(--color-text-primary)" }}>{mounted ? score : 0}</span>
        {size === 'lg' && (
          <span className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>Readiness</span>
        )}
      </div>
    </div>
  );
}
