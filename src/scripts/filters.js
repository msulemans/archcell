// Project filters (portfolio index) and drawing-catalogue discipline
// filters. Cards are server-rendered; filtering toggles visibility.

// --- Portfolio index -----------------------------------------------------
const filterButtons = [...document.querySelectorAll('[data-project-filter]')];
const grid = document.querySelector('#project-grid');

if (filterButtons.length && grid) {
  const cards = [...grid.querySelectorAll('.project-card')];
  const countEl = document.querySelector('#project-count');
  filterButtons.forEach((button) => button.addEventListener('click', () => {
    filterButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
    const filter = button.dataset.projectFilter;
    let count = 0;
    cards.forEach((card) => {
      const show = filter === 'All' || card.dataset.type === filter;
      card.hidden = !show;
      if (show) count++;
    });
    if (countEl) countEl.textContent = `${count} project${count === 1 ? '' : 's'}`;
  }));
}

// --- Drawing catalogue ---------------------------------------------------
const categoryButtons = [...document.querySelectorAll('[data-category]')];

if (categoryButtons.length) {
  const sheetCards = [...document.querySelectorAll('.sheet-card[data-sheet]')];
  categoryButtons.forEach((button) => button.addEventListener('click', () => {
    categoryButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
    const category = button.dataset.category;
    sheetCards.forEach((card) => {
      card.hidden = !(category === 'All drawings' || card.dataset.category === category);
    });
  }));
}
