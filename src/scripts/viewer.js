// Drawing viewer: opens a sheet card's server-rendered SVG in the dialog,
// with zoom/fit, previous/next, keyboard navigation and SVG download.
// Adapted from the legacy dist/app.js viewer (the SVG generator itself now
// runs at build time, so the dialog clones the pre-rendered artwork).

const dialog = document.querySelector('#drawing-dialog');
const cards = [...document.querySelectorAll('.sheet-card[data-sheet]')];

if (dialog && cards.length) {
  const sheetEl = document.querySelector('#drawing-sheet');
  const canvas = document.querySelector('.viewer-canvas');
  const counter = document.querySelector('#sheet-counter');
  const prevButton = document.querySelector('#previous-sheet');
  const nextButton = document.querySelector('#next-sheet');
  const zoomFit = document.querySelector('#zoom-fit');
  const projectSlug = document.body.dataset.project || 'archcell';
  const projectName = document.body.dataset.projectName || 'Archcell';

  let currentSheet = 0;
  let zoom = 1;

  function setZoom(value) {
    zoom = Math.max(0.75, Math.min(2.5, value));
    const styles = getComputedStyle(canvas);
    const width = canvas.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
    const height = canvas.clientHeight - parseFloat(styles.paddingTop) - parseFloat(styles.paddingBottom);
    const fitWidth = Math.max(1, Math.min(width, (height * 800) / 570));
    sheetEl.style.width = `${fitWidth * zoom}px`;
    sheetEl.style.maxWidth = 'none';
    zoomFit.textContent = zoom === 1 ? 'Fit' : Math.round(zoom * 100) + '%';
    zoomFit.setAttribute('aria-label', 'Fit entire drawing to viewer');
    document.querySelector('#zoom-out').disabled = zoom <= 0.75;
    document.querySelector('#zoom-in').disabled = zoom >= 2.5;
    if (zoom === 1) { canvas.scrollTop = 0; canvas.scrollLeft = 0; }
  }

  function updateSheet() {
    const card = cards.find((c) => Number(c.dataset.sheet) === currentSheet);
    const svg = card.querySelector('.sheet-image svg');
    document.querySelector('#drawing-title').textContent = card.dataset.name;
    document.querySelector('#drawing-code').textContent = `${projectName} / ${card.dataset.code}`;
    sheetEl.replaceChildren(svg.cloneNode(true));
    counter.textContent = `${String(currentSheet + 1).padStart(2, '0')} / ${cards.length}`;
    prevButton.disabled = currentSheet === 0;
    nextButton.disabled = currentSheet === cards.length - 1;
    setZoom(1);
  }

  function openSheet(index) {
    currentSheet = index;
    dialog.showModal();
    document.body.classList.add('locked');
    updateSheet();
  }
  function closeSheet() {
    dialog.close();
    document.body.classList.remove('locked');
  }

  cards.forEach((card) => card.addEventListener('click', () => openSheet(Number(card.dataset.sheet))));

  dialog.querySelector('.viewer-close').addEventListener('click', closeSheet);
  dialog.addEventListener('close', () => document.body.classList.remove('locked'));
  prevButton.addEventListener('click', () => { if (currentSheet > 0) { currentSheet--; updateSheet(); } });
  nextButton.addEventListener('click', () => { if (currentSheet < cards.length - 1) { currentSheet++; updateSheet(); } });

  new ResizeObserver(() => { if (dialog.open) setZoom(zoom); }).observe(canvas);
  document.querySelector('#zoom-in').addEventListener('click', () => setZoom(zoom + 0.25));
  document.querySelector('#zoom-out').addEventListener('click', () => setZoom(zoom - 0.25));
  zoomFit.addEventListener('click', () => setZoom(1));

  document.querySelector('#download-sheet').addEventListener('click', () => {
    const card = cards.find((c) => Number(c.dataset.sheet) === currentSheet);
    const svg = card.querySelector('.sheet-image svg');
    const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `archcell-${projectSlug}-${card.dataset.code}-SAMPLE.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && currentSheet < cards.length - 1) { e.preventDefault(); currentSheet++; updateSheet(); }
    if (e.key === 'ArrowLeft' && currentSheet > 0) { e.preventDefault(); currentSheet--; updateSheet(); }
  });
}
