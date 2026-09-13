// Marks the current section in a navigation list.
// Exact match, plus "/projects/" stays current on project detail routes.
export function isCurrent(pathname, href) {
  if (pathname === href) return true;
  return href === '/projects/' && pathname.startsWith('/projects/');
}
