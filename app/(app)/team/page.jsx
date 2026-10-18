'use client';
import { useStore } from '@/lib/store';
import { TEAM, CLOSED } from '@/lib/data';
import { Badge, Owner, PageHead } from '@/components/ui';

export default function Team() {
  const { S } = useStore();
  const tone = { Owner: 'ind', Admin: 'info', Manager: 'warn', Employee: 'mut' };
  return (
    <>
      <PageHead title="Team & access" sub="Illustrative roles only. Real authorization must be enforced by the backend." />
      <div className="card tw">
        <table>
          <thead><tr><th>Member</th><th>Role</th><th>Open leads</th></tr></thead>
          <tbody>{TEAM.map((m) => (
            <tr key={m.id}><td><Owner id={m.id} /></td><td><Badge tone={tone[m.role]}>{m.role}</Badge></td>
              <td>{S.leads.filter((l) => l.owner === m.id && !CLOSED.includes(l.stage)).length}</td></tr>))}</tbody>
        </table>
      </div>
    </>
  );
}
