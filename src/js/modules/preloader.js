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

    // Get positions
    const containerRect = logoContainer.getBoundingClientRect();
    const targetRect = targetLogo.getBoundingClientRect();

    // Calculate translation delta relative to current center position
    const deltaX = targetRect.left + (targetRect.width / 2) - (containerRect.left + (containerRect.width / 2));
    const deltaY = targetRect.top + (targetRect.height / 2) - (containerRect.top + (containerRect.height / 2));
    
    // Calculate scale factor based on container width
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

  // Run transition on DOMContentLoaded
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    onPageReady();
  } else {
    document.addEventListener('DOMContentLoaded', onPageReady);
  }

  // Fallback timeout to prevent infinite loader if resource fails to load (3500ms)
  setTimeout(onPageReady, 3500);
}
