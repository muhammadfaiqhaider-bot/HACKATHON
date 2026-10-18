// Mock data + helpers, ported from the original UBM HTML file.
export const NOW = new Date('2026-10-18T09:00:00');
export const H = 36e5, D = 24 * H;
const ago = (h) => (h == null ? null : new Date(NOW - h * H));
const inD = (n) => (n == null ? null : new Date(+NOW + n * D));

export const STAGES = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];
export const PRIORITIES = ['High', 'Medium', 'Low'];
export const SOURCES = ['Website', 'Web inquiry', 'Referral', 'WhatsApp', 'Event', 'Cold outreach'];
export const CLOSED = ['Won', 'Lost'];

export const TEAM = [
  { id: 'm1', name: 'Amara Khan', role: 'Owner' },
  { id: 'm2', name: 'Daniel Ortiz', role: 'Manager' },
  { id: 'm3', name: 'Priya Nair', role: 'Employee' },
  { id: 'm4', name: 'Tom Becker', role: 'Employee' },
  { id: 'm5', name: 'Sana Iqbal', role: 'Admin' },
];
export const member = (id) => TEAM.find((t) => t.id === id);

export const fd = (d) => (d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—');
export const ft = (d) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
export const rel = (d) => {
  if (!d) return 'never';
  const h = Math.round((NOW - d) / H);
  return h < 1 ? 'just now' : h < 48 ? h + 'h ago' : Math.round(h / 24) + 'd ago';
};
export const money = (n, c = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: c, maximumFractionDigits: 0 }).format(n);
export const initials = (name) => name.split(' ').map((w) => w[0]).join('');

export function seed() {
  const L = [
    ['l1', 'Hana Mori', 'Brightwave Studio', 'Website', 'New', 'High', null, false, 70, null, null, 8400],
    ['l2', 'Luis Duarte', 'Northfield Dental', 'Referral', 'New', 'Medium', 'm3', false, 52, null, -1, 3200],
    ['l3', 'Grace Okafor', 'Okafor Logistics', 'WhatsApp', 'Contacted', 'High', 'm2', true, 200, 96, -3, 15000],
    ['l4', 'Ethan Park', 'Parkside Fitness', 'Website', 'Qualified', 'Medium', 'm4', true, 300, 30, 2, 6500],
    ['l5', 'Sofia Lindqvist', 'Lindqvist Interiors', 'Event', 'Proposal', 'High', 'm3', true, 400, 20, 1, 22000],
    ['l6', 'Marcus Hill', 'Hill & Co Accounting', 'Referral', 'Contacted', 'Low', 'm4', true, 240, 220, null, 2800],
    ['l7', 'Aisha Rahman', 'Rahman Textiles', 'Website', 'New', 'High', null, false, 20, null, null, 11000],
    ['l8', 'Jonas Weber', 'Weber Bikes', 'Cold outreach', 'Qualified', 'Medium', 'm2', true, 180, 10, 5, 4900],
    ['l9', 'Nina Petrova', 'Petrova Bakery', 'Event', 'Won', 'Medium', 'm3', true, 600, 100, null, 5400],
    ['l10', 'Omar Said', 'Said Auto Care', 'WhatsApp', 'Lost', 'Low', 'm4', true, 700, 500, null, 1800],
    ['l11', 'Chloe Martin', 'Martin Legal', 'Referral', 'Proposal', 'High', 'm2', true, 350, 60, -2, 18500],
    ['l12', 'Ravi Menon', 'Menon Clinics', 'Website', 'New', 'Medium', 'm4', false, 30, null, 3, 7200],
  ];
  const leads = L.map((r) => ({
    id: r[0], name: r[1], company: r[2], source: r[3], stage: r[4], priority: r[5], owner: r[6], ack: r[7],
    created: ago(r[8]), last: ago(r[9]), follow: inD(r[10]), value: r[11],
    email: r[1].split(' ')[0].toLowerCase() + '@example.com',
  }));

  const acts = [];
  leads.forEach((l) => {
    acts.push({ id: 'a' + acts.length, lead: l.id, type: 'Created', text: 'Lead created from ' + l.source, who: 'System', at: l.created });
    if (l.last) acts.push({ id: 'a' + acts.length, lead: l.id, type: 'Call', text: 'Logged call (manual record)', who: l.owner ? member(l.owner).name : 'System', at: l.last });
  });
  acts.sort((a, b) => b.at - a.at);

  const pay = [
    ['PR-1001', 'l5', 'Proposal deposit', 5000, 'USD', 'Pending', 4, -2],
    ['PR-1002', 'l9', 'Onboarding package', 5400, 'USD', 'Paid', 20, -10],
    ['PR-1003', 'l11', 'Retainer – Q4', 3800, 'EUR', 'Pending', 6, 3],
    ['PR-1004', 'l3', 'Pilot project', 7500, 'USD', 'Failed', 9, -4],
    ['PR-1005', 'l4', 'Trial membership', 900, 'USD', 'Draft', 1, 7],
  ].map((p) => ({ id: p[0], lead: p[1], desc: p[2], amt: p[3], cur: p[4], status: p[5], created: ago(p[6] * 24), due: inD(p[7]) }));

  const integ = [
    { id: 'wa', name: 'WhatsApp Business', desc: 'Messaging provider', status: 'Connected', sync: ago(2), issue: null },
    { id: 'st', name: 'Stripe', desc: 'Payment workflows', status: 'Attention required', sync: ago(30), issue: 'Webhook signature check pending' },
    { id: 'gc', name: 'Google Calendar', desc: 'Appointment sync', status: 'Disconnected', sync: ago(120), issue: 'Authorization expired' },
    { id: 'sl', name: 'Slack', desc: 'Team notifications', status: 'Not configured', sync: null, issue: null },
  ];

  const appts = [
    ['p1', 'Proposal walkthrough', 'l5', 'm3', 1.2],
    ['p2', 'Discovery call', 'l12', 'm4', 3.1],
    ['p3', 'Contract review', 'l11', 'm2', -1.1],
  ].map((a) => ({ id: a[0], title: a[1], lead: a[2], owner: a[3], start: inD(a[4]), end: new Date(+inD(a[4]) + H), status: a[4] < 0 ? 'Completed' : 'Scheduled' }));

  const companies = [...new Set(leads.map((l) => l.company))].map((n, i) => ({
    id: 'co' + (i + 1), name: n,
    website: 'www.' + n.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '') + '.example',
    industry: ['Services', 'Retail', 'Health', 'Logistics'][i % 4],
    size: ['1-10', '11-50', '51-200'][i % 3],
    location: ['Berlin', 'Austin', 'Lisbon', 'Toronto'][i % 4],
    owner: leads.find((l) => l.company === n).owner,
  }));
  companies.push({ id: 'co' + (companies.length + 1), name: 'Summit Outfitters', website: 'www.summit.example', industry: 'Retail', size: '11-50', location: 'Denver', owner: 'm3' });

  const contacts = leads.map((l, i) => {
    const [first, ...r] = l.name.split(' ');
    l.coid = companies.find((c) => c.name === l.company).id;
    l.cid = 'ct' + (i + 1);
    return { id: l.cid, first, last: r.join(' '), email: l.email, phone: '+1 555 01' + (10 + i), title: 'Decision maker', company: l.coid, owner: l.owner, source: l.source };
  });
  contacts.push({ id: 'ct99', first: 'Dana', last: 'Fischer', email: 'dana@summit.example', phone: '', title: 'Owner', company: companies[companies.length - 1].id, owner: 'm3', source: 'Event' });

  const probs = { New: 10, Contacted: 20, Qualified: 40, Proposal: 65, Won: 100, Lost: 0 };
  const opps = ['l3', 'l4', 'l5', 'l8', 'l9', 'l10', 'l11'].map((id, i) => {
    const l = leads.find((x) => x.id === id);
    return { id: 'op' + (i + 1), title: l.company + ' – ' + (l.stage === 'Proposal' ? 'Service proposal' : 'Engagement'), cid: l.cid, coid: l.coid, lead: id, owner: l.owner, value: l.value, cur: 'USD', stage: l.stage, prob: probs[l.stage], close: inD(10 + i * 6) };
  });
  opps.push({ id: 'op8', title: 'Summit seasonal order', cid: 'ct99', coid: companies[companies.length - 1].id, lead: null, owner: 'm3', value: 9000, cur: 'USD', stage: 'Qualified', prob: 40, close: inD(25) });

  return { leads, acts, pay, integ, appts, companies, contacts, opps };
}

// What a lead needs to recover (used by dashboard + recovery queue)
export function needs(l) {
  const r = [];
  if (CLOSED.includes(l.stage)) return r;
  const days = (h) => Math.floor(h / 24);
  if (!l.owner) r.push('Unassigned for ' + days((NOW - l.created) / H) + 'd');
  else if (!l.ack) r.push('Awaiting acknowledgement');
  if (l.follow && l.follow < NOW) r.push('Follow-up overdue by ' + Math.ceil((NOW - l.follow) / D) + 'd');
  const idle = (NOW - (l.last || l.created)) / H;
  if (idle > 168) r.push('No activity for ' + days(idle) + 'd');
  return r;
}

export const integTone = (s) => ({ Connected: 'ok', 'Attention required': 'warn', Disconnected: 'err', 'Not configured': 'mut' }[s] || 'mut');
export const stageTone = { New: 'info', Contacted: 'info', Qualified: 'ind', Proposal: 'warn', Won: 'ok', Lost: 'err' };
export const payTone = { Paid: 'ok', Pending: 'warn', Failed: 'err', Cancelled: 'mut', Draft: 'mut' };
