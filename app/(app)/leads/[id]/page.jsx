'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { STAGES, TEAM, needs, money, fd, rel, stageTone, payTone } from '@/lib/data';
import { Badge, Owner, PageHead, Empty } from '@/components/ui';

export default function LeadDetail() {
  const { id } = useParams();
  const { S, setStage, assign, acknowledge, note, follow } = useStore();
  const [text, setText] = useState('');
  const l = S.leads.find((x) => x.id === id);
  if (!l) return <div className="card"><Empty>Lead not found. <br /><Link className="btn" href="/leads">Back to leads</Link></Empty></div>;
  const acts = S.acts.filter((a) => a.lead === id);
  const pays = S.pay.filter((p) => p.lead === id);
  const flags = needs(l);

  return (
    <>
      <PageHead title={l.name} sub={`${l.company} · ${l.email} · from ${l.source}`}>
        <Link href="/leads" className="btn">All leads</Link>
      </PageHead>
      {flags.length > 0 && <div className="note" style={{ background: 'var(--wnb)', color: 'var(--wn)' }}>{flags.join(' · ')}</div>}
      <div className="grid two">
        <section className="card">
          <h2>Details</h2>
          <div className="grid" style={{ gap: 14 }}>
            <div className="row sp"><span className="muted">Stage</span>
              <select value={l.stage} onChange={(e) => setStage(l.id, e.target.value)} aria-label="Stage">{STAGES.map((s) => <option key={s}>{s}</option>)}</select></div>
            <div className="row sp"><span className="muted">Owner</span>
              <select value={l.owner || ''} onChange={(e) => assign(l.id, e.target.value)} aria-label="Owner"><option value="">Unassigned</option>{TEAM.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
            <div className="row sp"><span className="muted">Acknowledged</span>
              {l.ack ? <Badge tone="ok">Acknowledged</Badge> : l.owner ? <button className="btn s" onClick={() => acknowledge(l.id)}>Acknowledge</button> : <Badge tone="err">Not assigned</Badge>}</div>
            <div className="row sp"><span className="muted">Follow-up</span>
              <input type="date" aria-label="Follow-up date" defaultValue={l.follow ? l.follow.toISOString().slice(0, 10) : ''} onChange={(e) => e.target.value && follow(l.id, e.target.value)} /></div>
            <div className="row sp"><span className="muted">Priority</span><span>{l.priority}</span></div>
            <div className="row sp"><span className="muted">Value</span><b style={{ fontWeight: 500 }}>{money(l.value)}</b></div>
            <div className="row sp"><span className="muted">Created</span><span>{fd(l.created)}</span></div>
          </div>
        </section>
        <section className="card">
          <h2>Add a note</h2>
          <form className="row" onSubmit={(e) => { e.preventDefault(); if (text.trim()) { note(l.id, text.trim()); setText(''); } }}>
            <input style={{ flex: 1, minWidth: 200 }} value={text} onChange={(e) => setText(e.target.value)} placeholder="What happened?" aria-label="Note" />
            <button className="btn">Add</button>
          </form>
          <h2 style={{ marginTop: 26 }}>Payments</h2>
          {pays.length ? pays.map((p) => <div key={p.id} className="row sp" style={{ padding: '8px 0', borderTop: '1px solid var(--line)' }}><span>{p.desc}<br /><small className="muted">{p.id} · due {fd(p.due)}</small></span><span style={{ textAlign: 'right' }}>{money(p.amt, p.cur)}<br /><Badge tone={payTone[p.status]}>{p.status}</Badge></span></div>) : <p className="muted">No payments yet.</p>}
        </section>
        <section className="card" style={{ gridColumn: '1/-1' }}>
          <h2>Activity</h2>
          <ul className="tl">{acts.map((a) => <li key={a.id}><b style={{ fontWeight: 500 }}>{a.type}</b> · {a.text}<br /><small className="muted">{a.who} · {rel(a.at)}</small></li>)}</ul>
        </section>
      </div>
    </>
  );
}
