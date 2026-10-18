'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { PageHead, Owner, Empty } from '@/components/ui';

export default function Companies() {
  const { S } = useStore();
  const [q, setQ] = useState(''); const [ind, setInd] = useState('');
  const rows = S.companies.filter((c) => (c.name + c.location).toLowerCase().includes(q.toLowerCase()) && (!ind || c.industry === ind));
  const inds = [...new Set(S.companies.map((c) => c.industry))];
  return (
    <>
      <PageHead title="Companies" sub="Businesses that contacts, leads and opportunities link to." />
      <div className="bar">
        <input placeholder="Search companies" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search companies" />
        <select value={ind} onChange={(e) => setInd(e.target.value)} aria-label="Industry"><option value="">All industries</option>{inds.map((i) => <option key={i}>{i}</option>)}</select>
      </div>
      <div className="card tw">
        {rows.length ? (
          <table>
            <thead><tr><th>Company</th><th>Industry</th><th>Size</th><th>Location</th><th>Contacts</th><th>Owner</th></tr></thead>
            <tbody>{rows.map((c) => (
              <tr key={c.id}>
                <td><b style={{ fontWeight: 500 }}>{c.name}</b><br /><small className="muted">{c.website}</small></td>
                <td>{c.industry}</td><td>{c.size}</td><td>{c.location}</td>
                <td>{S.contacts.filter((x) => x.company === c.id).length}</td><td><Owner id={c.owner} /></td>
              </tr>))}</tbody>
          </table>
        ) : <Empty>No companies match.</Empty>}
      </div>
    </>
  );
}
