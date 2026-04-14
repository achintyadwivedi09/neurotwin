export function getRecommendations(entry: any) {
  const recs = [];
  if (entry.sleep_hours < 6) recs.push({ type: 'rest', icon: 'Moon', message: "Your body thrives on rest. Even 30 more minutes of sleep could lift your energy noticeably." });
  if (entry.screen_time > 8) recs.push({ type: 'screen', icon: 'Smartphone', message: "Your eyes and mind might appreciate a screen break. Try the 20-20-20 rule: every 20 min, look 20 ft away for 20 sec." });
  if (entry.screen_time > 6 && entry.sleep_hours < 7) recs.push({ type: 'rest', icon: 'Bed', message: "Less screen time in the evening could help you drift off sooner — a win for both rest and focus." });
  if (entry.activity_minutes < 20) recs.push({ type: 'activity', icon: 'Activity', message: "A short 15-minute walk can genuinely reset your mood and sharpen your focus." });
  if (entry.focus_level < 4) recs.push({ type: 'focus', icon: 'Target', message: "Low focus days are completely normal. Breaking tasks into 25-minute sprints (Pomodoro) often helps." });
  if (entry.energy_level < 4) recs.push({ type: 'energy', icon: 'Zap', message: "Your energy seems low today. Hydration, a light snack, or a short nap could make a real difference." });
  if (entry.study_hours > 8) recs.push({ type: 'study', icon: 'BookOpen', message: "You've put in a lot of study time! Make sure to balance that with proper breaks to retain more." });
  
  return recs.slice(0, 3); // Max 3
}
