// Content access layer used by pages at build time.
// Reads from Sanity when the project is configured; otherwise (or if the
// dataset is empty/unreachable) it falls back to the local data in data.js
// so the build never breaks.

import {
  projects as localProjects,
  sheets as localSheets,
  credits as localCredits,
} from './data.js';
import { sanityClient, hasSanity, imageUrl } from './sanity.js';
import { projectsQuery, projectTypesQuery, drawingsQuery, creditsQuery, siteSettingsQuery, homePageQuery, faqsQuery } from './queries.js';

// Local fallbacks mirror the seeded Sanity content so the site keeps its copy
// when Sanity is not configured (or unreachable).
const localSiteSettings = {
  contact: {
    email: 'hello@archcell.example',
    whatsapp: '+92 3XX XXX XXXX',
    address: 'Lahore, Pakistan',
    addressNote: 'Detailed address to follow.',
    demoNote: 'Contact details are placeholders. This preview does not send messages or book appointments.',
  },
  stats: {
    yearsValue: '10',
    yearsSuffix: '+',
    yearsLabel: 'Years of practice',
    projectsValue: '100',
    projectsSuffix: 's',
    projectsLabel: 'Projects, each personal',
    homeValue: 'LHR',
    homeLabel: 'Our home, our perspective',
  },
  footer: {
    statement: 'Architecture & interiors.\nThoughtfully, from the ground up.',
    finePrint: 'Design preview. Illustrative projects and drawings; not for construction.',
    copyright: '© 2026 Archcell',
  },
  creditsIntro: 'These photographs are visual references for this design preview and do not depict verified Archcell projects.',
};

const localHomePage = {
  hero: {
    eyebrow: 'ARCHITECTURE, ROOTED IN LIFE',
    titleTop: 'Spaces for',
    titleLine2: 'the way you',
    titleEm: 'live.',
    paragraph: 'From the first line to the final detail.\nHomes imagined around you.',
    toplineLeft: 'CONSIDERED ARCHITECTURE. PERSONAL SPACES.',
    toplineRight: '31.5204° N   74.3587° E',
    footerLeft: 'BASED IN LAHORE. BUILT AROUND YOU.',
  },
  intro: {
    eyebrow: '01 / A WAY OF SEEING',
    heading: 'Good architecture is seen.',
    headingSpan: 'Great architecture is',
    headingEm: 'felt.',
    paragraph: 'Light that falls just right. Rooms that bring people together. A home that feels unmistakably yours. This is where our work begins.',
    linkLabel: 'Discover our approach',
  },
  work: {
    eyebrow: '02 / SELECTED WORK',
    heading: 'A sense of',
    headingEm: 'place.',
    aside: 'Individual homes.\nA shared attention to detail.',
    noteLabel: 'A PREVIEW OF POSSIBILITIES',
    noteText: 'Sample projects & reference photography. The Archcell portfolio is coming into focus.',
  },
  interlude: {
    eyebrow: 'MORE THAN FOUR WALLS',
    heading: 'The art of',
    headingEm: 'coming home.',
    label: 'MATERIAL. LIGHT. LIFE.',
  },
  drawingRoom: {
    eyebrow: '03 / THE DRAWING ROOM',
    heading: 'Beautiful outside.',
    headingEm: 'Considered within.',
    paragraph: 'Behind every elevation is a world of decisions. Explore the plans, systems and details that bring a home together, in one complete project collection.',
    linkLabel: 'Step inside the catalogue',
    teaserLabels: ['Architecture', 'Structure', 'Electrical', 'Plumbing', 'Interiors'],
  },
  studio: {
    eyebrow: '04 / THE STUDIO',
    heading: 'Local roots.',
    headingEm: 'Lasting spaces.',
    paragraphOne: 'Archcell is a Lahore-based architecture and interior design practice, shaped by a decade of residential work and hundreds of projects.',
    paragraphTwo: 'We believe a home should do more than make an impression. It should understand the people who live in it — their routines, their gatherings, their quiet moments.',
  },
};

const localFaqs = [
  { page: 'contact', question: 'Do I need a finished brief before getting in touch?', answer: 'No. A location, an approximate plot size and a sense of what you want to create are enough to begin shaping a conversation.' },
  { page: 'contact', question: 'Can I enquire about a project outside Lahore?', answer: 'Include the project location in your brief. Availability, travel and the appropriate project scope would need to be agreed with the studio.' },
  { page: 'contact', question: 'Does this form send my enquiry?', answer: 'Not yet. This is a demonstration of the enquiry experience. It prepares a brief in your browser that you can download. No message is sent, no appointment is booked, and no response is scheduled.' },
  { page: 'process', question: 'What should I bring to the first conversation?', answer: 'Your plot size and location, a sense of the spaces you need, any available site information, and a few references you like. It is fine if your ideas are still taking shape.' },
  { page: 'process', question: 'Can I start with only an elevation or interior?', answer: 'You can describe the specific part of your project in the enquiry form. The appropriate design scope can then be discussed with the studio.' },
  { page: 'process', question: 'How are fees and timelines agreed?', answer: 'They depend on the project size, complexity and deliverables. A proposal should set out the scope, stages, fees and programme before work begins.' },
  { page: 'process', question: 'Are the drawings on this website ready to build from?', answer: 'No. The current catalogue contains illustrative sample diagrams. Real construction drawings need to be prepared, coordinated and checked for the specific site and project.' },
];

// Renders editable multi-line text safely: escapes HTML, newlines become <br>.
export function textWithBreaks(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replace(/\n/g, '<br>');
}

function localProjectShape(project) {
  return { ...project, image: `/assets/${project.image}`, gallery: [] };
}

function mapProject(doc) {
  return {
    id: doc.id,
    name: doc.name,
    location: doc.location ?? '',
    type: doc.type ?? 'Residential',
    area: doc.area ?? '',
    year: doc.year ?? '',
    theme: doc.theme ?? '',
    description: doc.description ?? '',
    materials: doc.materials ?? '',
    image: imageUrl(doc.image, 1600) ?? '',
    gallery: (doc.gallery ?? []).map((image) => imageUrl(image, 1400)).filter(Boolean),
  };
}

async function fetchOrFallback(query, map, fallback) {
  if (!hasSanity) return fallback();
  try {
    const docs = await sanityClient.fetch(query);
    if (docs?.length) return docs.map(map);
  } catch (error) {
    console.warn('[archcell] Sanity fetch failed, using local data:', error.message);
  }
  return fallback();
}

export async function getProjects() {
  return fetchOrFallback(projectsQuery, mapProject, () => localProjects.map(localProjectShape));
}

// Project types drive the collection filters. Falls back to the distinct
// types used by the local data.
export async function getProjectTypes() {
  return fetchOrFallback(
    projectTypesQuery,
    (doc) => doc.title,
    () => [...new Set(localProjects.map((p) => p.type))],
  );
}

// All drawing sheets. Each sheet carries the `project` it belongs to.
export async function getSheets() {
  return fetchOrFallback(drawingsQuery, (doc) => ({ ...doc }), () => localSheets.map((sheet) => ({ ...sheet })));
}

// The sheets for one project. While the dataset still holds the old shared
// (unlinked) sheets, every project shows that shared set.
export function sheetsForProject(sheets, projectId) {
  const scoped = sheets.filter((sheet) => sheet.project === projectId);
  if (scoped.length) return scoped;
  return sheets.every((sheet) => !sheet.project) ? sheets : [];
}

export async function getCredits() {
  return fetchOrFallback(
    creditsQuery,
    (doc) => [doc.name, doc.usedFor ?? '', doc.url ?? '#'],
    () => localCredits.map((credit) => [...credit]),
  );
}

export function getProjectFrom(projects, slug) {
  return projects.find((project) => project.id === slug);
}

export function getNextProjectFrom(projects, project) {
  return projects[(projects.indexOf(project) + 1) % projects.length];
}

// Single-document fetchers (settings, homepage).
async function fetchSingleton(query, fallback) {
  if (!hasSanity) return fallback();
  try {
    const doc = await sanityClient.fetch(query);
    if (doc) return doc;
  } catch (error) {
    console.warn('[archcell] Sanity fetch failed, using local data:', error.message);
  }
  return fallback();
}

export async function getSiteSettings() {
  return fetchSingleton(siteSettingsQuery, () => localSiteSettings);
}

export async function getHomePage() {
  return fetchSingleton(homePageQuery, () => localHomePage);
}

export async function getFaqs(page) {
  const faqs = await fetchOrFallback(faqsQuery, (doc) => ({ ...doc }), () => localFaqs.map((item) => ({ ...item })));
  return faqs.filter((item) => item.page === page);
}
