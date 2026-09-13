// Server-side Sanity client for build-time content fetching.
// When SANITY_PROJECT_ID is not configured the site falls back to the
// local data in data.js, so builds never depend on the CMS being reachable.

import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { projectId, dataset, apiVersion, hasSanity } from '../sanity/env';

export { hasSanity };

export const sanityClient = hasSanity
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      perspective: 'published',
    })
  : null;

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

export function imageUrl(source, width = 1600) {
  if (!builder || !source) return null;
  return builder.image(source).width(width).auto('format').url();
}
