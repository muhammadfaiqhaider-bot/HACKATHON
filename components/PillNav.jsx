'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export const NAV = [
  ['Overview', [['/dashboard', 'Dashboard']]],
  ['Customers', [['/contacts', 'Contacts'], ['/companies', 'Companies']]],
  ['Sales', [['/leads', 'Leads'], ['/recovery', 'Recovery queue'], ['/pipeline', 'Pipeline']]],
  ['Operations', [['/activities', 'Activities'], ['/calendar', 'Calendar']]],
  ['Finance', [['/payments', 'Payments']]],
  ['Administration', [['/integrations', 'Integrations'], ['/team', 'Team & access'], ['/settings', 'Settings']]],
];
const flat = NAV.flatMap(([, l]) => l);

const Chevron = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 4l4 4 4-4" /></svg>
);
const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
);

export default function PillNav({ onNewLead }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const box = useRef(null);
  const home = path === '/';
  const label = home ? 'Home' : (flat.find(([h]) => path === h || path.startsWith(h + '/')) || [, 'Menu'])[1];

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const out = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', out); document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', out); document.removeEventListener('keydown', esc); };
  }, []);

  return (
    <nav className="pill" ref={box} aria-label="Main">
      <Link href="/" className="mark" aria-label="UBM home">U<span style={{ color: 'var(--lime)' }}>B</span></Link>
      <button className="menu-btn" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen((o) => !o)}>
        {label} <Chevron />
      </button>
      {home ? (
        <Link href="/dashboard" className="cta">Open workspace <Arrow /></Link>
      ) : (
        <button className="cta" onClick={onNewLead}>New lead <span aria-hidden="true">+</span></button>
      )}
      <AnimatePresence>
        {open && (
          <motion.div className="pop" initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.18 }}>
            {NAV.map(([g, links]) => [
              <div key={g} className="g mono">{g}</div>,
              ...links.map(([h, t]) => (
                <Link key={h} href={h} aria-current={path === h || path.startsWith(h + '/') ? 'page' : undefined}>{t}</Link>
              )),
            ])}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
