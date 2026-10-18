'use client';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { fd, ft } from '@/lib/data';
import { Badge, Owner, PageHead } from '@/components/ui';

export default function Calendar() {
  const { S } = useStore();
  const A = [...S.appts].sort((a, b) => a.start - b.start);
  const tone = { Scheduled: 'info', Completed: 'ok', Cancelled: 'mut' };
  return (
    <>
      <PageHead title="Calendar" sub="Agenda view. Google Calendar sync is currently disconnected." />
      <div className="grid">
        {A.map((a) => {
          const l = S.leads.find((x) => x.id === a.lead);
          return (
            <div key={a.id} className="card row sp">
              <div className="row" style={{ gap: 24 }}>
                <div style={{ minWidth: 86 }}><div style={{ fontSize: 34, letterSpacing: '-.05em', lineHeight: 1 }}>{fd(a.start)}</div><div className="muted">{ft(a.start)}–{ft(a.end)}</div></div>
                <div><b style={{ fontWeight: 500, fontSize: 18 }}>{a.title}</b><br />{l && <Link href={`/leads/${l.id}`} className="muted" style={{ textDecoration: 'underline' }}>{l.name}</Link>}</div>
              </div>
              <div className="row"><Owner id={a.owner} /><Badge tone={tone[a.status]}>{a.status}</Badge></div>
            </div>
          );
        })}
      </div>
    </>
  );
}
