const PUBLIC_KEY = '4gmVU1iXwFh4O74lw';
const serviceID = 'service_jreacuj';
const templateID = 'template_hs1ug4t';

$(window).on("load", function () {
emailjs.init(PUBLIC_KEY);
})

function OTP_alert(username, email){
    var store = getObjectStore(DB_STORE_NAME2, 'readwrite');
    var req;

    req = store.openCursor();
    req.onsuccess = function(evt) {
      let OTP = '';
      var cursor = evt.target.result;
      if (cursor) {
        req = store.get(cursor.key);
        req.onsuccess = function (evt) {
          var value = evt.target.result;
          OTP = value.otp;
          alertConfirmEmail(OTP, username);
        }
      }else{
        OTP = generate_OTP();
        let hashOTP = sha256(`${OTP}`);
        console.log(hashOTP);
        console.log(OTP);
        let templateParameter = {
          to_email: email,
          to_name: username,
          OTP: OTP,
          reply_to: email
        }
        eventSaveEmail(email, hashOTP);
        // emailjs.send(serviceID, templateID, templateParameter)

        alertConfirmEmail(hashOTP, username);
      }
    }
}

function alertConfirmEmail (OTP, username){
    Swal.fire({
      allowOutsideClick: false,
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
          let hashlogin = sha256(`${login}`);
            if (hashlogin != OTP) {
                return Swal.showValidationMessage('OTP tidak sesuai, periksa ulang email anda atau kirim ulang OTP');
            }
            return login;
        } catch (error) {
          Swal.showValidationMessage(`
            Request failed: ${error}
            `);
         }
        },
        allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          type: "POST",
          url: "/confirm_email",
          data: {
            username_give: username
          },
          success: function (response) {
            if (response.result == ['success']){
              Swal.fire({
                title: "Berhasil",
                text: "Konfirmasi email anda berhasil!",
                icon: "success",
              }).then((result) => {
                  if (result.isConfirmed) {
                      eventDeleteEmail();
                      window.location.href = '/dashboard';
                  }
              });  
            }
          }
        })
  
      } else if(result.isDismissed){
        $.removeCookie("mytoken", { path: "/" });
      }
    }); 
  }
  
  function getSavedEmail (store) {
    if (typeof store == 'undefined')
      store = getObjectStore(DB_STORE_NAME2, 'readonly');
    return store;
  }
  
  function eventSaveEmail (email, otp){
    let obj = {email: email, otp:otp};
    var req;
  
    try {
      var store = getObjectStore(DB_STORE_NAME2, 'readwrite');
      req = store.add(obj);
    } catch (e) {
      if (e.name == 'DataCloneError')
        console.log("This engine doesn't know how to clone a Data");
      throw e;
    }
    req.onsuccess = function (evt) {
      console.log("OTP Terkirim");
    };
    req.onerror = function() {
      console.error("Terdapat Error", this.error);
    };
  }
  
  function eventDeleteEmail(store) {
    if (typeof store == 'undefined')
      store = getObjectStore(DB_STORE_NAME2, 'readwrite');
  
    var req = store.openCursor();
    req.onsuccess = function(evt) {
      var record = evt.target.result;
  
      var deleteReq = store.delete(record.key);
      deleteReq.onsuccess = function(evt) {
        console.log("evt.target.result:", evt.target.result);
        console.log("Data Terhapus");
      };
      deleteReq.onerror = function (evt) {
        console.error("Terdapat Error:", evt.target.errorCode);
      };
    };
    req.onerror = function (evt) {
      console.error("Terdapat Error:", evt.target.errorCode);
    };
  }
  
  function generate_OTP(){
    return Math.floor(100000 + Math.random() * 900000);
  }
  