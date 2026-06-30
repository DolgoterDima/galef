export function initPreloader() {
  const preloader = document.getElementById('preloader');
  const whiteBg = preloader?.querySelector('.preloader__white-bg');

  if (!preloader || !whiteBg) return;

  let loaded = false;

  const onPageReady = () => {
    if (loaded) return;
    loaded = true;

    // Determine the active header logo (desktop or mobile) depending on viewport width
    const desktopLogo = document.querySelector('.header__desktop .header__logo img');
    const mobileLogo = document.querySelector('.header__mobile .header__logo img');
    let targetLogo = window.innerWidth >= 960 ? desktopLogo : mobileLogo;

    if (!targetLogo) {
      targetLogo = desktopLogo || mobileLogo;
    }

    const logoLink = targetLogo?.closest('.header__logo');

    if (!targetLogo || !logoLink) {
      // Fallback: if header logo elements are not found, just fade out preloader
      preloader.classList.add('preloader--hidden');
      document.body.classList.remove('is-loading');
      return;
    }

    // Get positions for translation (includes viewport scroll offsets)
    const targetRect = targetLogo.getBoundingClientRect();
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Center of target logo in its natural state
    const logoCenterX = targetRect.left + targetRect.width / 2;
    const logoCenterY = targetRect.top + targetRect.height / 2;

    // Calculate translation delta to move the logo to the center of the viewport
    const translateX = centerX - logoCenterX;
    const translateY = centerY - logoCenterY;

    // Calculate scale factor: we want the centered logo to be prominent (e.g. ~540px wide on desktop, ~50% viewport width on mobile)
    const scale = (window.innerWidth >= 960 ? Math.min(600, window.innerWidth * 0.45) : window.innerWidth * 0.5) / targetRect.width;

    // Apply the centered and scaled transform immediately before making it visible
    targetLogo.style.transition = 'none';
    targetLogo.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;

    // Show the logo link (which starts at opacity: 0 in CSS to prevent flicker)
    logoLink.style.opacity = '1';

    // Step 1: Start Phase 1 (reveal white circle behind the centered logo)
    whiteBg.style.clipPath = 'circle(150% at 50% 50%)';

    // Step 2: Wait for Phase 1 to complete (1500ms), then start Phase 2 & 3 (flight back to layout)
    setTimeout(() => {
      // Apply the transition style inline to ensure it overrides 'none'
      targetLogo.style.transition = 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
      
      // Force a browser reflow/repaint to apply the transition before we reset transform
      targetLogo.offsetHeight;

      // Reset transform to 'none' to let the transition glide it back to its exact natural layout position
      targetLogo.style.transform = 'none';

      // Fade out the preloader backgrounds
      preloader.classList.add('preloader--hidden');
    }, 1500);

    // Step 3: Remove loading state and clean up classes after flight completes
    setTimeout(() => {
      document.body.classList.remove('is-loading');
      // Clean up inline styles so browser default layout rules take over
      targetLogo.style.transform = '';
      targetLogo.style.transition = '';
      logoLink.style.opacity = '';
    }, 2720); // 1500ms delay + 1220ms animation time


    // Final clean up: hide preloader wrapper completely
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 2950);
  };

  // Run transition on DOMContentLoaded or immediately if already loaded
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    onPageReady();
  } else {
    document.addEventListener('DOMContentLoaded', onPageReady);
  }

  // Fallback timeout to prevent infinite loader if resource fails to load (3500ms)
  setTimeout(onPageReady, 3500);
}
