// Sanity project configuration.
//
// The project ID is public (it appears in every Studio and API URL), and the
// dataset is a public-read “production” dataset, so both are committed here.
// Write access is controlled separately by tokens that never live in the repo.
//
// Until a project exists this stays 'PLACEHOLDER': the Studio is not mounted
// and the site falls back to the local data in src/lib/data.js.

export const projectId = 'p8jvt4z4';
export const dataset = 'production';
export const apiVersion = '2026-09-13';

export const hasSanity = projectId !== 'PLACEHOLDER';
