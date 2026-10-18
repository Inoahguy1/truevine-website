// Booking modal — fake Calendly-style picker
const { useState, useEffect, useMemo } = React;

// Requests are emailed through FormSubmit. The first one triggers a one-time activation email to this address.
const BOOKING_EMAIL = 'noahwilliams@truevineautomation.com';
const BOOKING_ENDPOINT = `https://formsubmit.co/ajax/${BOOKING_EMAIL}`;

function BookingModal({ open, onClose, prefill }) {
  const [step, setStep] = useState(1); // 1: date/time, 2: details, 3: success
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [monthOffset, setMonthOffset] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', company: '', goal: '' });
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');

  useEffect(() => {
    if (!open) {
      // reset after close animation
      const t = setTimeout(() => {
        setSending(false); setSendError('');
        setStep(1); setSelectedDate(null); setSelectedSlot(null); setMonthOffset(0);
        setForm({ name: '', email: '', company: '', goal: '' });
      }, 300);
      return () => clearTimeout(t);
    }
    if (prefill) setForm((f) => ({ ...f, ...prefill }));
  }, [open]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && open) onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const now = new Date();
  const viewDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const monthName = viewDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const days = useMemo(() => {
    const y = viewDate.getFullYear(), m = viewDate.getMonth();
    const firstDow = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const arr = [];
    for (let i = 0; i < firstDow; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(y, m, d));
    return arr;
  }, [viewDate.getFullYear(), viewDate.getMonth()]);

  const isPast = (d) => {
    if (!d) return false;
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return d < today;
  };
  const isToday = (d) => d && d.toDateString() === now.toDateString();
  const isAvailable = (d) => {
    if (!d || isPast(d)) return false;
    const dow = d.getDay();
    return dow !== 0 && dow !== 6; // weekdays only
  };

  const slots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const summary = selectedDate && selectedSlot
    ? `${selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at ${selectedSlot}`
    : 'No time picked yet';

  const canProceedStep1 = selectedDate && selectedSlot;
  const canSubmit = form.name && form.email && form.goal;

  const sendBooking = async () => {
    setSending(true);
    setSendError('');
    try {
      const res = await fetch(BOOKING_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Consultation request from ${form.name}`,
          _template: 'table',
          'Requested time': summary,
          name: form.name,
          email: form.email,
          company: form.company || 'Not given',
          'Wants to automate': form.goal,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || String(data.success) !== 'true') throw new Error('send failed');
      setStep(3);
    } catch (e) {
      setSendError(`We couldn't send your request. Check your connection and try again, or email ${BOOKING_EMAIL}.`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={`modal-backdrop ${open ? 'open' : ''}`} onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Book your free consultation" onClick={(e) => e.stopPropagation()}>
        <div className="modal-chrome">
          <span className="modal-title">Book your free consultation</span>
          <div className="modal-steps" aria-hidden="true">
            <span className={`step-node ${step >= 1 ? 'on' : ''}`} />
            <span className={`step-stem ${step >= 2 ? 'on' : ''}`} />
            <span className={`step-node ${step >= 2 ? 'on' : ''}`} />
            <span className={`step-stem ${step >= 3 ? 'on' : ''}`} />
            <span className={`step-node ${step >= 3 ? 'on' : ''}`} />
          </div>
          <button className="close" aria-label="Close" onClick={onClose}>×</button>
        </div>

        {step === 3 ? (
          <div className="success-screen">
            <div className="success-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3>Request sent.</h3>
            <p>We'll reply to <strong>{form.email}</strong> to confirm your time and send a Zoom link.</p>
            <div className="success-details">
              <div className="row"><span>When</span><span>{summary}</span></div>
              <div className="row"><span>Duration</span><span>30 minutes</span></div>
              <div className="row"><span>With</span><span>The Truevine team</span></div>
            </div>
            <button className="modal-btn primary" style={{ marginTop: 28 }} onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <div className="modal-body">
              <div className="modal-side">
                <h3>Free audit call</h3>
                <div className="duration">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  <span>30 minutes on Zoom</span>
                </div>
                <p>A no-pressure call to map your repetitive workflows, find the automation wins, and scope what's realistic in 30 to 90 days.</p>
                <ul className="agenda">
                  <li>Quick intro and business snapshot</li>
                  <li>Audit of your current workflow</li>
                  <li>Automation opportunities</li>
                  <li>Timeline and rough pricing</li>
                </ul>
              </div>
              <div className="modal-main">
                {step === 1 && (
                  <>
                    <p className="modal-step">Step 1 of 2</p>
                    <h4>Pick a date and time</h4>
                    <div className="cal-month-head">
                      <div className="month">{monthName}</div>
                      <div className="cal-nav">
                        <button onClick={() => setMonthOffset(Math.max(0, monthOffset - 1))} disabled={monthOffset === 0}>‹</button>
                        <button onClick={() => setMonthOffset(monthOffset + 1)}>›</button>
                      </div>
                    </div>
                    <div className="cal-grid">
                      {['S','M','T','W','T','F','S'].map((d, i) => <div key={i} className="dow">{d}</div>)}
                      {days.map((d, i) => {
                        if (!d) return <div key={i} className="cal-day empty" />;
                        const past = isPast(d);
                        const avail = isAvailable(d);
                        const today = isToday(d);
                        const selected = selectedDate && d.toDateString() === selectedDate.toDateString();
                        const cls = ['cal-day'];
                        if (past) cls.push('past');
                        if (avail) cls.push('available');
                        if (today) cls.push('today');
                        if (selected) cls.push('selected');
                        return (
                          <button
                            key={i}
                            className={cls.join(' ')}
                            disabled={!avail}
                            onClick={() => { setSelectedDate(d); setSelectedSlot(null); }}
                          >
                            {d.getDate()}
                          </button>
                        );
                      })}
                    </div>

                    {selectedDate && (
                      <>
                        <div className="slots-label">
                          Available times on {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="slots">
                          {slots.map((s) => (
                            <button key={s} className={`slot ${selectedSlot === s ? 'selected' : ''}`} onClick={() => setSelectedSlot(s)}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}

                {step === 2 && (
                  <>
                    <p className="modal-step">Step 2 of 2</p>
                    <h4>Tell us about your business</h4>
                    <div className="form-row">
                      <label>Full name *</label>
                      <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Smith" />
                    </div>
                    <div className="form-row">
                      <label>Work email *</label>
                      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@company.com" />
                    </div>
                    <div className="form-row">
                      <label>Company</label>
                      <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Acme Co." />
                    </div>
                    <div className="form-row">
                      <label>What do you want to automate? *</label>
                      <textarea rows={3} value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} placeholder="Customer support, lead capture, invoicing..." />
                    </div>
                    {sendError && <p className="send-error" role="alert">{sendError}</p>}
                  </>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <div className="summary">
                <strong>{summary}</strong>
              </div>
              <div className="actions">
                {step === 2 && <button className="modal-btn" onClick={() => setStep(1)}>Back</button>}
                {step === 1 && (
                  <button className="modal-btn primary" disabled={!canProceedStep1} onClick={() => setStep(2)}>
                    Continue
                  </button>
                )}
                {step === 2 && (
                  <button className="modal-btn primary" disabled={!canSubmit || sending} onClick={sendBooking}>
                    {sending ? 'Sending…' : 'Send request'}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { BookingModal });
