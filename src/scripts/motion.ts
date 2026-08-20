/**
 * Scroll behaviour: reveals + parallax.
 *
 * Both are opt-in enhancements. If JS never runs, or the visitor asks for
 * reduced motion, everything renders in its final position — nothing is
 * hidden behind an animation that might not fire.
 */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ---------------------------------------------------------- reveals */
function initReveals() {
  const targets = document.querySelectorAll<HTMLElement>('.reveal');

  if (reduced.matches || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        const delay = Number(el.dataset.revealDelay ?? 0);
        window.setTimeout(() => el.classList.add('is-in'), delay);
        io.unobserve(el);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
  );

  targets.forEach((el) => io.observe(el));
}

/* --------------------------------------------------------- parallax */
type Layer = { el: HTMLElement; anchor: HTMLElement; speed: number; visible: boolean };

function initParallax() {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
  if (!nodes.length) return;

  const layers: Layer[] = nodes.map((el) => ({
    el,
    // Elements inside a [data-parallax-group] measure their offset from the
    // group, not from themselves. With speeds spaced evenly (+k, 0, -k) that
    // makes every gap in the group change by exactly the same amount — using
    // each element's own centre instead lets the gaps drift apart unevenly,
    // because the elements sit at different distances from the viewport centre.
    anchor: el.closest<HTMLElement>('[data-parallax-group]') ?? el,
    speed: Number(el.dataset.parallax) || 0,
    visible: false,
  }));

  const clear = () => layers.forEach((l) => (l.el.style.transform = ''));

  // Only run for pointer-driven viewports with motion allowed. Touch devices
  // get the static composition — scroll-linked transforms there cost more
  // than they add.
  const enabled = () => !reduced.matches && window.matchMedia('(min-width: 900px)').matches;

  // Track visibility so we only measure elements currently on screen.
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const layer = layers.find((l) => l.el === entry.target);
        if (layer) layer.visible = entry.isIntersecting;
      }
      // Recompute as soon as visibility changes. The observer's first records
      // arrive after this function returns, so without this a layer would keep
      // its untransformed position until the visitor's first scroll and then
      // jump into place.
      onScroll();
    },
    { rootMargin: '25% 0px' },
  );
  layers.forEach((l) => io.observe(l.el));

  let ticking = false;

  function frame() {
    ticking = false;
    if (!enabled()) return;

    const mid = window.innerHeight / 2;
    for (const layer of layers) {
      if (!layer.visible) continue;
      const rect = layer.anchor.getBoundingClientRect();
      // Distance of the anchor's centre from the viewport centre, so the
      // offset passes through zero as it crosses the middle of the screen.
      const delta = rect.top + rect.height / 2 - mid;
      layer.el.style.transform = `translate3d(0, ${(delta * layer.speed).toFixed(2)}px, 0)`;
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(frame);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  reduced.addEventListener('change', () => {
    clear();
    onScroll();
  });

  onScroll();
}

/* ------------------------------------------------ header + nav state */
function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;

  const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Highlight the section currently in view.
  const links = Array.from(header.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
  const sections = links
    .map((a) => document.querySelector<HTMLElement>(a.getAttribute('href')!))
    .filter((el): el is HTMLElement => Boolean(el));

  if (!sections.length || !('IntersectionObserver' in window)) return;

  // Track the visible set and always mark the topmost one, rather than
  // reacting to whichever entry happened to fire last — with two sections
  // straddling the band, the last-write-wins version lit up both.
  const visible = new Set<Element>();

  const spy = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }

      const current = sections.find((s) => visible.has(s));
      links.forEach((a) =>
        a.classList.toggle('is-current', Boolean(current) && a.getAttribute('href') === `#${current!.id}`),
      );
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  sections.forEach((s) => spy.observe(s));
}

/* ------------------------------------------------------ mobile menu */
function initMenu() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const panel = document.querySelector<HTMLElement>('[data-menu]');
  if (!toggle || !panel) return;

  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    panel.toggleAttribute('hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  panel.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
}

initReveals();
initParallax();
initHeader();
initMenu();
