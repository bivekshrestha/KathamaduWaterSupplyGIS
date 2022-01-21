<template>
  <div class="card card-body">
    <div class="addacc_form row">
      <validation-observer
          ref="observer"
          v-slot="{ handleSubmit }"
      >
        <form @submit.prevent="handleSubmit(submit)">
          <div class="row">
            <div class="col-12 col-md-6 mb-3">
              <validation-provider
                  v-slot="{ errors, pristine }"
                  name="layer name"
                  rules="required"
              >
                <label for="layer-name" class="form-label">Layer Name</label>
                <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                    id="layer-name"
                    v-model="form.Layer_Name"
                    placeholder="Layer Name"
                >
                <div class="invalid-feedback">
                  {{ errors[0] }}
                </div>
              </validation-provider>
            </div>

            <div class="col-12 col-md-6 mb-3">
              <validation-provider
                  v-slot="{ errors, pristine, validate }"
                  name="document"
                  rules=""
              >
                <label for="document" class="form-label">Document</label>
                <input
                    type="file"
                    ref="file"
                    class="form-control"
                    :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                    id="document"
                    @input="validate"
                    @change="processFile"
                >
                <div class="invalid-feedback">
                  {{ errors[0] }}
                </div>
              </validation-provider>
            </div>

            <div class="col-12 col-md-6 mb-3">
              <validation-provider
                  v-slot="{ errors, pristine }"
                  name="description"
                  rules=""
              >
                <label for="description" class="form-label">Description</label>
                <textarea
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                    id="description"
                    v-model="form.Description"
                ></textarea>
                <div class="invalid-feedback">
                  {{ errors[0] }}
                </div>
              </validation-provider>
            </div>

            <div class="col-12 col-md-6 mb-3">
              <validation-provider
                  v-slot="{ errors, pristine }"
                  name="keywords"
                  rules=""
              >
                <label for="keywords" class="form-label">Keywords</label>
                <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                    id="keywords"
                    v-model="form.keywords"
                    placeholder="Keywords"
                >
                <div class="invalid-feedback">
                  {{ errors[0] }}
                </div>
              </validation-provider>
            </div>

            <div class="col-12 col-md-6 mb-3">
              <validation-provider
                  v-slot="{ errors, pristine }"
                  name="File Type"
                  rules="required"
              >
                <label class="form-label">File Type</label>
                <v-select
                    placeholder="Select File Type"
                    class="bg-white"
                    :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                    v-model="form.File_Type"
                    :options="options.fileTypes"
                    label="Filetype"
                    :reduce="item => item.Filetype"
                ></v-select>
                <div class="invalid-feedback">
                  {{ errors[0] }}
                </div>
              </validation-provider>
            </div>

            <div class="col-12 col-md-6 mb-3">
              <validation-provider
                  v-slot="{ errors, pristine }"
                  name="Category"
                  rules="required"
              >
                <label class="form-label">Category</label>
                <v-select
                    placeholder="Select Category"
                    class="bg-white"
                    :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                    v-model="form.Category"
                    :options="options.categories"
                    label="Category"
                    :reduce="item => item.Category"
                ></v-select>
                <div class="invalid-feedback">
                  {{ errors[0] }}
                </div>
              </validation-provider>
            </div>

            <div class="col-12 mb-3">
              <button type="submit" class="btn btn-primary btn-sm rounded-0 me-3">Update</button>
              <slot name="cancel"></slot>
            </div>
          </div>
        </form>
      </validation-observer>
    </div>
  </div>
</template>

<script>
export default {
  name: "LayersEditFormAlternate",
  props: {
    layer: {
      required: true
    }
  },
  data() {
    return {
      loading: true,
      options: {
        fileTypes: [],
        categories: []
      },
      form: {
        Layer_Name: '',
        document: '',
        description: '',
        keywords: '',
        File_Type: '',
        Category: ''
      }
    }
  },
  watch: {
    layer() {
      this.setData()
    }
  },
  mounted() {
    this.loading = false
    this.getData()
    this.setData()
  },
  methods: {
    getData() {
      this.$repository.category.all()
          .then(response => {
            this.options.categories = response.data.results;
          })

      this.$repository.fileType.all()
          .then(response => {
            this.options.fileTypes = response.data.results;
          })
    },
    setData() {
      this.loading = true;
      if(this.layer){
        this.form = this.layer
        this.form.Category = this.layer.Category.Category
        this.form.File_Type = this.layer.File_Type.Filetype
      }
      this.loading = false;
    },
    processFile() {
      this.form.document = this.$refs.file.files[0]
    },
    submit() {
      let data = new FormData;

      for (let formKey in this.form) {
        data.append(formKey, this.form[formKey])
      }

      this.$repository.document.edit(data, this.layer.id)
          .then(() => {
            this.$refs.file.value = null;
            this.$refs.observer.reset();
            this.$toast.success('Layers Updated')
            this.$emit('updated');
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