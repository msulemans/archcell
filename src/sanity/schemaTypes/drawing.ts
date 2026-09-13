import { defineField, defineType } from 'sanity';

// The 18 diagram routines currently built into the site. A sheet's `kind`
// selects which generated diagram is drawn for it.
export const drawingKinds = [
  { title: 'Ground floor plan (plan)', value: 'plan' },
  { title: 'First floor plan (upper)', value: 'upper' },
  { title: 'Roof & terrace plan (roof)', value: 'roof' },
  { title: 'Building section (section)', value: 'section' },
  { title: 'Front elevation (elevation)', value: 'elevation' },
  { title: 'Rear elevation (rear)', value: 'rear' },
  { title: 'Foundation layout (foundation)', value: 'foundation' },
  { title: 'Column layout (columns)', value: 'columns' },
  { title: 'Slab framing plan (slab)', value: 'slab' },
  { title: 'Lighting layout (lighting)', value: 'lighting' },
  { title: 'Power & socket layout (power)', value: 'power' },
  { title: 'Switching circuits (switches)', value: 'switches' },
  { title: 'Water supply layout (water)', value: 'water' },
  { title: 'Drainage layout (drainage)', value: 'drainage' },
  { title: 'Sanitary fixture layout (sanitary)', value: 'sanitary' },
  { title: 'Furniture layout (furniture)', value: 'furniture' },
  { title: 'Reflected ceiling plan (ceiling)', value: 'ceiling' },
  { title: 'Kitchen joinery detail (joinery)', value: 'joinery' },
];

export const drawing = defineType({
  name: 'drawing',
  title: 'Drawing sheet',
  type: 'document',
  fields: [
    defineField({ name: 'project', title: 'Project', type: 'reference', to: [{ type: 'project' }], description: 'The project this sheet belongs to. Each project keeps its own drawing collection.', validation: (r) => r.required() }),
    defineField({ name: 'code', title: 'Sheet code', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'name', title: 'Sheet name', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'discipline',
      title: 'Discipline',
      type: 'reference',
      to: [{ type: 'discipline' }],
      description: 'Manage the list under “Disciplines” in the sidebar — new disciplines appear in the catalogue filters automatically.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'kind',
      title: 'Diagram style',
      type: 'string',
      options: { list: drawingKinds },
      description: 'Used when no uploaded drawing is set: selects which generated sample diagram this sheet shows.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'image',
      title: 'Uploaded drawing (optional)',
      type: 'image',
      description: 'An exported image of the sheet (JPG or PNG). When set, it replaces the generated sample diagram on the site.',
    }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 0 }),
  ],
  orderings: [{ title: 'Manual order', name: 'manual', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'code' } },
});
