'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { StoreProvider, useStore } from '@/lib/store';
import { SOURCES, PRIORITIES, TEAM } from '@/lib/data';
import PillNav from './PillNav';

function NewLeadDialog() {
  const { newLeadOpen, setNewLeadOpen, addLead } = useStore();
  const ref = useRef(null);
  const router = useRouter();
  useEffect(() => {
    const d = ref.current;
    if (newLeadOpen && !d.open) d.showModal();
    if (!newLeadOpen && d.open) d.close();
  }, [newLeadOpen]);
  const submit = (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    if (!f.name.trim()) return;
    const id = addLead({ name: f.name.trim(), email: f.email || f.name.split(' ')[0].toLowerCase() + '@example.com', company: f.company || '—', source: f.source, priority: f.priority, value: +f.value || 0, owner: f.owner || null, coid: null, cid: null });
    e.target.reset(); setNewLeadOpen(false); router.push('/leads/' + id);
  };
  return (
    <dialog ref={ref} onClose={() => setNewLeadOpen(false)}>
      <form onSubmit={submit}>
        <h2 style={{ margin: 0, fontSize: 28, letterSpacing: '-.04em', fontWeight: 500 }}>New lead</h2>
        <label>Name<input name="name" required autoFocus /></label>
        <label>Email<input name="email" type="email" /></label>
        <label>Company<input name="company" /></label>
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <label style={{ flex: 1 }}>Source<select name="source">{SOURCES.map((s) => <option key={s}>{s}</option>)}</select></label>
          <label style={{ flex: 1 }}>Priority<select name="priority" defaultValue="Medium">{PRIORITIES.map((s) => <option key={s}>{s}</option>)}</select></label>
        </div>
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <label style={{ flex: 1 }}>Value (USD)<input name="value" type="number" min="0" /></label>
          <label style={{ flex: 1 }}>Owner<select name="owner"><option value="">Unassigned</option>{TEAM.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></label>
        </div>
        <div className="row" style={{ justifyContent: 'flex-end', marginTop: 22 }}>
          <button type="button" className="btn" onClick={() => setNewLeadOpen(false)}>Cancel</button>
          <button className="cta">Create lead</button>
        </div>
      </form>
    </dialog>
  );
}

function Inner({ children }) {
  const { toast, setNewLeadOpen } = useStore();
  const path = usePathname();
  return (
    <>
      <div className="brandbar"><span className="logo">U</span><b style={{ letterSpacing: '-.03em' }}>UBM</b><span className="muted mono" style={{ marginLeft: 8 }}>Brightline Services</span></div>
      <motion.main key={path} className="pg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        {children}
      </motion.main>
      <PillNav onNewLead={() => setNewLeadOpen(true)} />
      <NewLeadDialog />
      {toast && <div className="toast" role="status" key={toast.k}>{toast.m}</div>}
    </>
  );
}

export default function AppShell({ children }) {
  return (
    <StoreProvider>
      <Inner>{children}</Inner>
    </StoreProvider>
  );
}
