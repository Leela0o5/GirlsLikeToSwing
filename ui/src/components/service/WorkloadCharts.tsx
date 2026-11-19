import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ServiceTicket, TicketStatus } from '@/types';
import { CHART_COLORS } from '@/utils/chart';
import { cn } from '@/utils/cn';
import { TICKET_STATUSES } from './TicketBadges';

const pipelineColor: Record<TicketStatus, string> = {
  Open: 'bg-[#A9B2AA]',
  'In Progress': 'bg-secondary',
  'Awaiting Parts': 'bg-warn',
  Completed: 'bg-primary',
};

export function TicketPipeline({ tickets }: { tickets: ServiceTicket[] }) {
  const total = tickets.length || 1;
  const counts = TICKET_STATUSES.map((s) => ({ status: s, n: tickets.filter((t) => t.status === s).length }));
  return (
    <div>
      <div className="flex h-3 gap-0.5 overflow-hidden rounded-full" role="img" aria-label={counts.map((c) => `${c.status}: ${c.n}`).join(', ')}>
        {counts.map((c) => (c.n > 0 ? <span key={c.status} className={cn('h-full', pipelineColor[c.status])} style={{ width: `${(c.n / total) * 100}%` }} /> : null))}
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-2 text-xs">
        {counts.map((c) => (
          <li key={c.status} className="flex items-center gap-2 text-muted">
            <span className={cn('size-2.5 rounded-sm', pipelineColor[c.status])} aria-hidden="true" />
            {c.status}
            <span className="ml-auto font-semibold text-ink">{c.n}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TechnicianWorkload({ tickets, technicians }: { tickets: ServiceTicket[]; technicians: string[] }) {
  const data = technicians.map((name) => ({ name, open: tickets.filter((t) => t.assignedTo === name && t.status !== 'Completed').length }));
  return (
    <div className="h-[170px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }} barCategoryGap="30%">
          <CartesianGrid stroke={CHART_COLORS.grid} horizontal={false} />
          <XAxis type="number" allowDecimals={false} tick={{ fill: CHART_COLORS.axis, fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="name" tick={{ fill: CHART_COLORS.axis, fontSize: 11 }} tickLine={false} axisLine={false} width={72} />
          <Tooltip cursor={{ fill: 'rgba(35,134,90,0.06)' }} formatter={(n) => [String(n), 'Open tickets']} contentStyle={{ borderRadius: 12, border: '1px solid #E7EBE7', fontSize: 12 }} />
          <Bar dataKey="open" fill={CHART_COLORS.actual} radius={[0, 4, 4, 0]} isAnimationActive={false} label={{ position: 'right', fill: '#202820', fontSize: 11 }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
