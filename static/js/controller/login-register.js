function is_password(asValue) {
    var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
    return regExp.test(asValue);
}

function is_email(asValue) {
    var regExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return regExp.test(asValue);
}

function openalert(){
  Swal.fire({
    title: "Konfirmasi Email",
    input: "text",
    inputAttributes: {
      autocapitalize: "off",
    },
    html: `
      <p>Periksa email anda dan masukkan kode OTP pada Kolom di Bawah</p>
    `,
    showCancelButton: true,
    confirmButtonText: "Konfirmasi",
    showLoaderOnConfirm: true,
    preConfirm: async (login) => {
      try {
        
        const authUrl = `
        /authEmail/${login}
`;
        const response = await axios.get(authUrl);
        const responseJson = await response.data.data;
        console.log(responseJson);
              if (!responseJson) {
                return Swal.showValidationMessage('OTP tidak sesuai, periksa ulang email anda atau kirim ulang OTP');
              }
        return responseJson;
      } catch (error) {
        Swal.showValidationMessage(`
  Request failed: ${error}
`);
      }
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Konfirmasi Berhasil",
        text: "Selamat! Anda sudah bisa menggunakan fitur-fitur di RainCast ID",
        icon: "success",
      });
      window.location.href = '/dashboard'
    }
  });
};

function login(){
    const btnLogin = document.getElementById('btn-login');
    let logintemp = ''
    let inputEmail = $('#form-email');
    let inputPassword = $('#form-password');

    let email = inputEmail.val();
    let password = inputPassword.val();

    let helpEmail = $('#help-email');
    let helpPassword = $('#help-password');

    if (email === "") {
      $('#fg-email')
      .removeClass('mb-3')
      .addClass('mb-1')
      helpEmail
        .text("Mohon masukkan email!")
        .removeClass("text-dark")
        .addClass("text-danger");
      inputEmail.focus();
      return;
    } else if (!is_email(email)) {
      $('#fg-email')
      .removeClass('mb-3')
      .addClass('mb-1')
      helpEmail
        .text(
          "Masukkan email dengan benar (example@example.com)"
        )
        .removeClass("text-dark")
        .addClass("taxt-danger");
      inputEmail.focus();
    }

    if (password === "") {
      helpPassword
        .text("Mohon masukkan password!")
        .removeClass("text-dark")
        .addClass("text-danger");
      inputPassword.focus();
      return;
    }

    let hashpassword = sha256(password);

    logintemp = `
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    <span class="sr-only">Loading...</span>
    `
    btnLogin.innerHTML = logintemp
    $.ajax({
      type: "POST",
      url: "/login",
      data: {
        email_give: email,
        password_give: hashpassword,
      },
      success: function (response) {
        if (response["result"] == "success") {

          if(response.data['level'] === 2){
            console.log(response.data);
            $.cookie("mytoken", response["token"], { path: "/" });
            Swal.fire({
              title: "Berhasil masuk",
              text: "Anda berhasil masuk! Selamat Datang di RainCast ID, " + response.data['username'] + "!",
              icon: "success"
            }).then((result) => {
              /* Read more about isConfirmed, isDenied below */
                  if (result.isConfirmed) {
                    getnavbar();
                    $('#loginModal').modal('hide');
                    window.location.reload();
                  }
            })
          }else if(response.data['level'] === 1){
            $.cookie("mytoken", response["token"], { path: "/" });
            Swal.fire({
              title: "Berhasil login",
              text: "Anda berhasil login!",
              icon: "success"
            }).then((result) => {
              /* Read more about isConfirmed, isDenied below */
                  if (result.isConfirmed) {
                    window.location.href = "admin/dashboard";
                    }
              })
          }
        // } else {
        //   Swal.fire({
        //     title: "Konfirmasi Email",
        //     showDenyButton: true,
        //     showCancelButton: false,
        //     confirmButtonText: "Kirim Ulang OTP",
        //     denyButtonText: "Tutup",
        //     html: `
        //     <h4 class="text-danger">Periksa Email Anda dan Masukkan OTP pada Kolom di Bawah</h4>
        //     <p>Alasan Pemblokiran: ${response.data['reasonblock']}<p>
        //     <small class="text-danger">Hubungi admin untuk informasi lebih lanjut dengan mengirim permintaan melalui tombol di bawah</small>
        //   `,
        //     icon: "error"
        //   }).then((result) => {
        //     /* Read more about isConfirmed, isDenied below */
        //     if (result.isConfirmed) {
        //       window.location.href = "/about?user="+response.data['userblock']+"&request=req#msgFormBox"
        //     } else if (result.isDenied) {
        //       Swal.DismissReason.cancel;
        //     }
        //   });
        //   resetform_login()
        // }
        } else {
          Swal.fire({
            title: "Gagal login",
            text: response["msg"],
            icon: "error"
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            logintemp = `Masuk`;
            btnLogin.innerHTML = logintemp
                if (result.isConfirmed) {
                 inputEmail.val("");
                 inputPassword.val("");
                  }
            })
          
        }

      },
    });

}

function resetform_login(){
    $('#form-email').val('');
    $('#form-password').val('');
}

async function check_dup_email(email){
  let response = await
    $.ajax({
      type: "POST",
      url: "/register/check_dup_email",
      data: {
        email_give: email,
      },
      success: function (response) {
      },
    });
  return response.exists;
}

async function check_dup_username(username){
  let response = await
    $.ajax({
      type: "POST",
      url: "/register/check_dup_username",
      data: {
        username_give: username,
      },
      success: function (response) {
      },
    });
  return response.exists;
}

async function register(){
    const btnRegister = document.getElementById('btn-register');
    let regtemp = ''

    let inputUsername = $('#form-username');
    let inputEmail = $('#form-email');
    let inputPassword = $('#form-password');
    let inputPassword2 = $('#form-password2');
    
    let username = inputUsername.val();
    let email = inputEmail.val();
    let password = inputPassword.val();
    let password2 = inputPassword2.val();

    let helpUsername = $('#help-username');
    let helpEmail = $('#help-email');
    let helpPassword = $('#help-password');
    let helpPassword2 = $('#help-password2');

    console.log(await check_dup_email(email));

    if (username === "") {
      $('#fg-username')
      .removeClass('mb-3')
      .addClass('mb-1')
      helpUsername
        .text("Mohon masukkan username!")
        .removeClass("text-dark")
        .addClass("text-danger");
      inputUsername.focus();
      return;
    } else if (await check_dup_username(username)) {
      $('#fg-username')
      .removeClass('mb-3')
      .addClass('mb-1')
      helpUsername
        .text("Username sudah terdaftar, gunakan username lain atau masuk menggunakan username tersebut!")
        .removeClass("text-dark")
        .addClass("text-danger");
      $('#form-username').val('');
      inputUsername.focus();
      return;
    } else {
      $('#fg-username')
      .removeClass('mb-3')
      .addClass('mb-1')
      helpUsername
        .text("Username dapat digunakan!")
        .removeClass("text-danger")
        .removeClass("text-dark")
        .addClass("text-success");
    }

    if (email === "") {
      $('#fg-email')
      .removeClass('mb-3')
      .addClass('mb-1')
      helpEmail
        .text("Mohon masukkan email!")
        .removeClass("text-dark")
        .addClass("text-danger");
      inputEmail.focus();
      return;
    } else if (!is_email(email)) {
      $('#fg-email')
      .removeClass('mb-3')
      .addClass('mb-1')
      helpEmail
        .text("Masukkan email dengan benar (example@example.com)")
        .removeClass("text-dark")
        .addClass("taxt-danger");
      $('#form-email').val('');
      inputEmail.focus();
      return;
    } else if (await check_dup_email(email)) {
      $('#fg-email')
      .removeClass('mb-3')
      .addClass('mb-1')
      helpEmail
        .text("Email sudah terdaftar, gunakan email lain atau masuk menggunakan email tersebut!")
        .removeClass("text-dark")
        .addClass("text-danger");
      $('#form-email').val('');
      inputEmail.focus();
      return;
    } else {
      $('#fg-email')
      .removeClass('mb-3')
      .addClass('mb-1')
      helpEmail
        .text("Email dapat digunakan!")
        .removeClass("text-danger")
        .removeClass("text-dark")
        .addClass("text-success");
    }

    if (password === "") {
        helpPassword
          .text("Mohon masukkan password!")
          .removeClass("text-dark")
          .addClass("text-danger");
        inputPassword.focus();
        return;
      } else if (!is_password(password)) {
        helpPassword
          .text(
            "Masukkan password dengan 8-10 karakter, angka, atau spesial karakter (!@#$%^&*)"
          )
          .removeClass("text-dark")
          .addClass("taxt-danger");
        inputPassword.focus();
      } else {
        helpPassword
          .text("Password dapat digunakan!")
          .removeClass("text-danger")
          .removeClass("text-dark")
          .addClass("text-success");
      }

    if (password2 === ""){
        $('#fg-password2')
        .removeClass('mb-3')
        .addClass('mb-1')
        helpPassword2
        .text(
          "Masukkan ulang password!"
        )
        .removeClass("text-dark")
        .addClass("taxt-danger");
      inputPassword2.focus();
      } else if (password2 !== password){
        $('#fg-password2')
        .removeClass('mb-3')
        .addClass('mb-1')
        helpPassword2
        .text(
          "Masukkan password yang sama dengan sebelumnya!"
        )
        .removeClass("text-dark")
        .addClass("taxt-danger");
      inputPassword2.focus();
    } else {
        helpPassword2
        .text("Password sesuai!")
        .removeClass("text-danger")
        .removeClass("text-dark")
        .addClass("text-success");

        let hashpassword = sha256(password);
        regtemp = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span class="sr-only">Loading...</span>
        `
        btnRegister.innerHTML = regtemp;
        $.ajax({
          type: "POST",
          url: "/register",
          data: {
            username_give: username,
            email_give: email,
            password_give: hashpassword,
          },
          success: function (response) {
            if(response.result=='success'){
            Swal.fire({
              title: "Berhasil daftar",
              text: "Akun anda telah terdaftar! Silakan login",
              icon: "success"
            });
            window.location.replace("?email="+response.data);
            }else{
              regtemp = 'Daftar'
              btnRegister.innerHTML = regtemp;
            }
          },
        });
    }
}

function resetform_register(){
    $('#form-username').val('');
    $('#form-email').val('');
    $('#form-password').val('');
    $('#form-password2').val('');
}