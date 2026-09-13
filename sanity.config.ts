import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schemaTypes';
import { projectId, dataset } from './src/sanity/env';

export default defineConfig({
  name: 'archcell',
  title: 'Archcell',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem().title('Site settings').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.listItem().title('Homepage').child(S.document().schemaType('homePage').documentId('homePage')),
            S.divider(),
            S.documentTypeListItem('project').title('Projects'),
            S.documentTypeListItem('projectType').title('Project types'),
            S.documentTypeListItem('discipline').title('Disciplines'),
            S.documentTypeListItem('drawing').title('Drawing sheets'),
            S.documentTypeListItem('credit').title('Photography credits'),
            S.documentTypeListItem('faq').title('FAQs'),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
});
