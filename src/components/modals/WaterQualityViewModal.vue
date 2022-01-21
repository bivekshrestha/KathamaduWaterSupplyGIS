<template>
  <div class="modal fade" id="watermapModal" tabindex="-1" aria-labelledby="watermapModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered  modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="watermapModalLabel">Water Quality Full Map</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="qualityimg">
            <img src="assets/img/map2.png" class="img-fluid w-100" alt="">

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WaterQualityViewModal"
}
</script>

<style scoped>

</style>