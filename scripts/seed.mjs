// Seeds the Sanity dataset with the site's current content.
//
// Usage:  npm run seed
// Auth:   SANITY_API_WRITE_TOKEN from the environment (or .env), falling back
//         to the Sanity CLI login token at ~/.config/sanity/config.json.
//         Tokens never belong in the repo.
//
// The script is idempotent AND editor-safe: documents use deterministic IDs with
// createIfNotExists, and only link fields are patched on existing documents.
// Studio edits (renames, uploaded drawing images, reordered rows) survive a re-run.
// Images are only uploaded when an asset with the same filename is missing.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';
import { projects, sheets, cats, credits } from '../src/lib/data.js';

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

const typeSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function seedProjectTypes() {
  const names = [...new Set(projects.map((p) => p.type))];
  for (const [index, name] of names.entries()) {
    await client.createIfNotExists({
      _id: `projectType-${typeSlug(name)}`,
      _type: 'projectType',
      title: name,
      order: index + 1,
    });
  }
  console.log(`✓ ${names.length} project types`);
}

async function seedDisciplines() {
  const names = cats.filter((name) => name !== 'All drawings');
  for (const [index, name] of names.entries()) {
    await client.createIfNotExists({
      _id: `discipline-${typeSlug(name)}`,
      _type: 'discipline',
      title: name,
      order: index + 1,
    });
  }
  console.log(`✓ ${names.length} disciplines`);
}

async function seedProjects() {
  for (const [index, project] of projects.entries()) {
    const imageId = await uploadImage(project.image);
    // The story-page image pair matches the original site: each project gets
    // its own gallery images (editable per project in the Studio).
    const galleryA = project.id === 'warm-minimalism' ? 'facade-detail.jpg' : 'interior.jpg';
    const galleryB = project.id === 'quiet-courtyard' ? 'residence.jpg' : 'courtyard.jpg';
    const galleryIds = [await uploadImage(galleryA), await uploadImage(galleryB)];
    const fields = {
      name: project.name,
      slug: { _type: 'slug', current: project.id },
      location: project.location,
      type: { _type: 'reference', _ref: `projectType-${typeSlug(project.type)}` },
      area: project.area,
      year: project.year,
      theme: project.theme,
      description: project.description,
      materials: project.materials,
      image: { _type: 'image', asset: { _type: 'reference', _ref: imageId } },
      gallery: galleryIds.map((id) => ({ _type: 'image', asset: { _type: 'reference', _ref: id } })),
      featured: index === 0,
      order: index + 1,
    };
    await client.createIfNotExists({ _id: `project-${project.id}`, _type: 'project', ...fields });
    // Keep the type link current without touching editor edits (images, copy).
    await client.patch(`project-${project.id}`).set({ type: fields.type }).commit();
  }
  console.log(`✓ ${projects.length} projects`);
}

async function seedDrawings() {
  // Remove the old shared sheet list (pre per-project collections).
  const legacyIds = await client.fetch(`*[_type == "drawing" && !defined(project)]._id`);
  for (const id of legacyIds) await client.delete(id);
  if (legacyIds.length) console.log(`  removed ${legacyIds.length} legacy unlinked sheets`);

  // Every project keeps its own copy of the sample sheet set.
  for (const project of projects) {
    await Promise.all(sheets.map(async (sheet, index) => {
      const fields = {
        project: { _type: 'reference', _ref: `project-${project.id}` },
        discipline: { _type: 'reference', _ref: `discipline-${typeSlug(sheet.category)}` },
      };
      // The full document is written once; afterwards only the links are
      // patched, so uploaded drawing images and renames are preserved.
      await client.createIfNotExists({
        _id: `drawing-${project.id}-${sheet.code.toLowerCase()}`,
        _type: 'drawing',
        code: sheet.code,
        name: sheet.name,
        kind: sheet.kind,
        order: index + 1,
        ...fields,
      });
      await client.patch(`drawing-${project.id}-${sheet.code.toLowerCase()}`).set(fields).unset(['category']).commit();
    }));
  }
  console.log(`✓ ${sheets.length} drawing sheets × ${projects.length} projects`);
}

async function seedCredits() {
  for (const [index, [name, usedFor, url]] of credits.entries()) {
    await client.createIfNotExists({
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
  await client.createIfNotExists({
    _id: 'siteSettings',
    _type: 'siteSettings',
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
  });

  const heroId = await uploadImage(projects[0].image);
  const interludeId = await uploadImage('interior.jpg');
  const studioId = await uploadImage('courtyard.jpg');
  await client.createIfNotExists({
    _id: 'homePage',
    _type: 'homePage',
    hero: {
      eyebrow: 'ARCHITECTURE, ROOTED IN LIFE',
      titleTop: 'Spaces for',
      titleLine2: 'the way you',
      titleEm: 'live.',
      paragraph: 'From the first line to the final detail.\nHomes imagined around you.',
      toplineLeft: 'CONSIDERED ARCHITECTURE. PERSONAL SPACES.',
      toplineRight: '31.5204° N   74.3587° E',
      footerLeft: 'BASED IN LAHORE. BUILT AROUND YOU.',
      image: { _type: 'image', asset: { _type: 'reference', _ref: heroId } },
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
      image: { _type: 'image', asset: { _type: 'reference', _ref: interludeId } },
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
      image: { _type: 'image', asset: { _type: 'reference', _ref: studioId } },
    },
  });
  console.log('✓ site settings + homepage');
}

const faqItems = [
  ['contact', 'Do I need a finished brief before getting in touch?', 'No. A location, an approximate plot size and a sense of what you want to create are enough to begin shaping a conversation.'],
  ['contact', 'Can I enquire about a project outside Lahore?', 'Include the project location in your brief. Availability, travel and the appropriate project scope would need to be agreed with the studio.'],
  ['contact', 'Does this form send my enquiry?', 'Not yet. This is a demonstration of the enquiry experience. It prepares a brief in your browser that you can download. No message is sent, no appointment is booked, and no response is scheduled.'],
  ['process', 'What should I bring to the first conversation?', 'Your plot size and location, a sense of the spaces you need, any available site information, and a few references you like. It is fine if your ideas are still taking shape.'],
  ['process', 'Can I start with only an elevation or interior?', 'You can describe the specific part of your project in the enquiry form. The appropriate design scope can then be discussed with the studio.'],
  ['process', 'How are fees and timelines agreed?', 'They depend on the project size, complexity and deliverables. A proposal should set out the scope, stages, fees and programme before work begins.'],
  ['process', 'Are the drawings on this website ready to build from?', 'No. The current catalogue contains illustrative sample diagrams. Real construction drawings need to be prepared, coordinated and checked for the specific site and project.'],
];

async function seedFaqs() {
  for (const [index, [page, question, answer]] of faqItems.entries()) {
    await client.createIfNotExists({
      _id: `faq-${page}-${index + 1}`,
      _type: 'faq',
      page,
      question,
      answer,
      order: index + 1,
    });
  }
  console.log(`✓ ${faqItems.length} FAQs`);
}

console.log(`Seeding “${projectId}/${dataset}”…`);
await seedProjectTypes();
await seedDisciplines();
await seedProjects();
await seedDrawings();
await seedCredits();
await seedSettings();
await seedFaqs();
console.log('Done.');
