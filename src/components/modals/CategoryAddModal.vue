<template>
  <div class="modal fade"
       id="categoryAddModal"
       tabindex="-1"
       aria-labelledby="categoryAddModalLabel"
       aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addlayerModalLabel">Add New Category</h5>
          <button type="button" ref="closeBtn" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <category-form @created="closeModal"></category-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CategoryForm from "../forms/CategoryForm";

export default {
  name: "CategoryAddModal",
  components: {CategoryForm},
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