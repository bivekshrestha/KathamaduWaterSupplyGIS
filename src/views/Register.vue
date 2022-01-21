<template>
  <div>
    <validation-observer
        ref="observer"
        v-slot="{ handleSubmit }"
    >
      <form @submit.prevent="handleSubmit(submit)">
        <section class="pt-50 pb-5">
          <div class="container pt-5 align-items-center justify-content-center m-auto">
            <div class="register login">
              <div class="card m-auto shadow">
                <div class="mt-4 text-center">
                  <img src="@/assets/img/logo.png" width="160" class="m-auto mb-3">
                  <h4 class="fw-bold">Register Now</h4> <span></span>

                  <div class="mt-3 inputbox">
                    <validation-provider
                        v-slot="{ errors, pristine }"
                        name="username"
                        rules="required"
                    >
                      <input
                          type="text" class="form-control"
                          placeholder="Username"
                          v-model="form.username"
                          :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                      >
                      <i class="fa fa-envelope-open"></i>
                      <div class="invalid-feedback">
                        {{ errors[0] }}
                      </div>
                    </validation-provider>
                  </div>

                  <div class="inputbox">
                    <validation-provider
                        v-slot="{ errors, pristine }"
                        name="email"
                        rules="required|email"
                    >
                      <input
                          type="email"
                          class="form-control"
                          placeholder="Email"
                          v-model="form.email"
                          :class="{ 'is-invalid' : errors[0], 'is-valid' : (!errors[0] && !pristine) }"
                      >
                      <i class="fa fa-envelope-open"></i>
                      <div class="invalid-feedback">
                        {{ errors[0] }}
                      </div>
                    </validation-provider>
                  </div>

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
                <div class="d-flex justify-content-between">
                  <div></div>
                </div>

                <div class="mybtn m-auto mt-2">
                  <button type="submit" class="btn btn-primary rounded-0 px-2 mb-2 mb-lg-0 me-3 addnewbtn allbtn">
                    <span class="d-flex align-items-center"> <span class="small">Register Now</span></span>
                  </button>

                  <button type="button" class="btn btn-danger border-0 rounded-0 px-2 mb-2 mb-lg-0"
                          @click.prevent="resetForm">
                    <span class="d-flex align-items-center"> <span class="small">Reset</span></span>
                  </button>
                </div>

                <div class="text-center intro mt-3">
                  <span class="d-block account">Already have an account?</span> <span class="contact"><router-link
                    :to="{name: 'login'}" class="mail fw-bold">Login Now</router-link></span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </form>
    </validation-observer>
  </div>
</template>

<script>

export default {
  name: "Register",
  data() {
    return {
      form: {
        email: '',
        username: '',
        password: '',
        password_confirmation: ''
      }
    }
  },
  methods: {
    resetForm() {
      this.form = {
        email: '',
        username: '',
        password: '',
        password_confirmation: ''
      }
      this.$refs.observer.reset();
    },
    async submit() {
      let data = new FormData;

      for (let formKey in this.form) {
        data.append(formKey, this.form[formKey])
      }

      await this.$repository.auth.register(data)
          .then(() => {
            this.$toast.success('Account Created')
            this.$router.push({name: 'login'});
          })
    }
  }
}
</script>

<style scoped>

</style>