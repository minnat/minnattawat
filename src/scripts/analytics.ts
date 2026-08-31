/**
 * Analytics: PostHog, loaded late and easy to switch off.
 *
 * Three rules this file exists to keep:
 *
 * 1. It never breaks the page. PostHog is loaded lazily and every failure —
 *    an ad-blocker, a dead network, storage being unavailable — resolves to a
 *    no-op. `track()` is always safe to call, even before PostHog has loaded
 *    or when it never loads at all.
 *
 * 2. It never sends anything a visitor typed. No field value from the contact
 *    form is ever captured; the events record which fields were filled and how
 *    long they took, never what was in them. The one exception is the "stage"
 *    dropdown, which is a fixed list of five options rather than free text.
 *
 * 3. It stores nothing on a visitor's machine. `persistence: 'memory'` means no
 *    cookies and no localStorage, which is why the site needs no cookie banner.
 *    The trade-off is that a returning visitor looks like a new one — fine for
 *    a one-page site where a visit is a page load.
 *
 * ---------------------------------------------------------------------------
 * Keeping your own visits out of the data
 *
 * Visit the site once per browser with `?analytics=off`. That sets a flag in
 * localStorage which is checked before PostHog is loaded, so nothing is even
 * downloaded, let alone sent. `?analytics=on` undoes it.
 *
 * `?analytics=debug` is the third switch: it forces tracking on even where it
 * would normally be skipped (localhost, or a browser you opted out) and turns
 * on PostHog's console logging, so you can watch events as they are sent.
 *
 * This is deliberately not PostHog's own `opt_out_capturing()`: PostHog stores
 * that in its persistence layer, and `persistence: 'memory'` would throw it
 * away on the next page load.
 *
 * Known limits, none of them fixable without a login:
 *   - It is per browser profile. Do it on each of your browsers and your phone.
 *   - Clearing site data forgets it. Visit the URL again.
 *   - Private windows are never excluded.
 * As a backstop, PostHog's project-level "internal and test users" filter can
 * drop traffic retroactively — worth adding an $ip rule there if a device you
 * forgot starts showing up.
 */

import type { PostHog } from 'posthog-js';
import { site } from '../data/site';

const STORAGE_KEY = 'mn_analytics_off';

type Props = Record<string, unknown>;
type Mode = 'off' | 'on' | 'debug' | null;

/* ------------------------------------------------------------- the gate */

/** localStorage throws outright in some private-browsing modes, so never trust it. */
function isExcluded(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function setExcluded(excluded: boolean): void {
  try {
    if (excluded) window.localStorage.setItem(STORAGE_KEY, '1');
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    console.warn('[analytics] This browser blocks storage, so the preference cannot be remembered.');
  }
}

function readMode(): Mode {
  const value = new URLSearchParams(window.location.search).get('analytics');
  return value === 'off' || value === 'on' || value === 'debug' ? value : null;
}

/** Drop the param once it has been acted on, so it never ends up in a bookmark or a referrer. */
function stripMode(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete('analytics');
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}

/** Dev servers and Cloudflare preview URLs are never real traffic. */
function isPreviewHost(): boolean {
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host.endsWith('.workers.dev');
}

let debugMode = false;

function shouldTrack(): boolean {
  const mode = readMode();
  debugMode = mode === 'debug';

  if (mode === 'off' || mode === 'on') {
    setExcluded(mode === 'off');
    stripMode();
    console.info(
      mode === 'off'
        ? '[analytics] Off. This browser will not be counted until you visit ?analytics=on.'
        : '[analytics] On. This browser is now counted like any other visitor.',
    );
  }

  // No token means analytics is simply not set up yet — stay completely silent.
  if (!site.posthogKey) return false;
  // `debug` is the deliberate override, so it has to beat both checks below.
  if (mode === 'debug') return true;
  if (isExcluded()) return false;
  return !isPreviewHost();
}

/* ------------------------------------------------------------ the loader */

let instance: PostHog | null = null;
let resolveReady!: (posthog: PostHog | null) => void;
const ready = new Promise<PostHog | null>((resolve) => {
  resolveReady = resolve;
});

function load(): void {
  import('posthog-js')
    .then(({ default: posthog }) => {
      // `?analytics=debug` turns on PostHog's own console logging, which is how
      // you check that a change to the tracking still sends what you think it
      // sends. Called before init() so it covers initialisation and the pageview
      // that init() sends itself.
      if (debugMode) posthog.debug();

      posthog.init(site.posthogKey, {
        api_host: site.posthogHost,
        defaults: '2026-08-30',
        // One pageview per page load, pinned. The site is a single page whose
        // nav is anchor links, so anything history-driven risks counting a jump
        // to #work as a second visit.
        capture_pageview: true,
        // See rule 3 at the top of this file.
        persistence: 'memory',
        // Pageleave is what turns a pageview into a time-on-page and a bounce rate.
        capture_pageleave: true,
        // Catches the clicks this file forgot to name, and powers heatmaps.
        // Autocapture records element text and attributes, never input values.
        autocapture: true,
        disable_session_recording: true,
      });
      // Also reachable as `posthog` in the console while debugging.
      if (debugMode) (window as unknown as Record<string, unknown>).posthog = posthog;

      instance = posthog;
      resolveReady(posthog);
    })
    .catch(() => {
      // Blocked or offline. Expected often enough that it is not worth a warning.
      resolveReady(null);
    });
}

/** Wait for a quiet moment: analytics must never compete with first paint. */
function loadWhenIdle(): void {
  // Safari only shipped requestIdleCallback recently, so the timeout still earns its place.
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(() => load(), { timeout: 3000 });
  } else {
    window.setTimeout(load, 1200);
  }
}

/**
 * Record an event. Safe to call at any time: before PostHog has loaded (it is
 * queued), or when PostHog will never load (it is dropped).
 *
 * Pass `duringUnload` for events fired from a `pagehide` handler — those must
 * skip the batching queue and go out over `sendBeacon`, which is the only
 * transport the browser guarantees to finish once the page is going away.
 */
export function track(event: string, props?: Props, duringUnload = false): void {
  const options = duringUnload ? { transport: 'sendBeacon' as const, send_instantly: true } : undefined;

  if (instance) {
    void instance.capture(event, props, options);
    return;
  }
  // Not loaded yet. Queue it — but an unload event has no future to be queued into.
  if (!duringUnload) void ready.then((posthog) => posthog?.capture(event, props));
}

/* ---------------------------------------------------------------- clicks */

/** Trim a link's visible text down to something readable in a PostHog table. */
function labelOf(el: Element): string {
  const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim();
  return text.length > 80 ? `${text.slice(0, 79)}…` : text;
}

/** Which part of the page a click came from — the hero CTA and the footer CTA are different questions. */
function locationOf(el: Element): string {
  if (el.closest('[data-menu]')) return 'mobile_menu';
  if (el.closest('header')) return 'header';
  if (el.closest('footer')) return 'footer';
  const section = el.closest<HTMLElement>('section[id]');
  if (!section) return 'page';
  return section.id === 'top' ? 'hero' : section.id;
}

function initClicks(): void {
  document.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement | null)?.closest?.('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    const label = labelOf(link);
    const location = locationOf(link);

    // In-page anchors: every nav item and every call to action on the site.
    if (href.startsWith('#')) {
      track('cta_clicked', { label, target: href, location });
      return;
    }

    let url: URL;
    try {
      url = new URL(href, window.location.href);
    } catch {
      return;
    }

    if (url.pathname === site.cvFile) {
      track('cv_viewed', { location });
      return;
    }

    if (url.origin !== window.location.origin) {
      track('outbound_link_clicked', { url: url.href, host: url.hostname, label, location });
    }
  });
}

/**
 * The burger's `aria-expanded` is the single source of truth (see initMenu in
 * motion.ts). Watching the attribute rather than the click keeps this immune to
 * which listener happens to run first.
 */
function initMenu(): void {
  const toggle = document.querySelector<HTMLElement>('[data-menu-toggle]');
  if (!toggle) return;

  new MutationObserver(() => {
    if (toggle.getAttribute('aria-expanded') === 'true') track('mobile_menu_opened');
  }).observe(toggle, { attributes: true, attributeFilter: ['aria-expanded'] });
}

/* -------------------------------------------------------------- sections */

/**
 * How far down the page people actually get. On a single long page this is the
 * other half of "why didn't they get in touch" — it shows where reading stops.
 * Mirrors the IntersectionObserver pattern in motion.ts.
 */
function initSections(): void {
  const sections = document.querySelectorAll<HTMLElement>('main section[id]');
  if (!sections.length || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        track('section_viewed', { section: el.id === 'top' ? 'hero' : el.id });
        io.unobserve(el);
      }
    },
    // Fires when the section's top edge passes 60% of the way down the
    // viewport — i.e. the reader has arrived at it. Deliberately not a ratio:
    // a section taller than twice the viewport can never be "50% visible".
    { rootMargin: '0px 0px -40% 0px', threshold: 0 },
  );

  sections.forEach((section) => io.observe(section));
}

/* ------------------------------------------------------------------ boot */

if (shouldTrack()) {
  loadWhenIdle();
  initClicks();
  initMenu();
  initSections();
} else {
  // Nothing is loaded and nothing is sent, but track() stays safe to call.
  resolveReady(null);
  if (import.meta.env.DEV) console.info('[analytics] Not tracking this page load.');
}
