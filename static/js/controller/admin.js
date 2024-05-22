$(window).on("load", function () {
    getnavbar();
    ambildata();
    $("#loading").fadeOut(500);
})

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

  function ujipredict(hidden) {
    let epoch = $("#input-epoch").val();
    if (epoch === "") {
      $("#titlePredictHidden").text("Masukkan Jumlah Epoch Terlebih Dahulu!");
    } else {
      $("#titlePredictHidden").text(
        "Perhitungan dengan " + hidden + " Lapisan Hidden"
      );
      let rainChart = document.getElementById("rainChart").getContext("2d");
      $("#datahasil").empty();
      $.ajax({
        type: "POST",
        url: "/predict",
        data: {
          jml_hidden: hidden,
          jml_epoch: epoch,
        },
        success: function (response) {
          console.log(response.data);
          let listpredict = [];
          let listtrue = [];
          let listlabel = [];
          for (let i = 0; i < response.data.length; i++) {
            let output = response.data;
            let no = i + 1;
            listpredict.push(output[i].prediksi);
            listtrue.push(output[i].aktual);
            listlabel.push(no);
            let temp_tbl = `
            <tr>
            <td>${output[i].prediksi}</td>
            <td>${output[i].aktual}</td>
            </tr>
            `;

            $("#datahasil").append(temp_tbl);
            $("#akurasi").text(`${response.akurasi} %`);
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
      url: "/getdata",
      data: {},
      success: function (response) {
        let output = response.data.listdata;
        let minmax = response.data.minmax[0];
        let normaldata = response.data.listnormaldata;
        console.log(output.length);
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