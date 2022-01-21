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
              name="variable id"
              rules="required"
          >
            <label for="variable_id" class="form-label">Variable ID</label>
            <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                id="variable_id"
                v-model="form.variable_id"
                placeholder="Variable ID"
            >
            <div class="invalid-feedback">
              {{ errors[0] }}
            </div>
          </validation-provider>
        </div>

        <div class="col-12 mb-3">
          <validation-provider
              v-slot="{ errors, pristine }"
              name="variable"
              rules="required"
          >
            <label for="variable" class="form-label">Variable</label>
            <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                id="variable"
                v-model="form.variable"
                placeholder="Variable"
            >
            <div class="invalid-feedback">
              {{ errors[0] }}
            </div>
          </validation-provider>
        </div>

        <div class="col-12 mb-3">
          <validation-provider
              v-slot="{ errors, pristine }"
              name="name"
              rules=""
          >
            <label for="name" class="form-label">Name</label>
            <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                id="name"
                v-model="form.Name"
                placeholder="Name"
            >
            <div class="invalid-feedback">
              {{ errors[0] }}
            </div>
          </validation-provider>
        </div>

        <div class="col-12 mb-3">
          <validation-provider
              v-slot="{ errors, pristine }"
              name="description"
              rules=""
          >
            <label for="description" class="form-label">Description</label>
            <textarea
                class="form-control"
                :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                id="description"
                v-model="form.Description"
                placeholder="Description"
            >
            </textarea>
            <div class="invalid-feedback">
              {{ errors[0] }}
            </div>
          </validation-provider>
        </div>

        <div class="col-12 mb-3">
          <validation-provider
              v-slot="{ errors, pristine }"
              name="unit"
              rules=""
          >
            <label for="unit" class="form-label">Unit</label>
            <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                id="unit"
                v-model="form.Unit"
                placeholder="Unit"
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
  name: "VariablesForm",
  data() {
    return {
      loading: true,
      form: {
        variable_id: '',
        variable: '',
        Name: '',
        Description: '',
        Unit: '',
      }
    }
  },
  mounted() {
    this.loading = false
  },
  methods: {
    resetForm() {
      this.form = {
        variable_id: '',
        variable: '',
        Name: '',
        Description: '',
        Unit: '',
      }
      this.$refs.observer.reset();
    },
    submit() {
      let data = new FormData;

      for (let formKey in this.form) {
        data.append(formKey, this.form[formKey])
      }

      this.$repository.variables.create(data)
          .then(() => {
            this.$toast.success('Variables Added')
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