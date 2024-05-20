let editor;
$(window).on("load", function () {
    getnavbar();
$('#loginModal').html(loginModal());
showHidePass();
showhidePass2();
    $("#loading").fadeOut(500);

    ClassicEditor
    .create( document.querySelector( '#deskripsi' ) )
    .then((newEditor) => {
    editor = newEditor;

    console.log('Editor was initialized successfully:', newEditor);
    })
    .catch( error => {
        console.error( error );
    });

    $('#forum-list').html(skeletonForumCard(3))
    get_posts();

    $('#image').on('change',(event) => {
        let image = document.getElementById('output');
        image.src = URL.createObjectURL(event.target.files[0]);
    })

    $.ajax({
        type: "GET",
        url: "/auth_login",
        data: {},
        success: function (response) {
          if (response.result == ['success']){
            $('#location').val(response.data['profile_info']['location_name'])
            $('#btn-add').removeClass('visually-hidden');
          }else{
            $('#btn-add').addClass('visually-hidden');
          }
        }
    })
    } 
)

function loc_current(){
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
        let name = APILoc.city.name;
        let country = APILoc.city.country;
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

function share(){
    let inputLokasi = $('#location');

    let lokasi = inputLokasi.val();
    let deskripsi = editor.getData();
    let file = $("#image")[0].files[0];

    if (!file) {
        alert("Mohon upload gambar!")
        return;
    } else if (deskripsi === "") {
        alert("Mohon masukkan deskripsi!")
        editor.focus();
        return;
    } else if (lokasi === "") {
        alert("Mohon masukkan lokasi!")
        inputLokasi.focus();
        return;
    } else {

      let today = new Date().toISOString()

      let form_data = new FormData();
      form_data.append("file_give", file);
      form_data.append("lokasi_give", lokasi);
      form_data.append("deskripsi_give", deskripsi);
      form_data.append("date_give", today);

      $.ajax({
          type: "POST",
          url: "/post_forum",
          data: form_data,
          cache: false,
          contentType: false,
          processData: false,
          success: function (response) {
            if(response['result'] ==='success'){
                Swal.fire({
                  title: "Sukses",
                  text: "Postingan berhasil diupload!",
                  icon: "success",
                }) 
              }else{
                Swal.fire({
                  title: "Gagal",
                  text: "Upload gagal!",
                  icon: "error",
                }) 
              }
        },
      });
    }
};

function get_posts(){
    $.ajax({
        type: "GET",
        url: "/list_forum",
        data: {},
        success: async function (response) {
            console.log(response['posts']);
            if (response["result"] == "success") {
                $('#forum-list').empty();
                let postlist = response['posts'];
                for(let i=0; i<postlist.length; i++){
                let post = postlist[i];
                let time_post = new Date(post["date"]);
                let time_before = time2str(time_post);
                let heart = 'bi-heart-fill';
                if(post['heart_by_me']){
                  heart = 'bi-heart-fill text-danger'
                }

                let responseLogin = await axios.get('/auth_login');
                let authLogin = await responseLogin.data;
                let hidden = '';
                if (!authLogin){
                  hidden = 'visually-hidden';
                }
                let temp_post = `
                <div class="card mb-4">
              <img
                src="static/assets/${post['image']}"
                class="card-img-top"
                height="300px"
                alt="..."
              />
              <div class="card-body">
                <div class="meta-top">
                  <div class="row px-3">
                    <div class="col d-flex align-items-center">
                      <img
                        src="/static/assets/profile_pics/profile_icon.png"
                        class="rounded-circle"
                        alt="..."
                        style="width: 32px"
                      />
                      &nbsp;<a
                        href="/user/${post['username']}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="fs-5 text-decoration-none text-black"
                        >@${post['username']}</a
                      >
                    </div>
                  </div>
                  <hr />
                  <div class="d-flex justify-content-between px-3">
                    <div class="time-loc d-flex">
                      <div>
                        <i class="bi bi-clock"></i>&nbsp;<span>${time_before}</span>
                      </div>
                      <div class="mx-2">
                        <i class="bi bi-geo-alt"></i>&nbsp;<span>${post['lokasi']}</span>
                      </div>
                    </div>
                    <div class="like-comment d-flex">
                      <div class="d-flex">
                        <span class="like-num" id="likenum-${i}">${post['count_heart']}</span>
                        &nbsp;&nbsp;
                        <a
                          aria-label="heart-${i}"
                          onclick="toggle_like('${post['postid']}', 'heart', ${i})"
                          style="cursor: pointer"
                        >
                          <i class="bi ${heart} fs-4" id="like-${i}"></i>
                        </a>
                      </div>
                      <div class="d-flex ms-2">
                        <span class="comment-num">${post['count_comment']}</span>
                        &nbsp;&nbsp;<i class="bi bi-chat-left-text-fill fs-4"></i>
                      </div>
                    </div>
                  </div>
                  <div class="card-text deskripsi px-3 text-dark mb-2" id="forum-deskripsi-${i}">
                    ${post['deskripsi'].slice(0, 150)} ...
                    <span class="text-secondary" id="btn-more-${i}" style="cursor: pointer">Lihat Selengkapnya</span>
                  </div>
                  <div class="card-text comment mx-3">
                    <a href="/forum/${post['postid']}" class="text-decoration-none text-secondary">
                      Lihat Semua Komentar
                    </a>
                    <div class="input-group ${hidden}">
                      <input
                        type="text"
                        id="inputKomen-${i}"
                        class="form-control"
                        placeholder="Berikan komentar ..."
                        aria-describedby="basic-addon2"
                      />
                      <button class="btn btn-success" onclick="sendKomen('${post['postid']}','${i}')">
                        <i class="bi bi-send-fill text-white"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
                `
                $('#forum-list').append(temp_post);
                $(`#btn-more-${i}`).on('click', () =>{
                    $(`#forum-deskripsi-${i}`).empty()
                    .html(post['deskripsi'])
                })
                }
            }
          }
    })
}

function time2str(date) {
    let today = new Date();
    let time = (today - date) / 1000 / 60; // minutes
    let timeH = time / 60;
    let timeD = timeH / 24;
  
    if (time < 5) {
      return "Just now";
    }
    if (time < 60) {
      return parseInt(time) + " minutes ago";
    } else if (timeH < 2) {
      return "1 hour ago";
    } else if (timeH < 24) {
      return parseInt(timeH) + " hours ago";
    } else if (timeD < 2) { 
      return "1 day ago";
    } else if (timeD < 7) {
      return parseInt(timeD) + " days ago";
    }
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
}

function sendKomen(post_id, row){
    let inputKomen = $(`#inputKomen-${row}`);
  
    let komen = inputKomen.val();
    console.log(komen);
  
    if (komen === "") {
      alert("Mohon isikan komentar!")
      inputKomen.focus();
      return;
    } else {
    let today = new Date().toISOString();
    $.ajax({
      type: "POST",
      url: "/add_comment",
      data: {
        post_id_give: post_id,
        comment_give: komen,
        date_give: today,
      },
      success: function (response) {
        if (response["result"] === "success") {
          alert(response["msg"]);
          window.location.reload();
        }
      },
    });
    }
  }
  
