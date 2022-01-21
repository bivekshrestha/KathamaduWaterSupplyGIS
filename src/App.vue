<template>
  <div id="app">
    <vue-confirm-dialog></vue-confirm-dialog>
    <the-navigation></the-navigation>
    <router-view/>
    <the-footer></the-footer>
  </div>
</template>

<style>

</style>

<script>
import TheNavigation from "./components/partials/TheNavigation";
import TheFooter from "./components/partials/TheFooter";

export default {
  components: {TheFooter, TheNavigation},
  created() {
   this.$store.dispatch('auth/isTokenExpired')
    .then(res => {
      if(res){
        window.location.reload()
      }
    })
  }
}
</script>