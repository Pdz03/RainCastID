document.addEventListener('DOMContentLoaded', () => {
    "use strict";

    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        const logoDisplay = $('.logo-display');
        const logoScrolled = $('.logo-scrolled');
        const navLink = $('#nav-top');
        
        if(window.pageYOffset >= 80){
            navbar.classList.add('scrolled');
            logoDisplay.css('display', 'none');
            logoScrolled.css('display', 'block');
            navLink.removeClass('text-white');
        }else{
            navbar.classList.remove('scrolled');
            logoDisplay.css('display', 'block');
            logoScrolled.css('display', 'none');
            navLink.addClass('text-white');
        }
    });
    
    const buttonDown = document.getElementById('scrollDown');
    
      buttonDown.addEventListener("click", (e)=>{
        e.preventDefault();
        const targetId = buttonDown.getAttribute("href");
        const targetElement = document.querySelector(targetId);
        const targetPosition = targetElement.getBoundingClientRect()
    
        const offsetPosition = targetPosition.top + window.pageYOffset - 200;
      
        window.scrollTo({
             top: offsetPosition,
             behavior: "smooth"
        });
      });

})

function openAPI(){
    console.log('API')
    $('#inputAPI').removeClass("visually-hidden");
    $('#inputManual').addClass("visually-hidden");
    $('#btn-minputManual').removeClass("active");
    $('#btn-minputAPI').addClass("active");
}

function openManual(){
    console.log('MANUAL')
    $('#inputAPI').addClass("visually-hidden");
    $('#inputManual').removeClass("visually-hidden");
    $('#btn-minputManual').addClass("active");
    $('#btn-minputAPI').removeClass("active");
}

function openregister(){
    $('#regform').toggleClass("visually-hidden");
    $('#add-regform').toggleClass("visually-hidden");
    $('#add-logform').addClass("visually-hidden");
    $('#title-login').addClass("visually-hidden");
  }
  
  function openlogin(){
    $('#regform').addClass("visually-hidden");
    $('#add-regform').addClass("visually-hidden");
    $('#add-logform').toggleClass("visually-hidden");
    $('#title-login').toggleClass("visually-hidden");
  }