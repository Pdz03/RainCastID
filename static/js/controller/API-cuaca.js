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

async function getWeatherData(lat, long, id, store){
  const contentContainer = document.querySelector('#prediksiAPI');
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

  let template = '';
  const listResult = APILoc.list;
  const today = new Date();
  const todayStr =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    today.getDate().toString().padStart(2, "0");
  let dataAPI = [];
  for (let i = 0; i < listResult.length; i++) {
    if (listResult[i].dt_txt.split(" ")[0] === todayStr) {
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
  console.log(dataAPI);
      $.ajax({
        type: "POST",
        url: "/predictModelAPI",
        data: JSON.stringify(dataAPI),
        contentType: "application/json",
        success: function (response) {
          console.log(response.data);
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
          console.log('MASUUUUUKKK')   
        }
      })
  contentContainer.innerHTML = template;
}

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

window.onload = function() {  
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
};

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




// Mulai prediksi

predictAPI = () =>{
    const selectedProvinsi = $('#select-provinsi').val();
    const selectedKota = $('#select-kota').val();

    const daerahFix = document.getElementById('locAPI');
    daerahFix.innerHTML = `Lokasi: ${selectedKota}, ${selectedProvinsi}`;

    const dataprovfix = selectedProvinsi.replace(/Kep. /g, '');
    const dataprovnospace = dataprovfix.replace(/\s+/g, '-');
    const datakotanospace = selectedKota.replace(/\s+/g, '-');

    const urlCuaca = `${dataprovnospace}/${datakotanospace}`;

    axios.get(API_ENDPOINT.kota(urlCuaca))
    .then((res) => {
      const paramCuaca = res.data.data;
      const contentContainer = document.querySelector('#prediksiAPI');

        console.log(paramCuaca)
        let template = '';
        for (let i = 0; i <= 3; i += 1) {
          const dataKelembaban = paramCuaca.params[0].times[i];
          const dataTemperatur = paramCuaca.params[5].times[i].celcius;
          const temperaturJadi = dataTemperatur.slice(0, -2);
          const dataKecepatan = paramCuaca.params[8].times[i];
          const dataCuaca = paramCuaca.params[6].times[i];
          const dateTimeString = dataKelembaban.datetime;
          const timeString = dateTimeString.substring(8);
          const hour = timeString.substring(0, 2);

          let suffix = 'AM';
          let formattedHours = hour;

          if (formattedHours >= 12) {
            suffix = 'PM';
            if (formattedHours > 12) {
              formattedHours -= 12;
            }
          }

          if (formattedHours === '00') {
            formattedHours = 12;
          } else if (formattedHours === '06') {
            formattedHours = 6;
          }

          let timesuf = `${formattedHours} ${suffix}`;

          let imgTime = getTimeImage(timesuf);

          template += `
          <div class="row g-0 p-2 align-items-center">
          <div class="col-md-3 d-flex flex-wrap justify-content-center">
            <h5 class="text-center">${timesuf}</h5>
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
                        <p class="card-text">${temperaturJadi} °C</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-6 pt-2">
                    <div class="row align-items-center">
                      <div class="col-2"><i class="bi bi-droplet-fill fs-2"></i></div> 
                      <div class="col-10">                     
                        <h6 class="card-title m-0">Kelembaban Udara</h6>
                        <p class="card-text">${dataKelembaban.value}</p>
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
                        <p class="card-text">${dataKecepatan.kph} km/h</p>
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
                        <p class="card-text">1010 mb</p>                           
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
        </div>
        `;
          contentContainer.innerHTML = template;
        }
      })
      .catch((error) => {
        console.error(error);
      });
}



