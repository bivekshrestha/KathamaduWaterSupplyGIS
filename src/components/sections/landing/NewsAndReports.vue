<template>
  <div class="news_section h-100">
    <div class="card border-0 h-100">
      <div class="card-body border-0 shadow">
        <div class=" d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
          <div class="mainhead">
            <h4 class="fw-bold">News and Reports</h4>
          </div>
          <div class="mybtn ml-auto">
            <router-link :to="{ name: 'study-reports' }"
                         class="btn btn-primary rounded-0 px-2 mb-2 mb-lg-0 addnewbtn allbtn"
            >
              <span class="d-flex align-items-center"><span class="small">View All</span></span>
            </router-link>
          </div>

        </div>
        <!-- time line section starts -->
        <div class="reportdetails" v-if="!loading">
          <div class="media post_item">
            <img :src="reports[0].Image" class="img-fluid" width="100" alt="">
            <div class="media-body">
              <router-link :to="{name: 'view-study-report', params: {id: reports[0].id}}">
                <h3 class="fw-bold text-dark">{{ reports[0].Title }}</h3>
              </router-link>
              <p class="text-dark mb-3">
                {{ reports[0].Description.substr(0, 350) }}...
              </p>
              <router-link :to="{name: 'view-study-report', params: {id: reports[0].id}}" class="fw-bold">Read More
              </router-link>
            </div>
          </div>
          <hr>
          <div class="media post_item">
            <img :src="reports[1].Image" class="img-fluid" width="100" alt="">
            <div class="media-body">
              <router-link :to="{name: 'view-study-report', params: {id: reports[1].id}}">
                <h3 class="fw-bold text-dark">{{ reports[1].Title }}</h3>
              </router-link>
              <p class="text-dark mb-3">
                {{ reports[1].Description.substr(0, 350) }}...
              </p>
              <router-link :to="{name: 'view-study-report', params: {id: reports[1].id}}" class="fw-bold">Read More
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NewsAndReports",
  data() {
    return {
      loading: true,
      reports: []
    }
  },
  mounted() {
    this.getAllReports()
  },
  methods: {
    async getAllReports() {
      await this.$repository.studyReports.filter(`?page_size=2`)
          .then(res => {
            this.reports = res.data.results
            this.loading = false
          })
    },
    getImgSrc(url) {
      return url;
    }
  }
}
</script>

<style scoped>

</style>