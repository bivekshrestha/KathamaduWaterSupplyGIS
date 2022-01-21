<template>
  <div class="container d-flex align-items-center">
      <div>
        <div class="title text-primary">404</div>
        <div class="subtitle">Something's wrong</div>
        <p class="mt-4">
          We couldn't locate the page you're looking for. It might have been moved to another location.
        </p>
        <p>
          <router-link :to="{name: 'home'}">GO BACK HOME</router-link>
        </p>
      </div>
  </div>
</template>

<script>
export default {
  name: "NotFound"
}
</script>

<style scoped>
.container {
  min-height: 75vh;
}

.title {
  font-size: 45px;
  font-weight: bold;
}

.subtitle {
  font-size: 35px;
  color: #6c757d;
  margin-top: 1rem;
}
</style>