<template>
  <section class="pt-50 pb-5">
    <div class="container pt-5 d-flex align-items-center justify-content-center m-auto login" style="min-height: 65vh">
      <div class="card m-auto col-md-3 p-5">
        <div class="text-center intro">
          <img src="@/assets/img/logo.png" width="160" class="m-auto">
        </div>
        <validation-observer
            ref="observer"
            v-slot="{ handleSubmit }"
        >
          <form @submit.prevent="handleSubmit(submit)">
            <div class="mt-4 text-center">
              <h4>Reset Password</h4>
              <validation-provider
                  v-slot="{ errors, pristine }"
                  name="email"
                  rules="required"
              >
                <div class="mt-3 inputbox">
                  <input
                      type="text"
                      class="form-control"
                      name="email"
                      placeholder="Email"
                      v-model="form.email"
                      :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                  >
                  <i class="fa fa-user"></i>
                  <div class="invalid-feedback">
                    {{ errors[0] }}
                  </div>
                </div>
              </validation-provider>
            </div>

            <div class="mybtn m-auto mt-3">
              <button
                  type="submit"
                  class="btn btn-primary rounded-0 px-5 mb-2 mb-lg-0 me-3 addnewbtn allbtn"
              >
                <span class="d-flex align-items-center"><span class="small">Reset</span></span>
              </button>
            </div>
          </form>
        </validation-observer>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "PasswordResetRequest",
  data() {
    return {
      form: {
        email: ''
      }
    }
  },
  methods: {
    async submit() {
      let data = new FormData;
      data.append('email', this.form.email)
      await this.$repository.password.request(data)
          .then(() => {

          })
          .catch(() => {

          })
    },
  }
}
</script>

<style scoped>

</style>