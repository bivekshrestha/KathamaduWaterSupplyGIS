<template>
  <div class="modal fade" id="viewallayerModal" tabindex="-1" aria-labelledby="viewallayerModalLabel"
       aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="viewallayerModalLabel">Layers</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-3">
              <div class="filterbar p-2">
                <div class="input-group">
                  <input type="text" class="form-control f-11" placeholder="Search now" aria-label="search"
                         aria-describedby="search">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="search"><i class="fas fa-search"></i></span>
                  </div>
                </div>
                <div class="box border-bottom">
                  <div class="box-label text-uppercase d-flex align-items-center">Category
                    <button
                        class="btn ml-auto"
                        type="button"
                        data-toggle="collapse"
                        data-target="#inner-box"
                        aria-expanded="false"
                        aria-controls="inner-box"
                        id="out"
                    >
                      <!--                      <span class="fas fa-plus"></span>-->
                    </button>
                  </div>
                  <div id="inner-box" class=" mt-2 mr-1">
                  </div>
                </div>

              </div>
            </div>
            <div class="col-md-8">
              <div class="filter_right">
                <form class="" method="get" action="">
                  <div
                      class="form-check form-check-inline">
                    <input
                        type="checkbox"
                        class="form-check-input"
                        checked="checked"
                        id="defaultInline1"
                    >
                    <label
                        class="btn btn-outline-primary btn-rounded small "
                        for="defaultInline1"
                    >
                      A
                    </label>

                  </div>
                  <div class="form-check form-check-inline">
                    <input
                        type="checkbox"
                        class="form-check-input"
                        id="defaultInline2"
                    >
                    <label
                        class="btn btn-outline-primary btn-rounded small"
                        for="defaultInline2"
                    >
                      B
                    </label>
                  </div>
                </form>
              </div>
              <hr>
              <div class="category_list">
                <p class="mb-0 fw-bold pb-0">Please Select Layers</p>
                <div class="row">
                  <div class="col-md-3 layerinner">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                      <label class="form-check-label" for="defaultCheck1">
                        <i class="fas fa-ellipsis-v"></i> Layer 1
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div class="modal-footer">
          <div class="mybtn">
            <button class="btn btn-primary rounded-0 px-2 mb-2 mb-lg-0 me-3 addnewbtn allbtn">
              <span class="d-flex align-items-center"><span class="small">Add</span></span>
            </button>
            <button class="btn btn-danger border-0 rounded-0 px-2 mb-2 mb-lg-0  allbtn" data-bs-dismiss="modal">
              <span class="d-flex align-items-center"><span class="small">Cancel</span></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LayersViewModal"
}
</script>

<style scoped>

</style>