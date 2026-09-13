// Seeds the Sanity dataset with the site's current content.
//
// Usage:  npm run seed
// Auth:   SANITY_API_WRITE_TOKEN from the environment (or .env), falling back
//         to the Sanity CLI login token at ~/.config/sanity/config.json.
//         Tokens never belong in the repo.
//
// The script is idempotent: documents use deterministic IDs (createOrReplace)
// and images are only uploaded when an asset with the same filename is missing.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';
import { projects, sheets, credits } from '../src/lib/data.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const envSource = fs.readFileSync(path.join(root, 'src/sanity/env.ts'), 'utf8');
const projectId = envSource.match(/projectId = '([^']+)'/)?.[1];
const dataset = envSource.match(/dataset = '([^']+)'/)?.[1] ?? 'production';

if (!projectId || projectId === 'PLACEHOLDER') {
  console.error('✗ Set the real projectId in src/sanity/env.ts before seeding.');
  process.exit(1);
}

function readToken() {
  if (process.env.SANITY_API_WRITE_TOKEN) return process.env.SANITY_API_WRITE_TOKEN;
  try {
    const config = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config/sanity/config.json'), 'utf8'));
    return config.authToken ?? null;
  } catch {
    return null;
  }
}

const token = readToken();
if (!token) {
  console.error('✗ No write token found. Log in with `npx sanity login` or set SANITY_API_WRITE_TOKEN.');
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: '2026-09-13', token, useCdn: false });

async function uploadImage(filename) {
  const filePath = path.join(root, 'public/assets', filename);
  const existing = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename == $name][0]{ _id }`,
    { name: filename },
  );
  if (existing) return existing._id;
  const asset = await client.assets.upload('image', fs.createReadStream(filePath), { filename });
  console.log(`  ↑ uploaded ${filename}`);
  return asset._id;
}

async function seedProjects() {
  for (const [index, project] of projects.entries()) {
    const imageId = await uploadImage(project.image);
    await client.createOrReplace({
      _id: `project-${project.id}`,
      _type: 'project',
      name: project.name,
      slug: { _type: 'slug', current: project.id },
      location: project.location,
      type: project.type,
      area: project.area,
      year: project.year,
      theme: project.theme,
      description: project.description,
      materials: project.materials,
      image: { _type: 'image', asset: { _type: 'reference', _ref: imageId } },
      featured: index === 0,
      order: index + 1,
    });
  }
  console.log(`✓ ${projects.length} projects`);
}

async function seedDrawings() {
  for (const [index, sheet] of sheets.entries()) {
    await client.createOrReplace({
      _id: `drawing-${sheet.code.toLowerCase()}`,
      _type: 'drawing',
      code: sheet.code,
      name: sheet.name,
      category: sheet.category,
      kind: sheet.kind,
      order: index + 1,
    });
  }
  console.log(`✓ ${sheets.length} drawing sheets`);
}

async function seedCredits() {
  for (const [index, [name, usedFor, url]] of credits.entries()) {
    await client.createOrReplace({
      _id: `credit-${index + 1}`,
      _type: 'credit',
      name,
      usedFor,
      url,
      order: index + 1,
    });
  }
  console.log(`✓ ${credits.length} photography credits`);
}

async function seedSettings() {
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    contact: {
      email: 'hello@archcell.example',
      whatsapp: '+92 3XX XXX XXXX',
      address: 'Lahore, Pakistan',
      addressNote: 'Detailed address to follow.',
    },
    stats: {
      yearsValue: '10',
      yearsSuffix: '+',
      yearsLabel: 'Years of practice',
      projectsValue: '100',
      projectsSuffix: 's',
      projectsLabel: 'Projects, each personal',
    },
    footer: {
      statement: 'Architecture & interiors. Thoughtfully, from the ground up.',
      finePrint: 'Design preview. Illustrative projects and drawings; not for construction.',
      copyright: '© 2026 Archcell',
    },
    creditsIntro: 'These photographs are visual references for this design preview and do not depict verified Archcell projects.',
  });

  const heroId = await uploadImage(projects[0].image);
  await client.createOrReplace({
    _id: 'homePage',
    _type: 'homePage',
    hero: {
      eyebrow: 'ARCHITECTURE, ROOTED IN LIFE',
      titleTop: 'Spaces for',
      titleEm: 'live.',
      paragraph: 'From the first line to the final detail. Homes imagined around you.',
      toplineLeft: 'CONSIDERED ARCHITECTURE. PERSONAL SPACES.',
      toplineRight: '31.5204° N   74.3587° E',
      footerLeft: 'BASED IN LAHORE. BUILT AROUND YOU.',
      image: { _type: 'image', asset: { _type: 'reference', _ref: heroId } },
    },
    intro: {
      eyebrow: '01 / A WAY OF SEEING',
      heading: 'Good architecture is seen.',
      headingSpan: 'Great architecture is felt.',
      paragraph: 'Light that falls just right. Rooms that bring people together. A home that feels unmistakably yours. This is where our work begins.',
      linkLabel: 'Discover our approach',
    },
    work: {
      eyebrow: '02 / SELECTED WORK',
      heading: 'A sense of',
      headingEm: 'place.',
      aside: 'Individual homes. A shared attention to detail.',
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
  });
  console.log('✓ site settings + homepage');
}

console.log(`Seeding “${projectId}/${dataset}”…`);
await seedProjects();
await seedDrawings();
await seedCredits();
await seedSettings();
console.log('Done.');
