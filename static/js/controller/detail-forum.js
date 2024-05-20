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

    getcomment(postid);
}
)

function add_comment(post_id){
    let inputKomen = $('#comment-input');
  
    let komen = inputKomen.val();
  
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
  
async function getcomment(post_id){
    let responseAuth = await axios.get("/auth_login");
    let responseAuthJson = await responseAuth.data;
    let user = responseAuthJson.data;   

    let responseKomen = await axios.get("/getcomment/"+post_id);
    let responseKomenJson = await responseKomen.data;
    let komen_data = responseKomenJson.komen;
    for(let i=0; i<komen_data.length; i++){
        let komen = komen_data[i];
        let tempUser = ''
        if (user){
        if(komen.username == user.username){
            tempUser = `
            <div class="visually-hidden" id="form-editcom">
            <textarea id="comment-edit" class="form-control">
  ${komen.comment}</textarea
            >
  
            <a
              class=""
              onclick="edit_comment('${komen.commentid}')"
              style="cursor: pointer"
              >Update</a
            >|
            <a
              class=""
              onclick="cancelcom()"
              style="cursor: pointer"
              >Batal</a
            >
          </div>
          <div id="com-control">
            <a
              class=""
              onclick="editcomment()"
              style="cursor: pointer"
              >Edit</a
            >|
            <a
              href=""
              onclick="delete_comment('${komen.commentid}')"
              style="cursor: pointer"
              >Hapus</a
            >
          </div>`
        }
    }

        let template = `
        <div class="card border-0 border-bottom border-dark mt-2">
        <div class="d-flex flex-start">
          <img
            class="rounded-circle shadow-1-strong me-3"
            src="/static/assets/${komen.user.profile_pic_real}"
            alt=""
            width="40"
            height="40"
          />
          <div class="form-outline">
            <a
              href="/user/${komen.username}"
              target="_blank"
              rel="noopener noreferrer"
              ><strong>@${komen.username}</strong></a
            >
            <p class="text-justify">${komen.comment}</p>
            <span class="time-comment">${komen.timecom}</span>
            ${tempUser}
          </div>
          
      </div>
    </div>`
    $('#comments').append(template);
    }
  }

  function resetcomment(){
    $('#comment-input').val('');
  }

  function edit_comment(comment_id){
    let inputKomenEdit = $('#comment-edit');
  
    let komenEdit = inputKomenEdit.val();
  
    if (komenEdit === "") {
      alert("Mohon isikan komentar terbaru!")
      inputKomenEdit.focus();
      return;
    } else {
    $.ajax({
      type: "POST",
      url: "/update_comment",
      data: {
        comment_id_give: comment_id,
        comment_give: komenEdit,
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
  
  function delete_comment(commentid){
    if (confirm("Yakin ingin menghapus komentar ini?") == true) {
      $.ajax({
        type: "POST",
        url: "/deletecomment/"+commentid,
        data: {},
        cache: false,
        contentType: false,
        processData: false,
        success: function (response) {
        if (response["result"] === "success") {
          alert(response["msg"]);
          window.location.reload();
        }
      },
    });
    }
  }
  
  function focus_comment() {
    let response = axios.get("/auth_login");
    let authLogin = response.data;
    if(authLogin){
    $("#comment-input").focus();
    }else{
        alert('ANDA HARUS LOGIN UNTUK DAPAT BERKOMENTAR!')
    }
  }

  function editcomment() {
    $("#form-editcom").removeClass("visually-hidden");
    $("#com-control").addClass("visually-hidden");
  }

  function cancelcom() {
    $("#form-editcom").addClass("visually-hidden");
    $("#com-control").removeClass("visually-hidden");
  }

  function update (){
    let inputLokasi = $('#location');

    let lokasi = inputLokasi.val();
    let deskripsi = editor.getData();
    let postid = $('#postid').val();
    let file = $("#image")[0].files[0] || "";
  
    if (lokasi === "") {
      alert("Mohon masukkan lokasi!")
      inputLokasi.focus();
      return;
    } else if (deskripsi === "") {
      alert("Mohon masukkan deskripsi!")
      editor.focus();
      return;
    } else {
  
      let form_data = new FormData();
      form_data.append("id_give", postid);
      if(file!==""){
      form_data.append("file_give", file);
      }
      form_data.append("lokasi_give", lokasi);
      form_data.append("deskripsi_give", deskripsi);
  
      $.ajax({
          type: "POST",
          url: "/update_forum",
          data: form_data,
          cache: false,
          contentType: false,
          processData: false,
          success: function (response) {
          if (response["result"] === "success") {
            alert(response["msg"]);
            window.location.reload();
          }
        },
      });
    }
  };