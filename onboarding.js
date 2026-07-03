/* onboarding.js — <mcaap-onboarding>
   Live guided-tour engine for MCAAP. Vanilla custom element + shadow DOM so it
   is fully isolated from the React app and survives re-renders. Mirrors the
   Stencil component in stencil-src/ 1:1 (same states, same behaviour).

   Public API (fire on window):
     window.dispatchEvent(new CustomEvent('mcaap-tour:open'))                       -> open the tour menu
     window.dispatchEvent(new CustomEvent('mcaap-tour:start',{detail:{id:'clearance'}})) -> start a tour
   Reads tours + illustrations from window.MCAAP_TOURS / window.MCAAP_ILLUS. */
(function () {
  var STORE_KEY = 'mcaap.onboarding.v1';

  function loadState() {
    try { return Object.assign({ seenWelcome: false, neverShow: false, completed: {} }, JSON.parse(localStorage.getItem(STORE_KEY) || '{}')); }
    catch (e) { return { seenWelcome: false, neverShow: false, completed: {} }; }
  }

  // map a step's page hint onto the React app's imperative navigation hooks
  function navigate(page) {
    if (!page) return;
    if (page === 'tasks-board') { window.__openTasks ? window.__openTasks({ view: 'board' }) : (window.__setPage && window.__setPage('tasks')); return; }
    if (page === 'agents' || page === 'tasks-fleet') { window.__goAgents ? window.__goAgents() : (window.__setPage && window.__setPage('tasks')); return; }
    window.__setPage && window.__setPage(page);
  }

  var ICONS = {
    map: '<path d="M9 4.5L3.5 7v12.5L9 17l6 2.5 5.5-2.5V4.5L15 7 9 4.5z"/><path d="M9 4.5v12.5M15 7v12.5"/>',
    check_square: '<path d="M9 11.5l2 2 4.5-4.5"/><rect x="3.5" y="3.5" width="17" height="17" rx="4"/>',
    megaphone: '<path d="M4 10.5v3a1.5 1.5 0 0 0 1.5 1.5H8l8 4.5V5L8 9.5H5.5A1.5 1.5 0 0 0 4 10.5z"/><path d="M18.5 9a3.4 3.4 0 0 1 0 6"/>',
    route: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.5 6H15a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h6.5"/>',
    pen: '<path d="M4 20l.9-3.6L15.4 5.9a2 2 0 0 1 2.8 0a2 2 0 0 1 0 2.8L7.6 19.1 4 20z"/><path d="M14 7.4l2.6 2.6"/>',
    book: '<path d="M12 6.4C10.4 5 7.8 4.6 4.5 5.2v13c3.3-.6 5.9-.2 7.5 1.2"/><path d="M12 6.4C13.6 5 16.2 4.6 19.5 5.2v13c-3.3-.6-5.9-.2-7.5 1.2"/><path d="M12 6.4v13.2"/>',
    bulb: '<path d="M9.5 18.5h5M10.5 21.5h3"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z"/>',
    database: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.6 3.1 3 7 3s7-1.4 7-3V6"/><path d="M5 12c0 1.6 3.1 3 7 3s7-1.4 7-3"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    arrow_right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrow_left: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    replay: '<path d="M4 12a8 8 0 1 0 2.3-5.6"/><path d="M4 4v3.5H7.5"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/>'
  };
  function svg(name, size) {
    return '<svg viewBox="0 0 24 24" width="' + (size || 18) + '" height="' + (size || 18) + '" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || '') + '</svg>';
  }

  var CSS = "\
:host{all:initial}\
*,*::before,*::after{box-sizing:border-box}\
.wrap{position:fixed;inset:0;z-index:2147483000;font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;color:#24272D;-webkit-font-smoothing:antialiased}\
.wrap.hidden{display:none}\
.catch{position:fixed;inset:0;background:rgba(13,25,42,.58);backdrop-filter:blur(1.5px);animation:fade .22s ease both}\
.catch.clear{background:transparent;backdrop-filter:none}\
.hole{position:fixed;border-radius:12px;box-shadow:0 0 0 9999px rgba(13,25,42,.58),0 10px 40px rgba(0,0,0,.28);pointer-events:none;transition:all .32s cubic-bezier(.2,.8,.3,1)}\
.ring{position:fixed;border-radius:14px;border:2.5px solid #0073E6;pointer-events:none;transition:all .32s cubic-bezier(.2,.8,.3,1);box-shadow:0 0 0 4px rgba(0,115,230,.18)}\
.ring::after{content:'';position:absolute;inset:-2.5px;border-radius:14px;border:2.5px solid #0073E6;animation:ringpulse 1.8s ease-out infinite}\
@keyframes ringpulse{0%{opacity:.7;transform:scale(1)}100%{opacity:0;transform:scale(1.14)}}\
@keyframes fade{from{opacity:0}to{opacity:1}}\
@keyframes pop{from{opacity:0;transform:translateY(8px) scale(.97)}to{opacity:1;transform:none}}\
.card{position:fixed;width:360px;max-width:calc(100vw - 32px);background:#fff;border-radius:16px;box-shadow:0 18px 50px rgba(13,25,42,.30);border:1px solid #E2E8F0;overflow:hidden;animation:pop .3s cubic-bezier(.2,.8,.3,1) both;transition:top .32s cubic-bezier(.2,.8,.3,1),left .32s cubic-bezier(.2,.8,.3,1)}\
.card.center{position:relative;width:440px;animation:pop .34s cubic-bezier(.2,.8,.3,1) both}\
.centerwrap{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;padding:24px}\
.arrow{position:fixed;width:14px;height:14px;background:#fff;border:1px solid #E2E8F0;transform:rotate(45deg);pointer-events:none;transition:all .32s cubic-bezier(.2,.8,.3,1)}\
.illus{width:100%;height:150px;padding:16px 18px 4px;background:linear-gradient(180deg,#FBFCFE,#F4F7FC)}\
.illus svg{display:block;height:100%;filter:drop-shadow(0 6px 14px rgba(29,53,87,.10))}\
.body{padding:16px 20px 18px}\
.eyebrow{display:flex;align-items:center;gap:7px;font-size:11px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:#0073E6;margin-bottom:8px}\
.eyebrow .dot{width:5px;height:5px;border-radius:50%;background:#B5851C}\
.title{font-size:19px;font-weight:700;letter-spacing:-.02em;margin:0 0 7px;line-height:1.2}\
.text{font-size:13.5px;line-height:1.6;color:#475569;margin:0}\
.foot{display:flex;align-items:center;gap:10px;padding:12px 20px 16px}\
.prog{flex:1;min-width:0}\
.prog .count{font-size:11.5px;font-weight:600;color:#94A3B8;margin-bottom:6px;font-variant-numeric:tabular-nums}\
.track{height:5px;border-radius:3px;background:#EEF2F7;overflow:hidden}\
.fill{height:100%;border-radius:3px;background:linear-gradient(90deg,#1D3557,#0073E6);transition:width .35s cubic-bezier(.2,.8,.3,1)}\
.btns{display:flex;align-items:center;gap:8px;flex:none}\
.btn{display:inline-flex;align-items:center;gap:6px;font-family:inherit;font-size:13px;font-weight:600;border-radius:9px;padding:9px 14px;cursor:pointer;border:1px solid transparent;transition:.14s;white-space:nowrap}\
.btn:focus-visible{outline:2px solid #0073E6;outline-offset:2px}\
.btn-primary{background:#1D3557;color:#fff}.btn-primary:hover{background:#162840}\
.btn-ghost{background:transparent;color:#475569;border-color:#E2E8F0}.btn-ghost:hover{background:#F1F5F9;color:#24272D}\
.btn-icon{padding:9px;border-color:#E2E8F0;color:#64748B;background:#fff}.btn-icon:hover{background:#F1F5F9;color:#24272D}\
.btn-text{background:transparent;color:#94A3B8;border:0;padding:9px 6px}.btn-text:hover{color:#475569}\
.close{position:absolute;top:12px;right:12px;z-index:2}\
.skiprow{display:flex;align-items:center;justify-content:space-between;padding:0 20px 14px;margin-top:-4px}\
/* ---- welcome & menu (modal) ---- */\
.modal{width:520px;max-width:calc(100vw - 32px);max-height:calc(100vh - 48px);background:#fff;border-radius:20px;box-shadow:0 30px 70px rgba(13,25,42,.4);overflow:hidden;display:flex;flex-direction:column;animation:pop .34s cubic-bezier(.2,.8,.3,1) both}\
.mhead{position:relative;padding:26px 28px 0}\
.mhero{height:168px;margin:0 -28px 0;padding:18px 28px 0}\
.mhero svg{height:100%;filter:drop-shadow(0 8px 18px rgba(29,53,87,.12))}\
.mtitle{font-size:25px;font-weight:800;letter-spacing:-.03em;margin:16px 0 6px}\
.mtext{font-size:14px;line-height:1.6;color:#475569;margin:0}\
.mbody{padding:22px 28px 26px;overflow-y:auto}\
.mactions{display:flex;gap:10px;margin-top:20px;flex-wrap:wrap}\
.btn-lg{padding:12px 18px;font-size:14px;border-radius:11px}\
.menu-head{display:flex;align-items:flex-start;gap:14px;padding:24px 26px 18px;border-bottom:1px solid #E2E8F0}\
.menu-mark{width:44px;height:44px;border-radius:12px;flex:none;display:flex;align-items:center;justify-content:center;background:#EAF0F7;color:#1D3557}\
.menu-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:18px 22px 8px}\
.tourcard{position:relative;text-align:left;display:flex;flex-direction:column;gap:9px;padding:15px 15px 14px;border:1px solid #E2E8F0;border-radius:14px;background:#fff;cursor:pointer;font-family:inherit;transition:.15s}\
.tourcard:hover{border-color:#0073E6;background:#F8FBFF;transform:translateY(-2px);box-shadow:0 10px 26px rgba(29,53,87,.10)}\
.tourcard.primary{grid-column:1 / -1;flex-direction:row;align-items:center;gap:14px;background:linear-gradient(120deg,#F5F9FF,#EEF4FC);border-color:#CBDDF5}\
.tc-icon{width:38px;height:38px;border-radius:10px;flex:none;display:flex;align-items:center;justify-content:center}\
.tc-title{font-size:14.5px;font-weight:700;letter-spacing:-.01em;color:#24272D;display:flex;align-items:center;gap:7px}\
.tc-tag{font-size:12px;color:#64748B;line-height:1.45}\
.tc-meta{display:flex;align-items:center;gap:6px;font-size:11px;color:#94A3B8;font-weight:600;margin-top:1px}\
.done-badge{display:inline-flex;align-items:center;gap:4px;font-size:10.5px;font-weight:700;color:#16A34A;background:#F0FDF4;padding:2px 7px;border-radius:20px}\
.menu-foot{display:flex;align-items:center;justify-content:space-between;padding:14px 24px;border-top:1px solid #E2E8F0;margin-top:10px}\
.chk{display:inline-flex;align-items:center;gap:8px;font-size:12.5px;color:#64748B;cursor:pointer;user-select:none}\
.chk input{width:15px;height:15px;accent-color:#1D3557;cursor:pointer}\
.kbd{font-family:ui-monospace,Menlo,monospace;font-size:10.5px;background:#F1F5F9;border:1px solid #E2E8F0;border-bottom-width:2px;border-radius:5px;padding:1px 5px;color:#64748B}\
/* ---- role view ---- */\
.menu-tabs{padding:14px 22px 2px}\
.seg{display:inline-flex;background:#EEF1F6;padding:3px;border-radius:10px;gap:3px}\
.seg button{display:inline-flex;align-items:center;gap:7px;border:0;background:transparent;color:#64748B;font-family:inherit;font-size:13px;font-weight:600;padding:8px 15px;border-radius:8px;cursor:pointer;transition:.13s}\
.seg button.on{background:#fff;color:#24272D;box-shadow:0 1px 2px rgba(15,23,42,.08)}\
.menu-hint{font-size:12.5px;color:#64748B;line-height:1.5;padding:16px 24px 4px}\
.menu-hint b{color:#24272D;font-weight:600}\
.role-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:12px 22px 8px}\
.rolecard{position:relative;text-align:left;display:grid;grid-template-columns:auto 1fr;grid-auto-rows:min-content;column-gap:12px;row-gap:4px;align-items:start;padding:15px 15px 14px;border:1px solid #E2E8F0;border-radius:14px;background:#fff;cursor:pointer;font-family:inherit;transition:.15s}\
.rolecard:hover{border-color:#0073E6;background:#F8FBFF;transform:translateY(-2px);box-shadow:0 10px 26px rgba(29,53,87,.10)}\
.rolecard .tc-icon{grid-row:1 / span 3}\
.rc-title{font-size:14.5px;font-weight:700;letter-spacing:-.01em;color:#24272D;display:flex;align-items:center;gap:7px}\
.rc-blurb{font-size:12px;color:#64748B;line-height:1.45}\
.rolecard .tc-meta{grid-column:2}\
.rc-go{position:absolute;top:15px;right:14px;color:#CBD5E1;transition:.15s}\
.rolecard:hover .rc-go{color:#0073E6;transform:translateX(2px)}\
.backbtn{display:inline-flex;align-items:center;gap:6px;margin:14px 24px 0;border:1px solid #E2E8F0;background:#fff;color:#475569;font-family:inherit;font-size:12.5px;font-weight:600;padding:7px 12px;border-radius:9px;cursor:pointer;transition:.13s}\
.backbtn:hover{background:#F1F5F9;color:#24272D}\
.role-head{display:flex;align-items:center;gap:13px;padding:14px 24px 2px}\
.rh-title{font-size:16px;font-weight:700;letter-spacing:-.02em;color:#24272D}\
.rh-blurb{font-size:12.5px;color:#64748B;margin-top:2px;line-height:1.4}\
.path-label{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#94A3B8;padding:14px 24px 0}\
/* ---- illustration animations ---- */\
.il-float{animation:ilfloat 3.4s ease-in-out infinite;transform-origin:center}\
@keyframes ilfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}\
.il-pulse{animation:ilpulse 2.2s ease-out infinite;transform-origin:center}\
@keyframes ilpulse{0%{opacity:.28;transform:scale(.7)}70%{opacity:0;transform:scale(1.5)}100%{opacity:0}}\
.il-draw{animation:ildraw 2.6s ease-in-out infinite}\
@keyframes ildraw{0%{stroke-dashoffset:120}45%,100%{stroke-dashoffset:0}}\
.il-slide-card{animation:ilslide 2.8s cubic-bezier(.2,.8,.3,1) infinite}\
@keyframes ilslide{0%{transform:translate(-58px,0);opacity:0}20%,80%{transform:none;opacity:1}100%{transform:translate(58px,0);opacity:0}}\
.il-ring{animation:ilspin 2.4s linear infinite}\
@keyframes ilspin{to{transform:rotate(360deg)}}\
.il-spin-slow{animation:ilspin 16s linear infinite}\
.il-spark circle,.il-spark path{animation:iltwinkle 2s ease-in-out infinite}\
.il-spark *:nth-child(2){animation-delay:.5s}.il-spark *:nth-child(3){animation-delay:1s}.il-spark *:nth-child(4){animation-delay:1.4s}\
@keyframes iltwinkle{0%,100%{opacity:.25;transform:scale(.7)}50%{opacity:1;transform:scale(1.1)}}\
.il-rise{animation:ilrise 3s ease-in-out infinite;transform-origin:center}\
@keyframes ilrise{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}\
.il-rise path{opacity:1 !important}\
.il-pen{animation:ilpen 2.6s ease-in-out infinite}\
@keyframes ilpen{0%{transform:translate(-84px,0)}45%,100%{transform:translate(0,0)}}\
.il-up{animation:ilup 2.2s ease-in-out infinite}\
@keyframes ilup{0%,100%{transform:translateY(3px)}50%{transform:translateY(-6px)}}\
.il-fall1{animation:ilfall 2.6s ease-in infinite}\
.il-fall2{animation:ilfall 2.6s ease-in infinite .5s}\
.il-fall3{animation:ilfall 2.6s ease-in infinite 1s}\
@keyframes ilfall{0%{transform:translateY(-30px);opacity:0}25%{opacity:1}55%,100%{transform:translateY(0);opacity:1}}\
.il-tilt{animation:iltilt 3.2s ease-in-out infinite;transform-origin:center;transform-box:fill-box}\
@keyframes iltilt{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}\
.il-bob{animation:ilbob 3.6s ease-in-out infinite;transform-origin:center;transform-box:fill-box}\
@keyframes ilbob{0%,100%{transform:translateY(2px) rotate(-2deg)}50%{transform:translateY(-6px) rotate(2deg)}}\
.il-driftx{animation:ildriftx 4s ease-in-out infinite}\
@keyframes ildriftx{0%,100%{transform:translateX(-7px)}50%{transform:translateX(7px)}}\
.il-grow{animation:ilgrow 2.8s ease-in-out infinite;transform-origin:left center;transform-box:fill-box}\
@keyframes ilgrow{0%{transform:scaleX(.05)}45%,100%{transform:scaleX(1)}}\
.il-scan{animation:ilscan 2.6s ease-in-out infinite}\
@keyframes ilscan{0%{transform:translateY(-34px);opacity:0}18%,82%{opacity:1}100%{transform:translateY(34px);opacity:0}}\
.il-blink{animation:ilblink 1.9s ease-in-out infinite}\
@keyframes ilblink{0%,100%{opacity:1}50%{opacity:.3}}\
.il-drop{animation:ildrop 2.8s ease-in-out infinite}\
@keyframes ildrop{0%{transform:translateY(-16px);opacity:0}28%,100%{transform:translateY(0);opacity:1}}\
.il-orbit{animation:ilspin 7s linear infinite}\
.il-wave>*{animation:ilwave 1.9s ease-in-out infinite;transform-box:fill-box}\
.il-wave>*:nth-child(2){animation-delay:.15s}.il-wave>*:nth-child(3){animation-delay:.3s}.il-wave>*:nth-child(4){animation-delay:.45s}.il-wave>*:nth-child(5){animation-delay:.6s}\
@keyframes ilwave{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}\
.il-popseq>*{animation:ilpopseq 2.6s ease-in-out infinite;transform-origin:center;transform-box:fill-box}\
.il-popseq>*:nth-child(2){animation-delay:.28s}.il-popseq>*:nth-child(3){animation-delay:.56s}.il-popseq>*:nth-child(4){animation-delay:.84s}\
@keyframes ilpopseq{0%,55%,100%{transform:scale(1)}28%{transform:scale(1.16)}}\
.il-shift{animation:ilshift 3.4s ease-in-out infinite}\
@keyframes ilshift{0%,100%{transform:translateX(0)}50%{transform:translateX(20px)}}\
.il-swap{animation:ilswap 3.4s ease-in-out infinite}\
@keyframes ilswap{0%,100%{transform:translateX(0)}50%{transform:translateX(-22px)}}\
@media (prefers-reduced-motion: reduce){.il-float,.il-pulse,.il-draw,.il-slide-card,.il-ring,.il-spin-slow,.il-spark circle,.il-spark path,.il-rise,.il-pen,.il-up,.il-fall1,.il-fall2,.il-fall3,.il-tilt,.il-bob,.il-driftx,.il-grow,.il-scan,.il-blink,.il-drop,.il-orbit,.il-wave>*,.il-popseq>*,.il-shift,.il-swap,.ring::after{animation:none!important}}\
";

  class McaapOnboarding extends HTMLElement {
    constructor() {
      super();
      this.st = loadState();
      this.mode = 'closed';          // closed | welcome | menu | tour | done
      this.tour = null;
      this.step = 0;
      this.menuTab = 'role';         // role | all
      this.selectedRole = null;
      this._onKey = this._onKey.bind(this);
      this._onScroll = this._onScroll.bind(this);
      this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      var style = document.createElement('style');
      style.textContent = CSS;
      this.shadowRoot.appendChild(style);
      this.root = document.createElement('div');
      this.root.className = 'wrap hidden';
      this.shadowRoot.appendChild(this.root);

      window.addEventListener('mcaap-tour:open', () => this.openMenu());
      window.addEventListener('mcaap-tour:start', (e) => this.startTour((e.detail || {}).id));
      window.addEventListener('resize', this._onScroll);
      window.addEventListener('scroll', this._onScroll, true);

      // first-visit auto trigger
      if (!this.st.seenWelcome && !this.st.neverShow) {
        setTimeout(() => { if (this.mode === 'closed') this.openWelcome(); }, 900);
      }
    }

    save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(this.st)); } catch (e) {} }

    // ---------- state transitions ----------
    openWelcome() { this.mode = 'welcome'; this.render(); this.bindKeys(true); }
    openMenu() { this.mode = 'menu'; this.render(); this.bindKeys(true); }
    close() {
      this.mode = 'closed'; this.tour = null;
      this.root.className = 'wrap hidden'; this.root.innerHTML = '';
      this.bindKeys(false);
    }
    startTour(id) {
      var t = (window.MCAAP_TOURS || []).find((x) => x.id === id);
      if (!t) return;
      this.tour = t; this.step = 0; this.mode = 'tour';
      this.st.seenWelcome = true; this.save();
      this.enterStep();
      this.bindKeys(true);
    }
    next() {
      if (!this.tour) return;
      if (this.step >= this.tour.steps.length - 1) { this.finishTour(); return; }
      this.step++; this.enterStep();
    }
    prev() { if (this.tour && this.step > 0) { this.step--; this.enterStep(); } }
    finishTour() {
      if (this.tour) { this.st.completed[this.tour.id] = true; this.st.seenWelcome = true; this.save(); }
      this.mode = 'done'; this.render();
    }

    // navigate (if needed) then wait for the target to exist, then paint the step
    enterStep() {
      var s = this.tour.steps[this.step];
      if (s.page) navigate(s.page);
      var self = this;
      var tries = 0;
      function attempt() {
        var ok = !s.target || document.querySelector(s.target);
        if (ok || tries > 28) { self.render(); self.layout(); return; }
        tries++; requestAnimationFrame(attempt);
      }
      // give React a beat to render the destination page
      setTimeout(attempt, s.page ? 90 : 0);
    }

    _onScroll() { if (this.mode === 'tour') this.layout(); }
    bindKeys(on) {
      window.removeEventListener('keydown', this._onKey);
      if (on) window.addEventListener('keydown', this._onKey);
    }
    _onKey(e) {
      if (this.mode === 'closed') return;
      if (e.key === 'Escape') { e.preventDefault(); this.close(); return; }
      if (this.mode !== 'tour') return;
      if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); this.next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); this.prev(); }
    }

    // ---------- rendering ----------
    render() {
      this.root.className = 'wrap';
      if (this.mode === 'welcome') this.root.innerHTML = this.viewWelcome();
      else if (this.mode === 'menu') this.root.innerHTML = this.viewMenu();
      else if (this.mode === 'tour') this.root.innerHTML = this.viewTour();
      else if (this.mode === 'done') this.root.innerHTML = this.viewDone();
      this.bind();
    }

    viewWelcome() {
      return '<div class="catch"></div><div class="centerwrap"><div class="modal">' +
        '<button class="btn btn-icon close" data-act="close" aria-label="Close">' + svg('x', 17) + '</button>' +
        '<div class="mhead"><div class="mhero">' + (window.MCAAP_ILLUS.welcome || '') + '</div>' +
        '<div class="eyebrow"><span class="dot"></span>Guided tour</div>' +
        '<h1 class="mtitle">Welcome to MCAAP</h1>' +
        '<p class="mtext">Your agency operations command center. Take a quick tour of the whole platform, or jump straight into the workflow you work in most.</p></div>' +
        '<div class="mbody"><div class="mactions">' +
        '<button class="btn btn-primary btn-lg" data-act="start" data-id="getting-started">' + svg('map', 17) + 'Take the tour</button>' +
        '<button class="btn btn-ghost btn-lg" data-act="menu">Browse all tours ' + svg('arrow_right', 16) + '</button>' +
        '</div><div class="skiprow" style="padding:18px 0 0"><label class="chk"><input type="checkbox" data-act="never"> Don’t show this again</label>' +
        '<button class="btn btn-text" data-act="close">Skip for now</button></div></div></div></div>';
    }

    tourCard(t) {
      var done = !!this.st.completed[t.id];
      return '<button class="tourcard' + (t.primary ? ' primary' : '') + '" data-act="start" data-id="' + t.id + '">' +
        '<span class="tc-icon" style="background:' + hexTint(t.color) + ';color:' + t.color + '">' + svg(t.icon, 20) + '</span>' +
        '<span style="flex:1;min-width:0"><span class="tc-title">' + t.title + (done ? ' <span class="done-badge">' + svg('check', 11) + 'Done</span>' : '') + '</span>' +
        '<span class="tc-tag">' + t.tagline + '</span>' +
        '<span class="tc-meta">' + svg('clock', 12) + t.minutes + ' min · ' + t.steps.length + ' steps</span></span>' +
        (t.primary ? '<span style="color:' + t.color + '">' + svg('arrow_right', 18) + '</span>' : '') +
        '</button>';
    }

    // ordered tours for a role: Getting Started pinned first, then the role's list
    rolePath(role) {
      var tours = window.MCAAP_TOURS || [];
      var ids = role.tours.slice();
      if (ids.indexOf('getting-started') < 0) ids.unshift('getting-started');
      var seen = {};
      return ids.map((id) => tours.find((t) => t.id === id)).filter((t) => t && !seen[t.id] && (seen[t.id] = 1));
    }

    viewMenu() {
      var tours = window.MCAAP_TOURS || [];
      var roles = window.MCAAP_ROLES || [];
      var completedCount = tours.filter((t) => this.st.completed[t.id]).length;
      var tab = this.menuTab || 'role';

      var seg = '<div class="seg">' +
        '<button class="' + (tab === 'role' ? 'on' : '') + '" data-act="tab" data-tab="role">' + svg('user', 15) + 'By role</button>' +
        '<button class="' + (tab === 'all' ? 'on' : '') + '" data-act="tab" data-tab="all">' + svg('grid', 15) + 'All tutorials</button>' +
        '</div>';

      var body;
      if (tab === 'all') {
        body = '<div class="menu-grid">' + tours.map((t) => this.tourCard(t)).join('') + '</div>';
      } else if (!this.selectedRole) {
        body = '<div class="menu-hint">Choose your role to see a recommended learning path — or switch to <b>All tutorials</b> to pick any.</div>' +
          '<div class="role-grid">' + roles.map((r) => {
            var path = this.rolePath(r);
            var done = path.filter((t) => this.st.completed[t.id]).length;
            return '<button class="rolecard" data-act="pickrole" data-id="' + r.id + '">' +
              '<span class="tc-icon" style="background:' + hexTint(r.color) + ';color:' + r.color + '">' + svg(r.icon, 20) + '</span>' +
              '<span class="rc-title">' + r.label + (done === path.length ? ' <span class="done-badge">' + svg('check', 11) + 'Done</span>' : '') + '</span>' +
              '<span class="rc-blurb">' + r.blurb + '</span>' +
              '<span class="tc-meta">' + svg('map', 12) + path.length + ' tutorials' + (done ? ' · ' + done + ' done' : '') + '</span>' +
              '<span class="rc-go">' + svg('arrow_right', 16) + '</span></button>';
          }).join('') + '</div>';
      } else {
        var role = roles.find((r) => r.id === this.selectedRole) || roles[0];
        var path = this.rolePath(role);
        body = '<button class="backbtn" data-act="backroles">' + svg('arrow_left', 15) + 'All roles</button>' +
          '<div class="role-head"><span class="tc-icon" style="background:' + hexTint(role.color) + ';color:' + role.color + '">' + svg(role.icon, 20) + '</span>' +
          '<div style="min-width:0"><div class="rh-title">' + role.label + '</div><div class="rh-blurb">' + role.blurb + '</div></div></div>' +
          '<div class="path-label">' + svg('map', 12) + 'Recommended path · ' + path.length + ' tutorials</div>' +
          '<div class="menu-grid">' + path.map((t) => this.tourCard(t)).join('') + '</div>';
      }

      return '<div class="catch"></div><div class="centerwrap"><div class="modal">' +
        '<div class="menu-head"><span class="menu-mark">' + svg('map', 22) + '</span>' +
        '<div style="flex:1;min-width:0"><div class="mtitle" style="font-size:20px;margin:0">Tutorials</div>' +
        '<div class="mtext" style="font-size:13px;margin-top:3px">' + completedCount + ' of ' + tours.length + ' completed. Replay any tutorial anytime.</div></div>' +
        '<button class="btn btn-icon" data-act="close" aria-label="Close">' + svg('x', 17) + '</button></div>' +
        '<div class="menu-tabs">' + seg + '</div>' +
        '<div class="mbody" style="padding:0 0 6px">' + body +
        '<div class="menu-foot"><span style="font-size:11.5px;color:#94A3B8">Use ' + kbd('←') + ' ' + kbd('→') + ' to navigate · ' + kbd('Esc') + ' to close</span>' +
        '<button class="btn btn-text" data-act="reset">Reset progress</button></div></div></div></div>';
    }

    viewTour() {
      var s = this.tour.steps[this.step];
      var hasTarget = s.target && document.querySelector(s.target);
      var illus = (window.MCAAP_ILLUS[s.illus] || window.MCAAP_ILLUS.welcome || '');
      var total = this.tour.steps.length;
      var pct = Math.round(((this.step + 1) / total) * 100);
      var backBtn = this.step > 0 ? '<button class="btn btn-icon" data-act="prev" aria-label="Back">' + svg('arrow_left', 16) + '</button>' : '';
      var nextLabel = this.step >= total - 1 ? 'Finish' : 'Next';
      var card = '<div class="card' + (hasTarget ? '' : ' center') + '">' +
        '<button class="btn btn-icon close" data-act="close" aria-label="Close tour">' + svg('x', 16) + '</button>' +
        '<div class="illus">' + illus + '</div>' +
        '<div class="body"><div class="eyebrow"><span class="dot"></span>' + this.tour.title + '</div>' +
        '<h2 class="title">' + s.title + '</h2><p class="text">' + s.body + '</p></div>' +
        '<div class="foot"><div class="prog"><div class="count">Step ' + (this.step + 1) + ' of ' + total + '</div>' +
        '<div class="track"><div class="fill" style="width:' + pct + '%"></div></div></div>' +
        '<div class="btns">' + backBtn + '<button class="btn btn-primary" data-act="next">' + nextLabel + (nextLabel === 'Next' ? svg('arrow_right', 16) : svg('check', 16)) + '</button></div></div>' +
        '<div class="skiprow"><button class="btn btn-text" data-act="menu">All tours</button><button class="btn btn-text" data-act="close">Skip tour</button></div>' +
        '</div>';
      if (hasTarget) {
        return '<div class="catch clear" data-act="noop"></div><div class="hole"></div><div class="ring"></div><div class="arrow"></div>' + card;
      }
      return '<div class="catch"></div><div class="centerwrap">' + card + '</div>';
    }

    viewDone() {
      var t = this.tour || {};
      var tours = window.MCAAP_TOURS || [];
      var remaining = tours.filter((x) => !this.st.completed[x.id] && !x.primary);
      var nextT = remaining[0];
      return '<div class="catch"></div><div class="centerwrap"><div class="modal">' +
        '<button class="btn btn-icon close" data-act="close" aria-label="Close">' + svg('x', 17) + '</button>' +
        '<div class="mhead"><div class="mhero">' + (window.MCAAP_ILLUS.celebrate || '') + '</div>' +
        '<div class="eyebrow"><span class="dot"></span>Tour complete</div>' +
        '<h1 class="mtitle">Nice work!</h1>' +
        '<p class="mtext">You’ve finished the <b style="color:#24272D">' + (t.title || '') + '</b> tour. It’s marked complete — you can replay it anytime from the “?” menu.</p></div>' +
        '<div class="mbody"><div class="mactions">' +
        (nextT ? '<button class="btn btn-primary btn-lg" data-act="start" data-id="' + nextT.id + '">Next: ' + nextT.title + ' ' + svg('arrow_right', 16) + '</button>' : '') +
        '<button class="btn btn-ghost btn-lg" data-act="menu">' + svg('map', 16) + 'All tours</button>' +
        '<button class="btn btn-text btn-lg" data-act="close">Done</button>' +
        '</div></div></div></div>';
    }

    // position spotlight hole + ring + arrow + card around the current target
    layout() {
      if (this.mode !== 'tour') return;
      var s = this.tour.steps[this.step];
      var el = s.target ? document.querySelector(s.target) : null;
      var hole = this.root.querySelector('.hole'), ring = this.root.querySelector('.ring'),
          arrow = this.root.querySelector('.arrow'), card = this.root.querySelector('.card');
      if (!el || !hole || !card) return;

      var r = el.getBoundingClientRect();
      var vh = window.innerHeight, vw = window.innerWidth, pad = 8;

      // scroll target into a comfortable band if off-screen
      if (r.top < 80 || r.bottom > vh - 60) {
        var goal = window.scrollY + r.top - Math.max(90, vh * 0.28);
        window.scrollTo({ top: Math.max(0, goal), behavior: 'smooth' });
        setTimeout(() => this.layout(), 340);
      }
      r = el.getBoundingClientRect();

      var hx = r.left - pad, hy = r.top - pad, hw = r.width + pad * 2, hh = r.height + pad * 2;
      hole.style.left = hx + 'px'; hole.style.top = hy + 'px'; hole.style.width = hw + 'px'; hole.style.height = hh + 'px';
      ring.style.left = (hx - 2) + 'px'; ring.style.top = (hy - 2) + 'px'; ring.style.width = (hw + 4) + 'px'; ring.style.height = (hh + 4) + 'px';

      var cw = card.offsetWidth || 360, ch = card.offsetHeight || 320;
      var place = s.placement || 'bottom';
      var gap = 18, top, left, arr = {};
      var spaceBelow = vh - r.bottom, spaceAbove = r.top;
      if (place === 'bottom' && spaceBelow < ch + gap && spaceAbove > spaceBelow) place = 'top';
      if (place === 'top' && spaceAbove < ch + gap && spaceBelow > spaceAbove) place = 'bottom';

      if (place === 'top' || place === 'bottom') {
        left = r.left + r.width / 2 - cw / 2;
        left = Math.max(12, Math.min(left, vw - cw - 12));
        top = place === 'bottom' ? r.bottom + gap : r.top - ch - gap;
        var acx = r.left + r.width / 2;
        arr.left = Math.max(left + 14, Math.min(acx - 7, left + cw - 22));
        arr.top = place === 'bottom' ? top - 7 : top + ch - 7;
      } else {
        top = r.top + r.height / 2 - ch / 2;
        top = Math.max(12, Math.min(top, vh - ch - 12));
        left = place === 'right' ? r.right + gap : r.left - cw - gap;
        arr.top = Math.max(top + 14, Math.min(r.top + r.height / 2 - 7, top + ch - 22));
        arr.left = place === 'right' ? left - 7 : left + cw - 7;
      }
      top = Math.max(12, Math.min(top, vh - ch - 12));
      card.style.top = top + 'px'; card.style.left = left + 'px';
      if (arrow) {
        arrow.style.top = arr.top + 'px'; arrow.style.left = arr.left + 'px';
        // arrow only needs 2 visible borders depending on side; simple square is fine
        arrow.style.display = 'block';
      }
    }

    // wire up buttons for the current view
    bind() {
      var self = this;
      this.root.querySelectorAll('[data-act]').forEach((btn) => {
        btn.addEventListener('click', function (e) {
          var act = btn.getAttribute('data-act');
          if (act === 'noop') return;
          e.stopPropagation();
          if (act === 'close') self.close();
          else if (act === 'menu') self.openMenu();
          else if (act === 'start') self.startTour(btn.getAttribute('data-id'));
          else if (act === 'next') self.next();
          else if (act === 'prev') self.prev();
          else if (act === 'reset') { self.st.completed = {}; self.save(); self.render(); }
          else if (act === 'tab') { self.menuTab = btn.getAttribute('data-tab'); self.selectedRole = null; self.render(); }
          else if (act === 'pickrole') { self.selectedRole = btn.getAttribute('data-id'); self.render(); }
          else if (act === 'backroles') { self.selectedRole = null; self.render(); }
          else if (act === 'never') { self.st.neverShow = btn.checked; self.st.seenWelcome = true; self.save(); }
        });
      });
    }
  }

  function hexTint(hex) {
    var m = { '#1D3557': '#EAF0F7', '#0073E6': '#EBF4FF', '#16A34A': '#F0FDF4', '#B5851C': '#FFFBEB' };
    return m[hex] || '#F1F5F9';
  }
  function kbd(k) { return '<span class="kbd">' + k + '</span>'; }

  if (!customElements.get('mcaap-onboarding')) customElements.define('mcaap-onboarding', McaapOnboarding);
})();
