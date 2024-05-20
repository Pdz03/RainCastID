document.addEventListener('DOMContentLoaded', () => {
   
      // const buttons = [
      //   {
      //     id: 'scrollDown',
      //   },
      //   {
      //     id: 'btnFitur',
      //   },
      //   {
      //     id: 'btnForum',
      //   },
      //   {
      //     id: 'btnKontak',
      //   },
      //   {
      //     id: 'btnFiturMob',
      //   },
      //   {
      //     id: 'btnForumMob',
      //   },
      //   {
      //     id: 'btnKontakMob',
      //   },
      // ];
      
      // buttons.forEach((button) => {
      //   scorllId(document.getElementById(button.id))
      // });
      
})

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

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
            Swal.fire({
              title: "Selamat Datang di RainCast ID",
              text: "Anda masuk sebagai "+response.data['username'],
              icon: "success",
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/dashboard'
                }
            });    
          }else{
            $('#loginModal').html(loginModal());
            showHidePass();
            showhidePass2();
          
            if (urlParams.has('email') || urlParams.has('login')){
              $("#loginModal").modal("show");
              $('#form-email').val(urlParams.get('email'));
            }else  if (urlParams.has('login')){
              $("#loginModal").modal("show");
            }
          }
      },
  });

  (async () => {
    try {
      db = await openDb();
      store = getSavedLoc();
      // ... (use database and functions)
    } catch (error) {
      console.error("Error opening database:", error);
    } finally {
      var req;

  req = store.openCursor();
  req.onsuccess = function(evt) {
    var cursor = evt.target.result;
    const savedLoc = document.getElementById('saved-loc');
    if (cursor) {
      req = store.get(cursor.key);
      req.onsuccess = function (evt) {
        var value = evt.target.result;
        savedLoc.innerHTML = `<p>Lokasi Tersimpan: <b>${value.name}, ${value.country}</b></p>
        <button class="btn btn-danger" onclick="confirmDelete()">Hapus Lokasi</button>`;
        $('#btnPredictAPI').removeClass('disabled');
      }
    } else {
      console.log("No more entries");
      savedLoc.innerHTML = `<p>Lokasi Tersimpan: <b>(Belum ada lokasi tersimpan)</b></p>`
      $('#btnPredictAPI').addClass('disabled');
    }
  };
  req.onerror = function() {
    console.error("Terdapat Error", this.error);
    window.location.reload();
  };
      // Optional: Handle cleanup tasks here
    }
  })();
  // store = getSavedLoc();
});

function eventSaveLoc(){
  let id = locationData.id;
  let lat = locationData.lat;
  let long = locationData.long;
  let name = locationData.name;
  let country = locationData.country;

  saveLocation(id, lat, long, name, country)
}

function saveLocation(id, lat, long, name, country){
    var obj = { id: id, lat: lat, long: long, name: name, country: country };

    var store = getObjectStore(DB_STORE_NAME, 'readwrite');
    var req;

    req = store.openCursor();
    req.onsuccess = function(evt) {
      var cursor = evt.target.result;
      if (cursor) {
        req = store.get(cursor.key);
        req.onsuccess = function (evt) {
          var value = evt.target.result;
          if (value.id !== obj.id){
            Swal.fire({
              title: "Apakah anda yakin?",
              text: "Anda akan mengganti lokasi yang sebelumnya tersimpan",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Ganti lokasi"
            }).then((result) => {
              if (result.isConfirmed) {
                deleteLocation();
                try {
                  var store = getObjectStore(DB_STORE_NAME, 'readwrite');
                  req = store.add(obj);
                } catch (e) {
                  if (e.name == 'DataCloneError')
                    displayActionFailure("This engine doesn't know how to clone a Data");
                  throw e;
                }
                req.onsuccess = function (evt) {
                  console.log("Lokasi Tersimpan");
                  displayActionSuccess("Lokasi Tersimpan");
                };
                req.onerror = function() {
                  console.error("Terdapat Error", this.error);
                  displayActionFailure(this.error);
                };
                Swal.fire({
                  title: "Tersimpan",
                  text: "Lokasi baru telah tersimpan",
                  icon: "success"
                })
              }
            });
          }else{
            alert('LOKASI SAMA!')
          }
        }
      } else {
        Swal.fire({
          title: "Apakah anda yakin?",
          text: "Anda menyimpan lokasi ini",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Simpan"
        }).then((result) => {
          if (result.isConfirmed) {
            try {
              var store = getObjectStore(DB_STORE_NAME, 'readwrite');
              req = store.add(obj);
            } catch (e) {
              if (e.name == 'DataCloneError')
                displayActionFailure("This engine doesn't know how to clone a Data");
              throw e;
            }
            req.onsuccess = function (evt) {
              console.log("Lokasi Tersimpan");
              displayActionSuccess("Lokasi Tersimpan");
            };
            req.onerror = function() {
              console.error("Terdapat Error", this.error);
              displayActionFailure(this.error);
            };
            Swal.fire({
              title: "Tersimpan",
              text: "Lokasi baru telah tersimpan",
              icon: "success"
            })
          }
        });
      }
    };
}


function confirmDelete(){
  Swal.fire({
    title: "Apakah anda yakin?",
    text: "Anda akan menghapus lokasi yang sudah tersimpan",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Hapus"
  }).then((result) => {
    if (result.isConfirmed) {
      deleteLocation();
      Swal.fire({
        title: "Terhapus",
        text: "Lokasi berhasil terhapus",
        icon: "success"
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
          }
        });
    }
  });
}

function deleteLocation(store) {
  console.log("deleteLocation:", arguments);

  if (typeof store == 'undefined')
    store = getObjectStore(DB_STORE_NAME, 'readwrite');

  var req = store.openCursor();
  req.onsuccess = function(evt) {
    var record = evt.target.result;

    var deleteReq = store.delete(record.key);
    deleteReq.onsuccess = function(evt) {
      console.log("evt.target.result:", evt.target.result);
      console.log("Lokasi Terhapus");
      displayActionSuccess("Lokasi Terhapus");
    };
    deleteReq.onerror = function (evt) {
      console.error("Terdapat Error:", evt.target.errorCode);
    };
  };
  req.onerror = function (evt) {
    console.error("Terdapat Error:", evt.target.errorCode);
  };
}

function displayActionSuccess(msg) {
  msg = typeof msg != 'undefined' ? "Success: " + msg : "Success";
  $('#msg').html('<span class="action-success">' + msg + '</span>');
}
function displayActionFailure(msg) {
  msg = typeof msg != 'undefined' ? "Failure: " + msg : "Failure";
  $('#msg').html('<span class="action-failure">' + msg + '</span>');
}


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