// Section components for Truevine Automation landing page
const { useState: useStateS, useEffect: useEffectS } = React;

const Arrow = () => (
  <svg className="arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
);

function Nav({ onBook }) {
  const [scrolled, setScrolled] = useStateS(false);
  useEffectS(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        <a href="#top" className="logo">
          <img src="assets/truevine-logo.png" alt="Truevine Automation" style={{ height: '44px', width: 'auto', objectFit: 'contain' }} />
        </a>
        <div className="nav-links">
          <a href="#services">Services</a>
          <a href="#work">Results</a>
          <a href="#why">Why us</a>
          <a href="#faq">Questions</a>
          <a href="#contact">Contact</a>
        </div>
        <button className="cta-btn" onClick={() => onBook()}>
          Book a call
          <Arrow />
        </button>
      </div>
    </nav>
  );
}

function Hero({ onBook, headline }) {
  const h = HEADLINES[headline] || HEADLINES.grow;
  const lines = [h.line1, h.line2, h.line3, h.line4].filter(Boolean);
  return (
    <section className="hero" id="top">
      <div className="container hero-inner">
        <div className="hero-left">
          <h1 data-sc-in>
            {lines.map((t) => <span key={t} className="line">{t}</span>)}
          </h1>
          <p className="hero-sub" data-sc-in>
            We build AI chatbots, workflow automations and custom websites for small and
            mid-size businesses. Each one takes root in a single task, then spreads to the work around it.
          </p>
          <div className="hero-cta-row">
            <button className="cta-btn" data-sc-magnet="0.25" onClick={() => onBook()}>
              Book your free consultation
              <Arrow />
            </button>
            <a href="#services" className="cta-btn ghost">Follow the vine</a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><strong>500+</strong><span>hours saved a month</span></div>
            <div className="hero-stat"><strong>20+</strong><span>businesses automated</span></div>
            <div className="hero-stat"><strong>24/7</strong><span>always-on systems</span></div>
          </div>
          <p className="hero-note">No long-term contracts. Results in weeks, not months.</p>
        </div>

        <div className="hero-viz">
          <div className="hero-seed" data-sc-tilt="4">
            <img src="assets/vine-01.png" alt="" />
          </div>
          <div className="vine-rail hero-rail" data-vine-rail />
        </div>
      </div>
    </section>
  );
}

// A section whose items hang off the vine. `flip` puts the items on the left so the trunk swings across.
function Grow({ id, flip, className, title, kicker, extra, children }) {
  return (
    <section className={`grow-section${className ? ' ' + className : ''}`} id={id}>
      <div className={`container grow${flip ? ' flip' : ''}`}>
        <div className="grow-head" data-sc-in>
          <h2>{title}</h2>
          {kicker && <p>{kicker}</p>}
          {extra}
        </div>
        <div className="grow-body">
          <div className="vine-rail" data-vine-rail />
          <div className="grow-items">{children}</div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const items = [
    {
      title: 'AI chatbots',
      desc: 'Trained on your data. Handles sales, support and bookings in your brand voice, including while you sleep.',
      tags: ['GPT-4', 'Voice', 'Multi-channel'],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <circle cx="9" cy="11" r="1" fill="currentColor" />
          <circle cx="15" cy="11" r="1" fill="currentColor" />
          <path d="M9 15h6" /><path d="M12 4V2" /><path d="M6 18l-2 3" /><path d="M18 18l2 3" />
        </svg>
      )
    },
    {
      title: 'Workflow automation',
      desc: 'Connect every tool you use. Invoicing, CRM and inventory run themselves on triggers you define once.',
      tags: ['Zapier', 'n8n', 'Custom APIs'],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="18" r="2.5" />
          <path d="M8.5 6H15.5" /><path d="M6 8.5V15.5" /><path d="M18 8.5V15.5" /><path d="M8.5 18H15.5" />
        </svg>
      )
    },
    {
      title: 'Custom websites',
      desc: 'Fast, conversion-focused sites with the automations built in. Customers serve themselves and your pipeline fills.',
      tags: ['Next.js', 'SEO', 'Analytics'],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="1.5" /><line x1="3" y1="9" x2="21" y2="9" />
          <path d="M7 14l2 2-2 2" /><path d="M11 18h4" />
        </svg>
      )
    },
    {
      title: 'Branding and CRM',
      desc: 'Identity, customer pipelines and messaging systems that turn one-time buyers into repeat revenue.',
      tags: ['Identity', 'Email', 'Pipelines'],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4z" /><path d="M9 12l2 2 4-4" />
        </svg>
      )
    },
  ];
  return (
    <Grow
      id="services"
      title="Four systems on one root."
      kicker="Take one or take the stack. Each pays for itself; together they reach into every corner of the business."
    >
      {items.map((s) => (
        <div key={s.title} className="item" data-vine-node="42">
          <div className="item-top">
            <span className="item-icon">{s.icon}</span>
            <h3>{s.title}</h3>
          </div>
          <p>{s.desc}</p>
          <div className="tags">{s.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
        </div>
      ))}
    </Grow>
  );
}

function CaseStudies() {
  const cases = [
    {
      who: 'Loop Earplugs, e-commerce chatbot',
      source: 'Forrester TEI / Ada',
      title: 'An AI support chatbot returned 357% ROI and cut first-response time.',
      desc: 'After deploying an AI support chatbot, Loop Earplugs sharply cut how long customers wait for a first reply and grew CSAT to 80. An agent trained on real support data pays back quickly, even in a lean team.',
      stats: [['357%', 'ROI over 3 years'], ['+194%', 'first-response rate'], ['80', 'CSAT score']],
      quote: 'Retail company Loop Earplugs used Ada\'s AI and automation platform to achieve a 357% ROI, driven mostly by faster response times.'
    },
    {
      who: 'Geberit, conversational AI',
      source: 'moinAI case study',
      title: 'Nearly half of all customer inquiries automated across Europe.',
      desc: 'Geberit deployed a multilingual chatbot across European markets to field questions about its AquaClean line. It resolves 47% of inbound conversations and turns 10% of them into qualified leads without a human stepping in.',
      stats: [['47%', 'inquiries automated'], ['10%', 'chats to leads'], ['24/7', 'multilingual cover']],
      quote: 'Geberit uses an AI chatbot to automate 47% of inquiries and convert 10% of conversations into leads across Europe.'
    },
    {
      who: 'B2B SaaS startup, workflow automation',
      source: 'M Studio / Elite Founders 2024',
      title: 'From a $50k to a $200k quarter after automating lead qualification and follow-up.',
      desc: 'A seed-stage startup replaced manual lead triage with an AI qualifier, triggered follow-up sequences after demos and automated outbound prospecting. Qualification dropped from 8 hours a week to 30 minutes.',
      stats: [['4x', 'quarterly revenue'], ['15→40%', 'close rate'], ['3x', 'lead volume']],
      quote: 'Q4 revenue soared to $200,000… manual lead qualification time dropped from 8 hours a week to just 30 minutes, while lead volume tripled.'
    },
    {
      who: 'Mid-size services firm, invoice automation',
      source: 'AIQ Labs',
      title: 'Invoice processing fell from 15 hours a week to under 2.',
      desc: 'A services business with growing receivables replaced manual invoice entry with an AI document pipeline. Staff got 13 hours back every week for higher-value work.',
      stats: [['87%', 'time cut'], ['13hr', 'reclaimed a week'], ['30–60d', 'payback window']],
      quote: 'One client reduced invoice processing from 15 hours to under 2 weekly — freeing staff for strategic work.'
    },
  ];
  return (
    <Grow
      id="work"
      flip
      title="Real companies, verified outcomes."
      kicker="Four public case studies from Forrester, Ada, moinAI and independent research. These are the same kinds of systems we build for our clients."
    >
      {cases.map((c) => (
        <article key={c.who} className="item" data-vine-node="36">
          <div className="case-meta">
            <span className="who">{c.who}</span>
            <span className="src">Source: {c.source}</span>
          </div>
          <h3>{c.title}</h3>
          <p>{c.desc}</p>
          <blockquote className="case-quote">“{c.quote}”</blockquote>
          <div className="case-stats">
            {c.stats.map(([v, l]) => (
              <div key={l} className="case-stat"><b>{v}</b><span>{l}</span></div>
            ))}
          </div>
        </article>
      ))}
      <p className="case-footnote">
        Loop Earplugs figures: Forrester Total Economic Impact study. Geberit: moinAI case library.
        SaaS startup: M Studio / Elite Founders (2024). Invoice automation: AIQ Labs client deployment.
      </p>
    </Grow>
  );
}

function WhyTruevine() {
  const items = [
    {
      title: 'Shipped in weeks, not quarters.',
      desc: 'Most agencies take three to six months. We deploy working systems in 30 days because we specialize, so we never relearn a stack on your dime.'
    },
    {
      title: 'Built and priced for small teams.',
      desc: 'Enterprise automation platforms cost $100k and up and need dedicated staff. We give you the same firepower, sized for a team of 5 to 50.'
    },
    {
      title: 'You own everything.',
      desc: 'No vendor lock-in and no black-box logic. All code, prompts and integrations are documented and handed over. You keep the keys.'
    },
  ];
  return (
    <Grow id="why" title="Why small businesses pick us over enterprise consultants.">
      {items.map((w) => (
        <div key={w.title} className="item" data-vine-node="42">
          <h3>{w.title}</h3>
          <p>{w.desc}</p>
        </div>
      ))}
    </Grow>
  );
}

function FAQ() {
  const [openIdx, setOpenIdx] = useStateS(0);
  const qs = [
    {
      q: 'How fast can you actually deploy?',
      a: 'Most single-system projects ship in 2–3 weeks. Full suites take 4–6 weeks. We start with an audit in week one and give you a working demo by week two, so there are no surprises on delivery day.'
    },
    {
      q: 'Do I need technical people on my team?',
      a: 'No. Every system is designed to be run by non-technical staff. You get video walkthroughs, plain-English docs and a dashboard. If something breaks, we fix it.'
    },
    {
      q: 'What if the AI chatbot gives wrong answers?',
      a: 'We train every agent on your own documents and transcripts, set strict guardrails, and monitor every conversation for the first 30 days. If answers drift, we retrain at no cost. Handing off to a human is always one click away.'
    },
    {
      q: 'Will this replace my employees?',
      a: 'Rarely the goal. Automation removes the repetitive work your team dislikes, and people move to higher-value work: sales, strategy, real customer relationships.'
    },
    {
      q: 'What tools do you integrate with?',
      a: 'Shopify, HubSpot, Stripe, QuickBooks, Airtable, Notion, Slack, Gmail, Calendly, Intercom, Zendesk and many more through Zapier, n8n or custom APIs. If it has an API, we can wire it up.'
    },
    {
      q: 'What happens if I want to stop working with you?',
      a: 'Everything we build is yours. We hand over all code, credentials and documentation. Retainer clients can cancel with 30 days notice.'
    },
  ];
  return (
    <Grow id="faq" flip title="Questions we get every week.">
      {qs.map((item, i) => {
        const open = openIdx === i;
        return (
          <div key={item.q} className={`faq-item${open ? ' open' : ''}`} data-vine-node="34">
            <button className="faq-q" aria-expanded={open} onClick={() => setOpenIdx(open ? -1 : i)}>
              <span>{item.q}</span>
              <span className="plus" aria-hidden="true" />
            </button>
            <div className="faq-a">
              <div className="faq-a-inner"><p>{item.a}</p></div>
            </div>
          </div>
        );
      })}
    </Grow>
  );
}

function FinalCTA({ onBook }) {
  const [form, setForm] = useStateS({ name: '', email: '', goal: '' });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    onBook({ prefill: form });
  };
  return (
    <Grow
      id="contact"
      className="final"
      title="Plant the first one."
      kicker="Tell us what eats your week. On a free 30-minute call we map your workflows and tell you what is worth automating, whether you hire us or not."
      extra={<img className="final-tree" src="assets/vine-06.webp" alt="" data-sc-tilt="4" />}
    >
      <form onSubmit={submit}>
        <div className="field" data-vine-node="53" data-vine-gap="1">
          <label htmlFor="f-name">Your name</label>
          <input id="f-name" type="text" autoComplete="name" required value={form.name} onChange={set('name')} placeholder="Jordan Lee" />
        </div>
        <div className="field" data-vine-node="53" data-vine-gap="1">
          <label htmlFor="f-email">Work email</label>
          <input id="f-email" type="email" autoComplete="email" required value={form.email} onChange={set('email')} placeholder="jordan@yourcompany.com" />
        </div>
        <div className="field" data-vine-node="53" data-vine-gap="1">
          <label htmlFor="f-goal">What takes up most of your week?</label>
          <textarea id="f-goal" rows="3" value={form.goal} onChange={set('goal')} placeholder="Answering the same customer emails, chasing invoices…" />
        </div>
        <div className="form-submit" data-vine-node="24" data-vine-gap="1">
          <button type="submit" className="cta-btn">
            Book your free consultation
            <Arrow />
          </button>
          <span>You pick a time on the next step.</span>
        </div>
      </form>
    </Grow>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <img src="assets/truevine-logo.png" alt="Truevine Automation" />
            <p>AI systems, chatbots and workflow automation for businesses ready to grow.</p>
          </div>
          <nav className="footer-links" aria-label="Footer">
            <a href="#services">Services</a>
            <a href="#work">Results</a>
            <a href="#why">Why us</a>
            <a href="#faq">Questions</a>
            <a href="mailto:noah.williams@truevineautomations.com">noah.williams@truevineautomations.com</a>
          </nav>
        </div>
        <div className="footer-bottom">© 2026 Truevine Automation</div>
      </div>
    </footer>
  );
}

Object.assign(window, { Nav, Hero, Services, CaseStudies, WhyTruevine, FAQ, FinalCTA, Footer });
