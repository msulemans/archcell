import { defineField, defineType } from 'sanity';

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      description: 'Used in the project URL: /projects/<slug>/',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: { list: ['Residential', 'Interiors'], layout: 'radio' },
      initialValue: 'Residential',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'area', title: 'Plot / covered area', type: 'string' }),
    defineField({ name: 'year', title: 'Year', type: 'string' }),
    defineField({ name: 'theme', title: 'Headline theme', type: 'string', description: 'The short phrase shown above the description (“THE IDEA”).' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 4 }),
    defineField({ name: 'materials', title: 'Material palette', type: 'string' }),
    defineField({ name: 'image', title: 'Card / hero image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'gallery', title: 'Detail images', type: 'array', of: [{ type: 'image', options: { hotspot: true } }], description: 'The two images shown on the project story page.' }),
    defineField({ name: 'featured', title: 'Featured on the homepage', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 0 }),
  ],
  orderings: [{ title: 'Manual order', name: 'manual', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'location', media: 'image' } },
});
