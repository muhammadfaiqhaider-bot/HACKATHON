'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { STAGES, money, fd, stageTone } from '@/lib/data';
import { Badge, Owner, PageHead } from '@/components/ui';

export default function Pipeline() {
  const { S, setOppStage } = useStore();
  const co = (id) => (S.companies.find((c) => c.id === id) || {}).name || '—';
  const ct = (id) => { const c = S.contacts.find((x) => x.id === id); return c ? c.first + ' ' + c.last : '—'; };
  const open = S.opps.filter((o) => !['Won', 'Lost'].includes(o.stage));
  return (
    <>
      <PageHead title="Pipeline" sub={`${open.length} open opportunities worth ${money(open.reduce((a, o) => a + o.value, 0))}. Use the stage menu to move a deal.`} />
      <div className="kan">
        {STAGES.map((s) => {
          const items = S.opps.filter((o) => o.stage === s);
          return (
            <section key={s} className="kc" aria-label={s}>
              <div className="row sp" style={{ padding: '4px 6px' }}><Badge tone={stageTone[s]}>{s}</Badge><span className="muted">{items.length} · {money(items.reduce((a, o) => a + o.value, 0))}</span></div>
              {items.map((o) => (
                <motion.div key={o.id} layout transition={{ type: 'spring', stiffness: 380, damping: 34 }} className="card">
                  <b style={{ fontWeight: 500 }}>{o.title}</b>
                  <div className="muted" style={{ fontSize: 13, margin: '4px 0 10px' }}>{co(o.coid)} · {ct(o.cid)}</div>
                  <div className="row sp"><b style={{ fontWeight: 500 }}>{money(o.value, o.cur)}</b><span className="muted">{o.prob}% · {fd(o.close)}</span></div>
                  <div className="row sp" style={{ marginTop: 10 }}>
                    <Owner id={o.owner} />
                    <select aria-label={`Stage for ${o.title}`} value={o.stage} onChange={(e) => setOppStage(o.id, e.target.value)}>{STAGES.map((x) => <option key={x}>{x}</option>)}</select>
                  </div>
                </motion.div>
              ))}
            </section>
          );
        })}
      </div>
    </>
  );
}
