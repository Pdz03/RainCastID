$(window).on("load", function () {
  getnavbar();
  $('#cuacaModal').html(predictModal());
  
    $.ajax({
        type: "GET",
        url: "/auth_login",
        data: {},
        success: function (response) {
          $("#loading").fadeOut(500);
            if (response.result == ['success']){
              console.log(response.data);
              $('#savedLocMember').text(response.data['profile_info']['location_name'])

              let locMember = response.data['profile_info']['location_id'];
              if (locMember == ""){
                let helpLoc = document.getElementById('helpLoc');
                $('#savedLocMember').text('Lokasi tidak tersimpan')
                $('#btn-predictToday').addClass('disabled');
                $('#btn-predict3Day').addClass('disabled');
                helpLoc.innerHTML = `
                Simpan lokasi anda melalui <a class="text-decoration-none" href='/user/${response.data['username']}'>Profil Pengguna<a/>
                `
              }else{
                $('#btn-predictToday').removeClass('disabled');
                $('#btn-predict3Day').removeClass('disabled');
              }

              $('.username').text(response.data['username']);
                if(!response.data['emailconfirm']){
                  OTP_alert(response.data['username'], response.data['email'])
                }

            } else if (response.result == ['fail']){
                Swal.fire({
                    title: response.msg,
                    text: "Sebelum masuk ke dashboard, silakan masuk menggunakan akun anda atau membuat akun baru",
                    icon: "error"
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                            window.location.href = "/?login";
                    }
                })
            }
        },
    });
    $('#form-fullname').on('input change', function() {
      if($(this).val() != '') {
          $('#btnSaveProf').removeClass('disabled');
      } else {
          $('#btnSaveProf').addClass('disabled');
      }
  });

  $("#notif-tele").on('change', function() {
    if ($(this).is(':checked')) {
        $(this).attr('value', 'true');
        alert($(this).val());
    }
    else {
       $(this).attr('value', 'false');
       alert($(this).val());
    }
});

});


