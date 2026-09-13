// Global site behaviour: reveals, mobile menu, credits dialog, page
// transition, cursor label, hero parallax, back-to-top and skip link.
// Ported from the legacy dist/app.js.

// --- Reveal-on-scroll ---------------------------------------------------
const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } }), { threshold: 0.08 }) : null;
if (revealObserver) document.documentElement.classList.add('has-reveals');

function observeReveals() {
  document.querySelectorAll('.reveal:not(.visible)').forEach((el) => (revealObserver ? revealObserver.observe(el) : el.classList.add('visible')));
}
observeReveals();

// --- Mobile menu --------------------------------------------------------
const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');

function setMenu(opened, restoreFocus = false) {
  menuButton.setAttribute('aria-expanded', String(opened));
  menuButton.setAttribute('aria-label', opened ? 'Close navigation' : 'Open navigation');
  mobileNav.classList.toggle('open', opened);
  mobileNav.inert = !opened;
  document.body.classList.toggle('menu-open', opened);
  document.querySelectorAll('#main-content,.site-footer,.brand,.header-cta,.skip-link').forEach((el) => { el.inert = opened; });
  if (opened) mobileNav.querySelector('a').focus();
  else if (restoreFocus) menuButton.focus();
}
function closeMenu() { setMenu(false); }

menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true', true));
mobileNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
window.addEventListener('keydown', (e) => {
  if (menuButton.getAttribute('aria-expanded') !== 'true') return;
  if (e.key === 'Escape') { e.preventDefault(); setMenu(false, true); }
  if (e.key === 'Tab') {
    const controls = [menuButton, ...mobileNav.querySelectorAll('a')];
    const index = controls.indexOf(document.activeElement);
    e.preventDefault();
    controls[(index + (e.shiftKey ? -1 : 1) + controls.length) % controls.length].focus();
  }
});
matchMedia('(max-width: 1100px)').addEventListener('change', () => closeMenu());

// --- Photography credits dialog -----------------------------------------
const creditsDialog = document.querySelector('#credits-dialog');
document.querySelector('#credits-button').addEventListener('click', () => { creditsDialog.showModal(); document.body.classList.add('locked'); });
creditsDialog.querySelector('.credits-close').addEventListener('click', () => creditsDialog.close());
creditsDialog.addEventListener('close', () => document.body.classList.remove('locked'));

// --- Page transition overlay --------------------------------------------
// Links that used to animate through the hash router now wipe on click.
const transition = document.querySelector('.page-transition');
document.addEventListener('click', (e) => {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest('a[data-page-transition]');
  if (!a || (a.target && a.target !== '_self')) return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  transition.classList.add('active');
});
window.addEventListener('pageshow', () => transition.classList.remove('active'));

// --- Cursor label --------------------------------------------------------
// Fine-pointer interactions supplement the regular, keyboard-accessible links.
const cursor = document.querySelector('.cursor-label');
if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.addEventListener('pointermove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursor.classList.toggle('shown', !!e.target.closest('.project-image'));
  });
  document.addEventListener('pointerleave', () => cursor.classList.remove('shown'));
}

// --- Hero parallax -------------------------------------------------------
let scrollTick = false;
window.addEventListener('scroll', () => {
  if (!scrollTick) {
    requestAnimationFrame(() => {
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const heroImage = document.querySelector('.hero-image');
        const y = window.scrollY;
        if (heroImage && y < window.innerHeight) heroImage.style.translate = `0 ${y * 0.16}px`;
      }
      scrollTick = false;
    });
    scrollTick = true;
  }
}, { passive: true });

// --- Utility links -------------------------------------------------------
// Keep back-to-top on the current page instead of jumping to the hash.
document.querySelectorAll('.back-top').forEach((link) => link.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}));

const main = document.querySelector('#main-content');
document.querySelector('.skip-link')?.addEventListener('click', (e) => {
  e.preventDefault();
  main.focus({ preventScroll: true });
  window.scrollTo({ top: Math.max(0, window.scrollY + main.getBoundingClientRect().top - 24), behavior: 'instant' });
});
