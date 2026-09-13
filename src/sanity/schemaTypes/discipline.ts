import { defineField, defineType } from 'sanity';

export const discipline = defineType({
  name: 'discipline',
  title: 'Discipline',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Name',
      type: 'string',
      description: 'Groups drawing sheets and drives the catalogue filter buttons.',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 0 }),
  ],
  orderings: [{ title: 'Manual order', name: 'manual', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title' } },
});
