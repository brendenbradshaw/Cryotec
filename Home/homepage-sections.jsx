/* CryoTec — Homepage section components for stacking after the premium comparison
   - ConditionsSection: full interactive 7-chip switcher with v6 reference card design
   - ModesSection:     static snapshot of v30 unified modes card (cold-level-3 state)

   Both scoped under their own class prefixes (cs-* and ms-*) so they're safe to
   render alongside the premium comparison (.cmp5) inside the same artboard.
*/

/* ──────────────────────────────────────────────────────────────
   1. CONDITIONS SECTION
   ────────────────────────────────────────────────────────────── */
const COND_DOT = { cold: '#60c8ff', heat: '#ff6420', contrast: '#0066FF' };

const COND_LIST = [
  { id:'shin', mode:'cold', name:'Shin Splints', type:'Cold',
    badge:'● COLD THERAPY · LEVEL 2–3', title:'Shin Splints Recovery',
    desc:'Medial tibial stress syndrome affects about 15–20% of runners. CryoTec delivers precise cold therapy at 8°C–12°C directly over the shin, reducing inflammation and starting recovery immediately after a run — from anywhere.',
    tags:['20-minute session','Hands-free','Wear during cooldown'],
    num:'01', img:'https://cryotec.ca/wp-content/uploads/2026/04/Running-Photo.png' },
  { id:'knee', mode:'cold', name:'Knee Pain', type:'Cold',
    badge:'● COLD THERAPY · LEVEL 1–3', title:'Knee Pain Treatment',
    desc:'Whether it\u2019s runner\u2019s knee, post-surgical recovery, or general inflammation — CryoTec wraps around the joint and delivers consistent cold to where you need it most.',
    tags:['Adjustable strap','Fits any knee','3 intensity levels'],
    num:'02', img:'https://cryotec.ca/wp-content/uploads/2026/03/C939FA5A-B018-4FA7-B4E3-496ABF9A30FF.png' },
  { id:'inflammation', mode:'cold', name:'Inflammation', type:'Cold',
    badge:'● COLD THERAPY · LEVEL 3', title:'Reduce Inflammation Fast',
    desc:'CryoTec\u2019s temperature-controlled plate reaches 8°C in minutes — clinical-grade cold in a wearable device. Powerful cooling in a pocket-sized package.',
    tags:['Instant cold','No ice needed','USB-C rechargeable'],
    num:'03', img:'https://cryotec.ca/wp-content/uploads/2026/04/Stretching-Calf-Chosen-005-Cryotec.png' },
  { id:'muscle', mode:'contrast', name:'Muscle Recovery', type:'Contrast',
    badge:'◐ CONTRAST THERAPY', title:'Accelerate Muscle Recovery',
    desc:'Automated cold-to-heat cycling flushes metabolic waste and supports tissue repair between training sessions. Contrast therapy, on autopilot.',
    tags:['Automated cycling','20-minute session','Hands-free'],
    num:'04', img:'https://cryotec.ca/wp-content/uploads/2026/04/Stretching-Calf-Cryotec-004-Selected.png' },
  { id:'stiffness', mode:'heat', name:'Joint Stiffness', type:'Heat',
    badge:'● HEAT THERAPY · LEVEL 2–3', title:'Relieve Joint Stiffness',
    desc:'Sustained warmth improves range of motion and soothes aching joints. Wear it while you stretch, move, or rest. Anytime, anywhere.',
    tags:['Gentle to deep heat','Wearable design','No cords'],
    num:'05', img:'https://cryotec.ca/wp-content/uploads/2026/04/Weightlifting-test.png' },
  { id:'elbow', mode:'cold', name:'Tennis Elbow', type:'Cold',
    badge:'● COLD THERAPY · LEVEL 1–2', title:'Tennis Elbow Relief',
    desc:'Lateral epicondylitis causes persistent pain at the outer elbow. CryoTec\u2019s targeted cold reduces inflammation at the tendon insertion point — strap it on after a match or a long day at the desk.',
    tags:['Precise placement','Compact fit','20-minute session'],
    num:'06', img:'https://cryotec.ca/wp-content/uploads/2026/04/Tennis-test-photo.png' },
  { id:'wrist', mode:'cold', name:'Wrist Pain', type:'Cold',
    badge:'● COLD THERAPY · LEVEL 1–2', title:'Wrist & Carpal Tunnel Relief',
    desc:'Repetitive strain, carpal tunnel, or wrist tendinitis — CryoTec wraps the joint and delivers consistent cold to reduce swelling and pain. Small enough to wear while you work.',
    tags:['Low-profile design','Fits under sleeves','Hands-free relief'],
    num:'07', img:'https://cryotec.ca/wp-content/uploads/2026/03/C939FA5A-B018-4FA7-B4E3-496ABF9A30FF.png' },
];

function ConditionsSection() {
  const [active, setActive] = React.useState('muscle');
  const idx = COND_LIST.findIndex(c => c.id === active);
  const cond = COND_LIST[idx];

  return (
    <section className="cs-section">
      <style>{`
        .cs-section { background: #f7f7f5; padding: 20px 40px; font-family: 'Inter', system-ui, sans-serif; color: #111; }
        .cs-inner { max-width: none; margin: 0; }
        .cs-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #0066FF; display: inline-flex; align-items: center; gap: 8px; margin: 0 0 18px; }
        .cs-eyebrow::before { content:''; display: block; width: 20px; height: 1px; background: #0066FF; }
        .cs-title { font-family: 'Unna', Georgia, serif; font-size: clamp(28px, 3.5vw, 48px); font-weight: 700; letter-spacing: -0.035em; color: #111; line-height: 1.08; margin: 0 0 12px; }
        .cs-title em { color: #0066FF; font-style: italic; font-weight: 700; }
        .cs-sub { font-size: 16px; color: #555; font-weight: 400; line-height: 1.65; max-width: 480px; margin: 0 0 44px; }

        .cs-chips { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
        .cs-chip { display: inline-flex; align-items: center; gap: 7px; padding: 9px 16px; border-radius: 100px; border: 1px solid #e0e0de; background: #fff; cursor: pointer; font-family: inherit; flex-shrink: 0; transition: all 0.2s; }
        .cs-chip:hover { border-color: #ccc; }
        .cs-chip-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .cs-chip-name { font-size: 13px; font-weight: 500; color: #777; letter-spacing: -0.01em; transition: color 0.2s; }
        .cs-chip-type { font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #bbb; transition: color 0.2s; }
        .cs-chip.on.cold     { background: #f0f7ff; border-color: rgba(96,200,255,0.5); box-shadow: 0 2px 12px rgba(96,200,255,0.12); }
        .cs-chip.on.heat     { background: #fff5f0; border-color: rgba(255,100,32,0.4); box-shadow: 0 2px 12px rgba(255,100,32,0.10); }
        .cs-chip.on.contrast { background: #f2f4ff; border-color: rgba(0,102,255,0.3);  box-shadow: 0 2px 12px rgba(0,102,255,0.08); }
        .cs-chip.on.cold .cs-chip-name     { color: #004a99; }
        .cs-chip.on.heat .cs-chip-name     { color: #b03a00; }
        .cs-chip.on.contrast .cs-chip-name { color: #0033aa; }
        .cs-chip.on.cold .cs-chip-type     { color: #60c8ff; }
        .cs-chip.on.heat .cs-chip-type     { color: #ff6420; }
        .cs-chip.on.contrast .cs-chip-type { color: #0066FF; }

        /* V6 card design — 35/65 grid */
        .cs-spot { display: grid; grid-template-columns: 35fr 65fr; border-radius: 24px; overflow: hidden; height: 580px; position: relative; margin-bottom: 24px; }
        .cs-spot.cold {
          background:
            radial-gradient(ellipse 58% 88% at -5% 50%, rgba(96,200,255,0.35) 0%, rgba(96,200,255,0.10) 42%, transparent 65%),
            radial-gradient(ellipse 30% 48% at 18% 90%, rgba(96,200,255,0.18) 0%, transparent 55%),
            #000000;
          box-shadow: 0 0 0 1px rgba(96,200,255,0.09), 0 40px 100px rgba(0,0,0,0.92);
        }
        .cs-spot.heat {
          background:
            radial-gradient(ellipse 55% 85% at -5% 50%, rgba(255,119,64,0.14) 0%, rgba(255,119,64,0.04) 40%, transparent 65%),
            radial-gradient(ellipse 28% 45% at 18% 90%, rgba(255,119,64,0.08) 0%, transparent 55%),
            linear-gradient(150deg, #0e0603 0%, #090401 55%, #060302 100%);
          box-shadow: 0 0 0 1px rgba(255,119,64,0.06), 0 40px 100px rgba(0,0,0,0.82);
        }
        .cs-spot.contrast {
          background:
            radial-gradient(ellipse 52% 55% at -5% 18%, rgba(96,200,255,0.14) 0%, rgba(96,200,255,0.03) 40%, transparent 62%),
            radial-gradient(ellipse 52% 55% at -5% 82%, rgba(255,119,64,0.12) 0%, rgba(255,119,64,0.03) 40%, transparent 62%),
            linear-gradient(150deg, #020a12 0%, #010810 55%, #010609 100%);
          box-shadow: 0 0 0 1px rgba(120,160,255,0.05), 0 40px 100px rgba(0,0,0,0.82);
        }

        .cs-left { padding: 52px 52px 52px 56px; display: flex; flex-direction: column; justify-content: space-between; position: relative; z-index: 2; }
        .cs-content { animation: csFade 0.4s ease both; }
        @keyframes csFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .cs-badge { display: inline-flex; align-items: center; gap: 7px; padding: 6px 14px; border-radius: 999px; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 28px; width: fit-content; }
        .cs-spot.cold .cs-badge     { background: rgba(96,200,255,0.10); color: #60c8ff; border: 1px solid rgba(96,200,255,0.20); }
        .cs-spot.heat .cs-badge     { background: rgba(255,119,64,0.10); color: #ff7740; border: 1px solid rgba(255,119,64,0.20); }
        .cs-spot.contrast .cs-badge { background: rgba(96,200,255,0.08); color: #60c8ff; border: 1px solid rgba(96,200,255,0.18); }
        .cs-card-title { font-family: 'Unna', Georgia, serif; font-size: 32px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.15; color: #fff; margin: 0 0 16px; }
        .cs-card-desc { font-size: 14px; line-height: 1.75; color: rgba(255,255,255,0.82); margin: 0 0 24px; }
        .cs-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 32px; }
        .cs-tag { font-size: 11px; font-weight: 500; letter-spacing: 0.06em; padding: 5px 12px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.65); }

        .cs-cta { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; border-radius: 999px; font-size: 13px; font-weight: 600; letter-spacing: 0.06em; text-decoration: none; width: fit-content; transition: background 0.2s; }
        .cs-spot.cold .cs-cta     { background: rgba(96,200,255,0.12); border: 1px solid rgba(96,200,255,0.30); color: #fff; }
        .cs-spot.heat .cs-cta     { background: rgba(255,119,64,0.12); border: 1px solid rgba(255,119,64,0.30); color: #fff; }
        .cs-spot.contrast .cs-cta { background: rgba(96,200,255,0.08); border: 1px solid rgba(96,200,255,0.24); color: #fff; }
        .cs-spot.cold .cs-cta:hover     { background: rgba(96,200,255,0.18); color: #fff; }
        .cs-spot.heat .cs-cta:hover     { background: rgba(255,119,64,0.18); color: #fff; }
        .cs-spot.contrast .cs-cta:hover { background: rgba(96,200,255,0.14); color: #fff; }

        .cs-right { position: relative; overflow: hidden; z-index: 2; }
        .cs-img-wrap { position: absolute; inset: 0; }
        .cs-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .cs-overlay { position: absolute; inset: 0; pointer-events: none; }
        .cs-spot.cold .cs-overlay     { background: linear-gradient(to right, #000000 0%, rgba(0,0,0,0.65) 10%, rgba(0,0,0,0.0) 23%); }
        .cs-spot.heat .cs-overlay     { background: linear-gradient(to right, #090401 0%, rgba(9,4,1,0.65) 10%, rgba(9,4,1,0.0) 23%); }
        .cs-spot.contrast .cs-overlay { background: linear-gradient(to right, #020a12 0%, rgba(2,10,18,0.65) 10%, rgba(2,10,18,0.0) 23%); }
        .cs-num { position: absolute; top: 28px; right: 32px; font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.16em; color: rgba(255,255,255,0.4); z-index: 3; }

        .cs-pips { display: flex; align-items: center; gap: 10px; padding-top: 4px; }
        .cs-pip { width: 8px; height: 8px; border-radius: 50%; background: #d4d4d2; cursor: pointer; transition: all 0.25s; }
        .cs-pip:hover { background: #aaa; }
        .cs-pip.on.cold     { background: #60c8ff; box-shadow: 0 0 0 4px rgba(96,200,255,0.20); }
        .cs-pip.on.heat     { background: #ff7740; box-shadow: 0 0 0 4px rgba(255,119,64,0.20); }
        .cs-pip.on.contrast { background: #0066FF; box-shadow: 0 0 0 4px rgba(0,102,255,0.20); }
        .cs-pip-lbl { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 11px; font-weight: 500; letter-spacing: 0.12em; color: #999; margin-left: 12px; }

        /* ── Mobile ── */
        @media (max-width: 900px) {
          .cs-section { padding: 40px 20px; }
          .cs-title { font-size: clamp(26px, 7vw, 36px); }
          .cs-sub { font-size: 14px; margin-bottom: 28px; }
          .cs-chips { gap: 6px; margin-bottom: 18px;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            flex-wrap: nowrap;
            margin-left: -20px; margin-right: -20px;
            padding: 4px 20px 8px; }
          .cs-chips::-webkit-scrollbar { display: none; }
          .cs-chip { scroll-snap-align: start; flex-shrink: 0; padding: 8px 14px; }
          .cs-chip-name { font-size: 12px; }
          .cs-chip-type { font-size: 9px; }

          .cs-spot { grid-template-columns: 1fr; height: auto; min-height: 560px; }
          .cs-left { padding: 32px 28px 28px; order: 2; }
          .cs-right { order: 1; height: 240px; }
          .cs-spot.cold .cs-overlay,
          .cs-spot.heat .cs-overlay,
          .cs-spot.contrast .cs-overlay { background: linear-gradient(to top,
            rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.0) 60%); }
          .cs-card-title { font-size: 24px; margin-bottom: 12px; }
          .cs-card-desc { font-size: 14px; margin-bottom: 18px; }
          .cs-tags { margin-bottom: 22px; }
          .cs-num { top: 14px; right: 16px; }
          .cs-cta { padding: 12px 22px; font-size: 12px; }
        }
      `}</style>

      <div className="cs-inner">
        <p className="cs-eyebrow">What Can CryoTec Help With?</p>
        <h2 className="cs-title">Real recovery, <em>made simple</em>.</h2>
        <p className="cs-sub">A compact recovery device delivering focused cold and heat therapy to joints and areas of inflammation.</p>

        <div className="cs-chips">
          {COND_LIST.map(c => (
            <button key={c.id} className={`cs-chip ${c.mode}${c.id===active?' on':''}`} onClick={() => setActive(c.id)}>
              <span className="cs-chip-dot" style={{background: COND_DOT[c.mode]}} />
              <span className="cs-chip-name">{c.name}</span>
              <span className="cs-chip-type">{c.type}</span>
            </button>
          ))}
        </div>

        <div className={`cs-spot ${cond.mode}`} key={active}>
          <div className="cs-left">
            <div className="cs-content">
              <div className="cs-badge">{cond.badge}</div>
              <h3 className="cs-card-title">{cond.title}</h3>
              <p className="cs-card-desc">{cond.desc}</p>
              <div className="cs-tags">
                {cond.tags.map((t, i) => <span key={i} className="cs-tag">{t}</span>)}
              </div>
            </div>
            <a href="/our-science/" className="cs-cta">See the Science →</a>
          </div>
          <div className="cs-right">
            <div className="cs-img-wrap"><img src={cond.img} alt={cond.title} /></div>
            <div className="cs-overlay" />
            <div className="cs-num">{cond.num}</div>
          </div>
        </div>

        <div className="cs-pips">
          {COND_LIST.map((c) => (
            <div key={c.id} className={`cs-pip ${c.mode}${c.id===active?' on':''}`} onClick={() => setActive(c.id)} />
          ))}
          <span className="cs-pip-lbl">{idx+1} / {COND_LIST.length}</span>
        </div>
      </div>
    </section>
  );
}


/* ──────────────────────────────────────────────────────────────
   2. MODES SECTION — v30 sticky-scroll port
   The full Three modes / One device card with the same sticky-scroll
   behaviour as the standalone v30 prototype:
     • a 400vh outer .ct-track
     • a position:sticky inner shell that pins the card to the viewport
     • scrolling drives cold → heat → contrast transitions
     • level pills auto-cycle, contrast mode cross-fades temps & colour
   See modes-section-v30.jsx for the markup + controller. This wrapper
   provides the surrounding section header used elsewhere on the homepage.
   ────────────────────────────────────────────────────────────── */
function ModesSection() {
  return (
    <section className="ms-section-v30">
      <style>{`
        .ms-section-v30 { font-family: 'Inter', system-ui, sans-serif; color: #111; background: #f7f7f5; }
        .ms-section-v30 .ms-head {
          max-width: none;
          margin: 0;
          padding: 60px 40px 24px;
        }
        .ms-section-v30 .ms-eyebrow {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #0066FF;
          display: inline-flex; align-items: center; gap: 8px;
          margin: 0 0 18px;
        }
        .ms-section-v30 .ms-eyebrow::before {
          content:''; display: block;
          width: 20px; height: 1px; background: #0066FF;
        }
        .ms-section-v30 .ms-section-title {
          font-family: 'Unna', Georgia, serif;
          font-size: clamp(28px, 3.5vw, 48px);
          font-weight: 700; letter-spacing: -0.035em;
          color: #111; line-height: 1.08;
          margin: 0 0 12px;
        }
        .ms-section-v30 .ms-section-title em {
          color: #0066FF; font-style: italic; font-weight: 700;
        }
        .ms-section-v30 .ms-section-sub {
          font-size: 16px; color: #555;
          font-weight: 400; line-height: 1.65;
          max-width: 520px; margin: 0;
        }
        @media (max-width: 768px) {
          .ms-section-v30 .ms-head { padding: 40px 24px 16px; }
        }
        .ms-section-v30 [data-ct-track] { padding: 0 40px; }
        @media (max-width: 768px) {
          .ms-section-v30 [data-ct-track] { padding: 0; }
        }
      `}</style>

      <div className="ms-head">
        <p className="ms-eyebrow">Inside The Device</p>
        <h2 className="ms-section-title">Three modes. <em>One device.</em></h2>
        <p className="ms-section-sub">Scroll to see how Cold, Heat, and Contrast deliver clinically-meaningful temperatures from a single pocket-sized device.</p>
      </div>

      <ModesSectionV30 />
    </section>
  );
}


/* ──────────────────────────────────────────────────────────────
   6. LAUNCH FAQ SECTION — dark card with eyebrow + headline + sub + blue pill CTA
   ────────────────────────────────────────────────────────────── */
function LaunchFAQSection() {
  return (
    <section className="lf-section" id="launch-faq">
      <style>{`
        .lf-section { background: #f7f7f5; padding: 20px 40px; font-family: 'Inter', system-ui, sans-serif; }
        .lf-card { background: #0a0a0a; border-radius: 24px;
          padding: 60px 72px; max-width: none; margin: 0;
          display: grid; grid-template-columns: 1fr auto;
          align-items: center; gap: 48px; color: #fff;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.04), 0 18px 50px -20px rgba(0,0,0,0.20); }
        .lf-eyebrow { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 11px; font-weight: 600; letter-spacing: 0.24em; text-transform: uppercase;
          color: rgba(255,255,255,0.42); margin: 0 0 22px; }
        .lf-title { font-family: 'Unna', Georgia, serif; font-size: clamp(28px, 3vw, 40px);
          font-weight: 700; letter-spacing: -0.025em; line-height: 1.08;
          margin: 0 0 14px; color: #fff; }
        .lf-sub { font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.55);
          margin: 0; max-width: 560px; }
        .lf-cta { display: inline-flex; align-items: center; gap: 10px;
          padding: 18px 34px; border-radius: 999px; background: #0066FF;
          color: #fff; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
          letter-spacing: -0.005em; text-decoration: none; flex-shrink: 0;
          transition: background 0.25s, transform 0.25s, box-shadow 0.25s; }
        .lf-cta:hover { background: #0052cc; transform: translateY(-1px);
          box-shadow: 0 16px 40px rgba(0,102,255,0.34); color: #fff; }
        .lf-cta .arr { display: inline-flex; transition: transform 0.25s; font-weight: 500; }
        .lf-cta:hover .arr { transform: translateX(4px); }

        @media (max-width: 768px) {
          .lf-section { padding: 20px 24px; }
          .lf-card { grid-template-columns: 1fr; padding: 44px 32px; gap: 28px; }
          .lf-title { font-size: 26px; }
          .lf-cta { justify-content: center; }
        }
      `}</style>

      <div className="lf-card">
        <div>
          <p className="lf-eyebrow">Launch FAQ</p>
          <h3 className="lf-title">Questions about the launch?</h3>
          <p className="lf-sub">Shipping timelines, what&rsquo;s in the box, return policy &mdash; everything answered in one place.</p>
        </div>
        <a href="/faq/" className="lf-cta">Read the FAQ <span className="arr">&rarr;</span></a>
      </div>
    </section>
  );
}


/* ──────────────────────────────────────────────────────────────
   LANDING PAGE HERO VARIANTS
   Each calls HeroSection with custom copy + media for a specific
   ad audience. The rest of the homepage (comparison / conditions /
   modes / founder / FAQ / reviews) is unchanged.
   ────────────────────────────────────────────────────────────── */

function HeroRunners() {
  return (
    <HeroSection
      eyebrow="Shin Splint Recovery — Built for Runners"
      title={<React.Fragment>Shin splints? <em>Time to update your recovery routine.</em></React.Fragment>}
      desc={<React.Fragment>Targeted cold therapy at 8°C–12°C, applied right where shin splints hit, in the 20-minute window after your run. <strong>Recovery you can wear while you cool down.</strong></React.Fragment>}
      media={{ type: 'image', src: 'https://cryotec.ca/wp-content/uploads/2026/04/Running-Photo.png', objectPosition: 'center 35%' }}
    />
  );
}

function HeroKnee() {
  return (
    <HeroSection
      eyebrow="Knee Pain Relief — On the Move"
      title={<React.Fragment>Knee pain shouldn&rsquo;t <em>own your day.</em></React.Fragment>}
      desc={<React.Fragment>Whether it&rsquo;s runner&rsquo;s knee, post-surgical recovery, or chronic inflammation — CryoTec straps over the joint and holds a precise temperature for the full session. <strong>Wearable cold and heat, anywhere you are.</strong></React.Fragment>}
      media={{ type: 'video', src: 'https://cryotec.ca/wp-content/uploads/2026/05/Cryotec_Squat_Hero_DesktopC.mp4', poster: 'https://cryotec.ca/wp-content/uploads/2026/03/B11209D9-4F64-411D-8FD4-8D4EAB72981D.png', objectPosition: '30% center' }}
    />
  );
}

function HeroTennis() {
  return (
    <HeroSection
      eyebrow="Tennis Elbow Relief — Court to Couch"
      title={<React.Fragment>Serving more recovery to your <em>tennis elbow.</em></React.Fragment>}
      desc={<React.Fragment>Targeted cold over the tendon insertion point reduces inflammation between matches and at the end of the day — when tennis elbow hits hardest. <strong>Strap it on. Get back to your swing.</strong></React.Fragment>}
      media={{ type: 'image', src: 'https://cryotec.ca/wp-content/uploads/2026/04/Tennis-test-photo.png', objectPosition: 'center 30%' }}
    />
  );
}

function HeroWrist() {
  return (
    <HeroSection
      eyebrow="Wrist & Carpal Tunnel Relief"
      title={<React.Fragment>Portable recovery for your wrist pain <em>like it&rsquo;s 2026.</em></React.Fragment>}
      desc={<React.Fragment>Low-profile, wearable cold therapy that fits under sleeves and at your desk. Eases swelling and pain from carpal tunnel, repetitive strain, and chronic tendinitis. <strong>Eight-hour shifts without the ache.</strong></React.Fragment>}
      media={{ type: 'image', src: 'https://cryotec.ca/wp-content/uploads/2026/04/Stretching-Calf-Cryotec-004-Selected.png', objectPosition: 'center center' }}
    />
  );
}

Object.assign(window, {
  ConditionsSection, ModesSection, HeroSection,
  FounderSection, ReviewsSection, LaunchFAQSection,
  HeroRunners, HeroKnee, HeroTennis, HeroWrist
});


/* ──────────────────────────────────────────────────────────────
   3. HERO SECTION — video background, content right, trust bar
   Desktop: full row of 4 trust items with dividers
   Mobile (≤768): rotating carousel of trust items, 2.5s interval
   ────────────────────────────────────────────────────────────── */
const TRUST_ITEMS = [
  { stars: '★★★★★', text: '5.0 from early testers' },
  { text: '30-Day Risk-Free Guarantee' },
  { text: 'Free Shipping over $100' },
  { text: 'Designed & Made in Canada' },
];

// Brevo embed-form action URL. To wire up the live "Notify Me on Launch"
// dropdown, replace this with your form's submit URL from Brevo's "Forms"
// dashboard (Forms › your form › Share → copy the form action attribute,
// usually https://YOUR-SUBDOMAIN.sendinblue.com/…/submit or similar).
const BREVO_FORM_URL = 'https://YOUR-BREVO-FORM-URL.example.com/submit';

function HeroSection({ eyebrow, title, desc, media } = {}) {
  // Defaults: the main homepage hero. Landing pages pass their own props.
  if (eyebrow === undefined) eyebrow = 'Wearable Cold, Heat and Contrast Therapy';
  if (title === undefined)   title   = (<React.Fragment>Wearable hot and cold recovery, <em>redesigned.</em></React.Fragment>);
  if (desc === undefined)    desc    = (<React.Fragment>Portable cold, heat, and contrast therapy designed for athletes — <strong>reduce pain, ease inflammation, and stay moving.</strong></React.Fragment>);
  if (media === undefined)   media   = { type: 'video', src: 'https://cryotec.ca/wp-content/uploads/2026/05/Cryotec_Squat_Hero_DesktopC.mp4', poster: 'https://cryotec.ca/wp-content/uploads/2026/03/B11209D9-4F64-411D-8FD4-8D4EAB72981D.png', objectPosition: '30% center' };

  const [trustIdx, setTrustIdx] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTrustIdx(i => (i+1) % TRUST_ITEMS.length), 2500);
    return () => clearInterval(id);
  }, []);

  // Notify-me dropdown — opens an inline panel below the CTAs with an
  // email input that posts to the Brevo form (BREVO_FORM_URL above).
  // The submit handler triggers the actual <form> POST and flips the UI
  // into a "thanks" state so the user gets confirmation without leaving
  // the page (the form opens its Brevo confirmation in a new tab).
  const [notifyOpen, setNotifyOpen] = React.useState(false);
  const [notifySent, setNotifySent] = React.useState(false);
  const notifyInputRef = React.useRef(null);
  const closeNotify = () => { setNotifyOpen(false); setNotifySent(false); };

  React.useEffect(() => {
    if (notifyOpen && notifyInputRef.current) {
      // small delay so the slide-down animation isn't fighting focus
      const t = setTimeout(() => notifyInputRef.current && notifyInputRef.current.focus(), 220);
      return () => clearTimeout(t);
    }
  }, [notifyOpen]);

  // Close on Escape
  React.useEffect(() => {
    if (!notifyOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') closeNotify(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [notifyOpen]);

  return (
    <section className="hs-section">
      <style>{`
        .hs-section { position: relative; height: min(840px, 100vh); min-height: 540px;
          background: #000; overflow: hidden;
          font-family: 'Inter', system-ui, sans-serif; color: #fff; }
        .hs-video { position: absolute; inset: 0; z-index: 0; }
        .hs-video video, .hs-video img { width: 100%; height: 100%; object-fit: cover; display: block; }
        /* Subtle right-side fade for legibility */
        .hs-grad { position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(to right,
            rgba(0,0,0,0.05) 0%,
            rgba(0,0,0,0.10) 35%,
            rgba(0,0,0,0.60) 65%,
            rgba(0,0,0,0.85) 100%); }
        .hs-grad::after { content:''; position: absolute; inset: 0;
          background: linear-gradient(to bottom,
            rgba(0,0,0,0.45) 0%, transparent 20%, transparent 60%, rgba(0,0,0,0.55) 100%); }

        .hs-inner { position: relative; z-index: 2; height: 100%;
          padding: 60px 80px 110px 40px;
          display: flex; align-items: center; justify-content: flex-end; }
        .hs-copy { max-width: 540px; width: 100%; opacity: 0; transform: translateY(18px);
          animation: hsIn 1s cubic-bezier(.2,.6,.2,1) 0.2s forwards; }
        @keyframes hsIn { to { opacity: 1; transform: translateY(0); } }

        .hs-eyebrow { display: flex; align-items: center; gap: 10px;
          font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 11px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase;
          color: #60c8ff; margin: 0 0 22px; }
        .hs-eyebrow::before { content:''; width: 22px; height: 1px; background: #60c8ff; display: block;
          box-shadow: 0 0 8px rgba(96,200,255,0.5); }
        .hs-title { font-family: 'Unna', Georgia, serif; font-weight: 700;
          font-size: clamp(36px, 4.6vw, 60px); line-height: 1.04; letter-spacing: -0.035em;
          color: #fff; margin: 0 0 18px; }
        .hs-title em { font-style: italic; color: #60c8ff; }
        .hs-desc { font-size: 15px; line-height: 1.65; color: rgba(255,255,255,0.68);
          max-width: 470px; margin: 0 0 24px; font-weight: 400; }
        .hs-desc strong { color: #fff; font-weight: 600; }

        .hs-price { display: flex; align-items: baseline; gap: 14px; flex-wrap: wrap; margin-bottom: 22px; }
        .hs-price-now { font-family: 'Unna', Georgia, serif; font-size: 32px; font-weight: 400; color: #fff; letter-spacing: -0.02em; }
        .hs-price-was { font-size: 16px; color: rgba(255,255,255,0.35); text-decoration: line-through; }
        .hs-price-tag { display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 11px; border-radius: 100px; background: rgba(96,200,255,0.12);
          font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 10px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase;
          color: #60c8ff; border: 1px solid rgba(96,200,255,0.25); }

        .hs-btns { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
        .hs-btn { display: inline-flex; align-items: center; gap: 10px;
          padding: 16px 28px; border-radius: 999px;
          font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
          letter-spacing: 0.06em; text-decoration: none; cursor: pointer;
          transition: transform 0.25s, box-shadow 0.25s, background 0.25s, color 0.25s; }
        .hs-btn-primary { background: #0066FF; color: #fff; border: 1.5px solid #0066FF; }
        .hs-btn-primary:hover { background: #0052cc; border-color: #0052cc; color: #fff;
          transform: translateY(-1px); box-shadow: 0 20px 50px -12px rgba(0,102,255,0.50); }
        .hs-btn-ghost { background: transparent; color: #fff; border: 1.5px solid rgba(255,255,255,0.25); }
        .hs-btn-ghost:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.4); }

        /* Notify-me dropdown — premium glass panel */
        .hs-notify-trigger { cursor: pointer; font-family: inherit; }
        .hs-notify-trigger .caret { font-size: 9px; line-height: 1;
          transition: transform 0.35s cubic-bezier(.2,.6,.2,1);
          display: inline-block; margin-left: 4px; opacity: 0.85; }
        .hs-notify-trigger.is-open { background: rgba(0,102,255,0.18); border-color: rgba(0,102,255,0.55); color: #fff; }
        .hs-notify-trigger.is-open .caret { transform: rotate(180deg); opacity: 1; }

        .hs-notify { margin-top: 0;
          max-width: 480px; overflow: hidden;
          max-height: 0; opacity: 0;
          transform: translateY(-12px) scale(0.96);
          transform-origin: top right;
          transition: max-height 0.5s cubic-bezier(.2,.7,.2,1),
                      opacity 0.35s cubic-bezier(.2,.7,.2,1),
                      transform 0.5s cubic-bezier(.2,.7,.2,1),
                      margin-top 0.5s cubic-bezier(.2,.7,.2,1);
          pointer-events: none; }
        .hs-notify.open { max-height: 180px; opacity: 1;
          transform: translateY(0) scale(1); margin-top: 18px; pointer-events: auto; }
        .hs-notify-form {
          background: linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%);
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 18px; padding: 8px 8px 8px 8px;
          backdrop-filter: blur(28px) saturate(140%); -webkit-backdrop-filter: blur(28px) saturate(140%);
          box-shadow:
            0 24px 60px -12px rgba(0,0,0,0.55),
            0 4px 14px -2px rgba(0,0,0,0.25),
            inset 0 1px 0 rgba(255,255,255,0.10); }
        .hs-notify-row { display: flex; align-items: stretch; gap: 6px;
          position: relative; }
        .hs-notify-row::before {
          content: '\\2709';
          position: absolute; left: 18px; top: 50%; transform: translateY(-50%);
          font-size: 14px; color: rgba(255,255,255,0.45);
          pointer-events: none; z-index: 1;
        }
        .hs-notify-input { flex: 1 1 auto; min-width: 0;
          background: rgba(0,0,0,0.32);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 999px; padding: 13px 18px 13px 42px;
          color: #fff; font: 500 14px/1 'Inter', sans-serif;
          letter-spacing: -0.005em;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s; }
        .hs-notify-input::placeholder { color: rgba(255,255,255,0.42); font-weight: 400; }
        .hs-notify-input:focus { outline: none;
          border-color: rgba(0,102,255,0.7);
          background: rgba(0,0,0,0.42);
          box-shadow: 0 0 0 3px rgba(0,102,255,0.22); }
        .hs-notify-submit { flex: 0 0 auto;
          background: #0066FF; color: #fff; border: 0;
          border-radius: 999px; padding: 13px 22px;
          font: 600 13px/1 'Inter', sans-serif;
          letter-spacing: 0.02em; cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px;
          transition: background 0.25s, transform 0.25s, box-shadow 0.25s; }
        .hs-notify-submit:hover { background: #0052cc;
          transform: translateY(-1px);
          box-shadow: 0 16px 36px -10px rgba(0,102,255,0.55); }
        .hs-notify-submit:active { transform: translateY(0); }
        .hs-notify-submit .arr { transition: transform 0.2s; font-weight: 500; }
        .hs-notify-submit:hover .arr { transform: translateX(3px); }
        .hs-notify-thanks { display: flex; align-items: center; gap: 14px;
          background: linear-gradient(180deg, rgba(0,102,255,0.16) 0%, rgba(0,102,255,0.08) 100%);
          border: 1px solid rgba(0,102,255,0.34);
          border-radius: 18px; padding: 16px 18px;
          backdrop-filter: blur(28px) saturate(140%); -webkit-backdrop-filter: blur(28px) saturate(140%);
          color: rgba(255,255,255,0.88); font-size: 13px; line-height: 1.4; }
        .hs-notify-thanks > div { flex: 1 1 auto; display: flex; flex-direction: column; gap: 2px; }
        .hs-notify-thanks strong { font-family: 'Unna', Georgia, serif;
          font-style: italic; font-weight: 700; font-size: 18px;
          color: #fff; letter-spacing: -0.01em; }
        .hs-notify-thanks-check { width: 30px; height: 30px; flex-shrink: 0;
          border-radius: 50%; background: #0066FF; color: #fff;
          display: inline-flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 15px;
          box-shadow: 0 4px 14px rgba(0,102,255,0.50); }
        .hs-notify-close { background: transparent; border: 0; color: rgba(255,255,255,0.55);
          font: inherit; cursor: pointer; padding: 4px 8px;
          line-height: 1; font-size: 13px;
          transition: color 0.2s; }
        .hs-notify-close:hover { color: #fff; }

        .hs-scarcity { display: inline-flex; align-items: baseline; gap: 10px; flex-wrap: wrap;
          font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 12px; line-height: 1.6; letter-spacing: 0.01em;
          color: rgba(255,255,255,0.55); margin-top: 6px; }
        .hs-scarcity .pulse { position: relative; top: 1px;
          width: 7px; height: 7px; border-radius: 50%; background: #60c8ff;
          box-shadow: 0 0 10px #60c8ff;
          animation: hsPulse 1.8s ease-in-out infinite; flex-shrink: 0; }
        .hs-scarcity strong { color: #fff; font-weight: 700; }
        .hs-scarcity a { color: #60c8ff; text-decoration: underline;
          text-underline-offset: 3px; text-decoration-thickness: 1px;
          transition: color 0.2s; }
        .hs-scarcity a:hover { color: #b0e0ff; }
        @keyframes hsPulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.7); } }

        /* Trust bar — absolute at hero bottom, always above the fold */
        .hs-trust { position: absolute; bottom: 0; left: 0; right: 0; z-index: 3;
          background: rgba(8,8,8,0.72);
          backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 0 24px; }
        .hs-trust-row { display: flex; align-items: center; justify-content: center; flex-wrap: nowrap; }
        .hs-tb-item { display: flex; align-items: center; gap: 8px;
          padding: 14px 26px;
          font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500;
          color: rgba(255,255,255,0.62); letter-spacing: 0.02em; white-space: nowrap; }
        .hs-tb-item a { color: inherit; text-decoration: none; transition: color 0.2s; }
        .hs-tb-item a:hover { color: #fff; }
        .hs-tb-stars { color: #FFD700; font-size: 12px; letter-spacing: 2px; }
        .hs-tb-div { width: 1px; height: 22px; background: rgba(255,255,255,0.10); flex-shrink: 0; }

        /* Mobile trust bar — rotator */
        .hs-trust-mobile { display: none; position: relative; height: 48px;
          align-items: center; justify-content: center; overflow: hidden; }
        .hs-trust-mobile .hs-tb-item-mobile { position: absolute; left: 0; right: 0;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.7); letter-spacing: 0.02em;
          opacity: 0; transform: translateY(8px);
          transition: opacity 0.5s cubic-bezier(.2,.6,.2,1), transform 0.5s cubic-bezier(.2,.6,.2,1);
          pointer-events: none; }
        .hs-trust-mobile .hs-tb-item-mobile.on { opacity: 1; transform: translateY(0); }
        .hs-trust-progress { position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: rgba(255,255,255,0.06); }
        .hs-trust-progress::after { content:''; position: absolute; top: 0; left: 0; height: 100%;
          width: 100%; background: linear-gradient(90deg, #60c8ff, rgba(96,200,255,0.4));
          transform-origin: left; transform: scaleX(0);
          animation: hsTrustProg 2.5s linear infinite; }
        @keyframes hsTrustProg { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }

        /* Responsive: trust bar swaps row → mobile rotator */
        @media (max-width: 768px) {
          .hs-section { height: 100vh; min-height: 540px; }
          .hs-inner { padding: 80px 22px 100px;
            justify-content: flex-start; align-items: flex-end; }
          .hs-copy { max-width: 100%; }
          .hs-title { font-size: clamp(28px, 8vw, 40px); }
          .hs-desc { font-size: 14px; max-width: none; }
          .hs-btns { gap: 8px; }
          .hs-btn { padding: 13px 22px; font-size: 12px; }
          .hs-notify { max-width: none; }
          .hs-notify-row { flex-direction: column; }
          .hs-notify-submit { width: 100%; justify-content: center; }
          .hs-trust-row { display: none; }
          .hs-trust-mobile { display: flex; }
        }
      `}</style>

      <div className="hs-video">
        {media.type === 'image' ? (
          <img src={media.src} alt="" style={{objectPosition: media.objectPosition || 'center center'}} />
        ) : (
          <video autoPlay muted loop playsInline preload="auto"
                 poster={media.poster}
                 style={{objectPosition: media.objectPosition || '30% center'}}>
            <source src={media.src} type="video/mp4" />
          </video>
        )}
      </div>
      <div className="hs-grad" />

      <div className="hs-inner">
        <div className="hs-copy">
          <p className="hs-eyebrow">{eyebrow}</p>
          <h1 className="hs-title">{title}</h1>
          <p className="hs-desc">{desc}</p>
          <div className="hs-price">
            <span className="hs-price-now">$75.99</span>
            <span className="hs-price-was">$109.99</span>
            <span className="hs-price-tag">Save 31%</span>
          </div>
          <div className="hs-btns">
            <a href="/product/cryotec/" className="hs-btn hs-btn-primary">Shop CryoTec →</a>
            <button
              type="button"
              className={`hs-btn hs-btn-ghost hs-notify-trigger ${notifyOpen ? 'is-open' : ''}`}
              onClick={() => setNotifyOpen(o => !o)}
              aria-expanded={notifyOpen}
              aria-controls="hs-notify-panel"
            >
              Notify Me on Launch
              <span className="caret" aria-hidden="true">▾</span>
            </button>
          </div>

          {/* Brevo notify dropdown — slides in below the CTA row */}
          <div
            id="hs-notify-panel"
            className={`hs-notify ${notifyOpen ? 'open' : ''}`}
            aria-hidden={!notifyOpen}
          >
            {!notifySent ? (
              <form
                className="hs-notify-form"
                action={BREVO_FORM_URL}
                method="POST"
                target="_blank"
                onSubmit={() => {
                  // Let the real form POST through to Brevo (opens their
                  // confirmation page in a new tab); flip to in-page
                  // success state so this form collapses cleanly.
                  setTimeout(() => setNotifySent(true), 100);
                }}
              >
                <div className="hs-notify-row">
                  <input
                    ref={notifyInputRef}
                    type="email"
                    name="EMAIL"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="hs-notify-input"
                    aria-label="Email address"
                  />
                  <button type="submit" className="hs-notify-submit">
                    Notify Me <span className="arr">→</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="hs-notify-thanks" role="status">
                <div className="hs-notify-thanks-check" aria-hidden="true">✓</div>
                <div>
                  <strong>You&rsquo;re on the list.</strong>
                  <span>We&rsquo;ll email you the moment CryoTec is ready to ship.</span>
                </div>
                <button type="button" className="hs-notify-close" onClick={closeNotify} aria-label="Close">✕</button>
              </div>
            )}
          </div>
          <div className="hs-scarcity"><span className="pulse" /><span>Only <strong>500 launch units</strong> available at this price. <a href="#launch-faq">Read the Launch FAQ</a></span></div>
        </div>
      </div>

      <div className="hs-trust">
        {/* Desktop: full row */}
        <div className="hs-trust-row">
          {TRUST_ITEMS.map((item, i) => (
            <React.Fragment key={i}>
              <div className="hs-tb-item">
                {item.stars && <span className="hs-tb-stars">{item.stars}</span>}
                <span>{item.text}</span>
              </div>
              {i < TRUST_ITEMS.length - 1 && <div className="hs-tb-div" />}
            </React.Fragment>
          ))}
        </div>
        {/* Mobile: rotator */}
        <div className="hs-trust-mobile">
          {TRUST_ITEMS.map((item, i) => (
            <div key={i} className={`hs-tb-item-mobile ${i===trustIdx?'on':''}`}>
              {item.stars && <span className="hs-tb-stars">{item.stars}</span>}
              <span>{item.text}</span>
            </div>
          ))}
          <div className="hs-trust-progress" />
        </div>
      </div>
    </section>
  );
}


/* ──────────────────────────────────────────────────────────────
   4. FOUNDER SECTION — story card with photo, quote, arrow
   ────────────────────────────────────────────────────────────── */
function FounderSection() {
  return (
    <section className="fs-section">
      <style>{`
        .fs-section { background: #f7f7f5; padding: 20px 40px; font-family: 'Inter', system-ui, sans-serif; color: #111; }
        .fs-inner { max-width: none; margin: 0; }
        .fs-eyebrow { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 11px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase;
          color: #0066FF; display: inline-flex; align-items: center; gap: 8px;
          margin: 0 0 18px; }
        .fs-eyebrow::before { content:''; display: block; width: 20px; height: 1px; background: #0066FF; }
        .fs-title { font-family: 'Unna', Georgia, serif; font-size: clamp(28px, 3.5vw, 48px);
          font-weight: 700; letter-spacing: -0.035em; color: #111; line-height: 1.08;
          margin: 0 0 40px; }
        .fs-title em { color: #0066FF; font-style: italic; font-weight: 700; }

        .fs-card { display: grid; grid-template-columns: auto 1fr auto;
          align-items: center; gap: 36px;
          background: #fff; border-radius: 24px; border: 1px solid rgba(17,17,17,0.06);
          padding: 44px 52px; max-width: none;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02), 0 12px 40px -16px rgba(4,17,30,0.10);
          transition: transform 0.3s cubic-bezier(.2,.6,.2,1), box-shadow 0.3s; text-decoration: none; }
        .fs-card:hover { transform: translateY(-2px); box-shadow: 0 1px 3px rgba(0,0,0,0.02), 0 24px 56px -16px rgba(4,17,30,0.14); }

        .fs-photo { width: 84px; height: 84px; border-radius: 50%; object-fit: cover;
          border: 3px solid rgba(0,102,255,0.12);
          background: linear-gradient(135deg, #e0e0e0, #c8c8c6); flex-shrink: 0; }
        .fs-body { min-width: 0; }
        .fs-name { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase;
          color: #0066FF; margin: 0 0 12px; }
        .fs-quote { font-family: 'Unna', Georgia, serif; font-size: 22px; font-style: italic;
          font-weight: 700; line-height: 1.45; color: #111; margin: 0 0 12px; letter-spacing: -0.015em; }
        .fs-sub { font-size: 14px; color: #555; line-height: 1.65; margin: 0; max-width: 640px; }
        .fs-arrow { display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 26px; border: 1.5px solid rgba(17,17,17,0.12); border-radius: 999px;
          font-size: 13px; font-weight: 600; color: #111; flex-shrink: 0;
          transition: background 0.25s, color 0.25s, border-color 0.25s, transform 0.25s; }
        .fs-card:hover .fs-arrow { background: #111; color: #fff; border-color: #111; }
        .fs-arrow .arr { display: inline-flex; transition: transform 0.25s; font-weight: 500; }
        .fs-card:hover .fs-arrow .arr { transform: translateX(4px); }

        @media (max-width: 900px) {
          .fs-section { padding: 20px 24px; }
          .fs-card { grid-template-columns: 1fr; padding: 32px 28px; gap: 20px; text-align: left; }
          .fs-arrow { justify-self: flex-start; }
          .fs-quote { font-size: 19px; }
        }
      `}</style>

      <div className="fs-inner">
        <p className="fs-eyebrow">Our Story</p>
        <h2 className="fs-title">Built by an athlete,<br /><em>for athletes.</em></h2>
        <a href="/about/" className="fs-card">
          <img className="fs-photo" src="https://cryotec.ca/wp-content/uploads/2026/03/Indoor-Gym-Photo.png" alt="Brenden — Founder, CryoTec" loading="lazy" />
          <div className="fs-body">
            <p className="fs-name">Brenden · Founder, CryoTec</p>
            <blockquote className="fs-quote">&ldquo;Let&rsquo;s face it, icing and heat therapy is inconvenient. It requires most people to be at home to do it, and that&rsquo;s exactly why it&rsquo;s something we typically don&rsquo;t do enough of in our recovery routine.&rdquo;</blockquote>
            <p className="fs-sub">CryoTec started as a personal problem as an avid runner. After years of dealing with shin splints during training blocks, I couldn&rsquo;t find a portable solution that provided me recovery on the go.</p>
          </div>
          <span className="fs-arrow">Read the Story <span className="arr">→</span></span>
        </a>
      </div>
    </section>
  );
}


/* ──────────────────────────────────────────────────────────────
   5. REVIEWS SECTION — image left, rotating review cards right
   Auto-cycles every 6 seconds, dots are clickable to jump
   ────────────────────────────────────────────────────────────── */
const REVIEWS_DATA = [
  { stars:'★★★★★', init:'T', name:'Taylor', sub:'ACL Tear Recovery · April 22, 2026',
    body:'\u201cI tore my ACL and am so happy I found CryoTec! It has been a major part of my recovery — from icing my knee multiple times a day to warming it up before gym PT sessions. It\u2019s become part of my daily routine, and I bring it almost everywhere with me.\u201d' },
  { stars:'★★★★★', init:'M', name:'Marcus T.', sub:'Marathon runner · Toronto',
    body:'\u201cUsed it after every run this week. Shin splints that usually last 3 days were gone in one. This is the product I didn\u2019t know I needed.\u201d' },
  { stars:'★★★★★', init:'S', name:'Sarah L.', sub:'CrossFit athlete · Calgary',
    body:'\u201cThe contrast mode is a game changer. I used to spend 40 minutes switching ice packs and heating pads. Now I just strap CryoTec on and go. My recovery time has been cut in half.\u201d' },
  { stars:'★★★★★', init:'D', name:'Daniel R.', sub:'Cyclist · Vancouver',
    body:'\u201cMy knee has been a problem for two years. First week with CryoTec and I\u2019m back to full training. The precision temperature control makes all the difference compared to ice packs.\u201d' },
];

function ReviewsSection() {
  const [idx, setIdx] = React.useState(0);
  const [fading, setFading] = React.useState(false);

  React.useEffect(() => {
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIdx(i => (i + 1) % REVIEWS_DATA.length);
        setFading(false);
      }, 400);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const jumpTo = (n) => {
    if (n === idx) return;
    setFading(true);
    setTimeout(() => { setIdx(n); setFading(false); }, 400);
  };

  const r = REVIEWS_DATA[idx];

  return (
    <section className="rs-section">
      <style>{`
        .rs-section { background: #f7f7f5; padding: 20px 40px; font-family: 'Inter', system-ui, sans-serif; color: #111; overflow: hidden; }
        .rs-inner { max-width: none; margin: 0; }
        .rs-eyebrow { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 11px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase;
          color: #0066FF; display: inline-flex; align-items: center; gap: 8px;
          margin: 0 0 18px; }
        .rs-eyebrow::before { content:''; display: block; width: 20px; height: 1px; background: #0066FF; }
        .rs-title { font-family: 'Unna', Georgia, serif; font-size: clamp(28px, 3.5vw, 48px);
          font-weight: 700; letter-spacing: -0.035em; color: #111; line-height: 1.08;
          margin: 0 0 28px; }
        .rs-title em { color: #0066FF; font-style: italic; font-weight: 700; }

        .rs-row { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: end; min-height: 480px; }

        /* Image bleeds to the bottom-left corner of the page — left edge flush to screen left, bottom edge flush to screen bottom */
        .rs-img-col { position: relative; margin-left: -40px; margin-bottom: -20px;
          align-self: end;
          display: flex; align-items: flex-end; justify-content: flex-start; }
        .rs-img-wrap { position: relative; display: flex; justify-content: flex-start; align-items: flex-end; }
        .rs-img-wrap::before { content:''; position: absolute; left: 8%; top: 8%; right: 30%; bottom: 0;
          background: radial-gradient(ellipse at 30% 70%, rgba(0,102,255,0.10) 0%, transparent 60%);
          filter: blur(40px); z-index: 0; pointer-events: none; }
        .rs-img-wrap img { position: relative; z-index: 1; display: block;
          width: 100%; max-width: 620px; height: auto; }

        .rs-card-col { padding: 32px 0; }

        .rs-card { background: #fff; border-radius: 18px; padding: 38px 42px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.02), 0 16px 40px -20px rgba(0,30,80,0.16);
          transition: opacity 0.4s ease; }
        .rs-card.fading { opacity: 0.25; }
        .rs-stars { color: #0066FF; font-size: 18px; letter-spacing: 3px; margin: 0 0 20px; }
        .rs-body { font-family: 'Unna', Georgia, serif; font-size: 21px; line-height: 1.5;
          font-weight: 400; color: #1a1a1a; margin: 0 0 28px; letter-spacing: -0.005em; }
        .rs-author-row { display: flex; align-items: center; gap: 14px;
          padding-top: 22px; border-top: 1px solid rgba(17,17,17,0.06); }
        .rs-avatar { width: 44px; height: 44px; border-radius: 50%;
          background: linear-gradient(135deg, #0066FF, #60c8ff);
          color: #fff; display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 700; letter-spacing: -0.01em; flex-shrink: 0; }
        .rs-author-info { flex: 1; min-width: 0; }
        .rs-author-name { font-family: 'Inter', sans-serif; font-weight: 600; font-size: 15px; line-height: 1.3; color: #111; }
        .rs-author-sub { font-family: 'Inter', sans-serif; font-weight: 400; font-size: 13px; line-height: 1.3; color: #777; margin-top: 2px; }
        .rs-verified { display: inline-flex; align-items: center; gap: 5px;
          font-family: 'Inter', sans-serif; font-weight: 500; font-size: 11px; line-height: 1;
          color: #16a34a; padding: 5px 10px; border-radius: 999px;
          background: rgba(22,163,74,0.08); border: 1px solid rgba(22,163,74,0.18); flex-shrink: 0; }
        .rs-verified::before { content:'\u2713'; font-size: 11px; font-weight: 700; }

        .rs-dots { display: flex; gap: 8px; justify-content: center; margin: 28px 0 0; padding: 0; }
        .rs-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(17,17,17,0.18);
          border: none; cursor: pointer; transition: all 0.3s; padding: 0; }
        .rs-dot:hover { background: rgba(17,17,17,0.35); }
        .rs-dot.on { background: #0066FF; width: 24px; border-radius: 100px; box-shadow: 0 0 0 4px rgba(0,102,255,0.12); }

        .rs-all { display: inline-flex; align-items: center; gap: 8px;
          margin: 22px auto 0; text-decoration: none;
          font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
          letter-spacing: 0.01em; color: #0066FF;
          padding: 10px 18px; border-radius: 999px;
          border: 1px solid rgba(0,102,255,0.20);
          background: rgba(0,102,255,0.04);
          transition: background 0.2s, border-color 0.2s, transform 0.2s, box-shadow 0.2s;
          justify-self: center; align-self: center;
          width: fit-content; }
        .rs-all:hover { background: rgba(0,102,255,0.10);
          border-color: rgba(0,102,255,0.40);
          transform: translateY(-1px);
          box-shadow: 0 10px 28px -10px rgba(0,102,255,0.30); }
        .rs-all .arr { transition: transform 0.2s; font-weight: 500; }
        .rs-all:hover .arr { transform: translateX(3px); }
        .rs-card-col { display: flex; flex-direction: column; align-items: stretch; }
        .rs-card-col .rs-dots { align-self: center; }

        @media (max-width: 900px) {
          .rs-section { padding: 20px 24px; }
          .rs-row { grid-template-columns: 1fr; gap: 0; }
          /* Mobile: review card first, image below (bleeds bottom-left) */
          .rs-img-col { order: 2; margin-top: 24px;
            margin-left: -24px; margin-right: -24px; margin-bottom: -20px; }
          .rs-img-wrap { margin: 0; justify-content: flex-start; }
          .rs-img-wrap img { max-height: 380px; width: 100%; max-width: 480px; }
          .rs-card-col { order: 1; padding: 0; }
          .rs-card { padding: 28px 24px; }
          .rs-body { font-size: 17px; }
        }
      `}</style>

      <div className="rs-inner">
        <header className="rs-header">
          <p className="rs-eyebrow">Reviews</p>
          <h2 className="rs-title">What athletes <em>are saying.</em></h2>
        </header>

        <div className="rs-row">
          <div className="rs-img-col">
            <div className="rs-img-wrap">
              <img src="https://cryotec.ca/wp-content/uploads/2026/05/Hand-Transparent_Comp.png"
                   alt="Hand holding CryoTec recovery device" loading="lazy" />
            </div>
          </div>
          <div className="rs-card-col">
            <div className={`rs-card ${fading?'fading':''}`}>
              <div className="rs-stars">{r.stars}</div>
              <p className="rs-body">{r.body}</p>
              <div className="rs-author-row">
                <div className="rs-avatar">{r.init}</div>
                <div className="rs-author-info">
                  <div className="rs-author-name">{r.name}</div>
                  <div className="rs-author-sub">{r.sub}</div>
                </div>
                <span className="rs-verified">Verified Buyer</span>
              </div>
            </div>
            <div className="rs-dots">
              {REVIEWS_DATA.map((_, i) => (
                <button key={i} className={`rs-dot ${i===idx?'on':''}`}
                  onClick={() => jumpTo(i)} aria-label={`Review ${i+1}`} />
              ))}
            </div>
            <a className="rs-all" href="https://cryotec.ca/product/cryotec/#reviews">
              Read all verified reviews on the product page <span className="arr">&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
