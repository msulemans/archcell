// GROQ queries. All lists are ordered by the manual `order` field.

export const projectsQuery = `*[_type == "project"] | order(order asc) {
  "id": slug.current,
  name,
  location,
  type,
  area,
  year,
  theme,
  description,
  materials,
  image,
  gallery,
  featured
}`;

export const drawingsQuery = `*[_type == "drawing"] | order(order asc) {
  code,
  name,
  category,
  kind
}`;

export const creditsQuery = `*[_type == "credit"] | order(order asc) {
  name,
  usedFor,
  url
}`;

export const siteSettingsQuery = `*[_type == "siteSettings"][0]`;

export const homePageQuery = `*[_type == "homePage"][0]`;
