<template>
  <section>
    <div class="container" v-if="!loading">
      <div class="row">
        <div class="col-lg-8 posts-list">
          <div class="single-post mt-4">
            <h2 class="fw-bold w-62">{{ report.Title }}</h2>
            <div class="feature-img mb-5">
              <img
                  class="img-fluid"
                  :src="report.Image"
                  :alt="report.Title"
              >
            </div>
            <div class="blog_details">
              <h2 class="fw-bold text-dark">Description </h2>
              <p class="excert" v-html="report.Description"></p>
            </div>
          </div>

        </div>

        <div class="col-lg-4 blog_right_sidebar">
          <aside class="single_sidebar_widget popular_post_widget mt-4 bg-white p-3">
            <div class="mainhead">
              <h4 class="fw-bold">Recent Post</h4>
              <hr>
            </div>

            <div
                v-for="recent in recentReports"
                :key="recent.id"
                class="media post_item"
            >
              <img
                  :src="recent.Image"
                  class="img-fluid"
                  width="80"
                  :alt="recent.Title"
              >
              <div class="media-body">
                <router-link
                    :to="{name: 'view-study-report', params: {id: recent.id}}"
                >
                  <h3>{{ recent.Title }}</h3>
                </router-link>
                <p>{{ recent.uploaded_at | formatDate}}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "ViewStudyReport",
  data() {
    return {
      loading: true,
      report: null,
      recentReports: []
    }
  },
  mounted() {
    this.loadData()
  },
  watch: {
    $route() {
      this.loadData()
    }
  },
  methods: {
    async loadData() {
      await this.$repository.studyReports.show(this.$route.params.id)
          .then(res => {
            this.report = res.data;
            this.loading = false;
          })

      let params = `?page_size=5`
      await this.$repository.studyReports.filter(params)
          .then(res => {
            this.recentReports = res.data.results
          })
    }
  }
}
</script>