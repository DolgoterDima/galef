export const initProductSpecifications = () => {
  const specsBlocks = document.querySelectorAll('.product-specifications');

  specsBlocks.forEach(block => {
    const table = block.querySelector('.product-specifications__table');
    const btn = block.querySelector('.product-specifications__btn');
    const btnText = btn?.querySelector('span');
    
    if (!table || !btn) return;

    // Check if table height exceeds 300px
    // Need to temporarily remove max-height if it exists to measure true height,
    // but initially it shouldn't have max-height until we add the collapsible class.
    
    const trueHeight = table.scrollHeight;
    
    if (trueHeight > 300) {
      block.classList.add('is-collapsible');
      btn.classList.add('is-visible');
      table.style.maxHeight = '300px';
      
      btn.addEventListener('click', () => {
        const isExpanded = block.classList.contains('is-expanded');
        
        if (isExpanded) {
          table.style.maxHeight = '300px';
          block.classList.remove('is-expanded');
        } else {
          table.style.maxHeight = `${table.scrollHeight}px`;
          block.classList.add('is-expanded');
        }
      });
    }
  });
};
