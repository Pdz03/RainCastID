document.addEventListener('DOMContentLoaded', () => {
"use strict";

//for Preloader

window.addEventListener('load', () => {

        $("#loading").fadeOut(500);
});

});

const swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'horizontal',
  loop: true,
  slidesPerView: 'auto',
  grabCursor: true,
  centeredSlides: true,
  effect: 'coverflow',
  coverflow: {
    depth: 100,
    modifier: 1,
    rotate: 50,
    scale: 1,
    slideShadows: true,
    stretch: 0
  },

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
  },
});




// // scrool Down

// const scrollDown = document.getElementById('scrollDown');

// scrollDown.addEventListener('click', () => {
//     $('html , body').stop().animate({
//         scrollTop: $($(this).attr('href')).offset().top - 160
//     }, 1500, 'easeInOutExpo');
//     event.preventDefault();
// });


