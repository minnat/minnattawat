# minnattawat.com

The personal site of Min Nattawat — a one-page pitch for two things: building
websites end to end, and connecting or automating the systems a business already
runs. [whereto.party](https://whereto.party) is the worked example for both.

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

**"AI" is the single permitted exception**, because the people this is written
for already use the word themselves. Nothing underneath it gets through: not
"LLM", not "agent", not "tool calling", and not "integration" as a noun — that
one is "systems that talk to each other". "Prompt injection" is "someone hiding
an instruction in a message to make it misbehave". If a term needs explaining
before the sentence works, it is the wrong term.

Three places are exempt, and only these three:

- **The structured data in `Base.astro`.** Nobody reads it, and search engines
  match on the standard vocabulary, so it says "systems integration" and
  "business process automation" where the page says neither.
- **The `<title>` and meta description.** They are search results, not copy.
  "AI automation" is there because it is what people type into a search box.
- **The `#hiring` block.** It is the one part of the page addressed to
  employers rather than customers, so "full-stack engineering" is the right
  words for its reader. Nothing above it does.

### The two offerings

`Makes` is websites; `Systems` is everything that isn't one. They are peers, and
read that way through paired eyebrows — "Half of what I do" / "The other half of
what I do" — and a card treatment from the same family with the colour rule
rotated from the left edge to the top.

**Band rhythm.** `Makes` sits on the deeper peach, `Systems` on plain stock, the
case study on ink: light, deep, dark. Two dark sections in a row flattens the run
into the case study, which is where the page wants its strongest contrast.

**Scope.** `Systems` covers software you log into in a browser. Desktop programs
are out of scope, and the section says so at its top and bottom rather than in
every card.

**Vocabulary.** The noun is "online software" — not "web app", since "app" reads
as phone app, and not "online tool", which sounds like a free utility rather than
something a business runs on. Where it has to be exact, the copy names the
behaviour instead of the category: "if you log into it in a browser".

**Contact form options.** Broad, and each one completes the question "What do you
need help with?" as a sentence, which is why all three are gerunds — reword the
label and the options have to move with it. The `value` attributes are what reach
PostHog, so keep them short and stable when a visible label changes; changing a
value splits the funnel into two series that look like a drop in traffic.

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
leak. Web3Forms stores the destination address against the key on their side, so
the key only ever delivers to one inbox and the address is never published as
scrapeable text. The CV in `public/` is the exception: it carries its own contact
details, is committed here, and is linked from the page. `robots.txt` disallows
it, which keeps it out of search results but does not hide it.

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

The two exceptions are the form's dropdowns, `topic` and `stage`, which travel
with `contact_form_submitted` because they are fixed lists rather than free text.
`topic` is the one to watch: with two offerings on the page, it is the only thing
that says which of them people are actually writing in about.

**Section views are named events, not one event with a property**:
`section_viewed_01_hero`, `section_viewed_02_make`, `section_viewed_03_systems`
and so on. The drop-off is then legible on PostHog's event list without breaking
anything down, and each section is a step you can drop straight into a funnel.
The number is the section's position read from the DOM, so adding or reordering
a section renumbers the ones after it by itself; it is padded to a fixed two
digits so the events sort into reading order rather than `10` landing above `2`.
The padding is deliberately not derived from the section count — if it were,
going from nine sections to ten would rename every event on the page rather than
only the ones that moved. Renaming a section's `id` also renames its event and
starts a new series in PostHog, which is the one thing to be deliberate about.

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
