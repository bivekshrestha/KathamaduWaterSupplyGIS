<template>
  <div class="card mb-4">
    <img
        :src="imageSrc"
        class="card-img-top"
        :alt="title"
    >
    <div class="card-body">
      <router-link
          :to="{name: 'view-study-report', params: {id: id}}"
          class="fs-6 card-title fw-bold text-blue"
      >
        {{ title }}
      </router-link>
      <p class="card-text text-dark">
        {{ description.substr(0, 50) }}...
      </p>
      <router-link
          :to="{name: 'view-study-report', params: {id: id}}"
          class="btn btn-primary rounded-0 px-2 mb-2 mb-lg-0 addnewbtn allbtn"
      >
        <span class="d-flex align-items-center"><span class="small">Read More</span></span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "StudyReportCard",
  props: {
    id: {
      required: true,
      type: Number
    },
    title: {
      required: true,
      type: String
    },
    description: {
      required: true,
      type: String
    },
    imageSrc: {
      required: true,
      type: String,
      default: '@/assets/img/map4.png'
    }
  }
}
</script>

<style scoped>

</style>
