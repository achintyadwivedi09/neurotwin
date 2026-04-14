export function calcReadiness(entry: any): number {
  if (!entry) return 0;
  const sleep_hours = Number(entry.sleep_hours) || 0;
  const activity_minutes = Number(entry.activity_minutes) || 0;
  const focus_level = Number(entry.focus_level) || 0;
  const energy_level = Number(entry.energy_level) || 0;
  const screen_time = Number(entry.screen_time) || 0;
  const study_hours = Number(entry.study_hours) || 0;

  const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

  const sleepScore = clamp(sleep_hours / 8, 0, 1) * 30;
  const activityScore = clamp(activity_minutes / 30, 0, 1) * 20;
  const focusScore = (focus_level / 10) * 20;
  const energyScore = (energy_level / 10) * 15;
  const screenPenalty = clamp((screen_time - 4) * 2, 0, 15);
  const studyScore = clamp(study_hours / 6, 0, 1) * 15;

  return Math.round(Math.max(0, sleepScore + activityScore + focusScore + energyScore + studyScore - screenPenalty));
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return "You're in a great rhythm today";
  if (score >= 60) return "A balanced day — keep it up";
  if (score >= 40) return "A small adjustment could help you feel better";
  return "Rest and recharge — tomorrow is a fresh start";
}

export function calcPredictedInsights(before: any, after: any): string[] {
  const insights: string[] = [];
  if (after.screen_time < before.screen_time) {
    insights.push(`Reducing screen time by ${before.screen_time - after.screen_time} hrs frees up mental bandwidth and helps you sleep faster.`);
  } else if (after.screen_time > before.screen_time) {
    insights.push(`Increasing screen time may drain your energy sooner.`);
  }

  if (after.activity_minutes > before.activity_minutes) {
    insights.push(`Adding ${after.activity_minutes - before.activity_minutes} min of activity could noticeably raise your energy and focus scores.`);
  }
  
  if (after.sleep_hours > before.sleep_hours) {
    insights.push(`Extra sleep builds your core readiness base faster than any other metric.`);
  } else if (after.sleep_hours < before.sleep_hours) {
    insights.push(`Less sleep sharply impacts your cognitive readiness. Over-study does not compensate for lost sleep.`);
  }

  if (insights.length === 0) insights.push("Adjust sliders to see potential impacts.");
  return insights;
}
