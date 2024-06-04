$(window).on("load", async function () {
    getnavbar();
    ambildata();
    await showHistori();
    get_user();
    get_posts();
    $('#section-post').hide();
    $('#section-user').hide();
    $('#section-history').hide();
    $('#section-uji').show();
    $("#loading").fadeOut(500);
})

async function showHistori(){
  let response = await axios.get('/showPredictAdmin');
  let historyCuaca = await response.data.data;
  for (let i=0;i<historyCuaca.length;i++){
    let dataCuaca = historyCuaca[i];
    let templateResult = '';
      for (let j=0;j<dataCuaca.result.length;j++){
        const waktu = dataCuaca.result[j].waktu;
        const imgTime = getTimeImage(waktu);
        templateResult += `
        <div class="row g-0 p-2 align-items-center">
            <div class="col-md-3 d-flex flex-wrap justify-content-center">
              <h5 class="text-center">${waktu}</h5>
              <img src="static/assets/images/${imgTime}" style="width:150px;" alt="...">
            </div>
            <div class="col-md-9">
              <div class="card-body">
                <div class="container w-100">
                  <div class="row">
                    <div class="col-6 pt-2">
                      <div class="row align-items-center">
                        <div class="col-2"><i class="bi bi-thermometer-half fs-2"></i></div>
                        <div class="col-10">                          
                          <h6 class="card-title m-0"></i>Temperatur Rata-rata</h6>
                          <p class="card-text">${dataCuaca.result[j].suhu} °C</p>
                        </div>
                      </div>
                    </div>
                    <div class="col-6 pt-2">
                      <div class="row align-items-center">
                        <div class="col-2"><i class="bi bi-droplet-fill fs-2"></i></div> 
                        <div class="col-10">                     
                          <h6 class="card-title m-0">Kelembaban Udara</h6>
                          <p class="card-text">${dataCuaca.result[j].kelembaban} %</p>
                        </div> 
                      </div>   
                    </div>
                    <div class="col-6 pt-2">
                      <div class="row align-items-center">
                        <div class="col-2">
                          <i class="bi bi-wind fs-2"></i>
                        </div>
                        <div class="col-10">
                          <h6 class="card-title m-0">Kecepatan Udara</h6>
                          <p class="card-text">${dataCuaca.result[j].kecepatan} m/s</p>
                        </div> 
                      </div>              
                    </div>
                    <div class="col-6 pt-2">
                      <div class="row align-items-center">
                        <div class="col-2">
                          <i class="bi bi-chevron-double-down fs-2"></i>
                        </div>
                        <div class="col-10">
                          <h6 class="card-title m-0">Tekanan Udara</h6>
                          <p class="card-text">${dataCuaca.result[j].tekanan} hPa</p>                           
                        </div>  
                      </div>
                    </div>
                  </div>
                  <hr>
                  <div class="row">
                  <h6 class="card-title m-0" id="curahhujan-${j}">Hasil Prediksi Curah Hujan: ${dataCuaca.result[j].curahHujan}</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
          `;
      }

    let template = `
    <tr class="pr-${dataCuaca.type}">
    <td>${dataCuaca.predictid}</td>
    <td>${dataCuaca.username}</td>
    <td>${dataCuaca.date}</td>
    <td>${dataCuaca.type}</td>
    <td><button class="btn btn-success" data-bs-toggle="modal"
    data-bs-target="#cuaca-${dataCuaca.predictid}">Lihat Hasil</button>
    <div
    class="modal fade"
    id="cuaca-${dataCuaca.predictid}"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="loginModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header text-white" style="background-color:#648CFF;">
        <h1 class="modal-title fs-5" id="cuacaModalLabel">Hasil Prediksi</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="sub-title">
          <h4 class="m-0" id="restitle"></h4>
          <p id="locAPI"></p>
        </div>
        <div id=""></div>
        <div class="card mb-3 px-3 align-items-end" id="prediksiAPI">
          ${templateResult}
        </div>
      </div>
    </div>
  </div>
  </div>
    </td>
    </tr>
    `
    $('#hisPredict').append(template);
  }
  $('.pr-3day').hide()

  $('#btn-prtoday').on('click', function(){
    $('.pr-3day').hide();
    $('.pr-today').show();
    $('#btn-prtoday').addClass('active');
    $('#btn-pr3day').removeClass('active');
  })

  $('#btn-pr3day').on('click', function(){
    $('.pr-3day').show();
    $('.pr-today').hide()
    $('#btn-prtoday').removeClass('active');
    $('#btn-pr3day').addClass('active');
  })
}

function predict() {
    let suhu = $("#suhu").val();
    let lembab = $("#lembab").val();
    let cepat = $("#cepat").val();
    let tekanan = $("#tekanan").val();

    let suhumin = $("#suhumin")[0].innerText;
    let lembabmin = $("#lembabmin")[0].innerText;
    let cepatmin = $("#cepatmin")[0].innerText;
    let tekananmin = $("#tekananmin")[0].innerText;

    let suhumax = $("#suhumax")[0].innerText;
    let lembabmax = $("#lembabmax")[0].innerText;
    let cepatmax = $("#cepatmax")[0].innerText;
    let tekananmax = $("#tekananmax")[0].innerText;

    let normalsuhu = (suhu - suhumin) / (suhumax - suhumin);
    let normallembab = (lembab - lembabmin) / (lembabmax - lembabmin);
    let normalcepat = (cepat - cepatmin) / (cepatmax - cepatmin);
    let normaltekanan = (tekanan - tekananmin) / (tekananmax - tekananmin);

    $.ajax({
      type: "POST",
      url: "/predict",
      data: {
        suhu_give: normalsuhu,
        kelembaban_give: normallembab,
        kecepatan_give: normalcepat,
        tekanan_give: normaltekanan,
      },
      success: function (response) {
        $("#output").empty();

        let temp = `
    (    <p>DATA PERCOBAAN</p>
        `;

        $("#output").append(temp);
      },
    });
  }

  function delall() {
    $.ajax({
      type: "POST",
      url: "/deleteall",
      data: {},
      success: function (response) {
        alert(response.msg);
        window.location.reload();
      },
    });
  }

  function ambildata() {
    $.ajax({
      type: "GET",
      url: "/ambildata",
      data: {},
      success: function (response) {
        let output = response.data;
        let minmax = response.dataminmax[0];
        let normaldata = response.normaldata;
        if (output.length > 0) {
          $("#datauji").empty();
          $("#dataminmax").empty();
          $("#datanormal").empty();
          let tbl_minmax = `
            <tr>
            <th>Data Min</th>
            <td id="suhumin">${minmax.x0min}</td>
            <td id="lembabmin">${minmax.x1min}</td>
            <td id="cepatmin">${minmax.x2min}</td>
            <td id="mataharimin">${minmax.x3min}</td>
            <td>${minmax.ymin}</td>
            </tr>
            <tr>
            <th>Data Max</th>
            <td id="suhumax">${minmax.x0max}</td>
            <td id="lembabmax">${minmax.x1max}</td>
            <td id="cepatmax">${minmax.x2max}</td>
            <td id="mataharimax">${minmax.x3max}</td>
            <td>${minmax.ymax}</td>
            </tr>
            `;
          $("#dataminmax").append(tbl_minmax);
          for (let i = 0; i < output.length; i++) {
            let no = i + 1;
            let temp_tbl = `
            <tr>
            <th>${no}. </th>
            <td>${output[i].x0}</td>
            <td>${output[i].x1}</td>
            <td>${output[i].x2}</td>
            <td>${output[i].x3}</td>
            <td>${output[i].y}</td>
            <td>   </td>
            </tr>
            `;
            let temp_tbl_normal = `
            <tr>
            <th>${no}. </th>
            <td>${normaldata[i].x0}</td>
            <td>${normaldata[i].x1}</td>
            <td>${normaldata[i].x2}</td>
            <td>${normaldata[i].x3}</td>
            <td>${normaldata[i].y}</td>
            </tr>
            `;

            $("#datauji").append(temp_tbl);
            $("#datanormal").append(temp_tbl_normal);
          }
        } else {
          $("#datauji").empty();
          let temp_tbl = `<tr>
          <td colspan="7">Tidak ada data uji</td>
          </tr>`;
          let temp_tbl_normal = `<tr>
          <td colspan="6">Tidak ada data uji</td>
          </tr>`;
          $("#datanormal").append(temp_tbl_normal);
          $("#datauji").append(temp_tbl);
        }
      },
    });
  }

  function predictcoba() {
    $.ajax({
      type: "GET",
      url: "/predictcoba",
      data: {},
      success: function (response) {
        alert("Sukses");
      },
    });
  }

  function upload_input_data() {
    let file = $("#input-file")[0].files[0];
    let form_data = new FormData();
    form_data.append("file_give", file);
    console.log(file, form_data);

    $.ajax({
      type: "POST",
      url: "/upload_input_data",
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

  function upload_add_data() {
    let file = $("#input-file")[0].files[0];
    let form_data = new FormData();
    form_data.append("file_give", file);
    console.log(file, form_data);

    $.ajax({
      type: "POST",
      url: "/upload_data",
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

  function upload_update_data() {
    let file = $("#input-file")[0].files[0];
    let confirm = "update-data";
    let form_data = new FormData();
    form_data.append("file_give", file);
    form_data.append("confirm_give", confirm);
    console.log(file, form_data);
    console.log(confirm);

    $.ajax({
      type: "POST",
      url: "/upload_data",
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

  function bacaexcel() {
    $.ajax({
      type: "GET",
      url: "/bacaexcel",
      data: {},
      success: function (response) {
        alert("Sukses");
        window.location.reload();
      },
    });
  }

  function updateexcel() {
    $.ajax({
      type: "GET",
      url: "/updateexcel",
      data: {},
      success: function (response) {
        alert("Sukses");
        window.location.reload();
      },
    });
  }

function init_predict(){
    // const btnInit = document.getElementById('btn-init');
    // let temp = `
    // <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    // <span class="sr-only">Loading...</span>
    // `;
    // btnInit.innerHTML(temp);
    let epoch = $('#epoch').val();
    let learn = $("#learn").val();
    console.log(epoch)
    $.ajax({
      type: "POST",
      url: "/initpredict",
      data: {
        epoch: epoch,
        learn, learn,
      },
      success: function (response) {
        if (response["result"]==='success'){
          alert("Sukses");
          window.location.reload();
        }
      },
    });
  }

  function upload_input_data() {
    let file = $("#input-file")[0].files[0];
    let form_data = new FormData();
    form_data.append("file_give", file);
    console.log(file, form_data);

    $.ajax({
      type: "POST",
      url: "/upload_input_data",
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

  function ujipredict() {
      $("#titlePredictHidden").text(
        "Uji Perhitungan Prediksi Mengggunakan Data yang Sebenarnya"
      );
      let rainChart = document.getElementById("rainChart").getContext("2d");
      $("#datahasil").empty();
      $.ajax({
        type: "POST",
        url: "/predictUji",
        data: {},
        success: function (response) {
          console.log(response.hasil);
          let listpredict = [];
          let listtrue = [];
          let listlabel = [];
          for (let i = 0; i < response.hasil.data.length; i++) {
            let output = response.hasil.data[i];
            let no = i + 1;
            listpredict.push(output.hasil);
            listtrue.push(output.aktual);
            listlabel.push(no);
            let temp_tbl = `
            <tr>
            <td>${output.hasil}</td>
            <td>${output.aktual}</td>
            </tr>
            `;

            $("#datahasil").append(temp_tbl);
            // $("#akurasi").text(`${(response.hasil.akurasi*100).toFixed(2)} %`);
          }
          let dataPrediksi = {
            label: "Data Prediksi",
            data: listpredict,
            lineTension: 0.3,
            fill: false,
            borderColor: "red",
            backgroundColor: "transparent",
            pointBorderColor: "red",
            pointBackgroundColor: "red",
            pointRadius: 5,
            pointBorderWidth: 2,
            pointStyle: "rectRounded",
          };

          let dataAktual = {
            label: "Data Aktual",
            data: listtrue,
            lineTension: 0.3,
            fill: false,
            borderColor: "blue",
            backgroundColor: "transparent",
            pointBorderColor: "blue",
            pointBackgroundColor: "blue",
            pointRadius: 5,
            pointBorderWidth: 2,
            pointStyle: "rectRounded",
          };

          let parentData = {
            labels: listlabel,
            datasets: [dataPrediksi, dataAktual],
          };

          let rainchart = new Chart(rainChart, {
            type: "line",
            data: parentData,
          });

          let btndestroy = document.getElementById("destroy");
          btndestroy.addEventListener("click", myFunction);

          function myFunction() {
            rainchart.destroy();
          }
        },
      });
    }

    function ujibiner() {
      $.ajax({
        type: "POST",
        url: "/predictUjiBiner",
        data: {},
        success: function (response) {
          alert('CEK TERMINAL!');
        },
      });
    }
    

function openpost() {
  $("#section-user").hide();
  $("#section-post").show();
  $("#section-history").hide();
  $("#section-uji").hide();
  $("#btn-user").removeClass("active");
  $("#btn-post").addClass("active");
  $("#btn-history").removeClass("active");
  $("#btn-uji").removeClass("active");
}

function openuser() {
  $("#section-user").show();
  $("#section-post").hide();
  $("#section-history").hide();
  $("#section-uji").hide();
  $("#btn-user").addClass("active");
  $("#btn-post").removeClass("active");
  $("#btn-history").removeClass("active");
  $("#btn-uji").removeClass("active");
}

function openhistory() {
  $("#section-user").hide();
  $("#section-post").hide();
  $("#section-history").show();
  $("#section-uji").hide();
  $("#btn-user").removeClass("active");
  $("#btn-post").removeClass("active");
  $("#btn-history").addClass("active");
  $("#btn-uji").removeClass("active");
}

function openuji() {
  $("#section-user").hide();
  $("#section-post").hide();
  $("#section-history").hide();
  $("#section-uji").show();
  $("#btn-user").removeClass("active");
  $("#btn-post").removeClass("active");
  $("#btn-history").removeClass("active");
  $("#btn-uji").addClass("active");
}

function get_user() {
  $("#userlist").empty();
  $.ajax({
    type: "GET",
    url: "/get_user",
    data: {},
    success: function (response) {
      if (response["result"] == "success") {
          let userlist = response['data'];
          for (let i = 0; i < userlist.length; i++) {
            let user = userlist[i];
            let temp_post = `
            <tr>
            <td>${user["username"]}</td>
            <td>${user["email"]}</td>
            <td>${user["fullname"]}</td>
            <td>${user["count_post"]}</td>
            <td>
            <a href="/user/${user['username']}" class="btn btn-success">Lihat Profil</a>
            </td>
            </tr>
            `;
            $("#userlist").append(temp_post);

          }
        }
    }
  })
}

function get_posts() {
  $("#postlist").empty();
  $.ajax({
    type: "GET",
    url: "/list_post",
    data: {},
    success: function (response) {
      if (response["result"] == "success") {
          let postlist = response['posts'];
          for (let i = 0; i < postlist.length; i++) {
            let post = postlist[i];
            let time_post = new Date(post["date"]);
            let time_before = time2str(time_post);
            let temp_post = `
            <tr>
            <td>${post["username"]}</td>
            <td>${time_before}</td>
            <td>${post["deskripsi"].slice(0, 150)} ...</td>
            <td>
            <a href="/forum/${post['postid']}" class="btn btn-success">Lihat Forum</a>
            </td>
            </tr>
            `;
            $("#postlist").append(temp_post);

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
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}