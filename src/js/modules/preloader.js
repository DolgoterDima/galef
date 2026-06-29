export function initPreloader() {
  const preloader = document.getElementById('preloader');
  const logoContainer = document.getElementById('preloader-logo-container');
  const logoImg = logoContainer?.querySelector('.preloader__logo');
  const whiteBg = preloader?.querySelector('.preloader__white-bg');

  if (!preloader || !logoContainer || !logoImg || !whiteBg) return;

  let loaded = false;

  // Start Phase 1 (reveal white circle and show preloader logo) only after page is ready
  const onPageReady = () => {
    if (loaded) return;
    loaded = true;

    // Step 1: Start phase 1 (white circle expansion)
    whiteBg.style.clipPath = 'circle(150% at 50% 50%)';
    
    // Logo pops in slightly after the reveal begins (300ms)
    setTimeout(() => {
      logoContainer.classList.add('is-visible');
    }, 300);

    // Step 2: Wait for Phase 1 to complete (1500ms), then start Phase 2 & 3 (flight)
    setTimeout(startTransition, 1500);
  };

  // Phase 2 & 3: Flight translation and scaling transition
  const startTransition = () => {
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

    // Get layout dimensions for scale calculation (ignores transforms)
    const targetWidth = targetLogo.offsetWidth;
    const logoWidth = logoImg.offsetWidth;

    // Get positions for translation (includes viewport scroll offsets)
    const containerRect = logoContainer.getBoundingClientRect();
    const targetRect = targetLogo.getBoundingClientRect();

    // Calculate translation delta relative to current center position and round to nearest pixel
    let deltaX = Math.round(targetRect.left + (targetRect.width / 2) - (containerRect.left + (containerRect.width / 2)));
    let deltaY = Math.round(targetRect.top + (targetRect.height / 2) - (containerRect.top + (containerRect.height / 2)));
    const isDesktop = window.innerWidth >= 960;


    

    // Calculate scale factor using layout widths (which is extremely stable and precise)
    const scale = targetWidth / logoWidth;

    // Apply translation to container, and scale to the image (which scales down faster)
    logoContainer.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    logoImg.style.transform = `scale(${scale})`;
    
    // Fade out preloader background (1s transition)
    preloader.classList.add('preloader--hidden');

    // Remove is-loading later to delay the appearance of the real header logo
    setTimeout(() => {
      document.body.classList.remove('is-loading');
    }, 1220);

    // Hide preloader logo container 1 second after transition completes
    setTimeout(() => {
      logoContainer.style.display = 'none';
    }, 1850);

    setTimeout(() => {
      preloader.style.display = 'none';
    }, 2050);
  };

  // Run transition on DOMContentLoaded
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    onPageReady();
  } else {
    document.addEventListener('DOMContentLoaded', onPageReady);
  }

  // Fallback timeout to prevent infinite loader if resource fails to load (3500ms)
  setTimeout(onPageReady, 3500);
}
