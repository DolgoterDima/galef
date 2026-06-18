import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

export const initProductSlider = () => {
    const sliders = document.querySelectorAll('.product-slider');
    
    if (!sliders.length) return;

    sliders.forEach(sliderContainer => {
        // Find all slides
        const slides = sliderContainer.querySelectorAll('.swiper-slide');
        
        slides.forEach(slide => {
            const realCard = slide.querySelector('.product-card');
            if (!realCard) return;
            
            // Create a skeleton card element
            const skeletonCard = document.createElement('article');
            skeletonCard.className = 'product-card product-card--skeleton';
            skeletonCard.innerHTML = `
              <div class="product-card__image-wrapper">
                <div class="product-card__image-skeleton">
                  <svg><use href="#icon-chair-skeleton"></use></svg>
                </div>
              </div>
              <div class="product-card__content">
                <div class="product-card__status-skeleton"></div>
                <div class="product-card__title-skeleton"></div>
                <div class="product-card__rating-skeleton"></div>
                <div class="product-card__price-skeleton"></div>
                <div class="product-card__btn-skeleton"></div>
              </div>
            `;
            
            // Insert skeleton before the real card
            slide.insertBefore(skeletonCard, realCard);
            
            // Hide real card initially
            realCard.style.display = 'none';
            
            // Show real card and remove skeleton after 2 seconds
            setTimeout(() => {
                skeletonCard.remove();
                realCard.style.display = 'flex';
                // Trigger swiper update if initialized
                if (swiper) {
                    swiper.update();
                }
            }, 2000);
        });

        // Find the navigation buttons relative to this specific slider's parent wrapper
        // The buttons are next to the slider container in the DOM tree
        const wrapper = sliderContainer.parentElement;
        const nextBtn = wrapper.querySelector('.product-slider__btn--next');
        const prevBtn = wrapper.querySelector('.product-slider__btn--prev');

        const swiper = new Swiper(sliderContainer, {
            modules: [Navigation],
            slidesPerView: 4,
            spaceBetween: 24,
            navigation: {
                nextEl: nextBtn,
                prevEl: prevBtn,
            },
            breakpoints: {
                0: {
                    slidesPerView: 2.5,
                    spaceBetween: 8
                },
                760: {
                    slidesPerView: 3,
                    spaceBetween: 8
                },
                961: {
                    slidesPerView: 4,
                    spaceBetween: 12
                },
                1200: {
                    slidesPerView: 4,
                    spaceBetween: 24
                }
            }
        });
    });
};
