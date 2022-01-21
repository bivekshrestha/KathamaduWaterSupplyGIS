<template>
  <div>
    <section class="breadcrumb_top mt-5">
      <div class="container">
        <div class="my_breadcrumb ">
          <div class="right_top mb-4">
            <div class="card shadow">
              <div class="card-body">
                <div class="studyreports d-flex justify-content-between align-items-center">
                  <div class="header-title">
                    <h4 class="fw-bold text-dark"> Study & Reports</h4>
                  </div>
                  <div class="Filter_btn">
<!--                    v-if="$store.state.auth.isStaff"-->
                    <button

                        class="btn btn-primary rounded-0 px-2 mb-2 mb-lg-0 addnewbtn allbtn"
                        data-bs-toggle="modal"
                        data-bs-target="#addReportModal"
                    >
                          <span class="d-flex align-items-center">
                              <span class="small fw-bold">Upload report</span>
                          </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <add-study-report-modal @added="loadData"></add-study-report-modal>

    <section>
      <div class="container">
        <div class="explore_inner_layer ourreports">
          <div class="row ">
            <div
                class="col-md-3"
                v-for="report in reports"
                :key="report.id"
            >
              <study-report-card
                  :id="report.id"
                  :title="report.Title"
                  :description="report.Description"
                  :image-src="report.Image"
              ></study-report-card>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="container d-flex">
      <nav>
        <ul class="pagination">
          <li class="page-item" v-if="currentPage !== 1 && totalPages > 1">
            <button
                class="page-link"
                @click="paginate(--currentPage)"
                :disabled="currentPage === 1"
            >
              Previous
            </button>
          </li>
          <li
              v-for="i in totalPages"
              class="page-item"
              :class="{'active' : currentPage === i}"
              :key="i"
          >
            <a class="page-link" href="#" @click="paginate(i)">{{ i }}</a>
          </li>
          <li class="page-item" v-if="currentPage !== totalPages && totalPages > 1">
            <button
                class="page-link"
                @click="paginate(++currentPage)"
                :disabled="currentPage >= totalPages"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>

  </div>
</template>

<script>

import StudyReportCard from "../../components/cards/StudyReportCard";
import AddStudyReportModal from "../../components/modals/AddStudyReportModal";
export default {
  name: "StudyReports",
  components: {AddStudyReportModal, StudyReportCard},
  data() {
    return {
      loading: true,
      reports: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      pageSize: 12,
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      let params = `?page_size=${this.pageSize}`
      await this.$repository.studyReports.filter(params)
          .then(res => {
            this.reports = res.data.results;
            this.totalItems = res.data.count;
            this.totalPages = Math.ceil(res.data.count / 10)
            this.loading = false;
          })
          .catch(error => {
            console.log(error)
          })
    },
    async paginate(page) {
      this.loading = true;
      this.currentPage = page;
      let params = `?page_size=${this.pageSize}&page=${this.currentPage}`
      await this.$repository.studyReports.filter(params)
          .then(res => {
            this.reports = res.data.results;
            this.loading = false;
          })
          .catch(error => {
            console.log(error)
          })
    }
  }
}
</script>

<style scoped>

</style>