import { defineField, defineType } from 'sanity';

export const credit = defineType({
  name: 'credit',
  title: 'Photography credit',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Photographer', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'usedFor', title: 'Used for', type: 'string', description: 'e.g. “The Courtyard House”' }),
    defineField({ name: 'url', title: 'Source URL', type: 'url' }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 0 }),
  ],
  orderings: [{ title: 'Manual order', name: 'manual', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'usedFor' } },
});
