<template>
  <div class="modal fade"
       id="addTimeSeriesModal"
       tabindex="-1"
       aria-labelledby="addTimeSeriesModalLabel"
       aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addlayerModalLabel">Add New TimeSeries</h5>
          <button type="button" ref="closeBtn" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <time-series-form @created="closeModal"></time-series-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TimeSeriesForm from "../forms/TimeSeriesForm";
export default {
  name: "AddTimeSeriesModal",
  components: {TimeSeriesForm},
  methods: {
    closeModal() {
      this.$refs.closeBtn.click();
      this.$emit('added');
    }
  }
}
</script>

<style scoped>

</style>