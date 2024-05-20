$(document).ready(function() {
    $('#tempInput' && '#lembabInput' && '#cepatInput' && '#tekananInput').on('input change', function() {
        if($(this).val() != '') {
            $('#btnPredictManual').removeClass('disabled');
        } else {
            $('#btnPredictManual').addClass('disabled');
        }
    });
})

function getClass(result) {
  let classPredict = ''
  let warning = ''
  switch (true) {
    case result == 0:
      classPredict = 'Tidak Hujan';
      warning = 'Tidak ada perinsagatan karena kemungkinan tidak ada hujan.'
      break;
    case result >= 0.1 && result <= 20:
      classPredict = 'Hujan Sangat Ringan';
      warning = 'Perhatian, kemungkinan hujan sangat ringan. Tetap waspada terhadap kemungkinan genangan air di area rendah.'
      break;
    case result >= 5.1 && result <= 20:
      classPredict = 'Hujan Ringan';
      warning = 'Waspada, kemungkinan hujan ringan akan turun. Gunakan payung atau jas hujan bila ingin keluar rumah'
      break;
    case result >= 20.1 && result <= 50:
      classPredict = 'Hujan Sedang';
      warning = 'Peringatan! Hujan akan turun dengan intensitas cukup tinggi. Hindari berkendara jika tidak diperlukan'
      break;
    case result >= 50.1 && result <= 100:
      classPredict = 'Hujan Lebat';
      warning = 'Bahaya! Hujan lebat akan mengguyur. Harap waspada terhadap banjir dan longsor.'
      break;
    case result > 100:
      classPredict = 'Hujan Sangat Lebat';
      warning = 'HUJAN SANGAT LEBAT AKAN MENGGUYUR. Harap siaga dan lakukan evakuasi bila perlu'
      break;
    default:
      classPredict = 'Terjadi Kesalahan';
      warning = 'Terjadi kesalahan ketika melakukan perhitungan prediksi'
  }

  let resPredict = {
    classPredict: classPredict,
    warning: warning
  }
  return resPredict;
}

function predictManual (){
    $('#restitle').text('Hasil Prediksi Cuaca Berdasarkan Input Manual');
    $('#locAPI').empty();
    const contentContainer = document.querySelector('#prediksiAPI');
    let skeleton = skeletonPredictManual();
    contentContainer.innerHTML = skeleton;

    const tempVal = $('#tempInput').val();
    const lembabVal = $('#lembabInput').val();
    const cepatVal = $('#cepatInput').val();
    const tekananVal = $('#tekananInput').val();

    $.ajax({
      type: "GET",
      url: "/getdata",
      data: {},
      success: function (response) {
        const minmax = response.data.minmax[0];
        const dataInput = {
          temperatur: tempVal,
          kelembaban: lembabVal,
          kecepatan: cepatVal,
          tekanan: tekananVal
        }

        const dataNormal = {
          normalsuhu : (dataInput.temperatur - minmax.x0min) / (minmax.x0max - minmax.x0min),
          normallembab : (dataInput.kelembaban - minmax.x1min) / (minmax.x1max - minmax.x1min),
          normalcepat : (dataInput.kecepatan - minmax.x2min) / (minmax.x2max - minmax.x2min),
          normaltekanan : (dataInput.tekanan - minmax.x3min) / (minmax.x3max - minmax.x3min),
        }

        $.ajax({
          type: "POST",
          url: "/predictModel",
          data: {
            suhu_give: dataNormal.normalsuhu,
            kelembaban_give: dataNormal.normallembab,
            kecepatan_give: dataNormal.normalcepat,
            tekanan_give: dataNormal.normaltekanan,
          },
          success: function (response) {
            const hasil = (response.data.hasil).toFixed(2);
            const klasifikasi = getClass(hasil).classPredict;
            const warning = getClass(hasil).warning;
            $('#curahhujan').text(`Hasil Prediksi Curah Hujan: ${hasil} mm (${klasifikasi})`)
                            .removeClass('text-danger')
            $('#warning').text(warning)
          },
        });

    let template = `
    <div class="row g-0 p-2 align-items-center">
    <div class="card-body">
      <div class="container w-100">
        <div class="row">
          <div class="col-6 pt-2">
            <div class="row align-items-center">
            <div class="col-2"><i class="bi bi-thermometer-half fs-2"></i></div>
            <div class="col-10">                          
              <h6 class="card-title m-0"></i>Temperatur Rata-rata</h6>
              <p class="card-text">${dataInput.temperatur} °C</p>
            </div>
            </div>
          </div>
          <div class="col-6 pt-2">
            <div class="row align-items-center">
            <div class="col-2"><i class="bi bi-droplet-fill fs-2"></i></div> 
            <div class="col-10">                     
              <h6 class="card-title m-0">Kelembaban Udara</h6>
              <p class="card-text">${dataInput.kelembaban} %</p>
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
            <p class="card-text">${dataInput.kecepatan} m/s</p>
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
            <p class="card-text">${dataInput.tekanan} hPa</p>                           
          </div>  
            </div>
          </div>
        </div>
        <hr>
        <div class="row"> 
        <h6 class="card-title m-0 text-danger" id="curahhujan">SEDANG PROSES PERHITUNGAN PREDIKSI         <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div></h6>
        <p class="card-text text-danger" id="warning">
      </p> 
        </div>
      </div>
    </div>
</div>
    `
    contentContainer.innerHTML = template;
      }
    })

    $('#empty').on('click', function(){
        $('#tempInput').val('');
        $('#lembabInput').val('');
        $('#cepatInput').val('');
        $('#tekananInput').val('');
    })
}  