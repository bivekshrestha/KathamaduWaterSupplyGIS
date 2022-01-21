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
              name="location id"
              rules="required"
          >
            <label for="location_id" class="form-label">Locational ID</label>
            <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                id="location_id"
                v-model="form.location_id"
                placeholder="Locational ID"
            >
            <div class="invalid-feedback">
              {{ errors[0] }}
            </div>
          </validation-provider>
        </div>

        <div class="col-12 mb-3">
          <validation-provider
              v-slot="{ errors, pristine }"
              name="latitude"
              rules="required"
          >
            <label for="latitude" class="form-label">Latitude</label>
            <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                id="latitude"
                v-model="form.latitude"
                placeholder="Latitude"
            >
            <div class="invalid-feedback">
              {{ errors[0] }}
            </div>
          </validation-provider>
        </div>

        <div class="col-12 mb-3">
          <validation-provider
              v-slot="{ errors, pristine }"
              name="longitude"
              rules="required"
          >
            <label for="longitude" class="form-label">Longitude</label>
            <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                id="longitude"
                v-model="form.longitude"
                placeholder="Longitude"
            >
            <div class="invalid-feedback">
              {{ errors[0] }}
            </div>
          </validation-provider>
        </div>

        <div class="col-12 mb-3">
          <validation-provider
              v-slot="{ errors, pristine }"
              name="Altitude"
              rules=""
          >
            <label for="Altitude" class="form-label">Altitude</label>
            <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                id="Altitude"
                v-model="form.Altitude"
                placeholder="Altitude"
            >
            <div class="invalid-feedback">
              {{ errors[0] }}
            </div>
          </validation-provider>
        </div>

        <div class="col-12 mb-3">
          <validation-provider
              v-slot="{ errors, pristine }"
              name="Ward"
              rules=""
          >
            <label for="Ward" class="form-label">Ward</label>
            <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                id="Ward"
                v-model="form.Ward"
                placeholder="Ward"
            >
            <div class="invalid-feedback">
              {{ errors[0] }}
            </div>
          </validation-provider>
        </div>

        <div class="col-12 mb-3">
          <validation-provider
              v-slot="{ errors, pristine }"
              name="Localname"
              rules=""
          >
            <label for="Localname" class="form-label">Localname</label>
            <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                id="Localname"
                v-model="form.Localname"
                placeholder="Localname"
            >
            <div class="invalid-feedback">
              {{ errors[0] }}
            </div>
          </validation-provider>
        </div>

        <div class="col-12 mb-3">
          <validation-provider
              v-slot="{ errors, pristine }"
              name="Municipality"
              rules="required"
          >
            <label for="Municipality" class="form-label">Municipality</label>
            <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                id="Municipality"
                v-model="form.Municipality"
                placeholder="Municipality"
            >
            <div class="invalid-feedback">
              {{ errors[0] }}
            </div>
          </validation-provider>
        </div>

        <div class="col-12 mb-3">
          <validation-provider
              v-slot="{ errors, pristine }"
              name="owner_name"
              rules=""
          >
            <label for="owner_name" class="form-label">Owner's Name</label>
            <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                id="owner_name"
                v-model="form.owner_name"
                placeholder="Owner's Name"
            >
            <div class="invalid-feedback">
              {{ errors[0] }}
            </div>
          </validation-provider>
        </div>

        <div class="col-12 mb-3">
          <validation-provider
              v-slot="{ errors, pristine }"
              name="started date"
              rules="required"
          >
            <label for="started_date" class="form-label">Started Date</label>
            <input
                type="date"
                class="form-control"
                :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                id="started_date"
                v-model="form.Started_date"
                placeholder="Started Date"
            >
            <div class="invalid-feedback">
              {{ errors[0] }}
            </div>
          </validation-provider>
        </div>

        <div class="col-12 mb-3">
          <validation-provider
              v-slot="{ errors, pristine }"
              name="End date"
              rules=""
          >
            <label for="end_date" class="form-label">End Date</label>
            <input
                type="date"
                class="form-control"
                :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                id="end_date"
                v-model="form.End_date"
                placeholder="End Date"
            >
            <div class="invalid-feedback">
              {{ errors[0] }}
            </div>
          </validation-provider>

          <div class="col-12 mb-3">
            <validation-provider
                v-slot="{ errors, pristine }"
                name="operational"
                rules=""
            >
              <label class="form-label">Operational</label>
              <select
                  class="form-control"
                  :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                  id="operational"
                  v-model="form.Operational"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
              <div class="invalid-feedback">
                {{ errors[0] }}
              </div>
            </validation-provider>

            <div class="col-12 mb-3">
              <validation-provider
                  v-slot="{ errors, pristine }"
                  name="variable"
                  rules="required"
              >
                <label class="form-label">Variable</label>
                <v-select
                    :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                    v-model="form.variable"
                    :options="options.variables"
                    label="variable"
                    :reduce="item => item.id"
                    multiple
                ></v-select>
                <div class="invalid-feedback">
                  {{ errors[0] }}
                </div>
              </validation-provider>
            </div>
          </div>

        </div>
      </div>
      <button type="submit" class="btn btn-primary px-5">Save</button>
    </form>
  </validation-observer>
</template>

<script>
export default {
  name: "LocationForm",
  data() {
    return {
      loading: true,
      options: {
        variables: []
      },
      form: {
        location_id: '',
        latitude: '',
        longitude: '',
        Altitude: '',
        Ward: '',
        Localname: '',
        Municipality: '',
        owners_name: '',
        Started_date: '',
        End_date: '',
        Operational: 'true',
        variable: []
      }
    }
  },
  mounted() {
    this.getVariables()
    this.loading = false
  },
  methods: {
    getVariables() {
      this.$repository.variables.all()
          .then(response => {
            this.options.variables = response.data.results;
          })
    },
    resetForm() {
      this.form = {
        location_id: '',
        latitude: '',
        longitude: '',
        Altitude: '',
        Ward: '',
        Localname: '',
        Municipality: '',
        owners_name: '',
        Started_date: '',
        End_date: '',
        Operational: 'true',
        variable: []
      }
      this.$refs.observer.reset();
    },
    submit() {
      let data = new FormData;

      for (let formKey in this.form) {
        data.append(formKey, this.form[formKey])
      }

      this.$repository.location.create(data)
          .then(() => {
            this.$toast.success('Location Added')
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