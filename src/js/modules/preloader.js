export function initPreloader() {
  const preloader = document.getElementById('preloader');
  const logoContainer = document.getElementById('preloader-logo-container');
  const logoImg = logoContainer?.querySelector('.preloader__logo');
  const whiteBg = preloader?.querySelector('.preloader__white-bg');

  if (!preloader || !logoContainer || !logoImg || !whiteBg) return;

  // Step 1: Start phase 1 (white circle expansion) and logo container reveal
  setTimeout(() => {
    whiteBg.style.clipPath = 'circle(150% at 50% 50%)';
    
    // Logo pops in slightly after the reveal begins (300ms)
    setTimeout(() => {
      logoContainer.classList.add('is-visible');
    }, 300);
  }, 100);

  // Step 2: Handle transition once page is loaded
  const startTransition = () => {
    if (preloader.classList.contains('preloader--hidden')) return; // already run

    // Determine target logo (desktop or mobile) depending on viewport
    const desktopLogo = document.querySelector('.header__desktop .header__logo img');
    const mobileLogo = document.querySelector('.header__mobile .header__logo img');
    let targetLogo = window.innerWidth >= 960 ? desktopLogo : mobileLogo;
    
    if (!targetLogo) {
      targetLogo = desktopLogo || mobileLogo;
    }

    if (!targetLogo) {
      // Fallback: if header logo is not found, just fade out preloader
      preloader.classList.add('preloader--hidden');
      document.body.classList.remove('is-loading');
      return;
    }

    // Switch transitions to animation mode
    logoContainer.classList.add('is-animating');

    // Get positions
    const containerRect = logoContainer.getBoundingClientRect();
    const targetRect = targetLogo.getBoundingClientRect();

    // Calculate translation delta relative to current center position
    const deltaX = targetRect.left + (targetRect.width / 2) - (containerRect.left + (containerRect.width / 2));
    const deltaY = targetRect.top + (targetRect.height / 2) - (containerRect.top + (containerRect.height / 2));
    
    // Calculate scale factor based on width
    const scale = targetRect.width / containerRect.width;

    // Apply translation to container, and scale to the image (which scales down faster)
    logoContainer.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    logoImg.style.transform = `scale(${scale})`;
    
    // Fade out preloader background (1s transition)
    preloader.classList.add('preloader--hidden');

    // Remove is-loading slightly before transition ends (900ms) to fade-in real logo early and avoid flicker
    setTimeout(() => {
      document.body.classList.remove('is-loading');
    }, 900);

    // Hide preloader logo container exactly when transition completes (1050ms)
    setTimeout(() => {
      logoContainer.style.display = 'none';
    }, 1050);

    setTimeout(() => {
      preloader.style.display = 'none';
    }, 1250);
  };

  // Run transition on window load or fallback timeout
  window.addEventListener('load', () => {
    // Small delay to ensure layout is fully drawn and stable (800ms)
    setTimeout(startTransition, 800);
  });

  // Fallback timeout to prevent infinite loader if resource fails to load (3500ms)
  setTimeout(startTransition, 3500);
}
