'use client';
import { createContext, useContext, useMemo, useState } from 'react';
import { seed, NOW, member } from './data';

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);

export function StoreProvider({ children }) {
  const [S, setS] = useState(() => seed());
  const [toast, setToast] = useState(null);
  const [newLeadOpen, setNewLeadOpen] = useState(false);

  const say = (m) => {
    setToast({ m, k: Math.random() });
    setTimeout(() => setToast(null), 2600);
  };

  const log = (s, lead, type, text) => ({
    ...s,
    acts: [{ id: 'a' + Math.random(), lead, type, text, who: 'You', at: NOW }, ...s.acts],
  });
  const patch = (id, fn) => (s) => ({ ...s, leads: s.leads.map((l) => (l.id === id ? fn(l) : l)) });

  const actions = useMemo(
    () => ({
      say,
      setStage(id, to) {
        setS((s) => {
          const from = s.leads.find((l) => l.id === id).stage;
          return log(patch(id, (l) => ({ ...l, stage: to, last: NOW }))(s), id, 'Stage change', from + ' → ' + to);
        });
        say('Stage updated');
      },
      assign(id, owner) {
        setS((s) => log(patch(id, (l) => ({ ...l, owner: owner || null, ack: false }))(s), id, 'Assignment', owner ? 'Assigned to ' + member(owner).name : 'Unassigned'));
        say(owner ? 'Assigned to ' + member(owner).name : 'Unassigned');
      },
      acknowledge(id) {
        setS((s) => log(patch(id, (l) => ({ ...l, ack: true, last: NOW }))(s), id, 'Acknowledgement', 'Acknowledgement recorded (no message was sent)'));
        say('Acknowledged');
      },
      note(id, text) {
        setS((s) => log(patch(id, (l) => ({ ...l, last: NOW }))(s), id, 'Note', text));
        say('Note added');
      },
      follow(id, date) {
        setS((s) => log(patch(id, (l) => ({ ...l, follow: new Date(date + 'T09:00:00') }))(s), id, 'Follow-up', 'Follow-up scheduled for ' + date));
        say('Follow-up scheduled');
      },
      addLead(d) {
        const id = 'l' + (Date.now() % 100000);
        setS((s) =>
          log({ ...s, leads: [{ id, ...d, stage: 'New', ack: false, created: NOW, last: null, follow: null }, ...s.leads] }, id, 'Created', 'Lead created manually')
        );
        say('Lead created');
        return id;
      },
      setOppStage(id, to) {
        setS((s) => ({ ...s, opps: s.opps.map((o) => (o.id === id ? { ...o, stage: to, prob: { New: 10, Contacted: 20, Qualified: 40, Proposal: 65, Won: 100, Lost: 0 }[to] } : o)) }));
        say('Opportunity moved to ' + to);
      },
    }),
    []
  );

  return <Ctx.Provider value={{ S, toast, newLeadOpen, setNewLeadOpen, ...actions }}>{children}</Ctx.Provider>;
}
