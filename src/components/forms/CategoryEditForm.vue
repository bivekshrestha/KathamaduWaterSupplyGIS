<template>
  <validation-observer
      ref="observer"
      v-slot="{ handleSubmit }"
  >
    <form @submit.prevent="handleSubmit(submit)" v-if="category">
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
      <button type="submit" class="btn btn-primary btn-sm me-3 px-5">Update</button>
      <button type="button" class="btn btn-danger btn-sm px-5" @click.prevent="cancelUpdate">Cancel</button>
    </form>
  </validation-observer>
</template>

<script>
export default {
  name: "CategoryEditForm",
  props: {
    category: {
      required: true
    }
  },
  data() {
    return {
      loading: true,
      form: {
        Category: '',
        description: '',
      }
    }
  },
  watch: {
    category(){
      this.setData()
    }
  },
  mounted() {
    this.loading = false
    this.setData()
  },
  methods: {
    cancelUpdate(){
      this.$emit('cancel')
    },
    setData() {
      this.loading = true;
      this.form = this.category
      this.loading = false;
    },
    resetForm() {
      this.form = this.category
      this.$refs.observer.reset();
    },
    submit() {
      let data = new FormData
      data.append('Category', this.form.Category)
      data.append('description', this.form.description)

      this.$repository.category.edit(data, this.category.id)
          .then(() => {
            this.$toast.success('Category Updated')
            this.resetForm();
            this.$emit('updated')
          })
          .catch(error => {
            if (error.response.status === 401) {
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