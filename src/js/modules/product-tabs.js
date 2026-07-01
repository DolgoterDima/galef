export function initProductTabs() {
  const tabButtons = document.querySelectorAll('.product-nav__tab-btn');
  const tabPanes = document.querySelectorAll('.product-content__tab-pane');

  if (!tabButtons.length || !tabPanes.length) return;

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');
      const targetPane = document.getElementById(`tab-${targetTab}`);

      if (!targetPane) return;

      // Deactivate all tab buttons
      tabButtons.forEach(btn => {
        btn.classList.remove('product-nav__tab-btn--active');
      });

      // Deactivate all tab panes
      tabPanes.forEach(pane => {
        pane.classList.remove('product-content__tab-pane--active');
      });

      // Activate selected tab and pane
      button.classList.add('product-nav__tab-btn--active');
      targetPane.classList.add('product-content__tab-pane--active');
    });
  });



  // Handle click on the video review shortcut in the sticky nav
  const videoReviewLink = document.querySelector('.product-nav__link[href="#video-review"]');
  if (videoReviewLink) {
    videoReviewLink.addEventListener('click', (e) => {
      e.preventDefault();
      
      const descTabBtn = document.querySelector('.product-nav__tab-btn[data-tab="desc"]');
      if (descTabBtn) {
        descTabBtn.click();
      }

      const videoReviewSection = document.getElementById('video-review');
      if (videoReviewSection) {
        // Delay slightly to let the tab transition complete before scrolling
        setTimeout(() => {
          videoReviewSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    });
  }

  // Handle interactivity of color swatch buttons selection outline
  const colorBtns = document.querySelectorAll('.product-hero__color-btn');
  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      colorBtns.forEach(b => b.classList.remove('product-hero__color-btn--active'));
      btn.classList.add('product-hero__color-btn--active');
    });
  });
}
