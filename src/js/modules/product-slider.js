import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

export const initProductSlider = () => {
    const sliders = document.querySelectorAll('.product-slider');
    
    if (!sliders.length) return;

    sliders.forEach(sliderContainer => {
        // Find the navigation buttons relative to this specific slider's parent wrapper
        // The buttons are next to the slider container in the DOM tree
        const wrapper = sliderContainer.parentElement;
        const nextBtn = wrapper.querySelector('.product-slider__btn--next');
        const prevBtn = wrapper.querySelector('.product-slider__btn--prev');

        new Swiper(sliderContainer, {
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
