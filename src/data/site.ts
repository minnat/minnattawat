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
  role: 'Web developer',
  location: 'Bangkok',
  firstName: 'Min',
  domain: 'minnattawat.com',
  /**
   * There is deliberately no email address in this file. Web3Forms stores the
   * delivery address against the access key, server-side, so the form reaches
   * the inbox without the address appearing in the page or in this repository.
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

export const nav = [
  { label: 'What I make', href: '#make' },
  { label: 'Something I made', href: '#work' },
  { label: 'How it works', href: '#process' },
  { label: 'About me', href: '#about' },
] as const;

/** Replaces the old stats strip: answers "what could he build for me?" */
export const makes = [
  {
    title: 'A website for your business',
    body: 'Somewhere people find you, see what you offer, and get in touch.',
  },
  {
    title: 'An online shop',
    body: 'Customers browse, buy, and pay. The money goes to your account.',
  },
  {
    title: 'A booking or enquiry system',
    body: 'People pick a time or send a request, and it lands in your inbox.',
  },
  {
    title: 'A place to manage it all',
    body: 'Your orders, bookings and customers on one screen, instead of across five spreadsheets.',
  },
  {
    title: 'A tool just for you',
    body: 'Something you can\'t just buy, because nobody else works quite the way you do.',
  },
  {
    title: 'Whatever you have in mind',
    body: 'If you can describe it, we can usually work out how to build it.',
  },
] as const;

/** The three plates. Design, build, launch — a real sequence, plainly named. */
export const layers = [
  {
    key: 'design',
    name: 'Design',
    color: 'orange',
    blurb: 'How it looks and how it feels to use. We work this out together first, so nothing has to be built twice.',
    items: ['What it should do', 'How it looks', 'Easy on a phone', 'Simple to use'],
  },
  {
    key: 'build',
    name: 'Build',
    color: 'grape',
    blurb: 'Making it actually work — the part people never see but always notice when it is wrong.',
    items: ['The whole thing built', 'Payments and email', 'Connects to other tools', 'Tested properly'],
  },
  {
    key: 'launch',
    name: 'Launch',
    color: 'jade',
    blurb: 'Getting it online and handing it over. Your domain, your accounts, everything in your name from day one.',
    items: ['Live on your domain', 'Fast and secure', 'Backed up', 'You own everything'],
  },
] as const;

export const services = [
  {
    title: 'Start from nothing',
    body: 'You have an idea and nothing else. I take it from a conversation to something real that people can actually use.',
    tag: 'Most common',
  },
  {
    title: 'Finish what stalled',
    body: 'Someone started it and it never got done, or the person who built it disappeared. I have picked up enough half-finished projects to know how to rescue one.',
    tag: '',
  },
  {
    title: 'Fix what is broken',
    body: 'It is slow, it keeps falling over, or something stopped working and nobody knows why. I find out and fix it.',
    tag: '',
  },
  {
    title: 'Let the computer do the boring part',
    body: 'The repetitive job someone on your team does by hand every week — copying details between systems, sorting messages, writing the same reply. A lot of that can just happen by itself now.',
    tag: '',
  },
  {
    title: 'Make it ready for real customers',
    body: 'It works when you try it and breaks when everyone else does. Getting from "it demos well" to "it holds up" is most of the actual work.',
    tag: '',
  },
  {
    title: 'Hand it over properly',
    body: 'Everything I build is yours. Your accounts, your domain, in your name from the start. If you hire someone else later, they can pick it up without starting over.',
    tag: 'Always included',
  },
] as const;

export const process = [
  {
    step: '01',
    title: 'Tell me what you want',
    body: 'A message is enough to start. From there we work out what you need and who it is for — a rough idea is plenty, or a site you like the look of, or just the problem you want solved. You do not have to know how any of it works. No charge, no obligation.',
  },
  {
    step: '02',
    title: 'I tell you what it takes',
    body: 'Within a few days you get it in writing: what I would build, how long it takes, and what it costs. One number, no surprises. And if there is a ready-made tool that would do the job for a fraction of the price, I will point you to it instead.',
  },
  {
    step: '03',
    title: 'You watch it get made',
    body: 'From the first week you get a link you can open any time to see how it is coming along. Tell me what to change while changing it is still easy.',
  },
  {
    step: '04',
    title: 'It goes live, and it is yours',
    body: 'I put it online, hand over every account and password, and show you how to run it. I am around afterwards when you want changes — but you are never stuck with me.',
  },
] as const;

/** Career, described so a non-technical reader gets why it matters. */
export const history = [
  {
    period: '2026 – now',
    org: 'whereto.party',
    role: 'My own project',
    note: 'A site for finding parties and events. My idea, built and run entirely by me.',
  },
  {
    period: '2023 – now',
    org: 'Iterate',
    role: 'Senior engineer',
    note: 'A product company in California. I build things for their clients — payment systems, a job site handling millions of listings, and more.',
  },
  {
    period: '2022 – 2023',
    org: 'Atato',
    role: 'Engineering lead',
    note: 'Ran the engineering team at a company keeping large digital assets safe. Grew the team from five people to eleven.',
  },
  {
    period: '2011 – 2022',
    org: 'Iterate',
    role: 'Engineer',
    note: 'Over ten products taken from an idea to something real people used. One was bought by another company in 2022.',
  },
] as const;

/** What I've built before — things a non-technical reader recognises. */
export const stack = [
  'Online payments', 'Shopping carts', 'Booking systems', 'Maps and locations',
  'Email and notifications', 'Sign-ups and logins', 'Dashboards and reports',
  'Phone apps', 'Business websites', 'Search', 'File and photo uploads',
  'Invoices and billing',
] as const;
