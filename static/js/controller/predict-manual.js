$(document).ready(function() {
    $('#tempInput' && '#lembabInput' && '#cepatInput' && '#tekananInput').on('input change', function() {
        if($(this).val() != '') {
            $('#btnPredictManual').removeClass('disabled');
        } else {
            $('#btnPredictManual').addClass('disabled');
        }
    });
})

function predictManual (){
    $('#restitle').text('Hasil Prediksi Cuaca Berdasarkan Input Manual');
    $('locAPI').empty();
    const contentContainer = document.querySelector('#prediksiAPI');
    let skeleton = skeletonPredictManual();
    contentContainer.innerHTML = skeleton;

    const tempVal = $('#tempInput').val();
    const lembabVal = $('#lembabInput').val();
    const cepatVal = $('#cepatInput').val();
    const tekananVal = $('#tekananInput').val();

    const dataInput = {
        temperatur: tempVal,
        kelembaban: lembabVal,
        kecepatan: cepatVal,
        tekanan: tekananVal
    }

    console.log(dataInput);

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
        <h6 class="card-title m-0">Prediksi Curah Hujan: 68 mm (Hujan Ringan)</h6>
        <p class="card-text text-danger">WASPADA HUJAN RINGAN!</p> 
        </div>
      </div>
    </div>
</div>
    `
    contentContainer.innerHTML = template;

    $('#empty').on('click', function(){
        $('#tempInput').val('');
        $('#lembabInput').val('');
        $('#cepatInput').val('');
        $('#tekananInput').val('');
    })
}  