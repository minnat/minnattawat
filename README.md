# minnattawat.com

The personal site of Min Nattawat — a one-page pitch for building websites end
to end, with [whereto.party](https://whereto.party) as the worked example.

**Live at [minnattawat.com](https://minnattawat.com)**

Built with [Astro](https://astro.build). `npm run build` emits a folder of
static HTML, CSS and JS that runs on any host — no server, no runtime, no
environment variables.

---

## Running it

```bash
npm install
npm run dev        # http://localhost:4321
```

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Static build into `dist/` |
| `npm run preview` | Serve the real build locally |
| `npm run check` | Type-check the project |

Node 22+ (see `.nvmrc`).

## Structure

```
src/
  data/site.ts        All the site's content: copy, services, process, history.
  styles/global.css   Design tokens and shared primitives.
  scripts/motion.ts   Scroll reveals, parallax, sticky header, mobile menu.
  scripts/analytics.ts PostHog: what to track, and how to exclude yourself.
  layouts/Base.astro  <head>, fonts, metadata, structured data.
  components/         One file per section, in page order.
  pages/index.astro   Assembles the sections.
public/
  favicon.svg         Two misregistered plates with an M.
  favicon.ico         16/32/48 fallback for browsers that ignore SVG icons.
  assets/og.png       Social share card (1200×630).
```

Content lives in `src/data/site.ts` rather than inside the components, so the
copy can be edited without touching markup.

## Design

Warm peach stock with three saturated plate colours — burnt orange, grape and
jade — printed deliberately out of register. The offset is the signature: every
card is a stack of slightly misaligned plates, and the three plates map to the
three stages of making something (**design, build, launch**). Parallax pulls
them apart as you scroll, which is the argument the page is making: one person
does all three.

Type is **Outfit** for headings, **Plus Jakarta Sans** for body and **Space
Mono** for small labels.

Colour roles are split on purpose. `--orange` / `--grape` / `--jade` are for
fills, shadows and large display type; `--orange-text` / `--grape-text` /
`--jade-text` are darkened versions for anything small set on the peach stock.
Small coloured text uses the `-text` variants, or it fails contrast.

### Writing

The site is written for readers who don't work in software. There is no jargon
anywhere — no stack names, no framework names, no acronyms. It also carries no
figures that decay: no commit counts, no test totals, no city lists that grow.
Every number on the page stays true without maintenance.

## Implementation notes

A few things that are less obvious than they look:

**The hero plates share a parallax anchor.** They sit inside
`[data-parallax-group]`, so each measures its scroll offset from the *group's*
centre rather than its own, and their speeds are spaced evenly around zero
(`+0.022 / 0 / -0.022`). That is what keeps the gaps between them identical at
every scroll position. Measuring from each element individually makes the gaps
drift apart as you scroll — at the bottom of the hero the first gap ends up
nearly twice the second.

**The portrait needs `height: auto`.** The `<img>` carries `width` and `height`
attributes for layout stability, and those set presentational width *and*
height. The CSS overrides width but not height, so without `height: auto` the
attribute height stays definite, `aspect-ratio` becomes a no-op — it only fills
an *auto* dimension — and `object-fit: cover` crops the photo into a sliver.

**Misregistration is drawn with offset box-shadows**, not `z-index: -1` pseudo
elements. A pseudo element behind its parent is hidden the moment any ancestor
creates a stacking context, which `will-change: transform` does.

## Accessibility

- Every text/background pair meets WCAG AA. Verified by walking every visible
  element on the rendered page and computing its real contrast against its real
  background, rather than estimating from the token list.
- Parallax and scroll reveals are disabled under
  `prefers-reduced-motion: reduce`, and parallax is off below 900px regardless.
- With JavaScript disabled everything renders in its final position, and the
  contact form falls back to a native POST.
- Visible keyboard focus throughout, and a skip link to the main content.

## The contact form

The form posts to [Web3Forms](https://web3forms.com), which is why the site
needs no backend and no secrets.

**The access key in `src/data/site.ts` is public by design** — it is not a
leak. Web3Forms stores the destination address against the key on their side,
so the key only ever delivers to one inbox and the address itself appears
nowhere in this repository or in the served page.

## Analytics

PostHog, loaded lazily so it never competes with first paint. Set `posthogKey`
in `src/data/site.ts` to switch it on; leave it empty and nothing is downloaded
and nothing is sent.

It is **cookieless** (`persistence: 'memory'`), which is why there is no cookie
banner. The cost is that a returning visitor counts as a new one — barely a loss
on a single-page site, where a visit is a page load anyway.

Beyond pageviews it tracks the calls to action, outbound links, CV views, how
far down the page people get, and the contact form as a funnel — including
`contact_form_abandoned`, for people who start typing and never send. No field
value ever leaves the browser; the events record which fields were filled and
how long they took, not what was in them.

### Keeping your own visits out

Open the live site once **per browser** at `?analytics=off`. That sets a
localStorage flag which is checked before PostHog loads, so nothing is even
downloaded.

| URL | Effect |
| --- | --- |
| `minnattawat.com/?analytics=off` | Stop counting this browser. |
| `minnattawat.com/?analytics=on` | Start counting it again. |
| `?analytics=debug` | Force tracking on and log every event to the console. |

`localhost` and `*.workers.dev` are skipped automatically, so development and
preview traffic never reaches the data.

The honest limits: it is per browser profile, clearing site data forgets it, and
private windows are never excluded. PostHog's project-level "internal and test
users" filter is the backstop, and unlike this flag it applies retroactively.

## Licence

All rights reserved. The code is public to read, but the content, design,
photography and CV are not offered for reuse.
