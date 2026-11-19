import type { Priority, RiskLevel, Tone } from '@/types';

export const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export const formatNumber = (n: number) => new Intl.NumberFormat('en-US').format(n);

export const formatDate = (iso: string) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

export const vehicleName = (v: { year: number; make: string; model: string }) => `${v.year} ${v.make} ${v.model}`;

export function sohTone(soh: number): Tone {
  if (soh >= 88) return 'positive';
  if (soh >= 80) return 'warning';
  return 'critical';
}

export function riskTone(risk: RiskLevel): Tone {
  if (risk === 'Low') return 'positive';
  return risk === 'Moderate' ? 'warning' : 'critical';
}

export function priorityTone(p: Priority): Tone {
  if (p === 'High') return 'critical';
  return p === 'Medium' ? 'warning' : 'neutral';
}
