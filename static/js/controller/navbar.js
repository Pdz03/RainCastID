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
})

function getnavbar(){
  $.ajax({
    type: "GET",
    url: "/auth_login",
    data: {},
    success: function (response) {
        let temp_navbar = ''
        if (response.result == ['success']){
            let warning = ''
            if (response.data['level'==2]){
            if (response.data['fullname']=='' ||
            response.data['profile_info']['location']=='' || 
            response.data['profile_info']['bio']=='' ||
            response.data['profile_info']['birth']==''){
              warning = '<i class="bi bi-exclamation-square-fill text-danger"></i>'
            }
          }
            temp_navbar = `
            <li class="nav-item">
            <a href="/dashboard" class="nav-link nav-top fw-bold text-white fs-5"
              >Dashboard</a
            >
          </li>
          <li class="nav-item">
            <a
              href="/forum"
              class="nav-link nav-top fw-bold text-white fs-5"
              >Forum</a
            >
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link nav-top dropdown-toggle fw-bold text-white fs-5"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
            <img src="/static/assets/${response.data['profile_pic_real']}" alt="avatar"
            class="rounded-circle img-fluid" style="width: 25px;">
            ${response.data['username']}&nbsp;&nbsp;${warning}
            </a>
            <ul class="dropdown-menu">
              <li>
                <a class="dropdown-item fw-bold" href="/user/${response.data['username']}"
                  >Profil&nbsp;&nbsp;${warning}</a>
              </li>
              <li>
                <a class="dropdown-item fw-bold" href="#" onclick="logout()"
                  >Keluar</a
                >
              </li>
            </ul>
          </li>
            `;
        }else{
          temp_navbar = `
          <li class="nav-item">
          <a href="/" class="nav-link nav-top fw-bold text-white fs-5"
            >Beranda</a
          >
        </li>
        <li class="nav-item">
          <a href="#features" id="btnFitur" class="nav-link nav-top fw-bold text-white fs-5">Fitur</a>
        </li>
        <li class="nav-item">
          <a href="/forum" id="btnForum" class="nav-link nav-top fw-bold text-white fs-5">Forum</a>
        </li>
        <li class="nav-item">
          <a href="" data-bs-toggle="modal" data-bs-target="#loginModal" class="nav-link nav-top fw-bold text-white fs-5"
            ><i class="bi bi-person-circle align-middle"></i
            >&nbsp;&nbsp;Masuk/Daftar</a
          >
        </li>`
        }
        $('#nav-pc').html(temp_navbar);
    }
})
}

function logout() {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Anda akan logout dari akun anda",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, logout!"
    }).then((result) => {
      if (result.isConfirmed) {
        $.removeCookie("mytoken", { path: "/" });
        Swal.fire({
            title: "Berhasil!",
            text: "Anda sudah logout dari akun anda!",
            icon: "success"
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                        window.location.href = "/?login";
                  }
            })
      }
    });
  
  }