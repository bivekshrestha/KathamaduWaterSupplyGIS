<template>
  <div class="modal fade"
       id="addLocationModal"
       tabindex="-1"
       aria-labelledby="addLocationModalLabel"
       aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addlayerModalLabel">Add New Location</h5>
          <button type="button" ref="closeBtn" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <location-form @created="closeModal"></location-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LocationForm from "../forms/LocationForm";
export default {
  name: "AddLocationModal",
  components: {LocationForm},
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