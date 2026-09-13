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
import { projectsQuery, drawingsQuery, creditsQuery } from './queries.js';

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

export async function getSheets() {
  return fetchOrFallback(drawingsQuery, (doc) => ({ ...doc }), () => localSheets.map((sheet) => ({ ...sheet })));
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
