'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { rel } from '@/lib/data';
import { PageHead } from '@/components/ui';

export default function Activities() {
  const { S } = useStore();
  const [t, setT] = useState('');
  const types = [...new Set(S.acts.map((a) => a.type))];
  const rows = S.acts.filter((a) => !t || a.type === t).slice(0, 40);
  return (
    <>
      <PageHead title="Activities" sub="Everything logged across leads, newest first." />
      <div className="bar"><select value={t} onChange={(e) => setT(e.target.value)} aria-label="Type"><option value="">All types</option>{types.map((x) => <option key={x}>{x}</option>)}</select></div>
      <div className="card">
        <ul className="tl">{rows.map((a) => { const l = S.leads.find((x) => x.id === a.lead); return <li key={a.id}><b style={{ fontWeight: 500 }}>{a.type}</b> · {a.text}<br /><small className="muted">{l && <Link href={`/leads/${l.id}`} style={{ textDecoration: 'underline' }}>{l.name}</Link>} · {a.who} · {rel(a.at)}</small></li>; })}</ul>
      </div>
    </>
  );
}
