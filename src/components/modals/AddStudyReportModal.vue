<template>
  <div class="modal fade"
       id="addReportModal"
       tabindex="-1"
       aria-labelledby="addReportModalLabel"
       aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addlayerModalLabel">Add New Report</h5>
          <button type="button" ref="closeBtn" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <study-reports-form @created="closeModal"></study-reports-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StudyReportsForm from "../forms/StudyReportsForm";
export default {
  name: "AddStudyReportModal",
  components: {StudyReportsForm},
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