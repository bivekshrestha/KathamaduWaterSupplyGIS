<template>
  <section class="pt-50 pb-5">
    <div class="container pt-5 align-items-center justify-content-center m-auto login">
      <div class="card m-auto col-md-3 p-5">
        <div class="text-center intro"><img src="@/assets/img/logo.png" width="160" class="m-auto"> <span
            class="d-block account">Don't have account yet?</span> <span class="contact">
          <router-link :to="{name: 'register'}"
                       class="mail fw-bold">Register Now</router-link></span>
        </div>
        <div class="mt-4 text-center">
          <h4>Log In.</h4> <span>Login with your admin credentials</span>
          <div class="mt-3 inputbox"><input type="text" class="form-control" name="" placeholder="Username"
                                            v-model="credentials.username"> <i
              class="fa fa-user"></i></div>
          <div class="inputbox"><input type="password" class="form-control" name="" placeholder="Password"
                                       v-model="credentials.password"> <i
              class="fa fa-lock"></i></div>
        </div>
        <div class="d-flex justify-content-center">
          <router-link :to="{name: 'password-reset-request'}">
            Forgot Password?
          </router-link>
        </div>
        <div class="mybtn m-auto mt-3">
          <button class="btn btn-primary rounded-0 px-2 mb-2 mb-lg-0 me-3 addnewbtn allbtn">
                                <span class="d-flex align-items-center" @click.prevent="login">

                <span class="small">Login Now</span>
                                </span>
          </button>
          <button class="btn btn-danger border-0 rounded-0 px-2 mb-2 mb-lg-0 " @click.prevent="resetFields">
                                <span class="d-flex align-items-center">

                <span class="small">Reset</span>
                                </span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      credentials: {
        username: '',
        password: '',
      }
    }
  },
  methods: {
    async login() {
      await this.$store.dispatch('auth/login', this.credentials);
    },
    resetFields() {
      this.credentials = {
        username: '',
        password: '',
      }
    }
  }
}
</script>

<style scoped>

</style>