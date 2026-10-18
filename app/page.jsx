import Link from 'next/link';
import HeroHeadline from '@/components/HeroHeadline';
import RockCanvas from '@/components/RockCanvas';
import PillNav from '@/components/PillNav';
import Reveal from '@/components/Reveal';
import { seed, needs, money, CLOSED } from '@/lib/data';

const MODULES = [
  ['Leads', '/leads', 'Assign, acknowledge and follow up. Every stage change is logged.'],
  ['Pipeline', '/pipeline', 'See open deals by stage and move them forward in one click.'],
  ['Contacts & companies', '/contacts', 'People and the businesses they belong to, linked to every deal.'],
  ['Payments', '/payments', 'Track what is paid, pending or failed, by currency.'],
  ['Calendar', '/calendar', 'Upcoming calls and walkthroughs, tied to the lead they are for.'],
  ['Integrations', '/integrations', 'WhatsApp, Stripe, Google Calendar and Slack. Spot what needs attention.'],
];

export default function Home() {
  const S = seed();
  const open = S.leads.filter((l) => !CLOSED.includes(l.stage));
  const attention = S.leads.filter((l) => needs(l).length).sort((a, b) => needs(b).length - needs(a).length).slice(0, 4);

  return (
    <>
      <header className="hero">
        <div className="hero-panels" aria-hidden="true">
          <i style={{ left: '-3%', top: '-8%', width: '34%', height: '30%' }} />
          <i style={{ right: '-4%', top: '2%', width: '30%', height: '26%' }} />
          <i style={{ left: '2%', bottom: '4%', width: '30%', height: '34%' }} />
          <i style={{ right: '3%', bottom: '8%', width: '36%', height: '30%' }} />
        </div>
        <div className="rock"><RockCanvas /></div>
        <div className="hero-in">
          <HeroHeadline words={['Unified', 'Business']} />
          <div className="caps mono">
            <p>One workspace for leads, deals, payments and your team</p>
            <p>A CRM for small teams that follow up, close and get paid</p>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="wrap">
          <Reveal><h2 className="big" style={{ maxWidth: 900 }}>Everything a deal touches, in one place.</h2></Reveal>
          <div className="mods" style={{ marginTop: 48 }}>
            {MODULES.map(([t, h, d], i) => (
              <Reveal key={t} delay={(i % 3) * 0.08}>
                <Link href={h} className="card mod">
                  <h3>{t}</h3>
                  <p>{d}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap grid two" style={{ alignItems: 'center', gap: 48 }}>
          <Reveal>
            <h2 className="big">Know what needs you today.</h2>
            <p className="muted" style={{ maxWidth: 440, marginTop: 20 }}>
              The recovery queue flags unassigned leads, missed acknowledgements, overdue follow-ups and deals that went quiet, so nothing slips.
            </p>
            <p style={{ marginTop: 28 }}><Link href="/recovery" className="cta">Open recovery queue</Link></p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card">
              <div className="row sp" style={{ marginBottom: 10 }}>
                <h2 style={{ margin: 0 }}>Needs attention</h2>
                <span className="muted">{open.length} open leads · {money(open.reduce((a, l) => a + l.value, 0))}</span>
              </div>
              {attention.map((l) => (
                <Link key={l.id} href={`/leads/${l.id}`} className="row sp" style={{ padding: '14px 0', borderTop: '1px solid var(--line)' }}>
                  <span><b style={{ fontWeight: 500 }}>{l.name}</b><br /><small className="muted">{l.company}</small></span>
                  <small style={{ color: 'var(--wn)', textAlign: 'right' }}>{needs(l)[0]}</small>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="foot">
        <div className="wrap row sp">
          <span>UBM · Unified Business Management</span>
          <span className="mono">Demo data. No real accounts or messages.</span>
        </div>
      </footer>
      <PillNav />
    </>
  );
}
