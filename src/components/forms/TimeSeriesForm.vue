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
              name="value"
              rules="required"
          >
            <label for="value" class="form-label">Value</label>
            <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                id="value"
                v-model="form.value"
                placeholder="Value"
            >
            <div class="invalid-feedback">
              {{ errors[0] }}
            </div>
          </validation-provider>
        </div>

        <div class="col-12 mb-3">
          <validation-provider
              v-slot="{ errors, pristine }"
              name="date"
              rules="required"
          >
            <label for="date" class="form-label">Date</label>
            <input
                type="date"
                class="form-control"
                :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                id="date"
                v-model="form.date"
                placeholder="Date"
            >
            <div class="invalid-feedback">
              {{ errors[0] }}
            </div>
          </validation-provider>
        </div>

        <div class="col-12 mb-3">
          <validation-provider
              v-slot="{ errors, pristine }"
              name="Source type"
              rules=""
          >
            <label for="source_type" class="form-label">Source Type</label>
            <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                id="source_type"
                v-model="form.Sourcetype"
                placeholder="Source Type"
            >
            <div class="invalid-feedback">
              {{ errors[0] }}
            </div>
          </validation-provider>
        </div>

        <div class="col-12 mb-3">
          <validation-provider
              v-slot="{ errors, pristine }"
              name="Measured By"
              rules=""
          >
            <label for="measured_by" class="form-label">Measured By</label>
            <select
                v-model="form.measured_by"
                id="measured_by"
                class="form-control"
                :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
            >
              <option value="" disabled selected>Select User</option>
              <option
                  v-for="user in options.users"
                  :key="user.email"
                  :value="user.profile ? user.profile.fullname : user.username "
              >
                {{ user.profile ? user.profile.fullname : user.username }} ({{ user.email }})
              </option>
            </select>
            <div class="invalid-feedback">
              {{ errors[0] }}
            </div>
          </validation-provider>
        </div>

        <div class="col-12 mb-3">
          <validation-provider
              v-slot="{ errors, pristine }"
              name="Variable"
              rules="required"
          >
            <label class="form-label">Variable</label>
            <v-select
                :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                v-model="form.variable"
                :options="options.variables"
                label="variable"
                :reduce="item => item.variable"
            ></v-select>
            <div class="invalid-feedback">
              {{ errors[0] }}
            </div>
          </validation-provider>
        </div>

        <div class="col-12 mb-3">
          <validation-provider
              v-slot="{ errors, pristine }"
              name="location"
              rules="required"
          >
            <label class="form-label">Location</label>
            <v-select
                plceholder="Select Location"
                :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                v-model="form.location"
                :options="options.locations"
                label="Localname"
                :reduce="item => item.location_id"
            ></v-select>
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
  name: "TimeSeriesForm",
  data() {
    return {
      loading: true,
      options: {
        variables: [],
        locations: [],
        users: []
      },
      form: {
        value: '',
        Sourcetype: '',
        date: '',
        measured_by: '',
        variable: null,
        location: null,
      }
    }
  },
  mounted() {
    this.loading = false;
    this.getData();
  },
  methods: {
    async getData() {
      await this.$repository.variables.all()
          .then(response => {
            this.options.variables = response.data.results;
          })

      await this.$repository.location.all()
          .then(response => {
            this.options.locations = response.data.results;
          })

      await this.$repository.user.get()
          .then(res => {
            this.options.users = res.data
          })
    },
    resetForm() {
      this.form = {
        value: '',
        Sourcetype: '',
        date: '',
        measured_by: '',
        variable: null,
        location: null,
      }
      this.$refs.observer.reset();
    },
    submit() {
      let data = new FormData;

      for (let formKey in this.form) {
        data.append(formKey, this.form[formKey])
      }

      this.$repository.timeSeries.create(data)
          .then(() => {
            this.$toast.success('Time Series Added')
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