'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useStore } from '@/lib/store';
import { STAGES, PRIORITIES, CLOSED, NOW, money, fd, stageTone } from '@/lib/data';
import { Badge, Owner, PageHead, Empty } from '@/components/ui';

const PS = 8;
export default function Leads() {
  const { S, setNewLeadOpen } = useStore();
  const [q, setQ] = useState(''); const [stage, setStage] = useState(''); const [pri, setPri] = useState(''); const [sort, setSort] = useState('created'); const [pg, setPg] = useState(1);
  const rows = useMemo(() => {
    const k = { created: (a, b) => b.created - a.created, name: (a, b) => a.name.localeCompare(b.name), value: (a, b) => b.value - a.value };
    return S.leads.filter((l) => (!q || (l.name + l.company).toLowerCase().includes(q.toLowerCase())) && (!stage || l.stage === stage) && (!pri || l.priority === pri)).sort(k[sort]);
  }, [S.leads, q, stage, pri, sort]);
  const pages = Math.max(1, Math.ceil(rows.length / PS)); const cur = Math.min(pg, pages);
  const view = rows.slice((cur - 1) * PS, cur * PS);
  const set = (fn) => (e) => { fn(e.target.value); setPg(1); };

  return (
    <>
      <PageHead title="Leads" sub="Assignment, acknowledgement and follow-up are tracked separately from the pipeline stage.">
        <button className="cta" onClick={() => setNewLeadOpen(true)}>New lead +</button>
      </PageHead>
      <div className="bar">
        <input placeholder="Search name or company" value={q} onChange={set(setQ)} aria-label="Search leads" />
        <select value={stage} onChange={set(setStage)} aria-label="Stage"><option value="">All stages</option>{STAGES.map((s) => <option key={s}>{s}</option>)}</select>
        <select value={pri} onChange={set(setPri)} aria-label="Priority"><option value="">All priorities</option>{PRIORITIES.map((s) => <option key={s}>{s}</option>)}</select>
        <select value={sort} onChange={set(setSort)} aria-label="Sort"><option value="created">Newest</option><option value="name">Name</option><option value="value">Value</option></select>
      </div>
      <div className="card tw">
        {view.length ? (
          <table>
            <thead><tr><th>Lead</th><th>Stage</th><th>Priority</th><th>Owner</th><th>Follow-up</th><th style={{ textAlign: 'right' }}>Value</th></tr></thead>
            <tbody>
              {view.map((l) => {
                const od = l.follow && l.follow < NOW && !CLOSED.includes(l.stage);
                return (
                  <tr key={l.id} className={od ? 'hl' : ''}>
                    <td><Link href={`/leads/${l.id}`}><b style={{ fontWeight: 500 }}>{l.name}</b><br /><small className="muted">{l.company}</small></Link></td>
                    <td><Badge tone={stageTone[l.stage]}>{l.stage}</Badge></td>
                    <td>{l.priority}</td>
                    <td><Owner id={l.owner} /></td>
                    <td>{!l.follow ? <span className="muted">—</span> : od ? <Badge tone="err">Overdue · {fd(l.follow)}</Badge> : fd(l.follow)}</td>
                    <td style={{ textAlign: 'right' }}>{money(l.value)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : <Empty>No leads match these filters.</Empty>}
      </div>
      <div className="row" style={{ justifyContent: 'flex-end', marginTop: 14 }}>
        <span className="muted">Page {cur} of {pages}</span>
        <button className="btn s" disabled={cur <= 1} onClick={() => setPg(cur - 1)}>Prev</button>
        <button className="btn s" disabled={cur >= pages} onClick={() => setPg(cur + 1)}>Next</button>
      </div>
    </>
  );
}
