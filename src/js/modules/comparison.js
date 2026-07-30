export function initComparison() {
  const toggle = document.querySelector('[data-comparison-toggle]');
  const topScroll = document.querySelector('.comparison__scroll--top');
  const mainScroll = document.querySelector('[data-comparison-scroll-main]');

  if (topScroll && mainScroll) {
    let syncingFromTop = false;
    let syncingFromMain = false;

    topScroll.addEventListener('scroll', () => {
      if (syncingFromMain) return;
      syncingFromTop = true;
      mainScroll.scrollLeft = topScroll.scrollLeft;
      syncingFromTop = false;
    });

    mainScroll.addEventListener('scroll', () => {
      if (syncingFromTop) return;
      syncingFromMain = true;
      topScroll.scrollLeft = mainScroll.scrollLeft;
      syncingFromMain = false;
    });

    topScroll.scrollLeft = mainScroll.scrollLeft;
  }

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
