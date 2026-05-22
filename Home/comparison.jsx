/* CryoTec — "What problem does this solve?" comparison section
   Three variations, all using site tokens (Inter + Unna, #0066FF / #ff6420 / #60c8ff).
*/

const COMPARISONS = [
  {
    problem: "Ice packs usually require you to be at home to start recovery.",
    solution: "Cryotec provides a range of cooling \u2014 from numbing cold to comfortable cooling \u2014 whenever you need it.",
  },
  {
    problem: "Heating pads are stationary and require cords.",
    solution: "Cryotec packs a range of heating modes into a compact, portable device.",
  },
  {
    problem: "Contrast therapy requires switching between ice packs and heating pads continuously.",
    solution: "Cryotec has a built-in contrast therapy mode that switches between cooling and heating every 5 minutes.",
  },
  {
    problem: "Ice packs are always too cold, and then not cold enough.",
    solution: "Cryotec maintains a steady 8\u00B0C, 12\u00B0C, or 16\u00B0C for the full 20-minute recovery session.",
  },
];

/* ──────────────────────────────────────────────────────────────
   V1 — Editorial Split (light, refined)
   ────────────────────────────────────────────────────────────── */
function VariationEditorial() {
  return (
    <div className="cmp1">
      <style>{`
        .cmp1 { font-family: 'Inter', sans-serif; background: #f7f7f5; color: #111; padding: 96px 80px; }
        .cmp1 .eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #0066FF; display: flex; align-items: center; gap: 12px; margin-bottom: 22px; font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace; }
        .cmp1 .eyebrow::before { content:''; display:block; width: 24px; height: 1px; background: #0066FF; }
        .cmp1 .title { font-family: 'Unna', Georgia, serif; font-weight: 700; font-size: clamp(36px, 4.2vw, 56px); letter-spacing: -0.025em; line-height: 1.05; color: #111; max-width: 760px; margin-bottom: 18px; }
        .cmp1 .title em { font-style: italic; color: #0066FF; font-weight: 700; }
        .cmp1 .sub { font-size: 15px; line-height: 1.7; color: #666; max-width: 480px; margin-bottom: 64px; font-weight: 400; }
        .cmp1 .sub strong { color: #111; font-weight: 600; }

        .cmp1 .table { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border-top: 1px solid rgba(17,17,17,0.12); }
        .cmp1 .head { display: contents; }
        .cmp1 .col-head { padding: 28px 32px 28px 0; display: flex; align-items: baseline; gap: 14px; border-bottom: 1px solid rgba(17,17,17,0.08); }
        .cmp1 .col-head.right { padding-left: 48px; border-left: 1px solid rgba(17,17,17,0.06); }
        .cmp1 .col-num { font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace; font-size: 11px; font-weight: 500; letter-spacing: 0.16em; color: #bbb; }
        .cmp1 .col-name { font-size: 18px; font-weight: 700; letter-spacing: -0.015em; color: #999; }
        .cmp1 .col-head.right .col-name { color: #111; }
        .cmp1 .col-head.right .col-num { color: #0066FF; }
        .cmp1 .col-tag { margin-left: auto; font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace; font-size: 10px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: #ff6420; padding: 4px 10px; border-radius: 100px; background: rgba(255,100,32,0.06); border: 1px solid rgba(255,100,32,0.15); }
        .cmp1 .col-head.right .col-tag { color: #0066FF; background: rgba(0,102,255,0.06); border-color: rgba(0,102,255,0.18); }

        .cmp1 .row-left, .cmp1 .row-right { padding: 30px 32px 30px 0; border-bottom: 1px solid rgba(17,17,17,0.06); display: flex; align-items: center; gap: 16px; min-height: 92px; }
        .cmp1 .row-right { padding-left: 48px; border-left: 1px solid rgba(17,17,17,0.06); }
        .cmp1 .row-left .dot { width: 8px; height: 8px; border-radius: 2px; background: #ff6420; opacity: 0.55; flex-shrink: 0; }
        .cmp1 .row-right .dot { width: 8px; height: 8px; border-radius: 50%; background: #0066FF; flex-shrink: 0; box-shadow: 0 0 0 4px rgba(0,102,255,0.10); }
        .cmp1 .row-left .text { font-size: 19px; font-weight: 400; color: #888; text-decoration: line-through; text-decoration-color: rgba(136,136,136,0.4); text-decoration-thickness: 1px; letter-spacing: -0.01em; }
        .cmp1 .row-right .text { font-size: 19px; font-weight: 600; color: #111; letter-spacing: -0.015em; }
        .cmp1 .row-right .text em { font-style: normal; color: #0066FF; font-weight: 600; }

        .cmp1 .footnote { margin-top: 56px; display: flex; align-items: center; gap: 16px; font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace; font-size: 11px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: #999; }
        .cmp1 .footnote .rule { flex: 0 0 32px; height: 1px; background: rgba(17,17,17,0.15); }
      `}</style>

      <div className="eyebrow">The Problem · Solved</div>
      <h2 className="title">Why <em>recovery</em> needed redefining.</h2>
      <p className="sub">Most brands skip this question. We'll answer it plainly — <strong>here's what's broken about traditional recovery, and how Cryotec fixes it.</strong></p>

      <div className="table">
        <div className="head">
          <div className="col-head"><span className="col-num">01</span><span className="col-name">Traditional Recovery</span><span className="col-tag">The status quo</span></div>
          <div className="col-head right"><span className="col-num">02</span><span className="col-name">Cryotec</span><span className="col-tag">Active contrast</span></div>
        </div>
        {COMPARISONS.map((c, i) => (
          <React.Fragment key={i}>
            <div className="row-left"><span className="dot" /><span className="text">{c.problem}</span></div>
            <div className="row-right"><span className="dot" /><span className="text">{c.solution}</span></div>
          </React.Fragment>
        ))}
      </div>

      <div className="footnote"><span className="rule" />Recovery · Redefined</div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   V2 — Dark Spotlight (matches .ct-u-spot.contrast gradient)
   ────────────────────────────────────────────────────────────── */
function VariationDark() {
  return (
    <div className="cmp2">
      <style>{`
        .cmp2 { font-family: 'Inter', sans-serif; padding: 96px 80px; color: #fff;
          background:
            radial-gradient(60% 50% at 22% 28%, rgba(96,200,255,0.18) 0%, transparent 55%),
            radial-gradient(70% 60% at 80% 80%, rgba(255,100,32,0.18) 0%, transparent 60%),
            linear-gradient(rgb(10,10,10) 0%, rgb(6,6,6) 50%, rgb(2,2,2) 100%);
        }
        .cmp2 .head-grid { display: grid; grid-template-columns: 1fr auto; align-items: end; gap: 40px; margin-bottom: 64px; }
        .cmp2 .eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: #4db8ff; display: flex; align-items: center; gap: 12px; margin-bottom: 20px; font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace; }
        .cmp2 .eyebrow::before { content:''; display:block; width: 24px; height: 1px; background: rgba(77,184,255,0.6); }
        .cmp2 .title { font-family: 'Unna', Georgia, serif; font-weight: 700; font-size: clamp(36px, 4.4vw, 60px); letter-spacing: -0.025em; line-height: 1.04; color: #fff; max-width: 760px; }
        .cmp2 .title em { font-style: italic; font-weight: 700;
          background: linear-gradient(120deg, #ff6420 0%, #ffb088 60%, #60c8ff 100%);
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent;
        }
        .cmp2 .lede { font-size: 14px; line-height: 1.75; color: rgba(255,255,255,0.55); max-width: 320px; font-weight: 300; }
        .cmp2 .lede strong { color: #fff; font-weight: 500; }

        .cmp2 .table {
          border-radius: 20px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.018);
          backdrop-filter: blur(6px);
        }
        .cmp2 .head-row {
          display: grid; grid-template-columns: 1fr 1fr;
          background: rgba(255,255,255,0.025);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .cmp2 .head-cell { padding: 26px 36px; display: flex; align-items: center; gap: 12px; }
        .cmp2 .head-cell + .head-cell { border-left: 1px solid rgba(255,255,255,0.08); }
        .cmp2 .pill { display: inline-flex; align-items: center; gap: 7px; padding: 6px 12px; border-radius: 100px; font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace; }
        .cmp2 .pill.heat { color: #ff8b5c; background: rgba(255,100,32,0.10); border: 1px solid rgba(255,100,32,0.22); }
        .cmp2 .pill.cold { color: #60c8ff; background: rgba(96,200,255,0.10); border: 1px solid rgba(96,200,255,0.28); }
        .cmp2 .pill .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; box-shadow: 0 0 8px currentColor; }
        .cmp2 .head-name { font-size: 17px; font-weight: 600; letter-spacing: -0.012em; color: #fff; }
        .cmp2 .head-cell.left .head-name { color: rgba(255,255,255,0.55); }

        .cmp2 .row { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid rgba(255,255,255,0.06); transition: background 0.3s ease; }
        .cmp2 .row:last-child { border-bottom: 0; }
        .cmp2 .row:hover { background: rgba(255,255,255,0.015); }
        .cmp2 .cell { padding: 28px 36px; display: flex; align-items: center; gap: 16px; min-height: 96px; font-size: 18px; letter-spacing: -0.012em; }
        .cmp2 .cell + .cell { border-left: 1px solid rgba(255,255,255,0.06); }
        .cmp2 .cell.left { color: rgba(255,255,255,0.42); font-weight: 300; }
        .cmp2 .cell.left .text { text-decoration: line-through; text-decoration-color: rgba(255,255,255,0.18); text-decoration-thickness: 1px; }
        .cmp2 .cell.right { color: #fff; font-weight: 500; }
        .cmp2 .cell .ico { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 11px; }
        .cmp2 .cell.left .ico { background: rgba(255,100,32,0.08); color: #ff8b5c; border: 1px solid rgba(255,100,32,0.18); }
        .cmp2 .cell.right .ico { background: rgba(96,200,255,0.12); color: #60c8ff; border: 1px solid rgba(96,200,255,0.28); box-shadow: 0 0 16px rgba(96,200,255,0.18); }
        .cmp2 .cell .idx { margin-left: auto; font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace; font-size: 10px; letter-spacing: 0.14em; color: rgba(255,255,255,0.22); }

        .cmp2 .foot { display: flex; align-items: center; justify-content: space-between; gap: 24px; margin-top: 44px; padding-top: 28px; border-top: 1px solid rgba(255,255,255,0.06); }
        .cmp2 .foot-quote { font-family: 'Unna', Georgia, serif; font-weight: 700; font-size: 18px; letter-spacing: -0.01em; color: rgba(255,255,255,0.75); max-width: 540px; line-height: 1.4; }
        .cmp2 .foot-quote em { font-style: italic; color: #60c8ff; }
        .cmp2 .cta { display: inline-flex; align-items: center; gap: 10px; padding: 14px 28px; border-radius: 100px; background: #fff; color: #111; font-size: 13px; font-weight: 600; letter-spacing: 0.04em; text-decoration: none; transition: transform 0.2s, box-shadow 0.2s; }
        .cmp2 .cta:hover { transform: translateY(-1px); box-shadow: 0 12px 32px rgba(96,200,255,0.18); }
        .cmp2 .cta .arrow { transition: transform 0.2s; }
        .cmp2 .cta:hover .arrow { transform: translateX(3px); }
      `}</style>

      <div className="head-grid">
        <div>
          <div className="eyebrow">What problem does this solve?</div>
          <h2 className="title">Old recovery is <em>cold, hot,</em> or unhelpful.<br />Cryotec is all three — at once.</h2>
        </div>
        <p className="lede"><strong>Most brands skip this question.</strong> We won't. Here's the unvarnished comparison between traditional recovery and contrast therapy you can wear.</p>
      </div>

      <div className="table">
        <div className="head-row">
          <div className="head-cell left">
            <span className="pill heat"><span className="dot" />Traditional</span>
            <span className="head-name">Ice baths, packs &amp; heating pads</span>
          </div>
          <div className="head-cell right">
            <span className="pill cold"><span className="dot" />Cryotec</span>
            <span className="head-name">Wearable contrast therapy</span>
          </div>
        </div>
        {COMPARISONS.map((c, i) => (
          <div className="row" key={i}>
            <div className="cell left">
              <span className="ico">✕</span>
              <span className="text">{c.problem}</span>
              <span className="idx">0{i+1}</span>
            </div>
            <div className="cell right">
              <span className="ico">✓</span>
              <span className="text">{c.solution}</span>
              <span className="idx">0{i+1}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="foot">
        <p className="foot-quote">Recovery is no longer a place you go.<br /><em>It's something you wear.</em></p>
        <a className="cta" href="#">See the device <span className="arrow">→</span></a>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   V3 — Card Stack with vs (scannable, modular)
   ────────────────────────────────────────────────────────────── */
function VariationCards() {
  return (
    <div className="cmp3">
      <style>{`
        .cmp3 { font-family: 'Inter', sans-serif; background: #fff; color: #111; padding: 96px 80px; }
        .cmp3 .top { margin-bottom: 56px; }
        .cmp3 .top-l { max-width: 820px; }
        .cmp3 .eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: #0066FF; display: flex; align-items: center; gap: 12px; margin-bottom: 22px; font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace; }
        .cmp3 .eyebrow::before { content:''; display:block; width: 24px; height: 1px; background: #0066FF; }
        .cmp3 .title { font-family: 'Unna', Georgia, serif; font-weight: 700; font-size: clamp(36px, 4.4vw, 60px); letter-spacing: -0.025em; line-height: 1.04; color: #111; margin-bottom: 18px; }
        .cmp3 .title em { font-style: italic; color: #0066FF; }
        .cmp3 .sub { font-size: 15px; line-height: 1.7; color: #666; max-width: 460px; }
        .cmp3 .sub strong { color: #111; font-weight: 600; }

        .cmp3 .stack { display: flex; flex-direction: column; gap: 14px; }
        .cmp3 .card {
          position: relative; display: grid; grid-template-columns: 1fr auto 1fr; gap: 0; align-items: stretch;
          background: #fff; border-radius: 20px; padding: 0; overflow: hidden;
          box-shadow: 0 0 0 1px rgba(17,17,17,0.06), 0 4px 18px -4px rgba(4,17,30,0.06);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .cmp3 .card:hover { transform: translateY(-2px); box-shadow: 0 0 0 1px rgba(0,102,255,0.18), 0 16px 40px -10px rgba(4,17,30,0.10); }
        .cmp3 .card::before {
          content:''; position: absolute; left: 0; right: 0; top: 0; height: 2px;
          background: linear-gradient(90deg, #ff6420 0%, #ff6420 38%, rgba(255,100,32,0.2) 42%, rgba(0,102,255,0.2) 58%, #0066FF 62%, #0066FF 100%);
        }
        .cmp3 .side { padding: 32px 40px; display: flex; flex-direction: column; justify-content: center; gap: 10px; }
        .cmp3 .side .tag { font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace; font-size: 10px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; display: flex; align-items: center; gap: 8px; }
        .cmp3 .side.old .tag { color: #ff6420; }
        .cmp3 .side.new .tag { color: #0066FF; }
        .cmp3 .side .tag .pip { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
        .cmp3 .side .body { font-size: 18px; letter-spacing: -0.012em; line-height: 1.4; font-weight: 500; }
        .cmp3 .side.old .body { color: #888; font-weight: 400; }
        .cmp3 .side.new .body { color: #111; font-weight: 500; }
        .cmp3 .side.new .body strong { color: #0066FF; font-weight: 600; }

        .cmp3 .arrow { display: flex; align-items: center; justify-content: center; padding: 0 24px; position: relative; }
        .cmp3 .arrow::before {
          content:''; position: absolute; inset: 24px 0; width: 1px; left: 50%; background: linear-gradient(180deg, rgba(255,100,32,0.18), rgba(0,102,255,0.18));
        }
        .cmp3 .arrow .vs {
          width: 44px; height: 44px; border-radius: 50%; background: #fff;
          border: 1px solid rgba(17,17,17,0.08);
          display: flex; align-items: center; justify-content: center;
          font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; color: #999;
          position: relative; z-index: 1;
          box-shadow: 0 4px 12px rgba(17,17,17,0.04);
        }

        .cmp3 .closer { margin-top: 48px; padding: 36px 44px; background: #f7f7f5; border-radius: 20px;
          display: flex; align-items: center; justify-content: space-between; gap: 32px; }
        .cmp3 .closer-text { font-family: 'Unna', Georgia, serif; font-weight: 700; font-size: 22px; letter-spacing: -0.012em; color: #111; max-width: 720px; line-height: 1.35; }
        .cmp3 .closer-text em { font-style: italic; color: #0066FF; }
        .cmp3 .cta { display: inline-flex; align-items: center; gap: 10px; padding: 14px 28px; border-radius: 4px; background: #111; color: #fff; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; flex-shrink: 0; transition: background 0.2s; }
        .cmp3 .cta:hover { background: #0066FF; }
      `}</style>

      <div className="top">
        <div className="top-l">
          <div className="eyebrow">What problem does this solve?</div>
          <h2 className="title">Recovery shouldn't <em>wait for you</em>.<br />It should move with you.</h2>
        </div>
      </div>

      <div className="stack">
        {COMPARISONS.map((c, i) => (
          <div className="card" key={i}>
            <div className="side old">
              <div className="tag"><span className="pip" />Traditional Recovery</div>
              <div className="body">{c.problem}</div>
            </div>
            <div className="arrow"><div className="vs">VS</div></div>
            <div className="side new">
              <div className="tag"><span className="pip" />With Cryotec</div>
              <div className="body">{c.solution}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="closer">
        <p className="closer-text">No more bulky tubs, dripping packs, or temporary fixes — <em>just contrast therapy that travels with you.</em></p>
        <a className="cta" href="#">Shop Cryotec →</a>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   V4 — Card Stack + Product Image (compact, hero-like)
   Same vocabulary as V3 but with the product photo on the left
   so the section reads wider and shorter on the page.
   ────────────────────────────────────────────────────────────── */
function VariationCardsImage() {
  return (
    <div className="cmp4">
      <style>{`
        .cmp4 { font-family: 'Inter', sans-serif; background: #fff; color: #111; padding: 88px 80px; }

        .cmp4 .top { margin-bottom: 48px; max-width: 820px; }
        .cmp4 .eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: #0066FF; display: flex; align-items: center; gap: 12px; margin-bottom: 22px; font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace; }
        .cmp4 .eyebrow::before { content:''; display:block; width: 24px; height: 1px; background: #0066FF; }
        .cmp4 .title { font-family: 'Unna', Georgia, serif; font-weight: 700; font-size: clamp(34px, 4vw, 54px); letter-spacing: -0.025em; line-height: 1.05; color: #111; }
        .cmp4 .title em { font-style: italic; color: #0066FF; }

        .cmp4 .grid { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 40px; align-items: stretch; min-height: 560px; }

        .cmp4 .media {
          position: relative; border-radius: 24px; overflow: hidden;
          background: linear-gradient(160deg, #f3f3f0 0%, #e9e9e6 100%);
          box-shadow: 0 0 0 1px rgba(17,17,17,0.06), 0 18px 50px -20px rgba(4,17,30,0.18);
          height: 100%;
        }
        .cmp4 .media img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .cmp4 .media-overlay {
          position: absolute; left: 24px; right: 24px; bottom: 24px;
          display: flex; align-items: flex-end; justify-content: space-between; gap: 16px;
          pointer-events: none;
        }
        .cmp4 .media-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 9px 14px; border-radius: 100px;
          background: rgba(255,255,255,0.92); backdrop-filter: blur(8px);
          font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace;
          font-size: 10px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: #111;
          box-shadow: 0 4px 14px rgba(0,0,0,0.08);
        }
        .cmp4 .media-badge .pip { width: 6px; height: 6px; border-radius: 50%; background: #0066FF; box-shadow: 0 0 0 3px rgba(0,102,255,0.18); }
        .cmp4 .media-caption {
          font-family: 'Unna', Georgia, serif; font-weight: 700; font-size: 14px; letter-spacing: -0.005em;
          color: rgba(255,255,255,0.95); text-shadow: 0 1px 12px rgba(0,0,0,0.4);
        }

        .cmp4 .stack { display: flex; flex-direction: column; gap: 12px; height: 100%; }
        .cmp4 .card {
          position: relative; display: grid; grid-template-columns: 1fr auto 1fr; gap: 0; align-items: stretch;
          flex: 1 1 0; min-height: 0;
          background: #fff; border-radius: 18px; overflow: hidden;
          box-shadow: 0 0 0 1px rgba(17,17,17,0.06), 0 4px 16px -6px rgba(4,17,30,0.06);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .cmp4 .card:hover { transform: translateY(-2px); box-shadow: 0 0 0 1px rgba(0,102,255,0.18), 0 14px 36px -10px rgba(4,17,30,0.10); }
        .cmp4 .card::before {
          content:''; position: absolute; left: 0; right: 0; top: 0; height: 2px;
          background: linear-gradient(90deg, rgba(17,17,17,0.35) 0%, rgba(17,17,17,0.35) 38%, rgba(17,17,17,0.12) 42%, rgba(0,102,255,0.18) 58%, #0066FF 62%, #0066FF 100%);
        }

        .cmp4 .side { padding: 22px 24px; display: flex; flex-direction: column; justify-content: center; gap: 8px; min-width: 0; }
        .cmp4 .side .tag { font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace; font-size: 9.5px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; display: flex; align-items: center; gap: 8px; }
        .cmp4 .side.old .tag { color: #555; }
        .cmp4 .side.new .tag { color: #0066FF; }
        .cmp4 .side .tag .pip { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
        .cmp4 .side .body { font-size: 14.5px; letter-spacing: -0.005em; line-height: 1.45; }
        .cmp4 .side.old .body { color: #888; font-weight: 400; }
        .cmp4 .side.new .body { color: #111; font-weight: 500; }

        .cmp4 .arrow { display: flex; align-items: center; justify-content: center; padding: 0 14px; position: relative; }
        .cmp4 .arrow::before {
          content:''; position: absolute; inset: 18px 0; width: 1px; left: 50%; background: linear-gradient(180deg, rgba(17,17,17,0.18), rgba(0,102,255,0.18));
        }
        .cmp4 .arrow .vs {
          width: 36px; height: 36px; border-radius: 50%; background: #fff;
          border: 1px solid rgba(17,17,17,0.08);
          display: flex; align-items: center; justify-content: center;
          font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace; font-size: 9px; font-weight: 600; letter-spacing: 0.06em; color: #999;
          position: relative; z-index: 1;
          box-shadow: 0 4px 12px rgba(17,17,17,0.04);
        }

        .cmp4 .closer { margin-top: 40px; padding: 36px 44px; background: #f7f7f5; border-radius: 18px;
          display: flex; align-items: center; justify-content: space-between; gap: 32px; }
        .cmp4 .closer-text { font-family: 'Unna', Georgia, serif; font-weight: 700; font-size: 26px; letter-spacing: -0.015em; color: #111; max-width: 560px; line-height: 1.25; }
        .cmp4 .closer-text em { font-style: normal; color: #0066FF; font-weight: 700; }
        .cmp4 .cta { display: inline-flex; align-items: center; gap: 14px; padding: 20px 36px; border-radius: 999px; background: #111; color: #fff; font-family: 'Inter', sans-serif; font-size: 17px; font-weight: 600; letter-spacing: -0.005em; text-decoration: none; flex-shrink: 0; transition: background 0.2s, transform 0.2s, box-shadow 0.2s; }
        .cmp4 .cta:hover { background: #0066FF; transform: translateY(-1px); box-shadow: 0 12px 32px rgba(0,102,255,0.22); }
        .cmp4 .cta .arrow { display: inline-flex; transition: transform 0.2s; font-weight: 500; }
        .cmp4 .cta:hover .arrow { transform: translateX(4px); }
      `}</style>

      <div className="top">
        <div className="eyebrow">What problem does this solve?</div>
        <h2 className="title">Recovery shouldn't <em>wait for you</em>.<br />It should move with you.</h2>
      </div>

      <div className="grid">
        <div className="media">
          <img src="https://cryotec.ca/wp-content/uploads/2026/03/Cryotec-001.png" alt="Cryotec wearable recovery device" />
          <div className="media-overlay">
            <span className="media-badge"><span className="pip" />Cryotec · Wearable</span>
          </div>
        </div>

        <div className="stack">
          {COMPARISONS.map((c, i) => (
            <div className="card" key={i}>
              <div className="side old">
                <div className="tag"><span className="pip" />Traditional Recovery</div>
                <div className="body">{c.problem}</div>
              </div>
              <div className="arrow"><div className="vs">VS</div></div>
              <div className="side new">
                <div className="tag"><span className="pip" />With Cryotec</div>
                <div className="body">{c.solution}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="closer">
        <p className="closer-text">“Recovery <em>that disappears into your routine</em> — instead of waiting for it.”</p>
        <a className="cta" href="#">Shop CryoTec <span className="arrow">→</span></a>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   V5 — Premium Cinematic (LIGHT)
   Off-white #f7f7f5 ground. Big Unna headline, two-line rows
   (struck-through pain on the left, confident solution + a
   one-line proof on the right). Cinematic micro-motion held.
   ────────────────────────────────────────────────────────────── */
const PREMIUM_ROWS = [
  {
    problem: 'Stuck at home, on the couch.',
    problemSupport: 'Ice packs are bulky and immobile — you can\u2019t recover on the move, so sessions get skipped.',
    solution: ['Recovery, ', {em:'anywhere.'}],
    support: 'Cordless and wearable — slip it on at your desk, in the car, between sets.'
  },
  {
    problem: 'Heating pads need a cord.',
    problemSupport: 'Stationary, plugged-in, and limited to wherever the outlet is. One room, one position.',
    solution: ['Wearable. ', {em:'Cordless.'}],
    support: 'Three heat modes in one compact device. No outlet, no pad, no tether.'
  },
  {
    problem: 'Constant manual switching.',
    problemSupport: 'Contrast therapy means swapping ice and heat by hand every few minutes — and resetting timers each time.',
    solution: ['Auto contrast \u2014 ', {em:'every 5 minutes.'}],
    support: 'Hot-cold cycles built in. No timers, no swapping pads, no breaks in your session.'
  },
  {
    problem: 'Melts. Reheats. Repeat.',
    problemSupport: 'Ice packs start too cold, then drift to not cold enough. You\u2019re guessing the temperature the whole session.',
    solution: ['Held at ', {em:'8\u00b0, 12\u00b0, or 16\u00b0.'}],
    support: 'Locked temperature for the full 20-minute recovery session \u2014 every time.'
  },
];

function renderSolution(parts) {
  return parts.map((p, i) => typeof p === 'string'
    ? <React.Fragment key={i}>{p}</React.Fragment>
    : <em key={i}>{p.em}</em>);
}

function VariationPremium({ surface = 'subtle' }) {
  return (
    <div className={`cmp5 cmp5-${surface}`}>
      <style>{`
        .cmp5 { font-family: 'Inter', sans-serif; color: #111; padding: 20px 40px;
          background: #f7f7f5; position: relative; overflow: hidden; }
        .cmp5 > * { max-width: none; margin-left: 0; margin-right: 0; }
        .cmp5::before { content:''; position: absolute; inset: -10%; pointer-events: none;
          background:
            radial-gradient(60% 50% at 12% 18%, rgba(0,102,255,0.07) 0%, transparent 62%),
            radial-gradient(50% 50% at 88% 84%, rgba(255,100,32,0.045) 0%, transparent 66%);
          animation: cmp5Drift 18s ease-in-out infinite alternate;
        }
        .cmp5::after { content:''; position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(120% 80% at 50% 0%, transparent 0%, rgba(247,247,245,0.45) 100%); }
        @keyframes cmp5Drift {
          0%   { transform: translate(0,0) scale(1);    opacity: 0.95; }
          100% { transform: translate(2%, -1%) scale(1.05); opacity: 1; }
        }
        .cmp5 > * { position: relative; z-index: 1; }

        /* Header */
        .cmp5 .head { margin-top: 20px; margin-bottom: 40px; max-width: none !important; }
        .cmp5 .eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase;
          color: #0066FF; display: inline-flex; align-items: center; gap: 8px;
          margin: 0 0 18px; font-family: 'Inter', sans-serif; }
        .cmp5 .eyebrow::before { content:''; display: block; width: 20px; height: 1px;
          background: #0066FF; }
        .cmp5 .title { font-family: 'Unna', Georgia, serif; font-weight: 700;
          font-size: clamp(40px, 5.4vw, 68px); letter-spacing: -0.035em; line-height: 1.02;
          margin: 0 0 18px 0; color: #111;
          opacity: 0; transform: translateY(20px);
          animation: cmp5In 1.1s cubic-bezier(.2,.6,.2,1) 0.15s forwards; }
        .cmp5 .title em { font-style: italic; font-weight: 700; color: #0066FF; }
        .cmp5 .lede { font-size: 16px; color: #555; max-width: 480px;
          line-height: 1.65; margin: 0; font-weight: 400;
          opacity: 0; transform: translateY(12px);
          animation: cmp5In 0.9s cubic-bezier(.2,.6,.2,1) 0.45s forwards; }
        @keyframes cmp5In { to { opacity: 1; transform: translateY(0); } }

        /* Grid */
        .cmp5 .grid { display: grid; grid-template-columns: 0.9fr 1.1fr;
          gap: 56px; align-items: end; min-height: 460px; }

        /* Media — bottom-aligned to the table, sized by aspect ratio so it
           doesn't stretch to match the (much taller) comparison column.
           Dark backdrop + radial vignette so the product photo floats on
           black with a soft fade out to the card edge. */
        .cmp5 .media { position: relative; border-radius: 22px; overflow: hidden;
          background: #0a0a0a;
          aspect-ratio: 4 / 3; height: auto;
          opacity: 0; transform: translateY(24px);
          animation: cmp5In 1.2s cubic-bezier(.2,.6,.2,1) 0.3s forwards; }
        .cmp5-subtle .media { box-shadow: 0 0 0 1px rgba(255,255,255,0.04),
          0 30px 70px -22px rgba(0,0,0,0.55),
          0 0 60px -20px rgba(0,102,255,0.10); }
        .cmp5-card .media { box-shadow: 0 0 0 1px rgba(255,255,255,0.04),
          0 38px 80px -22px rgba(0,0,0,0.55),
          0 0 60px -20px rgba(0,102,255,0.10); }
        .cmp5 .media img { width: 100%; height: 100%; object-fit: contain; display: block;
          transform: scale(0.9);
          transform-origin: center center;
          animation: cmp5Float 12s ease-in-out infinite alternate; }
        /* Soft black vignette that overlaps the product image edge by
           ~10px so the photo blends into the black card with no hard
           border — clear in the centre, opaque black at the corners. */
        .cmp5 .media::after {
          content: ''; position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 78% 88% at 50% 50%,
              transparent 50%,
              rgba(10,10,10,0.30) 68%,
              rgba(10,10,10,0.75) 85%,
              #0a0a0a 100%);
          pointer-events: none;
          z-index: 1;
        }
        @keyframes cmp5Float {
          0%   { transform: scale(0.90) translateY(0.5%); }
          100% { transform: scale(0.94) translateY(-1%); }
        }
        .cmp5 .media-mark { position: absolute; left: 22px; top: 22px;
          z-index: 2;
          font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 10px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase;
          color: #fff; display: flex; align-items: center; gap: 9px;
          padding: 8px 13px; background: rgba(10,12,16,0.78); border-radius: 100px;
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.08); }
        .cmp5 .media-mark .pip { width: 6px; height: 6px; border-radius: 50%; background: #60c8ff;
          box-shadow: 0 0 12px #60c8ff; animation: cmp5Pulse 2.4s ease-in-out infinite; }
        @keyframes cmp5Pulse {
          0%, 100% { box-shadow: 0 0 8px #60c8ff;  opacity: 1;   }
          50%      { box-shadow: 0 0 18px #60c8ff; opacity: 0.7; }
        }

        /* Table container — surface variants */
        .cmp5 .table-container { padding: 20px 28px 8px 28px; border-radius: 24px;
          display: flex; flex-direction: column; align-self: stretch; min-width: 0;
          opacity: 0; transform: translateY(20px);
          animation: cmp5In 1.1s cubic-bezier(.2,.6,.2,1) 0.4s forwards; }
        .cmp5-subtle .table-container { background: #fafaf8;
          box-shadow: 0 0 0 1px rgba(17,17,17,0.05),
                      0 8px 24px -12px rgba(4,17,30,0.06); }
        .cmp5-card .table-container { background: #ffffff;
          box-shadow: 0 0 0 1px rgba(17,17,17,0.04),
                      0 30px 70px -22px rgba(4,17,30,0.14),
                      0 4px 14px -6px rgba(4,17,30,0.06); }

        /* Column headers */
        .cmp5 .col-headers { display: grid;
          grid-template-columns: 38px 1fr 56px 1.5fr;
          gap: 22px; padding: 4px 0 16px 0;
          border-bottom: 1px solid rgba(17,17,17,0.08); }
        .cmp5 .col-h { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 10px; font-weight: 600; letter-spacing: 0.24em; text-transform: uppercase;
          display: flex; align-items: center; gap: 8px; }
        .cmp5 .col-h-old { color: #9a9a98; }
        .cmp5 .col-h-new { color: #0066FF; }
        .cmp5 .col-h .pip { width: 6px; height: 6px; border-radius: 50%; background: currentColor;
          opacity: 0.55; }
        .cmp5 .col-h-new .pip { opacity: 1; box-shadow: 0 0 8px rgba(0,102,255,0.4); }

        /* Rows */
        .cmp5 .rows { display: flex; flex-direction: column; flex: 1 1 auto; }
        .cmp5 .row { display: grid; grid-template-columns: 38px 1fr 56px 1.5fr;
          align-items: start; gap: 22px; padding: 16px 0;
          border-bottom: 1px solid rgba(17,17,17,0.08);
          opacity: 0; transform: translateY(18px);
          animation: cmp5In 0.9s cubic-bezier(.2,.6,.2,1) forwards; }
        .cmp5 .row:last-child { border-bottom: none; }
        .cmp5 .row:nth-child(1) { animation-delay: 0.65s; }
        .cmp5 .row:nth-child(2) { animation-delay: 0.80s; }
        .cmp5 .row:nth-child(3) { animation-delay: 0.95s; }
        .cmp5 .row:nth-child(4) { animation-delay: 1.10s; }

        .cmp5 .num-cell { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 11px; font-weight: 600; letter-spacing: 0.18em; color: #0066FF;
          padding-top: 6px; }

        .cmp5 .before-cell { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .cmp5 .before { font-size: 16px; font-weight: 500; color: #888;
          line-height: 1.35; letter-spacing: -0.005em;
          position: relative; display: inline-block; padding-right: 4px;
          align-self: flex-start; max-width: 100%; }
        .cmp5 .before::after { content:''; position: absolute; left: 0; right: 4px; top: 52%;
          height: 1px; background: rgba(17,17,17,0.4);
          transform: scaleX(0); transform-origin: left center;
          animation: cmp5Strike 0.9s cubic-bezier(.65,0,.35,1) forwards;
          animation-delay: var(--strike-delay, 0.9s); }
        @keyframes cmp5Strike { to { transform: scaleX(1); } }
        .cmp5 .before-support { font-size: 13px; line-height: 1.55; color: #999;
          font-weight: 400; letter-spacing: -0.003em; max-width: 380px; }

        .cmp5 .arrow-cell { position: relative; min-height: 24px;
          padding-top: 14px; }
        .cmp5 .arrow-line { position: absolute; left: 0; right: 14px; top: 14px; height: 1px;
          background: linear-gradient(90deg, rgba(17,17,17,0.12), rgba(0,102,255,0.6));
          transform: scaleX(0); transform-origin: left center;
          animation: cmp5Line 0.9s cubic-bezier(.65,0,.35,1) forwards;
          animation-delay: var(--line-delay, 1.0s); }
        @keyframes cmp5Line { to { transform: scaleX(1); } }
        .cmp5 .arrow-tip { position: absolute; right: 0; top: 14px;
          width: 0; height: 0; border-top: 4px solid transparent;
          border-bottom: 4px solid transparent; border-left: 6px solid #0066FF;
          transform: translateY(-50%) scale(0); transform-origin: right center;
          filter: drop-shadow(0 0 6px rgba(0,102,255,0.4));
          animation: cmp5Tip 0.4s cubic-bezier(.2,.6,.2,1) forwards;
          animation-delay: var(--tip-delay, 1.7s); }
        @keyframes cmp5Tip { to { transform: translateY(-50%) scale(1); } }

        .cmp5 .after-cell { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .cmp5 .after { font-family: 'Unna', Georgia, serif; font-weight: 700;
          font-size: clamp(22px, 2.4vw, 30px); line-height: 1.1; letter-spacing: -0.022em;
          color: #111; }
        .cmp5 .after em { font-style: italic; color: #0066FF; }
        .cmp5 .support { font-size: 13.5px; line-height: 1.55; color: #666;
          font-weight: 400; max-width: 480px; letter-spacing: -0.005em; }

        /* Closer card — matches user's reference: off-white panel + dark pill CTA */
        .cmp5 .closer-card { margin-top: 36px; padding: 32px 44px;
          background: #ededea; border-radius: 18px;
          display: flex; align-items: center; justify-content: space-between; gap: 32px;
          opacity: 0; transform: translateY(12px);
          animation: cmp5In 0.9s cubic-bezier(.2,.6,.2,1) 1.45s forwards; }
        .cmp5 .closer-text { font-family: 'Unna', Georgia, serif; font-weight: 700;
          font-size: 26px; letter-spacing: -.015em; color: #111;
          max-width: 600px; line-height: 1.25; margin: 0; }
        .cmp5 .closer-text em { font-style: normal; color: #0066FF; font-weight: 700; }
        .cmp5 .shop-cta { display: inline-flex; align-items: center; gap: 14px;
          padding: 20px 36px; border-radius: 999px; background: #111; color: #fff;
          font-family: 'Inter', sans-serif; font-size: 17px; font-weight: 600;
          letter-spacing: -0.005em; text-decoration: none; flex-shrink: 0;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s, color 0.2s; }
        .cmp5 .shop-cta:hover { background: #0066FF; color: #fff;
          transform: translateY(-1px);
          box-shadow: 0 12px 32px rgba(0,102,255,0.22); }
        .cmp5 .shop-cta .arr { display: inline-flex; font-weight: 500;
          transition: transform 0.2s; }
        .cmp5 .shop-cta:hover .arr { transform: translateX(4px); }

        /* ── Mobile ── */
        @media (max-width: 900px) {
          .cmp5 { padding: 40px 20px; }
          .cmp5 .head { margin-bottom: 24px; }
          .cmp5 .title { font-size: clamp(28px, 7vw, 40px); }
          .cmp5 .lede { font-size: 14px; }

          .cmp5 .grid { grid-template-columns: 1fr; gap: 20px; min-height: 0;
            align-items: stretch; }
          .cmp5 .media { aspect-ratio: 16 / 11; }
          .cmp5 .media img { transform: scale(0.86); }
          @keyframes cmp5Float {
            0%   { transform: scale(0.86) translateY(0.5%); }
            100% { transform: scale(0.90) translateY(-1%); }
          }

          .cmp5 .table-container { padding: 16px 16px 4px 16px; }
          .cmp5 .col-headers { grid-template-columns: 30px 1fr; gap: 12px;
            padding: 0 0 12px; }
          .cmp5 .col-headers > div:nth-child(3),
          .cmp5 .col-headers > div:nth-child(4) { display: none; }
          .cmp5 .col-h { font-size: 9px; letter-spacing: 0.18em; }

          .cmp5 .row { grid-template-columns: 30px 1fr; gap: 12px;
            padding: 14px 0; row-gap: 8px; }
          .cmp5 .arrow-cell { display: none; }
          /* On mobile the before/after stack instead of sitting side-by-side */
          .cmp5 .after-cell { grid-column: 2; }
          .cmp5 .num-cell { font-size: 10px; padding-top: 4px; }
          .cmp5 .before { font-size: 14px; }
          .cmp5 .before-support { font-size: 12px; }
          .cmp5 .after { font-size: 15px; }
          .cmp5 .after-support { font-size: 12px; }

          .cmp5 .closer { flex-direction: column; align-items: flex-start;
            padding: 24px 24px; gap: 18px; margin-top: 28px; }
          .cmp5 .shop-cta { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="head">
        <p className="eyebrow">The Cryotec Difference</p>
        <h2 className="title">Recovery shouldn't <em>wait for you</em>.</h2>
        <p className="lede">Four things old recovery gets wrong — and what we built instead.</p>
      </div>

      <div className="grid">
        <div className="media">
          <img src="https://cryotec.ca/wp-content/uploads/2026/03/Cryotec-001.png" alt="Cryotec wearable" />
          <div className="media-mark"><span className="pip" />Cryotec · Wearable</div>
        </div>

        <div className="table-container">
          <div className="col-headers">
            <div />
            <div className="col-h col-h-old"><span className="pip" />Traditional Recovery</div>
            <div />
            <div className="col-h col-h-new"><span className="pip" />CryoTec Recovery</div>
          </div>

          <div className="rows">
            {PREMIUM_ROWS.map((r, i) => {
              const strikeDelay = 0.85 + i * 0.15;
              const lineDelay = strikeDelay + 0.15;
              const tipDelay = lineDelay + 0.6;
              return (
                <div className="row" key={i} style={{
                  '--strike-delay': `${strikeDelay}s`,
                  '--line-delay': `${lineDelay}s`,
                  '--tip-delay': `${tipDelay}s`,
                }}>
                  <div className="num-cell">{String(i+1).padStart(2,'0')}</div>
                  <div className="before-cell">
                    <div className="before">{r.problem}</div>
                    <div className="before-support">{r.problemSupport}</div>
                  </div>
                  <div className="arrow-cell">
                    <div className="arrow-line" />
                    <div className="arrow-tip" />
                  </div>
                  <div className="after-cell">
                    <div className="after">{renderSolution(r.solution)}</div>
                    <div className="support">{r.support}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="closer-card">
        <p className="closer-text">&ldquo;Recovery <em>that disappears into your routine</em> — instead of waiting for it.&rdquo;</p>
        <a className="shop-cta" href="/product/cryotec/">Shop CryoTec <span className="arr">→</span></a>
      </div>
    </div>
  );
}

Object.assign(window, { VariationEditorial, VariationDark, VariationCards, VariationCardsImage, VariationPremium });
