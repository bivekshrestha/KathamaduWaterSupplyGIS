<template>
  <div class="modal fade" id="addnewModal" tabindex="-1" aria-labelledby="addnewModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addnewModalLabel">Add New Water Quality</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="addacc_form">

            <div class="form-group">
              <div class=" pt-2">
                <label class="mb-0">Name</label>
                <input type="text" class="form-control" placeholder="Enter Name">
              </div>
            </div>
            <!-- end row -->
            <div class="form-group">
              <div class=" pt-2">
                <label class="mb-0">Water Quantity</label>
                <input type="text" class="form-control" placeholder="Enter Water Quantity">
              </div>
            </div>
            <!-- end row -->
            <div class="form-group">
              <div class=" pt-2">
                <label class="mb-0">Location</label>
                <input type="text" class="form-control" placeholder="Enter Location">
              </div>
            </div>
            <!-- end row -->
            <!-- end row -->
            <div class="form-group">
              <div class=" pt-2">
                <label class="mb-0">Water Quality</label>
                <input type="text" class="form-control" placeholder="Enter Water Quality">
              </div>
            </div>
            <!-- end row -->

            <!-- end row -->
            <div class="form-group">
              <div class=" pt-2">
                <label class="mb-0">Description (optional)</label>
                <textarea id="message" rows="2" class="form-control"></textarea>
              </div>
            </div>
            <!-- end row -->


          </div>
        </div>
        <div class="modal-footer">
          <div class="mybtn">
            <button class="btn btn-primary rounded-0 px-2 mb-2 mb-lg-0 addnewbtn allbtn">
        <span class="d-flex align-items-center">

            <span class="small">Add</span>
        </span>
            </button>
            <button class="btn btn-danger border-0 rounded-0 px-2 mb-2 mb-lg-0  allbtn" data-bs-dismiss="modal">
        <span class="d-flex align-items-center">

            <span class="small">Cancel</span>
        </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WaterQualityAddNewModal"
}
</script>

<style scoped>

</style>