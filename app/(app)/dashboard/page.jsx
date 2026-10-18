'use client';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { STAGES, CLOSED, NOW, needs, money, fd, rel, integTone } from '@/lib/data';
import { Badge, Kpi, PageHead, Bar, Empty } from '@/components/ui';

export default function Dashboard() {
  const { S, setNewLeadOpen } = useStore();
  const L = S.leads;
  const openOpps = S.opps.filter((o) => !CLOSED.includes(o.stage));
  const won = S.opps.filter((o) => o.stage === 'Won').length;
  const closed = S.opps.filter((o) => CLOSED.includes(o.stage)).length;
  const need = L.filter((l) => needs(l).length);
  const overdue = L.filter((l) => !CLOSED.includes(l.stage) && l.follow && l.follow < NOW).length;
  const out = {};
  S.pay.filter((p) => p.status === 'Pending').forEach((p) => (out[p.cur] = (out[p.cur] || 0) + p.amt));
  const mx = Math.max(...STAGES.map((s) => L.filter((l) => l.stage === s).length));

  return (
    <>
      <PageHead title="Business overview" sub={`Demo workspace · data as of ${fd(NOW)}`}>
        <button className="cta" onClick={() => setNewLeadOpen(true)}>New lead +</button>
      </PageHead>
      <div className="grid k">
        <Kpi href="/leads" label="Total leads" value={L.length} sub="all stages" />
        <Kpi href="/leads" label="New leads" value={L.filter((l) => l.stage === 'New').length} sub="in stage New" />
        <Kpi href="/pipeline" label="Open opportunities" value={openOpps.length} sub={money(openOpps.reduce((a, o) => a + o.value, 0)) + ' open value'} />
        <Kpi href="/pipeline" label="Conversion rate" value={closed ? Math.round((won / closed) * 100) + '%' : '—'} sub={`${won} won of ${closed} closed`} />
        <Kpi href="/recovery" label="Overdue follow-ups" value={overdue} sub="open leads" />
        <Kpi href="/payments" label="Outstanding" value={Object.entries(out).map(([c, v]) => money(v, c)).join(' · ') || '—'} sub="pending, by currency" />
      </div>
      <div className="grid two" style={{ marginTop: 14 }}>
        <section className="card">
          <h2>Needs attention ({need.length})</h2>
          {need.length ? need.slice(0, 5).map((l) => (
            <Link key={l.id} href={`/leads/${l.id}`} style={{ display: 'block', padding: '10px 0', borderTop: '1px solid var(--line)' }}>
              <b style={{ fontWeight: 500 }}>{l.name}</b><br /><small className="muted">{needs(l).join(' · ')}</small>
            </Link>
          )) : <Empty>Nothing needs attention.</Empty>}
          <p style={{ marginBottom: 0 }}><Link className="btn s" href="/recovery">Open recovery queue</Link></p>
        </section>
        <section className="card">
          <h2>Leads by stage</h2>
          {STAGES.map((s, i) => {
            const n = L.filter((l) => l.stage === s);
            return (
              <div key={s} style={{ margin: '12px 0' }}>
                <div className="row sp" style={{ marginBottom: 6 }}><span>{s} · {n.length}</span><span className="muted">{money(n.reduce((a, l) => a + l.value, 0))}</span></div>
                <Bar pct={(n.length / mx) * 100} delay={i * 0.07} />
              </div>
            );
          })}
        </section>
        <section className="card">
          <h2>Recent activity</h2>
          <ul className="tl">
            {S.acts.slice(0, 6).map((a) => {
              const l = S.leads.find((x) => x.id === a.lead);
              return <li key={a.id}><b style={{ fontWeight: 500 }}>{a.type}</b> · {a.text}<br /><small className="muted">{l && <Link href={`/leads/${l.id}`} style={{ textDecoration: 'underline' }}>{l.name}</Link>} · {a.who} · {rel(a.at)}</small></li>;
            })}
          </ul>
        </section>
        <section className="card">
          <h2>Integration health</h2>
          {S.integ.map((i) => <div key={i.id} className="row sp" style={{ padding: '8px 0' }}><span>{i.name}</span><Badge tone={integTone(i.status)}>{i.status}</Badge></div>)}
          <p style={{ marginBottom: 0 }}><Link className="btn s" href="/integrations">Review integrations</Link></p>
        </section>
      </div>
    </>
  );
}
