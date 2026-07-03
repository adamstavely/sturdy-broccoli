import { newSpecPage } from '@stencil/core/testing';
import { McaapOnboarding } from './mcaap-onboarding';

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

async function mount() {
  return newSpecPage({ components: [McaapOnboarding], html: `<mcaap-onboarding></mcaap-onboarding>` });
}

describe('mcaap-onboarding — flow & state machine', () => {
  it('renders nothing when closed', async () => {
    const page = await mount();
    expect(page.root.shadowRoot.querySelector('.wrap')).toBeNull();
  });

  it('open() shows the tutorials menu, defaulting to the "By role" tab', async () => {
    const page = await mount();
    await page.rootInstance.open();
    await page.waitForChanges();
    expect(page.root.shadowRoot.querySelector('.menu-head')).toBeTruthy();
    expect(page.root.shadowRoot.querySelectorAll('.rolecard').length).toBeGreaterThan(0);
  });

  it('the "All tutorials" tab lists a card per tour', async () => {
    const page = await mount();
    await page.rootInstance.open();
    page.rootInstance.menuTab = 'all';
    await page.waitForChanges();
    expect(page.root.shadowRoot.querySelectorAll('.tourcard').length).toBeGreaterThan(0);
  });

  it('start(id) enters the tour and renders the first step', async () => {
    const page = await mount();
    await page.rootInstance.start('getting-started');
    await page.waitForChanges();
    expect(page.root.shadowRoot.querySelector('.title').textContent).toContain('Welcome to MCAAP');
    expect(page.root.shadowRoot.querySelector('.count').textContent).toContain('Step 1 of');
  });

  it('start(id) with an unknown id is a no-op', async () => {
    const page = await mount();
    await page.rootInstance.start('does-not-exist');
    await page.waitForChanges();
    expect(page.root.shadowRoot.querySelector('.wrap')).toBeNull();
  });
});

describe('mcaap-onboarding — accessibility wiring', () => {
  it('the tour card is a labelled modal dialog', async () => {
    const page = await mount();
    await page.rootInstance.start('getting-started');
    await page.waitForChanges();
    const dlg = page.root.shadowRoot.querySelector('[role="dialog"]');
    expect(dlg).toBeTruthy();
    expect(dlg.getAttribute('aria-modal')).toBe('true');
    expect(dlg.getAttribute('aria-labelledby')).toBe('mo-tour-title');
    expect(page.root.shadowRoot.querySelector('#mo-tour-title')).toBeTruthy();
    expect(page.root.shadowRoot.querySelector('[aria-live="polite"]').textContent).toContain('Step 1 of');
  });
});

describe('mcaap-onboarding — analytics events', () => {
  it('emits started, step and navigate when a tour begins', async () => {
    const page = await mount();
    const started = jest.fn(), step = jest.fn(), nav = jest.fn();
    page.root.addEventListener('mcaapTourStarted', started);
    page.root.addEventListener('mcaapTourStep', step);
    page.root.addEventListener('mcaapNavigate', nav);
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
    page.root.addEventListener('mcaapTourSkipped', skipped);
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
    const saved = JSON.parse(localStorage.getItem('mcaap.onboarding.v1'));
    expect(saved.seenWelcome).toBe(true);
  });
});

describe('mcaap-onboarding — content validation', () => {
  it('validate() reports no content problems (ids/icons/illustrations/role refs)', async () => {
    const page = await mount();
    const res = await page.rootInstance.validate();
    expect(res.content).toEqual([]);
    expect(res.pages.length).toBeGreaterThan(0);
  });
});
