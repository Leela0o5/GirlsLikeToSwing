import { Link, useNavigate } from 'react-router-dom';
import type { KpiMetric } from '@/types';
import { getMaintenanceActions, getTechnicians, getVehicleSync, inspectionsStore, serviceAlertsStore, ticketsStore } from '@/services';
import { useAsync } from '@/hooks/useAsync';
import { useInitialLoading, useStore } from '@/hooks/useStore';
import { Card, CardHeader } from '@/components/ui/card';
import { EmptyState } from '@/components/common/StateViews';
import { PageSkeleton } from '@/components/common/PageSkeleton';
import { SectionLink } from '@/components/common/SectionLink';
import { DataTable } from '@/components/common/DataTable';
import { KpiStrip, RecommendationsPanel } from '@/components/dashboard';
import { AlertList } from '@/components/battery';
import { AlertActions } from '@/components/service/AlertActions';
import { InspectionActions } from '@/components/service/InspectionActions';
import { InspectionStatusBadge, PRIORITY_ORDER, PriorityBadge } from '@/components/service/TicketBadges';
import { TechnicianWorkload, TicketPipeline } from '@/components/service/WorkloadCharts';
import { ticketColumns } from '@/components/service/ticketColumns';
import { SERVICE_ROUTES } from '@/constants/routes';
import { formatDate, vehicleName } from '@/utils/format';

export function ServiceDashboardPage() {
  const navigate = useNavigate();
  const tickets = useStore(ticketsStore);
  const inspections = useStore(inspectionsStore);
  const alerts = useStore(serviceAlertsStore);
  const loading = useInitialLoading(450);
  const { data: actions } = useAsync(getMaintenanceActions, []);

  if (loading) return <PageSkeleton />;

  const open = tickets.filter((t) => t.status !== 'Completed').sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  const needInspection = inspections.filter((i) => i.status !== 'Passed').sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  const activeAlerts = alerts.filter((a) => !a.acknowledged);
  const critical = activeAlerts.filter((a) => a.severity === 'critical').length;
  const completed = tickets.filter((t) => t.status === 'Completed').length + inspections.filter((i) => i.status === 'Passed').length;

  const kpis: KpiMetric[] = [
    { id: 'open', label: 'Open service tickets', value: String(open.length), icon: 'tickets', delta: `${open.filter((t) => t.priority === 'Critical' || t.priority === 'High').length} high priority`, trend: 'flat', tone: 'neutral' },
    { id: 'insp', label: 'Inspections pending', value: String(needInspection.length), icon: 'inspection', delta: `${needInspection.filter((i) => i.status === 'Due').length} not yet scheduled`, trend: 'flat', tone: 'warning' },
    { id: 'alerts', label: 'Active battery alerts', value: String(activeAlerts.length), icon: 'alert', delta: `${critical} critical`, trend: critical ? 'up' : 'flat', tone: critical ? 'critical' : 'neutral' },
    { id: 'done', label: 'Completed this week', value: String(completed), icon: 'completed', delta: 'Tickets + inspections', trend: 'up', tone: 'positive' },
  ];

  return (
    <>
      <h1 className="sr-only">Service centre dashboard</h1>
      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(340px,400px)]">
        <div className="@container min-w-0 space-y-5">
          <KpiStrip metrics={kpis} />

          <Card className="p-0 sm:p-0" aria-labelledby="assigned-title">
            <div className="p-5 pb-3 sm:p-6 sm:pb-3">
              <CardHeader
                titleId="assigned-title"
                title="Assigned Service Requests"
                subtitle="Open tickets by priority · change status inline"
                action={<SectionLink to={SERVICE_ROUTES.tickets}>All tickets</SectionLink>}
                className="mb-0"
              />
            </div>
            <DataTable
              rows={open.slice(0, 6)}
              columns={ticketColumns({ editableStatus: true, compact: true })}
              getRowId={(t) => t.id}
              caption="Open service tickets"
              onRowClick={(t) => navigate(SERVICE_ROUTES.ticket(t.id))}
              empty={<EmptyState title="No open tickets" description="All caught up." />}
              minWidth={640}
            />
          </Card>

          <div className="grid grid-cols-1 gap-5 @3xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <Card aria-labelledby="insp-title">
              <CardHeader titleId="insp-title" title="Vehicles Requiring Inspection" subtitle={`${needInspection.length} pending`} action={<SectionLink to={SERVICE_ROUTES.inspections}>Manage</SectionLink>} />
              {needInspection.length === 0 ? (
                <EmptyState title="No inspections pending" />
              ) : (
                <ul className="divide-y divide-line">
                  {needInspection.slice(0, 5).map((i) => {
                    const v = getVehicleSync(i.vehicleId);
                    return (
                      <li key={i.id} className="flex flex-wrap items-center gap-3 py-3">
                        <div className="min-w-0 flex-1">
                          <Link to={SERVICE_ROUTES.vehicle(i.vehicleId)} className="text-sm font-semibold text-ink hover:text-primary">
                            {v ? vehicleName(v) : i.vehicleId}
                          </Link>
                          <p className="text-xs text-muted">
                            {i.reason} · due {formatDate(i.dueDate)}
                            {i.bay && <> · {i.bay}</>}
                          </p>
                        </div>
                        <PriorityBadge priority={i.priority} />
                        <InspectionStatusBadge status={i.status} />
                        <InspectionActions inspection={i} />
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>
            <Card aria-labelledby="pipeline-title">
              <CardHeader titleId="pipeline-title" title="Ticket Pipeline" subtitle={`${tickets.length} tickets total`} />
              <TicketPipeline tickets={tickets} />
              <h3 className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wider text-muted">Technician workload</h3>
              <TechnicianWorkload tickets={tickets} technicians={getTechnicians()} />
            </Card>
          </div>
        </div>

        <aside className="grid min-w-0 grid-cols-1 items-start gap-5 md:grid-cols-2 xl:grid-cols-1" aria-label="Alerts and recommendations">
          <Card aria-labelledby="salerts-title">
            <CardHeader titleId="salerts-title" title="Reported Battery Alerts" subtitle={`${activeAlerts.length} need attention`} action={<SectionLink to={SERVICE_ROUTES.alerts}>View all</SectionLink>} />
            <AlertList alerts={activeAlerts.slice(0, 3)} showVehicle compact actions={(a) => <AlertActions alert={a} />} />
          </Card>
          {actions && (
            <RecommendationsPanel
              recommendations={actions}
              title="Recommended Maintenance"
              subtitle="Rule-based suggestions (demo)"
              badgeLabel="Demo"
              actionLink={{ to: SERVICE_ROUTES.inspections, label: 'Go to Inspections' }}
            />
          )}
        </aside>
      </div>
    </>
  );
}
