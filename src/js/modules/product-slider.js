import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

export const initProductSlider = () => {
    const sliderContainer = document.querySelector('.product-slider');
    
    if (!sliderContainer) return;

    new Swiper(sliderContainer, {
        modules: [Navigation],
        slidesPerView: 4,
        spaceBetween: 24,
        navigation: {
            nextEl: '.product-slider__btn--next',
            prevEl: '.product-slider__btn--prev',
        },
        breakpoints: {
            // 0 - 749px: 2.5 slides (user requested "менше 750 то 2.5")
            0: {
                slidesPerView: 2.5,
                spaceBetween: 16
            },
            // 750px - 960px: 3 slides (user requested "960 і менше 3 штуки")
            750: {
                slidesPerView: 3,
                spaceBetween: 20
            },
            // 961px+: 4 slides
            961: {
                slidesPerView: 4,
                spaceBetween: 24
            }
        }
    });
};
