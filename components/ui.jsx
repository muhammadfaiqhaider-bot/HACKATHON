'use client';
import Link from 'next/link';
import { animate, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { initials, member } from '@/lib/data';

export const Badge = ({ tone = 'mut', children }) => <span className={`b ${tone}`}>{children}</span>;

export const Owner = ({ id }) =>
  id ? (
    <span><span className="av" aria-hidden="true">{initials(member(id).name)}</span>{member(id).name}</span>
  ) : (
    <span className="muted">Unassigned</span>
  );

export function PageHead({ title, sub, children }) {
  return (
    <div className="ph">
      <div>
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      <div className="row">{children}</div>
    </div>
  );
}

export const Empty = ({ children }) => <div className="empty">{children}</div>;

// Counts up once when it scrolls into view. Non-numeric values render as-is.
export function CountUp({ value }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true });
  const [v, setV] = useState(typeof value === 'number' ? 0 : value);
  useEffect(() => {
    if (typeof value !== 'number') return setV(value);
    if (!seen) return;
    const c = animate(0, value, { duration: 1.1, ease: [0.16, 1, 0.3, 1], onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [seen, value]);
  return <span ref={ref}>{v}</span>;
}

export function Kpi({ href, label, value, sub }) {
  return (
    <Link href={href} className="card kpi">
      <div className="mono muted">{label}</div>
      <div className="v"><CountUp value={value} /></div>
      <small>{sub}</small>
    </Link>
  );
}

export function Bar({ pct, delay = 0 }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true });
  return (
    <div className="pb" ref={ref}>
      <i style={{ width: pct + '%', transform: seen ? 'scaleX(1)' : 'scaleX(0)', transition: `transform .9s cubic-bezier(.16,1,.3,1) ${delay}s` }} />
    </div>
  );
}
