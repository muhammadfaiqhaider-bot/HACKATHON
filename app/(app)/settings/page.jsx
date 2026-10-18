'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { PageHead } from '@/components/ui';

export default function Settings() {
  const { say } = useStore();
  const [n, setN] = useState({ assign: true, overdue: true, payment: false, integ: true });
  const items = [['assign', 'Lead assigned to me'], ['overdue', 'Follow-up overdue'], ['payment', 'Payment failed'], ['integ', 'Integration issues']];
  return (
    <>
      <PageHead title="Settings" sub="Workspace preferences for the demo." />
      <section className="card" style={{ maxWidth: 560 }}>
        <h2>Notifications</h2>
        {items.map(([k, t]) => (
          <label key={k} className="row" style={{ padding: '10px 0', borderTop: '1px solid var(--line)', cursor: 'pointer' }}>
            <input type="checkbox" checked={n[k]} onChange={(e) => { setN({ ...n, [k]: e.target.checked }); say('Preference saved'); }} style={{ width: 18, height: 18, minHeight: 0, accentColor: '#cdf564' }} /> {t}
          </label>
        ))}
      </section>
    </>
  );
}
