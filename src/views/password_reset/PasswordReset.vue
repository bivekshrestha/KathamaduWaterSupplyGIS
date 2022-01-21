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
              <div class="inputbox">
                <validation-provider
                    vid="password"
                    v-slot="{ errors, pristine }"
                    name="password"
                    rules="required"
                >
                  <input
                      type="password"
                      class="form-control"
                      placeholder="Password"
                      v-model="form.password"
                      :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                  >
                  <i class="fa fa-lock"></i>
                  <div class="invalid-feedback">
                    {{ errors[0] }}
                  </div>
                </validation-provider>
              </div>

              <div class="inputbox">
                <validation-provider
                    v-slot="{ errors, pristine }"
                    name="password confirmation"
                    rules="required|confirmed:password"
                >
                  <input
                      type="password"
                      class="form-control"
                      placeholder="Re-type Password"
                      v-model="form.password_confirmation"
                      :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                  >
                  <i class="fa fa-lock"></i>
                  <div class="invalid-feedback">
                    {{ errors[0] }}
                  </div>
                </validation-provider>
              </div>
            </div>

            <div v-if="errorMessage">
              <small class="text-danger">{{ errorMessage }}</small>
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
  name: "PasswordReset",
  data() {
    return {
      form: {
        password: '',
        password_confirmation: ''
      },
      token: '',
      errorMessage: null
    }
  },
  mounted() {
    if(this.$route.query.token){
      this.token = this.$route.query.token
      this.validateToken()
    }else {
      this.$toast.warning('No Token Found');
      this.$router.push({name: 'password-reset-request'})
    }
  },
  methods: {
    async validateToken() {
      let data = new FormData;
      data.append('token', this.token);

      await this.$repository.password.validate(data)
      .catch(() => {
        this.$toast.warning('Invalid Token');
        this.$router.push({name: 'password-reset-request'})
      })
    },
    async submit() {
      this.errorMessage = null;
      let data = new FormData;
      data.append('password', this.form.password);
      data.append('token', this.token);

      await this.$repository.password.confirm(data)
          .then(() => {
            this.$router.push({name: 'login'})
          })
          .catch(() => {
            this.errorMessage = 'Try another password.'
          })
    }
  }
}
</script>

<style scoped>

</style>