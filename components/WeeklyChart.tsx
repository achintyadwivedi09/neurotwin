"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

export function WeeklyChart({ data, type = 'bar' }: { data: any[], type?: 'bar' | 'line' }) {
  if (!data || data.length === 0) return <div className="h-full flex items-center justify-center text-[var(--color-text-muted)]">No data yet</div>;
  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-muted)', fontSize: 12}} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-muted)', fontSize: 12}} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
            cursor={{ stroke: 'var(--color-border)', strokeWidth: 1 }}
          />
          <Line type="monotone" dataKey="energy" stroke="var(--color-secondary-accent)" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
          <Line type="monotone" dataKey="focus" stroke="var(--color-tertiary-accent)" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={16}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-muted)', fontSize: 12}} />
        <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-muted)', fontSize: 12}} />
        <Tooltip 
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
          cursor={{ fill: 'var(--color-page-bg)' }}
        />
        <Bar dataKey="study" stackId="a" fill="var(--color-primary-accent)" />
        <Bar dataKey="sleep" stackId="a" fill="var(--color-secondary-accent)"  />
        <Bar dataKey="screen" stackId="a" fill="var(--color-warning-soft)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
