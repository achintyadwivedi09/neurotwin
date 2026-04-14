"use client";
import * as Icons from "lucide-react";

export function RecommendationCard({ icon, message, type }: { icon: string; message: string; type: string }) {
  const IconComponent = (Icons as any)[icon] || Icons.AlertCircle;
  let bg = "bg-[#f0f9ff]"; 
  let iconColor = "text-[#0369a1]";
  
  if (type === 'activity') { bg = "bg-[#f0fdf4]"; iconColor = "text-[#15803d]"; }
  if (type === 'rest') { bg = "bg-[#eef2ff]"; iconColor = "text-[#4338ca]"; }
  if (type === 'screen') { bg = "bg-[#fff7ed]"; iconColor = "text-[#c2410c]"; }
  if (type === 'study' || type === 'focus') { bg = "bg-[#f0f9ff]"; iconColor = "text-[#0369a1]"; }
  if (type === 'energy') { bg = "bg-[#fefce8]"; iconColor = "text-[#a16207]"; }

  return (
    <div className={`p-4 rounded-[var(--radius-xl)] flex gap-3 ${bg} border border-[var(--color-border)]`}>
      <div className={`shrink-0 ${iconColor}`}>
        <IconComponent size={24} />
      </div>
      <p className="text-sm text-[var(--color-text-primary)] font-medium leading-relaxed">
        {message}
      </p>
    </div>
  );
}
