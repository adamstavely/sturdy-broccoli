import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { McaapOnboarding } from './mcaap-onboarding';
import { TOURS } from './tours';

// The component uses bare globals (requestAnimationFrame / localStorage) that the
// spec (mock-DOM) environment doesn't always provide — polyfill them once.
beforeAll(() => {
  const g = global as any;
  if (typeof g.requestAnimationFrame === 'undefined') {
    g.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(() => cb(0), 0) as any;
    g.cancelAnimationFrame = (id: any) => clearTimeout(id);
  }
  if (typeof g.localStorage === 'undefined') {
    let store: Record<string, string> = {};
    g.localStorage = {
      getItem: (k: string) => (k in store ? store[k] : null),
      setItem: (k: string, v: string) => { store[k] = String(v); },
      removeItem: (k: string) => { delete store[k]; },
      clear: () => { store = {}; },
    };
  }
});
beforeEach(() => localStorage.clear());

async function mount(): Promise<SpecPage> {
  return newSpecPage({ components: [McaapOnboarding], html: `<mcaap-onboarding></mcaap-onboarding>` });
}
/** Non-null shadow root accessor — under `strict` the raw `page.root.shadowRoot` is
 * `ShadowRoot | null`; every test here runs after the component has rendered, so a
 * missing shadow root is itself a failure worth throwing on rather than typing around. */
function shadow(page: SpecPage): ShadowRoot {
  const sr = page.root && page.root.shadowRoot;
  if (!sr) throw new Error('expected a shadowRoot');
  return sr;
}
function q(page: SpecPage, sel: string): Element {
  const el = shadow(page).querySelector(sel);
  if (!el) throw new Error(`expected to find "${sel}"`);
  return el;
}
/** Drive the private key-handling logic directly (unit-level). Real keydown->handler
 * wiring across the window listener is covered end-to-end in test/smoke.e2e.mjs. */
function pressKey(page: SpecPage, key: string) {
  (page.rootInstance as any).handleKey({ key, preventDefault: () => {} });
}

describe('mcaap-onboarding — flow & state machine', () => {
  it('renders nothing when closed', async () => {
    const page = await mount();
    expect(shadow(page).querySelector('.wrap')).toBeNull();
  });

  it('open() shows the tutorials menu, defaulting to the "By role" tab', async () => {
    const page = await mount();
    await page.rootInstance.open();
    await page.waitForChanges();
    expect(shadow(page).querySelector('.menu-head')).toBeTruthy();
    expect(shadow(page).querySelectorAll('.rolecard').length).toBeGreaterThan(0);
  });

  it('the "All tutorials" tab lists a card per tour', async () => {
    const page = await mount();
    await page.rootInstance.open();
    page.rootInstance.menuTab = 'all';
    await page.waitForChanges();
    expect(shadow(page).querySelectorAll('.tourcard').length).toBeGreaterThan(0);
  });

  it('start(id) enters the tour and renders the first step', async () => {
    const page = await mount();
    await page.rootInstance.start('getting-started');
    await page.waitForChanges();
    expect(q(page, '.title').textContent).toContain('Welcome to MCAAP');
    expect(q(page, '.count').textContent).toContain('Step 1 of');
  });

  it('start(id) with an unknown id is a no-op', async () => {
    const page = await mount();
    await page.rootInstance.start('does-not-exist');
    await page.waitForChanges();
    expect(shadow(page).querySelector('.wrap')).toBeNull();
  });

  it('starting a new tour while one is active abandons the old one and starts fresh', async () => {
    const page = await mount();
    const skipped = jest.fn();
    page.root!.addEventListener('mcaapTourSkipped', skipped);
    await page.rootInstance.start('clearance');
    await page.rootInstance.start('memos'); // switch mid-tour, no Escape/close in between
    await page.waitForChanges();
    // @Watch('mode') can't see a 'tour' -> 'tour' transition, so beginTour() must emit
    // the skip itself — this is the fix for the abandoned-tour analytics gap.
    expect(skipped).toHaveBeenCalledTimes(1);
    expect((skipped.mock.calls[0][0] as CustomEvent).detail).toMatchObject({ id: 'clearance', step: 1 });
    expect(page.rootInstance.tourId).toBe('memos');
    expect(page.rootInstance.step).toBe(0);
  });
});

describe('mcaap-onboarding — keyboard navigation', () => {
  it('ArrowRight advances a step and ArrowLeft goes back', async () => {
    const page = await mount();
    await page.rootInstance.start('getting-started');
    await page.waitForChanges();
    pressKey(page, 'ArrowRight');
    await page.waitForChanges();
    expect(page.rootInstance.step).toBe(1);
    pressKey(page, 'ArrowLeft');
    await page.waitForChanges();
    expect(page.rootInstance.step).toBe(0);
  });

  it('Escape closes the tour', async () => {
    const page = await mount();
    await page.rootInstance.start('getting-started');
    await page.waitForChanges();
    pressKey(page, 'Escape');
    await page.waitForChanges();
    expect(page.rootInstance.mode).toBe('closed');
  });

  it('ArrowRight on the last step finishes the tour', async () => {
    const page = await mount();
    await page.rootInstance.start('memos'); // 5 steps
    await page.waitForChanges();
    for (let i = 0; i < 5; i++) { pressKey(page, 'ArrowRight'); await page.waitForChanges(); }
    expect(page.rootInstance.mode).toBe('done');
  });
});

describe('mcaap-onboarding — completion', () => {
  it('finishing a tour marks it completed and emits mcaapTourCompleted (not skipped)', async () => {
    const page = await mount();
    const completed = jest.fn(), skipped = jest.fn();
    page.root!.addEventListener('mcaapTourCompleted', completed);
    page.root!.addEventListener('mcaapTourSkipped', skipped);
    await page.rootInstance.start('memos');
    await page.waitForChanges();
    const total = TOURS.find(t => t.id === 'memos')!.steps.length;
    for (let i = 0; i < total; i++) { pressKey(page, 'ArrowRight'); await page.waitForChanges(); }
    expect(completed).toHaveBeenCalledTimes(1);
    expect((completed.mock.calls[0][0] as CustomEvent).detail).toEqual({ id: 'memos', title: 'Memos' });
    expect(skipped).not.toHaveBeenCalled();
    expect(page.rootInstance.completed['memos']).toBe(true);
  });
});

describe('mcaap-onboarding — reset progress', () => {
  it('clears completed tours and first-run flags, and persists the reset', async () => {
    const page = await mount();
    await page.rootInstance.start('memos');
    const total = TOURS.find(t => t.id === 'memos')!.steps.length;
    for (let i = 0; i < total; i++) { pressKey(page, 'ArrowRight'); await page.waitForChanges(); }
    expect(page.rootInstance.completed['memos']).toBe(true);

    (page.rootInstance as any).resetProgress();
    await page.waitForChanges();
    expect(page.rootInstance.completed).toEqual({});
    const saved = JSON.parse(localStorage.getItem('mcaap.onboarding.v1') || '{}');
    expect(saved.completed).toEqual({});
    expect(saved.neverShow).toBe(false);
    expect(saved.seenWelcome).toBe(false);
  });
});

describe('mcaap-onboarding — accessibility wiring', () => {
  it('the tour card is a labelled modal dialog', async () => {
    const page = await mount();
    await page.rootInstance.start('getting-started');
    await page.waitForChanges();
    const dlg = q(page, '[role="dialog"]');
    expect(dlg.getAttribute('aria-modal')).toBe('true');
    expect(dlg.getAttribute('aria-labelledby')).toBe('mo-tour-title');
    expect(shadow(page).querySelector('#mo-tour-title')).toBeTruthy();
    expect(q(page, '[aria-live="polite"]').textContent).toContain('Step 1 of');
  });

  it('the welcome, menu and done screens are also labelled modal dialogs', async () => {
    const page = await mount();
    await page.rootInstance.open();
    await page.waitForChanges();
    expect(q(page, '[role="dialog"]').getAttribute('aria-labelledby')).toBe('mo-menu-title');

    await page.rootInstance.start('memos');
    const total = TOURS.find(t => t.id === 'memos')!.steps.length;
    for (let i = 0; i < total; i++) { pressKey(page, 'ArrowRight'); await page.waitForChanges(); }
    expect(q(page, '[role="dialog"]').getAttribute('aria-labelledby')).toBe('mo-done-title');
  });
});

describe('mcaap-onboarding — analytics events', () => {
  it('emits started, step and navigate when a tour begins', async () => {
    const page = await mount();
    const started = jest.fn(), step = jest.fn(), nav = jest.fn();
    page.root!.addEventListener('mcaapTourStarted', started);
    page.root!.addEventListener('mcaapTourStep', step);
    page.root!.addEventListener('mcaapNavigate', nav);
    await page.rootInstance.start('clearance');
    await page.waitForChanges();
    expect(started).toHaveBeenCalledTimes(1);
    expect((started.mock.calls[0][0] as CustomEvent).detail).toEqual({ id: 'clearance', title: 'Clearance' });
    expect(step).toHaveBeenCalledTimes(1);
    expect((step.mock.calls[0][0] as CustomEvent).detail).toMatchObject({ id: 'clearance', step: 1 });
    expect((nav.mock.calls[0][0] as CustomEvent).detail).toEqual({ page: 'clearance' });
  });

  it('emits skipped when the tour is left before completion', async () => {
    const page = await mount();
    const skipped = jest.fn();
    page.root!.addEventListener('mcaapTourSkipped', skipped);
    await page.rootInstance.start('clearance');
    await page.rootInstance.open(); // leave the tour for the menu
    await page.waitForChanges();
    expect(skipped).toHaveBeenCalledTimes(1);
    expect((skipped.mock.calls[0][0] as CustomEvent).detail).toMatchObject({ id: 'clearance' });
  });
});

describe('mcaap-onboarding — navigation seam', () => {
  it('calls the injected navigateHandler instead of globals', async () => {
    const page = await mount();
    const handler = jest.fn();
    page.rootInstance.navigateHandler = handler;
    await page.rootInstance.start('upload'); // first step navigates to 'upload'
    await page.waitForChanges();
    expect(handler).toHaveBeenCalledWith('upload');
  });
});

describe('mcaap-onboarding — persistence', () => {
  it('records that the welcome has been seen once a tour starts', async () => {
    const page = await mount();
    await page.rootInstance.start('clearance');
    const saved = JSON.parse(localStorage.getItem('mcaap.onboarding.v1') || '{}');
    expect(saved.seenWelcome).toBe(true);
  });
});

describe('mcaap-onboarding — content validation', () => {
  it('validate() reports no content problems on the real tour data', async () => {
    const page = await mount();
    const res = await page.rootInstance.validate();
    expect(res.content).toEqual([]);
    expect(res.pages.length).toBeGreaterThan(0);
  });

  it('validate() actually catches a broken entry (mutation test)', async () => {
    // Proves the validator's logic does something, rather than always returning [] —
    // TOURS is a plain exported array, so we can push a deliberately-broken tour and
    // pop it back off afterwards.
    const page = await mount();
    const badTour = {
      id: 'clearance', // duplicate of an existing id
      title: 'Broken', tagline: '', icon: 'not-a-real-icon', color: '#000', minutes: 1,
      steps: [{ title: '', body: '', illus: 'not-a-real-illustration', placement: 'sideways' as any }],
    };
    TOURS.push(badTour as any);
    try {
      const res = await page.rootInstance.validate();
      expect(res.content).toEqual(expect.arrayContaining([
        expect.stringContaining('Duplicate tour id: "clearance"'),
        expect.stringContaining('unknown icon "not-a-real-icon"'),
        expect.stringContaining('missing title'),
        expect.stringContaining('missing body'),
        expect.stringContaining('unknown illustration "not-a-real-illustration"'),
        expect.stringContaining('bad placement "sideways"'),
      ]));
    } finally {
      TOURS.pop();
    }
  });
});
