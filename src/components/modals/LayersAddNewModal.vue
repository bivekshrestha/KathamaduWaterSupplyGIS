<template>
  <div class="modal fade" id="addlayerModal" tabindex="-1" aria-labelledby="addlayerModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addlayerModalLabel">Add New Layer</h5>
          <button type="button" ref="closeBtn" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="addacc_form">
            <layers-form @created="closeModal"></layers-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LayersForm from "../forms/LayersForm";

export default {
  name: "LayersAddNewModal",
  components: {LayersForm},
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