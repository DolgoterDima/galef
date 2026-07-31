export function initComparison() {
  const toggle = document.querySelector('[data-comparison-toggle]');
  const topScroll = document.querySelector('.comparison__scroll--top');
  const productsScroll = document.querySelector('[data-comparison-scroll-products]');
  const mainScroll = document.querySelector('[data-comparison-scroll-main]');
  const scrollAreas = document.querySelectorAll('.comparison__scroll');

  const syncScrolls = [topScroll, productsScroll, mainScroll].filter(Boolean);
  if (syncScrolls.length > 1) {
    let isSyncing = false;

    syncScrolls.forEach(source => {
      source.addEventListener('scroll', () => {
        if (isSyncing) return;
        isSyncing = true;
        syncScrolls.forEach(target => {
          if (target !== source) target.scrollLeft = source.scrollLeft;
        });
        isSyncing = false;
      });
    });

    const initialLeft = mainScroll?.scrollLeft ?? productsScroll?.scrollLeft ?? topScroll?.scrollLeft ?? 0;
    syncScrolls.forEach(area => {
      area.scrollLeft = initialLeft;
    });
  }

  const canScrollHorizontally = (element, deltaX) => {
    const maxLeft = element.scrollWidth - element.clientWidth;
    if (maxLeft <= 0) return false;
    if (deltaX < 0 && element.scrollLeft > 0) return true;
    if (deltaX > 0 && element.scrollLeft < maxLeft) return true;
    return false;
  };

  scrollAreas.forEach(area => {
    area.addEventListener(
      'wheel',
      event => {
        const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
        if (!delta) return;
        if (!canScrollHorizontally(area, delta)) return;

        event.preventDefault();
        area.scrollLeft += delta;
      },
      { passive: false }
    );
  });

  if (!toggle) return;

  const rows = document.querySelectorAll('.comparison__spec-group[data-same="true"]');

  const syncRows = () => {
    rows.forEach(row => {
      row.classList.toggle('is-hidden', toggle.checked);
    });
  };

  toggle.addEventListener('change', syncRows);
  syncRows();
}
