import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({
      name: 'contact',
      title: 'Contact details',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'email', title: 'Email', type: 'string' }),
        defineField({ name: 'whatsapp', title: 'WhatsApp', type: 'string' }),
        defineField({ name: 'address', title: 'Studio address', type: 'string' }),
        defineField({ name: 'addressNote', title: 'Address note', type: 'string' }),
        defineField({ name: 'demoNote', title: 'Contact note', type: 'string', description: 'The small print under the contact details.' }),
      ],
    }),
    defineField({
      name: 'stats',
      title: 'Studio statistics',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'yearsValue', title: 'Years value', type: 'string', description: 'e.g. “10”' }),
        defineField({ name: 'yearsSuffix', title: 'Years suffix', type: 'string', description: 'e.g. “+”' }),
        defineField({ name: 'yearsLabel', title: 'Years label', type: 'string', description: 'e.g. “Years of practice”' }),
        defineField({ name: 'projectsValue', title: 'Projects value', type: 'string', description: 'e.g. “100”' }),
        defineField({ name: 'projectsSuffix', title: 'Projects suffix', type: 'string', description: 'e.g. “s”' }),
        defineField({ name: 'projectsLabel', title: 'Projects label', type: 'string', description: 'e.g. “Projects, each personal”' }),
        defineField({ name: 'homeValue', title: 'Home value', type: 'string', description: 'e.g. “LHR”' }),
        defineField({ name: 'homeLabel', title: 'Home label', type: 'string', description: 'e.g. “Our home, our perspective”' }),
      ],
    }),
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'statement', title: 'Statement', type: 'string' }),
        defineField({ name: 'finePrint', title: 'Fine print', type: 'string' }),
        defineField({ name: 'copyright', title: 'Copyright line', type: 'string' }),
      ],
    }),
    defineField({
      name: 'creditsIntro',
      title: 'Credits dialog intro',
      type: 'string',
      description: 'The sentence shown above the photography credits list.',
    }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
});
