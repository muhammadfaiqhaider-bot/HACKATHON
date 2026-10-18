'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { PageHead, Owner, Empty } from '@/components/ui';

export default function Contacts() {
  const { S } = useStore();
  const [q, setQ] = useState('');
  const co = (id) => (S.companies.find((c) => c.id === id) || {}).name || '—';
  const rows = S.contacts.filter((c) => (c.first + ' ' + c.last + c.email + co(c.company)).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHead title="Contacts" sub="People linked to their company and lead records." />
      <div className="bar"><input placeholder="Search contacts" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search contacts" /></div>
      <div className="card tw">
        {rows.length ? (
          <table>
            <thead><tr><th>Name</th><th>Company</th><th>Email</th><th>Phone</th><th>Owner</th><th>Source</th></tr></thead>
            <tbody>{rows.map((c) => (
              <tr key={c.id}>
                <td><b style={{ fontWeight: 500 }}>{c.first} {c.last}</b><br /><small className="muted">{c.title}</small></td>
                <td>{co(c.company)}</td><td>{c.email}</td><td>{c.phone || <span className="muted">—</span>}</td><td><Owner id={c.owner} /></td><td>{c.source}</td>
              </tr>))}</tbody>
          </table>
        ) : <Empty>No contacts match “{q}”.</Empty>}
      </div>
    </>
  );
}
