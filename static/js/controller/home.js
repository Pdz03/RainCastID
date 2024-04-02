document.addEventListener('DOMContentLoaded', () => {
    "use strict";

    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        const logoDisplay = $('.logo-display');
        const logoScrolled = $('.logo-scrolled');
        const navLink = $('.nav-top');
        
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

      const buttons = [
        {
          id: 'scrollDown',
        },
        {
          id: 'btnFitur',
        },
        {
          id: 'btnForum',
        },
        {
          id: 'btnKontak',
        },
        {
          id: 'btnFiturMob',
        },
        {
          id: 'btnForumMob',
        },
        {
          id: 'btnKontakMob',
        },
      ];
      
      buttons.forEach((button) => {
        scorllId(document.getElementById(button.id))
      });

})

function scorllId (id) {
  id.addEventListener("click", (e)=>{
    e.preventDefault();
    const targetId = id.getAttribute("href");
    const targetElement = document.querySelector(targetId);
    const targetPosition = targetElement.getBoundingClientRect()

    const offsetPosition = targetPosition.top + window.pageYOffset - 200;
  
    window.scrollTo({
         top: offsetPosition,
         behavior: "smooth"
    });
  });
}

openAPI = ()=>{
    $('#inputAPI').removeClass("visually-hidden");
    $('#inputManual').addClass("visually-hidden");
    $('#btn-minputManual').removeClass("active");
    $('#btn-minputAPI').addClass("active");
}

openManual = ()=>{
    $('#inputAPI').addClass("visually-hidden");
    $('#inputManual').removeClass("visually-hidden");
    $('#btn-minputManual').addClass("active");
    $('#btn-minputAPI').removeClass("active");
}

openregister = ()=>{
    $('#regform').toggleClass("visually-hidden");
    $('#add-regform').toggleClass("visually-hidden");
    $('#add-logform').addClass("visually-hidden");
    $('#title-login').addClass("visually-hidden");
}
  
openlogin = () =>{
    $('#regform').addClass("visually-hidden");
    $('#add-regform').addClass("visually-hidden");
    $('#add-logform').toggleClass("visually-hidden");
    $('#title-login').toggleClass("visually-hidden");
}

const navMobHome = $('#btnHomeMob');
const navMobFitur = $('#btnFiturMob');
const navMobForum = $('#btnForumMob');
const navMobKontak = $('#btnKontakMob');
const navMobLogin = $('#btnLoginMob');

navMobHome.on('click', () => {
    navMobHome.addClass('active');
    navMobFitur.removeClass('active');
    navMobForum.removeClass('active');
    navMobKontak.removeClass('active');
    navMobLogin.removeClass('active');
})

navMobFitur.on('click', () => {
  navMobHome.removeClass('active');
  navMobFitur.addClass('active');
  navMobForum.removeClass('active');
  navMobKontak.removeClass('active');
  navMobLogin.removeClass('active');
})

navMobForum.on('click', () => {
  navMobHome.removeClass('active');
  navMobFitur.removeClass('active');
  navMobForum.addClass('active');
  navMobKontak.removeClass('active');
  navMobLogin.removeClass('active');
})

navMobKontak.on('click', () => {
  navMobHome.removeClass('active');
  navMobFitur.removeClass('active');
  navMobForum.removeClass('active');
  navMobKontak.addClass('active');
  navMobLogin.removeClass('active');
})

navMobLogin.on('click', () => {
  navMobHome.removeClass('active');
  navMobFitur.removeClass('active');
  navMobForum.removeClass('active');
  navMobKontak.removeClass('active');
  navMobLogin.addClass('active');
})

window.addEventListener('scroll', () => {
  var windowHeight = window.innerHeight;
  var homeTarget = document.getElementById('home');
  var homePosition = homeTarget.getBoundingClientRect();
  if (homePosition.top <= windowHeight) {
    navMobHome.addClass('active');
    navMobFitur.removeClass('active');
    navMobForum.removeClass('active');
    navMobKontak.removeClass('active');
    navMobLogin.removeClass('active');
  } else {
    navMobHome.removeClass('active');
  }

  var fiturTarget = document.getElementById('features');
  var fiturPosition = fiturTarget.getBoundingClientRect();
  if (fiturPosition.top <= windowHeight) {
    navMobHome.removeClass('active');
    navMobFitur.addClass('active');
    navMobForum.removeClass('active');
    navMobKontak.removeClass('active');
    navMobLogin.removeClass('active');
  } else {
    navMobFitur.removeClass('active');
  }

  var forumTarget = document.getElementById('forum');
  var forumPosition = forumTarget.getBoundingClientRect();
  if (forumPosition.top <= windowHeight) {
    navMobHome.removeClass('active');
    navMobFitur.removeClass('active');
    navMobForum.addClass('active');
    navMobKontak.removeClass('active');
    navMobLogin.removeClass('active');
  } else {
    navMobForum.removeClass('active');
  }

  var kontakTarget = document.getElementById('contact');
  var kontakPosition = kontakTarget.getBoundingClientRect();
  if (kontakPosition.top <= windowHeight) {
    navMobHome.removeClass('active');
    navMobFitur.removeClass('active');
    navMobForum.removeClass('active');
    navMobKontak.addClass('active');
    navMobLogin.removeClass('active');
  } else {
    navMobKontak.removeClass('active');
  }

});