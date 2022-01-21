<template>
  <validation-observer
      ref="observer"
      v-slot="{ handleSubmit }"
  >
    <form @submit.prevent="handleSubmit(submit)">
      <div class="row">
        <div class="col-12 mb-3">
          <validation-provider
              v-slot="{ errors, pristine }"
              name="filetype"
              rules="required"
          >
            <label for="filetype" class="form-label">File Type</label>
            <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                id="filetype"
                v-model="form.Filetype"
                placeholder="File Type"
            >
            <div class="invalid-feedback">
              {{ errors[0] }}
            </div>
          </validation-provider>
        </div>
      </div>
      <button type="submit" class="btn btn-primary px-5">Save</button>
    </form>
  </validation-observer>
</template>

<script>
export default {
  name: "FileTypesForm",
  data() {
    return {
      loading: true,
      form: {
        Filetype: '',
      }
    }
  },
  mounted() {
    this.loading = false
  },
  methods: {
    resetForm() {
      this.$refs.observer.reset();
      this.form = {
        Filetype: '',
      }
    },
    submit() {
      let data = new FormData;

      for (let formKey in this.form) {
        data.append(formKey, this.form[formKey])
      }

      this.$repository.fileType.create(data)
          .then(() => {
            this.$toast.success('File Type Added')
            this.resetForm();
            this.$emit('created');
          })
          .catch(error => {
            if(error.response.status === 401){
              this.$toast.warning('You are not authorized. Please login and try again.')
            }
          })
          .finally(() => {
            this.loading = false
          })
    }
  }
}
</script>

<style scoped>

</style>