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
              name="category"
              rules="required"
          >
            <label for="category" class="form-label">Name</label>
            <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                id="category"
                v-model="form.Category"
                placeholder="Enter Name"
            >
            <div class="invalid-feedback">
              {{ errors[0] }}
            </div>
          </validation-provider>
        </div>
        <div class="col-12 mb-3">
          <label for="description" class="form-label">Description</label>
          <textarea
              type="text"
              class="form-control"
              id="description"
              v-model="form.description"
          ></textarea>
        </div>
      </div>
      <button type="submit" class="btn btn-primary btn-sm px-5 me-3">Save</button>
      <slot name="cancel"></slot>
    </form>
  </validation-observer>
</template>

<script>
export default {
  name: "CategoryForm",
  data() {
    return {
      loading: true,
      form: {
        Category: '',
        description: '',
      }
    }
  },
  mounted() {
    this.loading = false
  },
  methods: {
    resetForm() {
      this.form = {
        Category: '',
        description: '',
      }
      this.$refs.observer.reset();
    },
    submit() {
      let data = new FormData
      data.append('Category', this.form.Category)
      data.append('description', this.form.description)

      this.$repository.category.create(data)
          .then(() => {
            this.$toast.success('Category Added')
            this.resetForm();
            this.$emit('created')
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