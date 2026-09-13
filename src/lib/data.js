// Content data for the Archcell site.
// Phase 2 of the migration replaces these arrays with Sanity documents;
// the shapes intentionally mirror the former dist/app.js arrays.

export const projects = [
  { id: 'courtyard-house', name: 'The Courtyard House', location: 'DHA, Lahore', type: 'Residential', image: 'residence.jpg', area: '1 kanal', year: '2025', theme: 'Light, openness, connection.', description: 'A quiet retreat around an open heart. Layered volumes, deep shade and generous greenery create a home that balances togetherness with moments of privacy.', materials: 'Natural stone / Oak / Clear glass' },
  { id: 'stone-residence', name: 'The Stone Residence', location: 'Bahria Town, Lahore', type: 'Residential', image: 'hero-night.jpg', area: '10 marla', year: '2025', theme: 'Warmth, framed in stone.', description: 'An expressive stone facade gives way to a warm, luminous interior. Double-height spaces and a restrained material palette make ordinary evenings feel special.', materials: 'Textured stone / Timber / Bronze' },
  { id: 'white-house', name: 'House of Light', location: 'DHA, Lahore', type: 'Residential', image: 'facade-detail.jpg', area: '1 kanal', year: '2024', theme: 'A conversation with the sky.', description: 'Sculpted white volumes hold a careful balance of openness and shelter. Every opening is an invitation for daylight, every shaded edge a place to pause.', materials: 'White render / Concrete / Glass' },
  { id: 'garden-residence', name: 'The Garden Residence', location: 'Lake City, Lahore', type: 'Residential', image: 'villa-lawn.jpg', area: '2 kanal', year: '2024', theme: 'Life, opening to the garden.', description: 'Long horizontal lines connect family life with the landscape. Open living spaces, sheltered terraces and broad views give this generous home an easy rhythm.', materials: 'Limestone / Timber / Landscape' },
  { id: 'quiet-courtyard', name: 'A Quiet Courtyard', location: 'Gulberg, Lahore', type: 'Residential', image: 'courtyard.jpg', area: '10 marla', year: '2023', theme: 'An inward-looking sanctuary.', description: 'A garden at the heart of the home brings a little of the outside into every day. Raw materials and soft planting offer a thoughtful retreat from the city.', materials: 'Exposed concrete / Steel / Greenery' },
  { id: 'warm-minimalism', name: 'The Warm Edit', location: 'DHA, Lahore', type: 'Interiors', image: 'interior.jpg', area: '1 kanal', year: '2023', theme: 'A softer kind of minimalism.', description: 'Rich timber, tactile fabrics and subtle colour bring depth to a pared-back family interior. Comfort is designed into the details, from bespoke joinery to layered light.', materials: 'Oak / Linen / Brushed brass' }
];

// Each sheet is an original, clearly marked illustrative diagram for the design preview.
export const sheets = [
  { code: 'A-101', name: 'Ground floor plan', category: 'Architecture', kind: 'plan' },
  { code: 'A-102', name: 'First floor plan', category: 'Architecture', kind: 'upper' },
  { code: 'A-103', name: 'Roof & terrace plan', category: 'Architecture', kind: 'roof' },
  { code: 'A-104', name: 'Building section AA', category: 'Architecture', kind: 'section' },
  { code: 'A-201', name: 'Front elevation', category: 'Elevations', kind: 'elevation' },
  { code: 'A-202', name: 'Rear elevation', category: 'Elevations', kind: 'rear' },
  { code: 'S-101', name: 'Foundation layout', category: 'Structural', kind: 'foundation' },
  { code: 'S-102', name: 'Column layout', category: 'Structural', kind: 'columns' },
  { code: 'S-103', name: 'Slab framing plan', category: 'Structural', kind: 'slab' },
  { code: 'E-101', name: 'Lighting layout', category: 'Electrical', kind: 'lighting' },
  { code: 'E-102', name: 'Power & socket layout', category: 'Electrical', kind: 'power' },
  { code: 'E-103', name: 'Switching circuits', category: 'Electrical', kind: 'switches' },
  { code: 'P-101', name: 'Water supply layout', category: 'Plumbing', kind: 'water' },
  { code: 'P-102', name: 'Drainage layout', category: 'Plumbing', kind: 'drainage' },
  { code: 'P-103', name: 'Sanitary fixture layout', category: 'Plumbing', kind: 'sanitary' },
  { code: 'I-101', name: 'Furniture layout', category: 'Interiors', kind: 'furniture' },
  { code: 'I-102', name: 'Reflected ceiling plan', category: 'Interiors', kind: 'ceiling' },
  { code: 'I-103', name: 'Kitchen joinery detail', category: 'Interiors', kind: 'joinery' }
];

export const cats = ['All drawings', 'Architecture', 'Elevations', 'Structural', 'Electrical', 'Plumbing', 'Interiors'];

export const credits = [
  ['John Fornander', 'The Courtyard House', 'https://unsplash.com/photos/Id7u0EkTjBE'],
  ['Igor Savelev', 'The Stone Residence', 'https://unsplash.com/photos/a-house-with-a-swimming-pool-at-night-hnFmQgrmLt4'],
  ['Felix', 'House of Light', 'https://unsplash.com/photos/P21wf6KAykw'],
  ['Frames For Your Heart', 'The Garden Residence', 'https://unsplash.com/photos/white-concrete-building-under-blue-sky-during-daytime-mR1CIDduGLc'],
  ['Miguel Picq', 'A Quiet Courtyard', 'https://unsplash.com/photos/minimalist-concrete-courtyard-with-white-furniture-plants-and-geometric-shadows-poEga0PVyPs/'],
  ['Clay Banks', 'The Warm Edit', 'https://unsplash.com/photos/modern-living-room-with-stylish-furniture-and-large-windows-FL-ZcDK8tMo']
];

export function getProject(slug) {
  return projects.find((p) => p.id === slug);
}

export function getNextProject(project) {
  return projects[(projects.indexOf(project) + 1) % projects.length];
}
