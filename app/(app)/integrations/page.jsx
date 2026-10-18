'use client';
import { useStore } from '@/lib/store';
import { rel, integTone } from '@/lib/data';
import { Badge, PageHead } from '@/components/ui';

export default function Integrations() {
  const { S, say } = useStore();
  return (
    <>
      <PageHead title="Integrations" sub="Provider connections. Nothing here is live: test results are simulated." />
      <div className="grid two">
        {S.integ.map((i) => (
          <div key={i.id} className="card">
            <div className="row sp"><h2 style={{ margin: 0 }}>{i.name}</h2><Badge tone={integTone(i.status)}>{i.status}</Badge></div>
            <p className="muted" style={{ margin: '6px 0 14px' }}>{i.desc}</p>
            {i.issue && <div className="note" style={{ background: 'var(--wnb)', color: 'var(--wn)' }}>{i.issue}</div>}
            <div className="row sp"><small className="muted">Last sync: {rel(i.sync)}</small><button className="btn s" onClick={() => say(`Simulated test for ${i.name}`)}>Test connection</button></div>
          </div>
        ))}
      </div>
    </>
  );
}
