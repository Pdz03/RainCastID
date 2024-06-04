$(document).ready(function() {
    $('#select-provinsi').select2();
    $('#select-kota').select2();
})

const CUACA_URL = 'https://cuaca-gempa-rest-api.vercel.app/';
const CUACA2_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const API_KEY = '5ab05ef1ef4bea450ad3dcce88bb8c53';
const API_ENDPOINT = {
    provinsi: `${CUACA_URL}weather/Indonesia`,
    kota: (provinsi) => `${CUACA_URL}weather/${provinsi}`,
    cuaca: (urlCuaca) => `${CUACA_URL}weather/${urlCuaca}`,
    coord: (lat, long) => `${CUACA2_URL}?lat=${lat}&lon=${long}&appid=${API_KEY}`,
    cityid: (id) => `${CUACA2_URL}?id=${id}&appid=${API_KEY}`
}

class CuacaSource {
    static async dataProvinsi() {
        const response = await axios.get(API_ENDPOINT.provinsi);
        const responseJson = await response.data;
        return responseJson;
    }
    static async cuacaTerkini() {
        const response = await axios.get(API_ENDPOINT.cuaca);
        const responseJson = await response.data;
        return responseJson;
    }
    static async cuacaLokasiTerkini(lat, long){
        const response = await axios.get(API_ENDPOINT.coord(lat, long));
        const responseJson = await response.data;
        return responseJson;
    }
    static async cuacaLokasiTerkinibyID(id){
      const response = await axios.get(API_ENDPOINT.cityid(id));
      const responseJson = await response.data;
      return responseJson;
  }
}

function getSavedLoc (store) {
  if (typeof store == 'undefined')
    store = getObjectStore(DB_STORE_NAME, 'readonly');

  return store;
}

function getTimeImage(code) {
  let image = '';
  switch (code) {
    case '0:00':
      image = '0.png';
      break;
    case '3:00':
      image = '3.png';
      break;
    case '6:00':
      image = '6.png';
      break;
    case '9:00':
      image = '9.png';
      break;
    case '12:00':
      image = '12.png';
      break;
    case '15:00':
      image = '15.png';
      break;
    case '18:00':
      image = '18.png';
      break;
    case '21:00':
      image = '21.png';
      break;
    default:
      image = '0.png';
  }
  return image;
}

let locationData = ''
function predictAPILoc(status){
  $('#restitle').text('Hasil Prediksi Cuaca Hari Ini Berdasarkan Lokasi');
  const contentContainer = document.querySelector('#prediksiAPI');
  let skeleton = skeletonPredictLoc(4);
  contentContainer.innerHTML = skeleton;
  if (status === 'saved'){
    store = getSavedLoc();
    var req;
    req = store.openCursor();
    req.onsuccess = function(evt) {
      var cursor = evt.target.result;
      if (cursor) {
        req = store.get(cursor.key);
        req.onsuccess = function (evt) {
          var value = evt.target.result;
          getWeatherData('', '', value.id)
        }
      } else {
        console.log("No more entries");
      }
    };
  }else if(status === 'unsaved'){
  if (navigator.geolocation) {
    //jika navigator tersedia
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    //jika navigator tidak tersedia
    console.log("Geolocation is not supported by this device");
  }

 function showPosition  (position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  $('#cuacaModal').modal('show');
  getWeatherData(lat, long, '')
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
}

async function predictDay(type){
  let response = await axios.get('/auth_login');
  let authLogin = await response.data;
  if (authLogin){
  const contentContainer = document.querySelector('#prediksiAPI');
  let skeleton = skeletonPredictLoc(4);
  contentContainer.innerHTML = skeleton;
  let locId = authLogin.data.profile_info.location_id;
  $('#cuacaUserModal').modal('show');
  let APILoc = await CuacaSource.cuacaLokasiTerkinibyID(locId);
  let wData = await getUserWeatherData(APILoc, type);

  const today = new Date();
  const todayStr =
    today.getFullYear() +
    "-" +
    (today.getMonth()+1).toString().padStart(2, "0") +
    "-" +
    today.getDate().toString().padStart(2, "0");

  const day3Str =
    today.getFullYear() +
    "-" +
    (today.getMonth()+1).toString().padStart(2, "0") +
    "-" +
    (today.getDate()+2).toString().padStart(2, "0");

  const day2Str =
    today.getFullYear() +
    "-" +
    (today.getMonth()+1).toString().padStart(2, "0") +
    "-" +
    (today.getDate()+1).toString().padStart(2, "0");

  if(type==='3day'){

    let tanggal = wData.dTanggal;
    for(let i=0;i<=tanggal.length;i++){
      if(tanggal[i] !== todayStr){
        $(`.${tanggal[i]}`).hide();
      }
    }

    $(`#btn-${day3Str}`).on('click', function(){
        $(`.${todayStr}`).hide();
        $(`.${day2Str}`).hide();
        $(`.${day3Str}`).show();

        $(`#btn-${day3Str}`).addClass('active');
        $(`#btn-${day2Str}`).removeClass('active');
        $(`#btn-${todayStr}`).removeClass('active');
    })

    $(`#btn-${day2Str}`).on('click', function(){
        $(`.${todayStr}`).hide();
        $(`.${day2Str}`).show();
        $(`.${day3Str}`).hide();

        $(`#btn-${day2Str}`).addClass('active');
        $(`#btn-${todayStr}`).removeClass('active');
        $(`#btn-${day3Str}`).removeClass('active');
    })

    $(`#btn-${todayStr}`).on('click', function(){
        $(`.${todayStr}`).show();
        $(`.${day2Str}`).hide();
        $(`.${day3Str}`).hide();

        $(`#btn-${todayStr}`).addClass('active');
        $(`#btn-${day3Str}`).removeClass('active');
        $(`#btn-${day2Str}`).removeClass('active');
    })
  }

  const contentType = 'application/json'; // Adjust based on server expectation
  const headers = { 'Content-Type': contentType };
  let response = await axios.post('/predictAPI', JSON.stringify(wData.dCurah), {headers});
  let hasil = response.data.data;
  for (let i=0;i<hasil.length;i++){
    let curahhujan = (hasil[i].hasil).toFixed(2);
    console.log(curahhujan)
    const klasifikasi = getClass(curahhujan).classPredict;
    const warning = getClass(curahhujan).warning;
    $(`#curahhujan-${i}`).text(`Hasil Prediksi Curah Hujan: ${curahhujan} mm (${klasifikasi})`)
    .removeClass('text-danger')
    $(`#warning-${i}`).text(warning);
  }

  let dataResultAPI = wData.dCurah.map((dataPoint, index) => {
    return {
      ...dataPoint,
      curahHujan: (hasil[index].hasil).toFixed(2),
    };
  });

  let dataResult = [{
    username: authLogin.data.username,
    date: todayStr,
    result: dataResultAPI,
    type: type
  }]

  $('#btnSaveResult').on('click', async function (){
    result = await axios.post('/savePredict', JSON.stringify(dataResult), {headers});
    alert(result.data.result)
    window.location.reload();
  })
  }
}

async function getWeatherData(lat, long, id, store){
  let APILoc ='';
  if (id !== ''){
    APILoc = await CuacaSource.cuacaLokasiTerkinibyID(id);
  }else{
    APILoc = await CuacaSource.cuacaLokasiTerkini(lat, long);
  }
  locationData = {
    id: APILoc.city.id,
    lat: lat,
    long: long,
    name: APILoc.city.name,
    country: APILoc.city.country,
  }
  store = getSavedLoc();
  var req;
  req = store.openCursor();
  req.onsuccess = function(evt) {
    var cursor = evt.target.result;
    if (cursor) {
      req = store.get(cursor.key);
      req.onsuccess = function (evt) {
        var value = evt.target.result;
        if(locationData.id == value.id){
        $('#btnSaveLoc').addClass('visually-hidden');
        $('#btnDeleteLoc').removeClass('visually-hidden');
        $('#locAPI').text(`Lokasi: ${APILoc.city.name}, ${APILoc.city.country} (Lokasi Tersimpan)`)
        }else{
          $('#btnSaveLoc').removeClass('visually-hidden');
          $('#btnDeleteLoc').addClass('visually-hidden');
          $('#locAPI').text(`Lokasi: ${APILoc.city.name}, ${APILoc.city.country} (Lokasi Tidak Tersimpan)`)
        }
      }
    } else {
      console.log("No more entries");
      $('#btnSaveLoc').removeClass('visually-hidden');
      $('#btnDeleteLoc').addClass('visually-hidden');
      $('#locAPI').text(`Lokasi: ${APILoc.city.name}, ${APILoc.city.country} (Lokasi Tidak Tersimpan)`)
    }
  };

  const contentContainer = document.querySelector('#prediksiAPI');
  let template = '';
  const listResult = APILoc.list;
  const today = new Date();
  const todayStr =
    today.getFullYear() +
    "-" +
    (today.getMonth()+1).toString().padStart(2, "0") +
    "-" +
    today.getDate().toString().padStart(2, "0");
  
  console.log(todayStr)
  let dataAPI = [];
  console.log(listResult);
  for (let i = 0; i < listResult.length; i++) {
    let dttxt = listResult[i].dt_txt.split(" ")[0];
    if (dttxt === todayStr) {
        const time = new Date(listResult[i].dt_txt);
        const jam = time.getHours();
        const menit = time.getMinutes();
        const waktu = jam + ":" + menit.toString().padStart(2, "0");
        const imgTime = getTimeImage(waktu);
        dataAPI.push({
          waktu: waktu,
          suhu: (listResult[i].main.temp / 10).toFixed(2),
          kelembaban: listResult[i].main.humidity,
          kecepatan: listResult[i].wind.speed,
          tekanan: listResult[i].main.pressure
        })
  
        template += `
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
                        <p class="card-text">${(listResult[i].main.temp / 10).toFixed(2)} °C</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-6 pt-2">
                    <div class="row align-items-center">
                      <div class="col-2"><i class="bi bi-droplet-fill fs-2"></i></div> 
                      <div class="col-10">                     
                        <h6 class="card-title m-0">Kelembaban Udara</h6>
                        <p class="card-text">${listResult[i].main.humidity} %</p>
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
                        <p class="card-text">${listResult[i].wind.speed} m/s</p>
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
                        <p class="card-text">${listResult[i].main.pressure} hPa</p>                           
                      </div>  
                    </div>
                  </div>
                </div>
                <hr>
                <div class="row">
                <h6 class="card-title m-0 text-danger" id="curahhujan-${i}">SEDANG PROSES PERHITUNGAN PREDIKSI         <div class="spinner-border" role="status"></div></h6>
                <p class="card-text text-danger" id="warning-${i}"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        `;
        
      }
  }
  $.ajax({
    type: "POST",
    url: "/predictAPI",
    data: JSON.stringify(dataAPI),
    contentType: "application/json",
    success: function (response) {
      let hasil = response.data;
      for (let i=0;i<hasil.length;i++){
        let curahhujan = (hasil[i].hasil).toFixed(2);
        const klasifikasi = getClass(curahhujan).classPredict;
        const warning = getClass(curahhujan).warning;
        $(`#curahhujan-${i}`).text(`Hasil Prediksi Curah Hujan: ${curahhujan} mm (${klasifikasi})`)
        .removeClass('text-danger')
        $(`#warning-${i}`).text(warning)
      }
      // const minmax = response.data.minmax[0];
      // let dataNormal = {
      //   normalsuhu : ((listResult[i].main.temp / 10)- minmax.x0min) / (minmax.x0max - minmax.x0min),
      //   normallembab : (listResult[i].main.humidity - minmax.x1min) / (minmax.x1max - minmax.x1min),
      //   normalcepat : (listResult[i].wind.speed - minmax.x2min) / (minmax.x2max - minmax.x2min),
      //   normaltekanan : (listResult[i].main.pressure - minmax.x3min) / (minmax.x3max - minmax.x3min),
      // }      
    }
  })
contentContainer.innerHTML = template;
}

async function getUserWeatherData(APILoc, type){
  const contentContainer = document.querySelector('#prediksiAPI');
  let template = '';
  const listResult = APILoc.list;
  const today = new Date();
  const todayStr =
    today.getFullYear() +
    "-" +
    (today.getMonth()+1).toString().padStart(2, "0") +
    "-" +
    today.getDate().toString().padStart(2, "0");

  const day3Str =
    today.getFullYear() +
    "-" +
    (today.getMonth()+1).toString().padStart(2, "0") +
    "-" +
    (today.getDate()+2).toString().padStart(2, "0");

  const day2Str =
    today.getFullYear() +
    "-" +
    (today.getMonth()+1).toString().padStart(2, "0") +
    "-" +
    (today.getDate()+1).toString().padStart(2, "0");

  let dataAPI = [];
  let dataTanggal = [];
  for (let i = 0; i < listResult.length; i++) {
    let dttxt = listResult[i].dt_txt.split(" ")[0];
    if(type==='today'){
      if (dttxt === todayStr) {
        const time = new Date(listResult[i].dt_txt);
        const jam = time.getHours();
        const menit = time.getMinutes();
        const waktu = jam + ":" + menit.toString().padStart(2, "0");
        const imgTime = getTimeImage(waktu);
        dataAPI.push({
          waktu: waktu,
          suhu: (listResult[i].main.temp / 10).toFixed(2),
          kelembaban: listResult[i].main.humidity,
          kecepatan: listResult[i].wind.speed,
          tekanan: listResult[i].main.pressure
        })
  
        template += `
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
                        <p class="card-text">${(listResult[i].main.temp / 10).toFixed(2)} °C</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-6 pt-2">
                    <div class="row align-items-center">
                      <div class="col-2"><i class="bi bi-droplet-fill fs-2"></i></div> 
                      <div class="col-10">                     
                        <h6 class="card-title m-0">Kelembaban Udara</h6>
                        <p class="card-text">${listResult[i].main.humidity} %</p>
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
                        <p class="card-text">${listResult[i].wind.speed} m/s</p>
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
                        <p class="card-text">${listResult[i].main.pressure} hPa</p>                           
                      </div>  
                    </div>
                  </div>
                </div>
                <hr>
                <div class="row">
                <h6 class="card-title m-0 text-danger" id="curahhujan-${i}">SEDANG PROSES PERHITUNGAN PREDIKSI         <div class="spinner-border" role="status"></div></h6>
                <p class="card-text text-danger" id="warning-${i}"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        `;
        
      }
  }else if(type === '3day'){
    if (dttxt >= todayStr && dttxt <= day3Str) {
      dataTanggal.push(dttxt);
      let btnTanggal = `
      <button class="btn btn-orange active" id="btn-${todayStr}">${todayStr}</button>
      <button class="btn btn-orange" id="btn-${day2Str}">${day2Str}</button>
      <button class="btn btn-orange" id="btn-${day3Str}">${day3Str}</button>
      `
      $('#btn-tanggal').html(btnTanggal);
      let idTanggal = ''
      if (dttxt === todayStr){
        idTanggal = todayStr;
      }else if(dttxt === day2Str){
        idTanggal = day2Str;
      }else if(dttxt === day3Str){
        idTanggal = day3Str;
      }
      const time = new Date(listResult[i].dt_txt);
      const jam = time.getHours();
      const menit = time.getMinutes();
      const waktu = jam + ":" + menit.toString().padStart(2, "0");
      const imgTime = getTimeImage(waktu);
      dataAPI.push({
        waktu: waktu,
        suhu: (listResult[i].main.temp / 10).toFixed(2),
        kelembaban: listResult[i].main.humidity,
        kecepatan: listResult[i].wind.speed,
        tekanan: listResult[i].main.pressure
      })

      template += `
      <div class="row g-0 p-2 align-items-center ${idTanggal}" id="">
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
                      <p class="card-text">${(listResult[i].main.temp / 10).toFixed(2)} °C</p>
                    </div>
                  </div>
                </div>
                <div class="col-6 pt-2">
                  <div class="row align-items-center">
                    <div class="col-2"><i class="bi bi-droplet-fill fs-2"></i></div> 
                    <div class="col-10">                     
                      <h6 class="card-title m-0">Kelembaban Udara</h6>
                      <p class="card-text">${listResult[i].main.humidity} %</p>
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
                      <p class="card-text">${listResult[i].wind.speed} m/s</p>
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
                      <p class="card-text">${listResult[i].main.pressure} hPa</p>                           
                    </div>  
                  </div>
                </div>
              </div>
              <hr>
              <div class="row">
              <h6 class="card-title m-0 text-danger" id="curahhujan-${i}">SEDANG PROSES PERHITUNGAN PREDIKSI         <div class="spinner-border" role="status"></div></h6>
              <p class="card-text text-danger" id="warning-${i}"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      `;
     

    }
  }
  }
  
  contentContainer.innerHTML = template;

  let btnEmptyUser = document.getElementById("empty-user");
  btnEmptyUser.addEventListener("click", function (){
  $('#prediksiAPI').empty();
  $('#btn-tanggal').empty();
});

let wheaterData = {
  dTanggal: dataTanggal,
  dCurah: dataAPI
}
return wheaterData;
}

async function showHistory(){
  let response = await axios.get('/showPredict');
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

