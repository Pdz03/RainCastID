let editor;
$(window).on("load", function () {
  getnavbar();
$('#loginModal').html(loginModal());
showHidePass();
showhidePass2();
  $.ajax({
      type: "GET",
      url: "/auth_login",
      data: {},
      success: function (response) {
        $("#loading").fadeOut(500);
        if (response.result == ['success']){
          if (response.data['fullname']=='' ||
          response.data['profile_info']['location']=='' ||
          response.data['profile_info']['birth']=='' || 
          response.data['profile_info']['bio']==''){
            $('#profile-warn').html('<i class="bi bi-exclamation-square-fill text-danger"></i>&nbsp;&nbsp;Mohon lengkapi beberapa detail profil!')
          }

          if(!response.data['emailconfirm']){
            console.log('WOEYYYY')
            OTP_alert(response.data['username'], response.data['email'])
          }
        }
      },
  });

  $('#phone').on('input change', function() {
    if($(this).val() != '') {
        $('#wa-enable').removeAttr('disabled');
    } else {
        $('#wa-enable').attr({'disabled':''});
    }
  if($('#phone').val()!=''){
    $('#wa-enable').removeAttr('disabled');
  }
});

ClassicEditor
.create( document.querySelector( '#bio' ) )
.then((newEditor) => {
editor = newEditor;

console.log('Editor was initialized successfully:', newEditor);
})
.catch( error => {
    console.error( error );
});

new QRCode("qr-profile", window.location.href);
          
let profile_temp = `<h4 class="text-center my-2">@${username}<h4>`
$('#qr-profile').append(profile_temp);

$('#urlLink').val(window.location.href);

});

const togglePasswordOld = document.querySelector("#togglePasswordOld");
const passwordOld = document.querySelector("#old-password");

togglePasswordOld.addEventListener("click", function () {
// toggle the type attribute
const type = passwordOld.getAttribute("type") === "password" ? "text" : "password";
passwordOld.setAttribute("type", type);

// toggle the icon
this.classList.toggle("bi-eye");
});

const togglePasswordNew = document.querySelector("#togglePasswordNew");
const passwordNew = document.querySelector("#new-password");

togglePasswordNew.addEventListener("click", function () {
// toggle the type attribute
const type = passwordNew.getAttribute("type") === "password" ? "text" : "password";
passwordNew.setAttribute("type", type);

// toggle the icon
this.classList.toggle("bi-eye");
});

const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#password");

togglePassword.addEventListener("click", function () {
// toggle the type attribute
const type = password.getAttribute("type") === "password" ? "text" : "password";
password.setAttribute("type", type);

// toggle the icon
this.classList.toggle("bi-eye");
});


function check_loc(){
  if (navigator.geolocation) {
    //jika navigator tersedia
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    //jika navigator tidak tersedia
    console.log("Geolocation is not supported by this device");
  }
  
   async function showPosition  (position) {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    let APILoc = await CuacaSource.cuacaLokasiTerkini(lat, long);
    let id = APILoc.city.id;
    let name = APILoc.city.name;
    let country = APILoc.city.country;
    $('#loc-id').val(id);
    $('#location').val(`${name}, ${country}`);
  }
  
    //jika location disabled atau not allowed
    function showError(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.log("User denied the request for Geolocation.");
          break;
        case error.POSITION_UNAVAILABLE:
          console.log("Location information is unavailable.");
          break;
        case error.TIMEOUT:
          console.log("The request to get user location timed out.");
          break;
        case error.UNKNOWN_ERROR:
          console.log("An unknown error occurred.");
          break;
    }
  }
}


function is_phone(asValue) {
  var regExp = /^(^\+62|62)(\d{3,4}-?)/;
  return regExp.test(asValue);
}

function is_password(asValue) {
    var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
    return regExp.test(asValue);
}

function update_profile(){
  let inputFullname = $('#fullname');
  let inputPhone = $('#phone');
  let inputWA = $('#wa-enable')[0].checked;
  let inputLocation = $('#location');
  let inputBirth = $('#birth');
  
  let fullname = inputFullname.val();
  let phone = inputPhone.val();
  let wa = ''
  let locId = $('#loc-id').val();
  let location = inputLocation.val();
  let birth = inputBirth.val();
  let bio = editor.getData();
  let file = $("#image-profile")[0].files[0];

  let helpFullname = $('#help-fullname');
  let helpPhone = $('#help-phone');
  let helpLocation = $('#help-location');
  let helpBio = $('#help-bio');
  let helpBirth = $('#help-birth');

  if (fullname === "") {
    $('#fg-fullname')
    .removeClass('mb-3')
    .addClass('mb-1')
    helpFullname
      .text("Mohon masukkan nama lengkap anda!")
      .removeClass("text-dark")
      .addClass("text-danger");
    inputFullname.focus();
    return;
  }else{
    $('#fg-fullname')
    .addClass('mb-3')
    .removeClass('mb-1');
    helpFullname.text('');
  }

  if(phone === ""){
    helpPhone.text('');
  }else if(!is_phone(phone)){
    $('#fg-phone')
    .removeClass('mb-3')
    .addClass('mb-1')
    helpPhone
      .text("Masukkan nomor telepon antara 11-13 digit dan diawali dengan 62!")
      .removeClass("text-dark")
      .addClass("text-danger");
    inputPhone.focus();
    return;
  }else{
    $('#fg-phone')
    .addClass('mb-3')
    .removeClass('mb-1');
    helpPhone.text('');
  }

  if(location==="" && locId === ""){
    $('#fg-location')
    .removeClass('mb-3')
    .addClass('mb-1')
    helpLocation
      .text("Mohon masukkan lokasi dengan fitur deteksi lokasi!")
      .removeClass("text-dark")
      .addClass("text-danger");
    inputLocation.focus();
    return;
  }else{
    $('#fg-location')
    .addClass('mb-3')
    .removeClass('mb-1')
    helpLocation.text('')
  }

  if (bio === "") {
    $('#fg-bio')
    .removeClass('mb-3')
    .addClass('mb-1')
    helpBio
      .text("Mohon masukkan bio profil anda!")
      .removeClass("text-dark")
      .addClass("text-danger");
    editor.focus();
    return;
  }else{
    $('#fg-bio')
    .addClass('mb-3')
    .removeClass('mb-1')
    helpBio.text('');
  }

  if (birth === "") {
    $('#fg-bio')
    .removeClass('mb-3')
    .addClass('mb-1');
    helpBirth
      .text("Mohon masukkan tanggal lahir anda!")
      .removeClass("text-dark")
      .addClass("text-danger");
    inputBirth.focus();
    return;
  }else{
    $('#fg-bio')
    .addClass('mb-3')
    .removeClass('mb-1');
    helpBirth.text('');
  }

  let form_data = new FormData();
  if (file){
    form_data.append("file_give", file);
  }
    form_data.append("fullname_give", fullname);
  if (phone){ 
    if (inputWA){
      wa = 1;
    }else{
      wa = 0;
    }
    console.log(wa);
    form_data.append("phone_give", phone);
    form_data.append("wa-enable_give", wa);
  }
    form_data.append("loc_give", locId);
    form_data.append("locname_give", location);
  if (birth){
    form_data.append("birth_give", birth);
  }
    form_data.append("bio_give", bio);
    
  $.ajax({
    type: "POST",
    url: "/update_profile",
    data: form_data,
    cache: false,
    contentType: false,
    processData: false,
    success: function (response) {
      if(response['result'] ==='success'){
        Swal.fire({
          title: "Sukses",
          text: "Update profil berhasil!",
          icon: "success",
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload();
            }
        });    
      }else{
        Swal.fire({
          title: "Gagal",
          text: "Update profil gagal!",
          icon: "error",
        }) 
      }
    },
  });
}

function resetPass(username, password){
  let passOldInput = $('#old-password');
  let passNewInput = $('#new-password');

  let passOld = sha256(passOldInput.val());
  let passNew = passNewInput.val();
  let hashpassNew = sha256(passNew);

  if (passOld !== password){
    alert('Password lama tidak sesuai! Mohon periksa kembali!')
    passOldInput.val("");
    passOldInput.focus();
  }else if(passNew == ''){
    alert('Mohon masukkan password baru!')
    passNewInput.val("");
    passNewInput.focus();
  }else if(!is_password(passNew)){
    alert('Mohon sesuaikan format password seperti sebelumnya!')
    passNewInput.val("");
    passNewInput.focus();
  }else if(hashpassNew == passOld){
    alert('Mohon masukkan password yang berbeda dengan password lama anda!')
    passNewInput.val("");
    passNewInput.focus();
  }else{
    $.ajax({
      type: "POST",
      url: "/reset_pass",
      data: {
        username_give: username,
        passnew_give: hashpassNew
      },
      success: function (response) {
        if(response['result'] ==='success'){
          Swal.fire({
            title: "Sukses",
            text: "Update password berhasil!",
            icon: "success",
          }).then((result) => {
              if (result.isConfirmed) {
                  window.location.reload();
              }
          });    
        }
      },
    });  
  }
}

function check_pass(password){
  let passInput = $('#password');
  let pass = passInput.val();
  let hashpass = sha256(passInput.val());
  if(pass == ''){
    alert('Mohon masukkan password!')
    passInput.val("");
    passInput.focus();
  }else if(hashpass != password){
    alert('Password yang anda masukkan salah!')
    passInput.val("");
    passInput.focus();
  }else{
    $("#modalResetEmail").modal("hide");
    $("#modalResetEmail2").modal("show");
  }
}

async function resetEmail(username, email){
  let emailNewInput = $('#new-email');

  let emailNew = emailNewInput.val();

  console.log(emailNewInput)

  if(emailNew == ''){
    alert('Mohon masukkan email baru!')
    emailNewInput.val("");
    emailNewInput.focus();
    return;
  }else if(!is_email(emailNew)){
    alert('Mohon sesuaikan format email seperti sebelumnya!')
    emailNewInput.val("");
    emailNewInput.focus();
    return;
  }else if(emailNew == email){
    alert('Mohon masukkan email yang berbeda dengan email lama anda!')
    emailNewInput.val("");
    emailNewInput.focus();
    return;
  }else if (await check_dup_email(emailNew)) {
    alert('Email sudah terdaftar, gunakan email lain!')
    emailNewInput.val("");
    emailNewInput.focus();
    return;
  }else{
    $.ajax({
      type: "POST",
      url: "/reset_email",
      data: {
        newemail_give: emailNew,
        username_give: username
      },
      success: function (response) {
        if(response['result'] ==='success'){
          Swal.fire({
            title: "Sukses",
            text: "Update email berhasil!",
            icon: "success",
          }).then((result) => {
              if (result.isConfirmed) {
                  window.location.reload();
              }
          });    
        }
      },
    });  
  }
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

function is_email(asValue) {
  var regExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return regExp.test(asValue);
}

function copyURL(){
  const URL = document.getElementById('urlLink');

  URL.select();
  URL.setSelectionRange(0, 99999);

  navigator.clipboard.writeText(URL.value);
  alert("URL Tersalin");
}