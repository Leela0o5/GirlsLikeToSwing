import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ClipboardPlus, Loader2 } from 'lucide-react';
import type { BatteryAlert } from '@/types';
import { acknowledgeServiceAlert, createTicketFromAlert, ticketsStore } from '@/services';
import { Button } from '@/components/ui/button';
import { SERVICE_ROUTES } from '@/constants/routes';

export function AlertActions({ alert }: { alert: BatteryAlert }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState<'ack' | 'ticket' | null>(null);
  const existing = ticketsStore.get().find((t) => t.alertIds.includes(alert.id));

  const ack = async () => {
    setBusy('ack');
    await acknowledgeServiceAlert(alert.id);
    setBusy(null);
  };
  const createTicket = async () => {
    setBusy('ticket');
    const id = await createTicketFromAlert(alert.id);
    navigate(SERVICE_ROUTES.ticket(id));
  };

  return (
    <>
      {existing ? (
        <Button variant="outline" size="sm" onClick={() => navigate(SERVICE_ROUTES.ticket(existing.id))}>
          Open {existing.id}
        </Button>
      ) : (
        <Button variant="soft" size="sm" onClick={createTicket} disabled={busy !== null}>
          {busy === 'ticket' ? <Loader2 className="animate-spin" /> : <ClipboardPlus />} Create ticket
        </Button>
      )}
      {!alert.acknowledged && (
        <Button variant="ghost" size="sm" onClick={ack} disabled={busy !== null}>
          {busy === 'ack' ? <Loader2 className="animate-spin" /> : <Check />} Acknowledge
        </Button>
      )}
    </>
  );
}
