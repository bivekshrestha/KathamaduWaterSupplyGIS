<template>
  <div>
    <div class="page-title-overlap bg-theme pt-4">
      <div class="container d-lg-flex justify-content-between py-2 py-lg-3">
        <div class="order-lg-1 pe-lg-4 text-center text-lg-start">
          <!--          <h1 class="h3 text-light mb-0">Profile</h1>-->
        </div>
      </div>
    </div>
    <!-- explore layer css -->
    <div class="container pb-5 mb-2 mb-md-4">
      <div class="row w-71 m-auto">
        <!-- Sidebar-->
        <aside class="col-lg-4 pt-4 pt-lg-0 pe-xl-5">
          <div class="bg-white rounded-3 shadow-lg pt-1 mb-5 mb-lg-0">
            <div class="d-md-flex justify-content-between align-items-center text-center text-md-start p-4">
              <div class="d-md-flex align-items-center">
                <div
                    class="img-thumbnail rounded-circle position-relative flex-shrink-0 mx-auto mb-2 mx-md-0 mb-md-0"
                    style="width: 6.375rem;"
                >
                  <img class="rounded-circle img-fluid" src="@/assets/img/profile.png" alt="Profile Picture">
                </div>
                <div class="ps-md-3">
                  <h3 class="fs-base mb-0">Name of user</h3>
                  <span class="text-accent fs-sm">a@user.vom</span>
                </div>
              </div>
            </div>
            <div class="d-lg-block collapse" id="account-menu">

              <div class="bg-secondary px-4 py-3">
                <h3 class="fs-sm mb-0 text-muted">Account settings</h3>
              </div>
              <ul class="list-unstyled mb-0">
                <li class="border-bottom mb-0">
                  <a class="nav-link-style d-flex align-items-center px-4 py-3 active" href="#">
                    <i class="fas fa-user opacity-60 me-2"></i>Profile
                  </a>
                </li>
                <li class="border-bottom mb-0">
                  <a class="nav-link-style d-flex align-items-center px-4 py-3" href="#">
                    <i class="fas fa-tools opacity-60 me-2"></i>Settings
                  </a>
                </li>
                <li class="border-top mb-0">
                  <a class="nav-link-style d-flex align-items-center px-4 py-3" href="">
                    <i class="fas fa-power-off opacity-60 me-2"></i>Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </aside>
        <!-- Content  -->
        <section class="col-lg-8" v-if="!loading">
          <!-- Toolbar-->
          <div class="d-none d-lg-flex justify-content-between align-items-center pt-lg-3 pb-4 pb-lg-5 mb-lg-3">
            <h6 class="fs-base text-light mb-0">Update you profile details below:</h6>
          </div>
          <!-- Profile form-->
          <div class="bg-white p-3">
            <validation-observer
                ref="observer"
                v-slot="{ handleSubmit }"
            >
              <form @submit.prevent="handleSubmit(updateProfile)">
                <div class="row gx-4 gy-3">
                  <div class="col-12 col-md-6">
                    <label class="form-label" for="first_name">First Name</label>
                    <input
                        class="form-control"
                        type="text"
                        id="first_name"
                        v-model="form.first_name"
                    >
                  </div>
                  <div class="col-12 col-md-6">
                    <label class="form-label" for="last_name">Last Name</label>
                    <input
                        class="form-control"
                        type="text"
                        id="last_name"
                        v-model="form.last_name"
                    >
                  </div>
                  <div class="col-12 col-md-6">
                    <label class="form-label" for="date_of_birth">Date of Birth</label>
                    <input
                        class="form-control"
                        type="date"
                        id="date_of_birth"
                        v-model="form.profile.dob"
                    >
                  </div>
                  <div class="col-12 col-md-6">
                    <label class="form-label" for="address">Address</label>
                    <input
                        class="form-control"
                        type="text"
                        id="address"
                        v-model="form.profile.address"
                    >
                  </div>
                  <div class="col-12 col-md-6">
                    <label class="form-label" for="district">District</label>
                    <div class="password-toggle">
                      <input
                          class="form-control"
                          type="text"
                          id="district"
                          v-model="form.profile.district"
                      >
                    </div>
                  </div>
                  <div class="col-12 col-md-6">
                    <label class="form-label" for="municipality">Municipality</label>
                    <div class="password-toggle">
                      <input
                          class="form-control"
                          type="text"
                          id="municipality"
                          v-model="form.profile.Municipality"
                      >
                    </div>
                  </div>

                  <div class="col-12 col-md-6">
                    <validation-provider
                        v-slot="{ errors, pristine, validate }"
                        name="document"
                        rules="required"
                    >
                      <label for="photo" class="form-label">Profile Picture</label>
                      <input
                          type="file"
                          ref="file"
                          class="form-control"
                          :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                          id="photo"
                          @input="validate"
                          @change="processFile"
                      >
                      <div class="invalid-feedback">
                        {{ errors[0] }}
                      </div>
                    </validation-provider>
                  </div>

                  <div class="col-md-12">
                    <div class="mybtn pad_left">
                      <button class="btn btn-primary rounded-0 px-2 mb-2 mb-lg-0 addnewbtn allbtn">
                        <span class="d-flex align-items-center"><span class="small">Save & Update</span></span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </validation-observer>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Profile",
  data() {
    return {
      loading: true,
      form: {
        email: '',
        first_name: '',
        last_name: '',
        profile: {
          fullname: '',
          dob: '',
          address: '',
          district: '',
          Municipality: '',
          photo: null,
        },
      }
    }
  },
  mounted() {
    this.getUser();
  },
  methods: {
    processFile() {
      this.form.profile.photo = this.$refs.file.files[0]
    },
    async getUser() {
      await this.$repository.user.show(1)
          .then(res => {
            this.form = res.data;
            this.loading = false;
          })
    },
    async updateProfile() {
      this.form.profile.fullname = this.form.first_name + ' ' + this.form.last_name;

      await this.$repository.user.update(this.form, 1)
          .then(res => {
            console.log(res);
          })
    }
  }
}
</script>

<style scoped>

</style>