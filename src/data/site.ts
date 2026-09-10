/**
 * Single source of truth for everything you'll want to edit.
 *
 * Written for a mostly non-technical reader — friends, people you've met,
 * small business owners. If a word would make someone ask "what does that
 * mean?", it doesn't belong here.
 */

export const site = {
  name: 'Nattawat Choojirawong',
  shortName: 'Min Nattawat',
  /**
   * A job-title noun phrase, not a sentence: it renders as "role · location" in
   * the footer and is also emitted as schema.org `jobTitle`, which expects a
   * title rather than a claim.
   */
  role: 'Software and AI developer',
  location: 'Bangkok',
  firstName: 'Min',
  domain: 'minnattawat.com',
  /**
   * There is deliberately no email address in this file. Web3Forms stores the
   * delivery address against the access key, server-side, so the form reaches
   * the inbox without the address being published as scrapeable text.
   *
   * The CV in public/ is the exception: it carries its own contact details, and
   * it is committed here and linked from the page. robots.txt disallows it, which
   * keeps it out of search results but does not hide it from anyone with the link.
   */

  linkedin: 'https://linkedin.com/in/minnattawat',
  github: 'https://github.com/minnat',
  instagram: 'https://www.instagram.com/minnattawat/' as string,
  cvFile: '/nattawat-choojirawong-cv.pdf',

  /** Public by design — safe to commit and ship in the browser. */
  web3formsKey: '6b3f425b-1c68-4ef6-9553-cdaa29003bec',

  /**
   * PostHog analytics. The project token is public by design, same as the key
   * above — it can only write events, never read them.
   *
   * Leave `posthogKey` empty and analytics stays completely switched off: no
   * script is downloaded and no requests are made. Paste the `phc_…` token from
   * PostHog → Project settings to turn it on.
   *
   * To keep your own visits out of the data, open the live site once per browser
   * at `?analytics=off`. See src/scripts/analytics.ts for the full story.
   */
  posthogKey: 'phc_tgPpsuJBRMEiDeFNDGe8p6PP3Tu6VTP7GTvZC99weKHZ' as string,
  posthogHost: 'https://us.i.posthog.com',

  /** Drop a square-ish photo in public/assets/ and put the filename here. */
  headshot: '/assets/photo-ginkgo.jpg',
} as const;

/**
 * When the career clock started. Everything that says "N years" derives from
 * this, so the number is never edited by hand.
 *
 * Computed at build time — it costs nothing at runtime and ships no JavaScript,
 * but it does mean the figure refreshes on the next deploy rather than on the
 * anniversary itself.
 */
const CAREER_START = new Date(Date.UTC(2011, 5, 1)); // June 2011

function completedYearsSince(start: Date, now = new Date()): number {
  let years = now.getUTCFullYear() - start.getUTCFullYear();
  const monthDelta = now.getUTCMonth() - start.getUTCMonth();
  // Not yet past the anniversary this year, so the last year isn't complete.
  if (monthDelta < 0 || (monthDelta === 0 && now.getUTCDate() < start.getUTCDate())) {
    years -= 1;
  }
  return years;
}

const NUMBER_WORDS: Record<number, string> = {
  10: 'ten', 11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen',
  15: 'fifteen', 16: 'sixteen', 17: 'seventeen', 18: 'eighteen', 19: 'nineteen',
  20: 'twenty', 21: 'twenty-one', 22: 'twenty-two', 23: 'twenty-three',
  24: 'twenty-four', 25: 'twenty-five', 26: 'twenty-six', 27: 'twenty-seven',
  28: 'twenty-eight', 29: 'twenty-nine', 30: 'thirty',
};

/** e.g. 15 — for the short mono lines. */
export const experienceYears = completedYearsSince(CAREER_START);

/** e.g. "fifteen" — reads better mid-sentence. Falls back to the numeral. */
export const experienceYearsWord =
  NUMBER_WORDS[experienceYears] ?? String(experienceYears);

/**
 * Four items. Five was the most the header fit before the labels crowded the
 * CTA, and that was when the CTA only existed above 900px — it is visible at
 * every width now, so the nav has less room than the old comment assumed.
 *
 * "What I do" covers both offerings, which used to be two sections and two nav
 * entries. "How it works" points at #process, which is where the old #build
 * section's argument now lives.
 */
export const nav = [
  { label: 'What I do', href: '#offer' },
  { label: 'What I made', href: '#work' },
  { label: 'How it works', href: '#process' },
  { label: 'About me', href: '#about' },
] as const;

/**
 * The first of the two offerings: answers "what could he build for me?"
 *
 * A ladder, read in order: a site that does something, a product with accounts
 * and money behind it, then something nobody sells. The middle rung exists
 * because the old three cards all described a brochure, which undersold the
 * work badly sitting next to a card about AI reading your invoices.
 *
 * No example is named here on purpose. The case study is the next section and
 * can speak for itself — and whereto.party is not an example of the middle
 * rung, which has no sign-in, customers or billing.
 */
export const makes = [
  {
    title: 'A website for your business',
    body: 'Somewhere people find you, see what you offer, and either get in touch or book a time themselves. The site you\'re reading is one of these.',
  },
  {
    title: 'A proper product, not just a page',
    body: 'Sign-ups and logins, customers and orders you can actually manage, payments and invoices that go out on their own — and it connects to the other software you already use.',
  },
  {
    title: 'A tool just for you',
    body: 'Something you can\'t buy off the shelf, because nobody works quite the way you do — the screen your team lives in all day, shaped around how the job really gets done.',
  },
] as const;

/**
 * The second offering. Each title is a sentence someone might have said about
 * their own business; the body is what it turns into.
 *
 * This is the one place "AI" is allowed to appear as itself — the buyer already
 * uses the word. Everything underneath it still has to be plain English.
 */
export const systems = [
  {
    title: 'Two systems that don\'t talk to each other',
    body: 'An order lands in your shop and somebody retypes it into your accounts — every week, forever. I connect the two so it moves across by itself.',
  },
  {
    title: 'Someone reads every message that comes in',
    body: 'Enquiries, orders, invoices. AI reads them, pulls out what matters, files it — and sets aside the ones you should see yourself.',
  },
  {
    title: 'Online software that does almost what you need',
    body: 'It gets you most of the way and you already pay for it. I build the missing part onto the side, rather than replacing what works.',
  },
] as const;

export const process = [
  {
    step: '01',
    title: 'Tell me what you want',
    body: 'A rough idea is plenty — or a site you like the look of, or the thing that annoys everyone every week. No charge, no obligation.',
  },
  {
    step: '02',
    title: 'I tell you what it takes',
    body: 'Within a few days, in writing: what I\'d build, how long, what it costs. One number, no surprises. And if something you can just buy would do the job, I\'ll say so.',
  },
  {
    step: '03',
    title: 'You watch it get made',
    body: 'From the first week you get a link you can open any time. Tell me what to change while changing it is easy.',
  },
  {
    step: '04',
    title: 'It goes live, and it is yours',
    body: 'I put it online, hand over every account and password, and show you how to run it. I\'m around afterwards — but you\'re never stuck with me.',
  },
] as const;

/** Career, described so a non-technical reader gets why it matters. */
export const history = [
  {
    period: '2026 – now',
    org: 'whereto.party',
    role: 'My own project',
    note: 'A site for finding parties and events. My idea, built and run by me.',
  },
  {
    period: '2023 – now',
    org: 'Iterate',
    role: 'Senior engineer',
    note: 'A product company in California. Payment systems, a job site handling millions of listings.',
  },
  {
    period: '2022 – 2023',
    org: 'Atato',
    role: 'Engineering lead',
    note: 'Ran engineering at a company keeping large digital assets safe. Grew the team from five to eleven.',
  },
  {
    period: '2011 – 2022',
    org: 'Iterate',
    role: 'Engineer',
    note: 'Over ten products taken from a sketch to daily use. One was bought in 2022.',
  },
] as const;

/** What I've built before — things a non-technical reader recognises. */
export const stack = [
  'Online payments', 'Shopping carts', 'Booking systems', 'Sign-ups and logins',
  'Dashboards and reports', 'Business websites', 'Invoices and billing',
  'Systems that talk to each other', 'Reading documents',
  'Reports that write themselves', 'Work that runs on its own',
] as const;
