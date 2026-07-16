export const initProductReviews = () => {
  const list = document.querySelector('.reviews-block__list');
  const btn = document.querySelector('.reviews-section__link-all');
  if (!list || !btn) return;

  const reviews = list.querySelectorAll('.review-item');
  if (reviews.length <= 3) {
    btn.style.display = 'none';
    return;
  }

  let collapsedHeight = 0;

  const calculateHeight = () => {
    // Temporarily clear maxHeight to measure natural bounds
    const prevMaxHeight = list.style.maxHeight;
    list.style.maxHeight = 'none';
    
    const listRect = list.getBoundingClientRect();
    const thirdRect = reviews[2].getBoundingClientRect();
    collapsedHeight = thirdRect.bottom - listRect.top;
    
    // Restore maxHeight or apply the correct one
    if (list.classList.contains('is-expanded')) {
      list.style.maxHeight = `${list.scrollHeight}px`;
    } else {
      list.style.maxHeight = `${collapsedHeight}px`;
    }
  };

  list.classList.add('is-collapsible');
  
  // Run initially
  calculateHeight();

  // Recalculate on resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(calculateHeight, 150);
  });

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const isExpanded = list.classList.contains('is-expanded');

    if (isExpanded) {
      list.style.maxHeight = `${collapsedHeight}px`;
      list.classList.remove('is-expanded');
    } else {
      list.style.maxHeight = `${list.scrollHeight}px`;
      list.classList.add('is-expanded');
      
      // Smoothly scroll to the 3rd comment so new comments are visible at the top
      setTimeout(() => {
        reviews[2].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150); // delay slightly to let the height expansion transition begin
    }
  });
};
