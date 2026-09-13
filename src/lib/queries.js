// GROQ queries. All lists are ordered by the manual `order` field.

export const projectsQuery = `*[_type == "project"] | order(order asc) {
  "id": slug.current,
  name,
  location,
  "type": type->title,
  area,
  year,
  theme,
  description,
  materials,
  image,
  gallery,
  featured
}`;

export const projectTypesQuery = `*[_type == "projectType"] | order(order asc) {
  "title": title
}`;

// Sheets carry a `discipline` reference; the dereferenced title is aliased to
// `category` for the site components (same shape as the local data fallback).
export const drawingsQuery = `*[_type == "drawing"] | order(order asc) {
  code,
  name,
  "category": discipline->title,
  "categoryOrder": discipline->order,
  kind,
  image,
  "project": project->slug.current
}`;

export const creditsQuery = `*[_type == "credit"] | order(order asc) {
  name,
  usedFor,
  url
}`;

export const siteSettingsQuery = `*[_type == "siteSettings"][0]`;

export const homePageQuery = `*[_type == "homePage"][0]`;

export const faqsQuery = `*[_type == "faq"] | order(order asc) {
  question,
  answer,
  page
}`;
