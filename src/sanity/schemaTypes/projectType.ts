import { defineField, defineType } from 'sanity';

export const projectType = defineType({
  name: 'projectType',
  title: 'Project type',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Name',
      type: 'string',
      description: 'Shown on the project card and used by the filter buttons on the project collection.',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 0 }),
  ],
  orderings: [{ title: 'Manual order', name: 'manual', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title' } },
});
