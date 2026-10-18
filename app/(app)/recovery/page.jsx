'use client';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { needs, TEAM, stageTone } from '@/lib/data';
import { Badge, Owner, PageHead, Empty } from '@/components/ui';

export default function Recovery() {
  const { S, assign, acknowledge } = useStore();
  const rows = S.leads.filter((l) => needs(l).length).sort((a, b) => needs(b).length - needs(a).length);
  return (
    <>
      <PageHead title="Recovery queue" sub="Leads that are unassigned, unacknowledged, overdue or gone quiet. Most flags first." />
      {rows.length ? (
        <div className="grid">
          {rows.map((l) => (
            <div key={l.id} className="card row sp">
              <div>
                <Link href={`/leads/${l.id}`}><b style={{ fontWeight: 500, fontSize: 18 }}>{l.name}</b></Link> <Badge tone={stageTone[l.stage]}>{l.stage}</Badge>
                <div className="muted" style={{ margin: '4px 0 8px' }}>{l.company}</div>
                <div className="row">{needs(l).map((n) => <Badge key={n} tone="warn">{n}</Badge>)}</div>
              </div>
              <div className="row">
                <Owner id={l.owner} />
                <select aria-label={`Assign ${l.name}`} value={l.owner || ''} onChange={(e) => assign(l.id, e.target.value)}><option value="">Unassigned</option>{TEAM.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
                {l.owner && !l.ack && <button className="btn" onClick={() => acknowledge(l.id)}>Acknowledge</button>}
              </div>
            </div>
          ))}
        </div>
      ) : <div className="card"><Empty>Nothing needs attention. Nice work.</Empty></div>}
    </>
  );
}
