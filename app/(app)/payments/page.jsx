'use client';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { money, fd, payTone } from '@/lib/data';
import { Badge, PageHead } from '@/components/ui';

export default function Payments() {
  const { S } = useStore();
  const sum = (s) => { const o = {}; S.pay.filter((p) => p.status === s).forEach((p) => (o[p.cur] = (o[p.cur] || 0) + p.amt)); return Object.entries(o).map(([c, v]) => money(v, c)).join(' · ') || '—'; };
  const lead = (id) => S.leads.find((l) => l.id === id);
  return (
    <>
      <PageHead title="Payments" sub="Payment requests by lead. Amounts are grouped by currency, never converted." />
      <div className="grid k" style={{ marginBottom: 14 }}>
        {['Paid', 'Pending', 'Failed'].map((s) => <div key={s} className="card"><div className="mono muted">{s}</div><div className="kpi"><div className="v" style={{ fontSize: 34 }}>{sum(s)}</div></div></div>)}
      </div>
      <div className="card tw">
        <table>
          <thead><tr><th>Request</th><th>Lead</th><th>Status</th><th>Due</th><th style={{ textAlign: 'right' }}>Amount</th></tr></thead>
          <tbody>{S.pay.map((p) => (
            <tr key={p.id}>
              <td><b style={{ fontWeight: 500 }}>{p.desc}</b><br /><small className="muted">{p.id}</small></td>
              <td>{lead(p.lead) ? <Link href={`/leads/${p.lead}`} style={{ textDecoration: 'underline' }}>{lead(p.lead).name}</Link> : '—'}</td>
              <td><Badge tone={payTone[p.status]}>{p.status}</Badge></td><td>{fd(p.due)}</td>
              <td style={{ textAlign: 'right' }}>{money(p.amt, p.cur)}</td>
            </tr>))}</tbody>
        </table>
      </div>
    </>
  );
}
