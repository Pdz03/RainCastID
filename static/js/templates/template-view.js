const skeletonPredictLoc = (row) => {
    let template = ''
    for (let i = 0; i < row; i += 1) {
    template += `
    <div class="row g-0 p-2 align-items-center">
                <div class="col-md-3 d-flex flex-wrap justify-content-center">
                  <h5 class="skeleton skeleton-time"></h5>
                  <div class="skeleton skeleton-circle"></div>
                </div>
                <div class="col-md-9">
                  <div class="card-body">
                    <div class="container w-100">
                      <div class="row">
                        <div class="col-6 pt-2">
                          <div class="row align-items-center">
                            <div class="col-2"><div class="skeleton skeleton-icon"></div></div>
                            <div class="col-10">                          
                              <h6 class="card-title m-0 skeleton skeleton-title"></i></h6>
                            </div>
                          </div>
                        </div>
                        <div class="col-6 pt-2">
                          <div class="row align-items-center">
                            <div class="col-2"><div class="skeleton skeleton-icon"></div></div> 
                            <div class="col-10">                     
                              <h6 class="card-title m-0 skeleton skeleton-title"></h6>
                            </div> 
                          </div>   
                        </div>
                        <div class="col-6 pt-2">
                          <div class="row align-items-center">
                            <div class="col-2">
                              <div class="skeleton skeleton-icon"></div>
                            </div>
                            <div class="col-10">
                              <h6 class="card-title m-0 skeleton skeleton-title"></h6>
                            </div> 
                          </div>              
                        </div>
                        <div class="col-6 pt-2">
                          <div class="row align-items-center">
                            <div class="col-2">
                              <div class="skeleton skeleton-icon"></div>
                            </div>
                            <div class="col-10">
                              <h6 class="card-title m-0 skeleton skeleton-title"></h6>                         
                            </div>  
                          </div>
                        </div>
                      </div>
                      <hr>
                      <div class="row">
                      <h6 class="card-title m-0 text-danger" id="curahhujan[${i}]">SEDANG PROSES PERHITUNGAN PREDIKSI <div class="spinner-border" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div></h6>
                      <p class="card-text text-danger" id="warning">
                    </p> 
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr>
    `
}
    return template;
}

const skeletonPredictManual = () => {
  let template = `
  <div class="row g-0 p-2 align-items-center">
                <div class="card-body">
                  <div class="container w-100">
                    <div class="row">
                      <div class="col-6 pt-2">
                        <div class="row align-items-center">
                          <div class="col-2"><div class="skeleton skeleton-icon"></div></div>
                          <div class="col-10">                          
                            <h6 class="card-title m-0 skeleton skeleton-title"></i></h6>
                          </div>
                        </div>
                      </div>
                      <div class="col-6 pt-2">
                        <div class="row align-items-center">
                          <div class="col-2"><div class="skeleton skeleton-icon"></div></div> 
                          <div class="col-10">                     
                            <h6 class="card-title m-0 skeleton skeleton-title"></h6>
                          </div> 
                        </div>   
                      </div>
                      <div class="col-6 pt-2">
                        <div class="row align-items-center">
                          <div class="col-2">
                            <div class="skeleton skeleton-icon"></div>
                          </div>
                          <div class="col-10">
                            <h6 class="card-title m-0 skeleton skeleton-title"></h6>
                          </div> 
                        </div>              
                      </div>
                      <div class="col-6 pt-2">
                        <div class="row align-items-center">
                          <div class="col-2">
                            <div class="skeleton skeleton-icon"></div>
                          </div>
                          <div class="col-10">
                            <h6 class="card-title m-0 skeleton skeleton-title"></h6>                         
                          </div>  
                        </div>
                      </div>
                    </div>
                    <hr>
                    <div class="row">
                      <h6 class="card-title m-0 skeleton skeleton-title2"></h6>
                    </div>
                  </div>
                </div>
            </div>
  `
  return template;
}

const skeletonForumCard = (row) => {
  let template = ''
  for (let i = 0; i < row; i += 1) {
  template += `
  <div class="card mb-4">
  <div class="skeleton skeleton-img-top" alt="..."></div>
  <div class="card-body">
    <div class="meta-top">
      <div class="row px-3">
        <div class="skeleton skeleton-author"></div>
      </div>
      <hr />
      <div class="d-flex justify-content-between px-3">
        <div
          class="time-loc d-flex skeleton skeleton-timeloc"
        ></div>
        <div
          class="like-comment d-flex skeleton skeleton-likecom"
        ></div>
      </div>
      <div
        class="card-text deskripsi m-3 text-dark skeleton skeleton-content"
      ></div>
      <div
        class="card-text comment mx-3 skeleton skeleton-comment"
      ></div>
    </div>
  </div>
</div>
`
  }
  return template;
}

const loginModal = () =>{
  let template =`
<div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header text-white" style="background-color:#648CFF;">
                <h1 class="modal-title fs-5" id="loginModalLabel">Bergabung dengan RainCast ID</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body text-center">
                  <h3 class="mb-2" id="title-login">Masuk</h3>
                  <div id="regform" class="visually-hidden">
                    <h3 class="mb-2" id="title-register">Daftar</h3>
                    <div class="input-group mb-3" id="fg-username">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Masukkan Username"
                        aria-label="username"
                        aria-describedby="button-addon2"
                        id="form-username"
                      />
                    </div>
                    <h6
                      class="text-start mb-2"
                      id="help-username"
                    ></h6>
                  </div>
                  <div class="input-group mb-3" id="fg-email">
                    <input
                      type="email"
                      class="form-control"
                      placeholder="Masukkan Email"
                      aria-label="email"
                      aria-describedby="button-addon2"
                      id="form-email"
                    />
                  </div>
                  <h6 class="text-start mb-2" id="help-email"></h6>
                  <div class="input-group mb-1">
                    <input
                      type="password"
                      class="form-control"
                      placeholder="Masukkan Password"
                      aria-label="password"
                      aria-describedby="button-addon2"
                      id="form-password"
                    />
                    <span class="input-group-text" id="basic-addon3">
                      <i class="bi bi-eye-slash" id="togglePassword">
                      </i>
                    </span>
                  </div>
                  <h6
                    class="text-start text-dark mb-2"
                    id="help-password"
                  >
                    Masukkan password dengan 8-10 karakter, angka,
                    atau spesial karakter (!@#$%^&*)
                  </h6>
                  <div id="add-regform" class="visually-hidden">
                    <div class="input-group mb-3" id="fg-password2">
                      <input
                        type="password"
                        class="form-control"
                        placeholder="Masukkan Konfirmasi Password"
                        aria-label="password-confirm"
                        aria-describedby="button-addon2"
                        id="form-password2"
                      />
                      <span
                        class="input-group-text"
                        id="basic-addon3"
                      >
                        <i
                          class="bi bi-eye-slash"
                          id="togglePassword2"
                        >
                        </i>
                      </span>
                    </div>
                    <h6
                      class="text-start text-danger mb-2"
                      id="help-password2"
                    ></h6>
                    <button
                      class="btn btn-lg btn-block mb-2 btn-rcprimary"
                      onclick="register()"
                    >
                      Daftar
                    </button>
                    <button
                      class="btn btn-lg btn-block btn-rcdangerol mb-2"
                      onclick="resetform_register()"
                    >
                      Reset
                    </button>
                    <hr class="my-2" />
                    <p
                      style="
                        color: black;
                        font-size: medium;
                        font-style: normal;
                      "
                    >
                      Sudah punya akun?
                      <a
                        onclick="openlogin()"
                        class=""
                        style="cursor: pointer"
                        >Masuk di sini</a
                      >
                    </p>
                  </div>
                  <div id="add-logform">
                    <button
                      class="btn btn-lg btn-block mb-2 btn-rcprimary"
                      id="btn-login"
                      onclick="login()"
                    >
                      Masuk
                    </button>
                    <button
                      class="btn btn-lg btn-block mb-2 btn-rcdangerol"
                      id="btn-register"
                      onclick="resetform_login()"
                    >
                      Reset
                    </button>
                    <hr class="my-2" />
                    <p
                      style="
                        color: black;
                        font-size: medium;
                        font-style: normal;
                      "
                    >
                      Belum punya akun?
                      <a
                        onclick="openregister()"
                        style="cursor: pointer"
                        class=""
                        >Daftar di sini</a
                      >
                    </p>
                  </div>
              </div>
            </div>
          </div>
`;

return template;
}

const predictModal = () => {
  let template = `
  <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header text-white" style="background-color:#648CFF;">
            <h1 class="modal-title fs-5" id="cuacaModalLabel">Hasil Prediksi</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="empty"></button>
          </div>
          <div class="modal-body">
            <div class="sub-title">
              <h4 class="m-0" id="restitle"></h4>
              <p id="locAPI"></p>
            </div>
            <div class="card mb-3 px-3 align-items-end" id="prediksiAPI">
              
            </div>
          </div>
          <div class="modal-footer">
            <div id="msg"></div>
            <button id="btnSaveLoc" type="button" class="btn btn-primary" onclick="eventSaveLoc()">Simpan Lokasi</button>
            <button id="btnDeleteLoc" type="button" class="btn btn-danger" onclick="confirmDelete()">Hapus Lokasi</button>
          </div>
        </div>
      </div>
  `;

  return template;
}

const predictUserModal = () => {
  let template = `
  <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header text-white" style="background-color:#648CFF;">
            <h1 class="modal-title fs-5" id="cuacaModalLabel">Hasil Prediksi</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="empty-user"></button>
          </div>
          <div class="modal-body">
            <div class="sub-title">
              <h4 class="m-0" id="restitle"></h4>
              <p id="locAPI"></p>
            </div>
            <div id="btn-tanggal" class="mb-2"></div>
            <div class="card mb-3 px-3 align-items-end" id="prediksiAPI">
              
            </div>
          </div>
          <div class="modal-footer">
            <div id="msg"></div>
            <button id="btnSaveResult" type="button" class="btn btn-primary">Simpan Hasil Prediksi</button>
          </div>
        </div>
      </div>
  `;

  return template;
}