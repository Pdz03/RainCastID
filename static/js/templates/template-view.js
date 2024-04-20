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