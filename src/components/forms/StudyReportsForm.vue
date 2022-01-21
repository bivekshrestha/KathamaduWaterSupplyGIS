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
              name="title"
              rules="required"
          >
            <label for="title" class="form-label">Title</label>
            <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                id="title"
                v-model="form.Title"
                placeholder="Title"
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
              rules="required"
          >
            <label for="description" class="form-label">Description/Abstract</label>
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
        <div class="col-12 mb-3">
          <validation-provider
              v-slot="{ errors, pristine, validate }"
              name="image"
              rules="required"
          >
            <label for="image" class="form-label">Image</label>
            <input
                type="file"
                ref="file"
                class="form-control"
                :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                id="image"
                @input="validate"
                @change="processFile('image')"
            >
            <div class="invalid-feedback">
              {{ errors[0] }}
            </div>
          </validation-provider>
        </div>
        <div class="col-12 mb-3">
          <validation-provider
              v-slot="{ errors, pristine, validate }"
              name="file"
              rules="required"
          >
            <label for="file" class="form-label">File</label>
            <input
                type="file"
                ref="fileUpload"
                class="form-control"
                :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                id="file"
                @input="validate"
                @change="processFile('file')"
            >
            <div class="invalid-feedback">
              {{ errors[0] }}
            </div>
          </validation-provider>
        </div>
        <div class="col-12 mb-3">
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
        <div class="col-12 mb-3">
          <validation-provider
              v-slot="{ errors, pristine }"
              name="reported_by"
              rules=""
          >
            <label for="reported_by" class="form-label">Reported By</label>
            <select
                v-model="form.Reported_by"
                id="reported_by"
                class="form-control"
                :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
            >
              <option value="" disabled selected>Select User</option>
              <option
                  v-for="user in options.users"
                  :key="user.profile ? user.profile.fullname : user.username "
              >
                {{ user.profile ? user.profile.fullname : user.username }} ({{ user.email }})
              </option>
            </select>
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
  name: "StudyReportsForm",
  data() {
    return {
      loading: true,
      form: {
        Title: '',
        Description: '',
        Image: null,
        fileupload: null,
        keywords: '',
        Reported_by: ''
      },
      options: {
        users: []
      }
    }
  },
  mounted() {
    this.getSelectionData();
    this.loading = false
  },
  methods: {
    async getSelectionData() {
      await this.$repository.user.get()
          .then(res => {
            this.options.users = res.data
          })
    },
    processFile(type) {
      if (type === 'image') {
        this.form.Image = this.$refs.file.files[0]
      } else {
        this.form.fileupload = this.$refs.fileUpload.files[0]
      }
    },
    resetForm() {
      this.form = {
        Title: '',
        Description: '',
        Image: null,
        fileupload: null,
        keywords: '',
        Reported_by: ''
      }
      this.$refs.observer.reset();
    },
    submit() {
      let data = new FormData;

      for (let formKey in this.form) {
        data.append(formKey, this.form[formKey])
      }

      this.$repository.studyReports.create(data)
          .then(() => {
            this.$toast.success('Reports Added')
            this.resetForm();
            this.$emit('created');
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