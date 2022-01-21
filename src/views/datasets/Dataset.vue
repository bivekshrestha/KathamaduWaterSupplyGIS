<template>
  <div>
    <!-- dataset breadcrumb starts -->
    <section class="breadcrumb_top mt-5">
      <div class="container">
        <div class="my_breadcrumb ">
          <div class="right_top mb-4">
            <div class="card shadow">
              <div class="card-body">
                <div class="company_footer d-flex justify-content-between align-items-center">
                  <div class="header-title">
                    <h4 class="fw-bold text-dark"> Explore Datasets</h4>
                  </div>
                  <div class="Filter_btn">
                    <button
                        v-if="$store.state.auth.isStaff"
                        class="btn btn-primary rounded-0 px-2 mb-2 mb-lg-0 addnewbtn allbtn"
                        data-bs-toggle="modal"
                        data-bs-target="#addlayerModal"
                    >
                      <span class="d-flex align-items-center"><span class="small fw-bold">Upload Layers</span></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <layers-add-new-modal></layers-add-new-modal>

    <button
        class="d-none"
        ref="editBtn"
        data-bs-toggle="modal"
        data-bs-target="#editLayerModal"></button>

    <div class="modal fade" id="editLayerModal" tabindex="-1" aria-labelledby="editLayerModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editLayerModalLabel">Edit Layer</h5>
            <button type="button" ref="closeBtn" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="addacc_form">
              <layers-edit-form :layer="editLayer" @edited="closeModal"></layers-edit-form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section>
      <div class="container">
        <div class="explore_inner_layer">
          <div class="row">
            <div class="col-md-3">
              <div class="card shadow">
                <div class="card-body">
                  <div class="company_footer">
                    <div class="d-flex align-items-center">
                      <div class="input-group">
                        <input type="text" class="form-control w-100" placeholder="Search now" aria-label="search"
                               aria-describedby="search" v-model="selection.search">
                        <div class="input-group-prepend mt-1" @click.prevent="getDocuments">
                          <span class="input-group-text text-white" id="search"><i
                              class="fas fa-search"></i>Search</span>
                        </div>
                      </div>
                    </div>
                    <div class="layer_filter mt-3">
                      <div class="form-group ">
                        <label class="control-label fw-bolder text-dark fs-6">File Type</label>
                        <v-select
                            placeholder="Select File Types"
                            v-model="selection.fileType"
                            :options="options.filetypes"
                            label="Filetype"
                            :reduce="item => item.Filetype"
                            @input="getDocuments"
                        ></v-select>
                      </div>

                      <div class="form-group pt-3">
                        <label class="control-label fw-bolder text-dark fs-6">Category</label>
                        <v-select
                            placeholder="Select Category"
                            v-model="selection.category"
                            :options="options.categories"
                            label="Category"
                            :reduce="item => item.Category"
                            @input="getDocuments"
                        ></v-select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-9" v-if="!loading">
              <div class="dataset_right" v-if="layers.length > 0">
                <div class="card mb-3">
                  <div class="row">
                    <div
                        class="col-md-6"
                        v-for="layer in layers"
                        :key="layer.id"
                    >
                      <div class="card-body">
                        <div class="mainhead mainhead1 d-flex align-items-center">
                          <img src="@/assets/img/icon1.png" alt="" class="me-2">
                          <h4 class="fw-bold">{{ layer.Layer_Name }}</h4>
                        </div>
                        <div class="mybtn mt-2 mb-2">
                          <span class="badge bt2 rounded-pill bg-secondary text-dark me-1">
                            {{ layer.uploaded_at | formatDate }}
                          </span>
                          <span class="badge bt1 rounded-pill bg-primary text-dark me-1 text-capitalize">{{
                              layer.Category.Category.replaceAll('_', ' ')
                            }}</span>
                          <span class="badge bt3 rounded-pill bg-success text-dark me-1 text-capitalize">{{
                              layer.File_Type.Filetype
                            }}</span>
                        </div>
                        <p class="card-text mt-3 text-dark fw-normal">
                          {{ layer.description }}
                        </p>
                        <div class="mybtn mt-3">
                          <router-link :to="{name: 'dataset-view', params:{id: layer.id}}"
                                       class="btn btn-primary rounded-0 px-2 mb-2 mb-lg-0 addnewbtn allbtn me-2">
                            <span class="d-flex align-items-center"><i class="fas fa-eye me-2"></i><span
                                class="small fw-bold">View</span></span>
                          </router-link>
                          <a
                              v-if="$store.state.auth.isLoggedIn"
                              class="btn btn-primary rounded-0 px-2 mb-2 mb-lg-0 border-0 download allbtn me-2"
                              :href="layer.document"
                              target="_blank"
                          >
                            <span class="d-flex align-items-center"><i class="fas fa-download me-2"></i><span
                                class="small fw-bold">Download</span></span>
                          </a>
                          <button
                              v-if="$store.state.auth.isStaff"
                              class="btn btn-primary rounded-0 px-2 mb-2 mb-lg-0 viewallbtn edit allbtn me-2"
                              @click.prevent="onEdit(layer)">
                            <span class="d-flex align-items-center"><i class="fas fa-edit me-2"></i><span
                                class="small fw-bold">Edit</span></span>
                          </button>

                          <button
                              v-if="$store.state.auth.isStaff"
                              class="btn btn-danger rounded-0 px-2 mb-2 mb-lg-0 border-0 delete allbtn me-2"
                              @click.prevent="onDelete(layer.id)">
                            <span class="d-flex align-items-center"><i class="fas fa-trash me-2"></i><span
                                class="small fw-bold">Delete</span></span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr>
                </div>

                <div class="" v-if="meta.totalPages > 1">
                  <nav>
                    <ul class="pagination justify-content-end">
                      <li class="page-item">
                        <button
                            class="page-link"
                            @click.prevent="getDocuments(--meta.currentPage)"
                            :disabled="meta.currentPage === 1"
                        >
                          Previous
                        </button>
                      </li>
                      <li
                          v-for="i in meta.totalPages"
                          class="page-item"
                          :class="{'active' : meta.currentPage === i}"
                          :key="i"
                      >
                        <a class="page-link" href="#" @click.prevent="getDocuments(i)">{{ i }}</a>
                      </li>
                      <li class="page-item">
                        <button
                            :disabled="meta.currentPage >= meta.totalPages"
                            class="page-link"
                            @click.prevent="getDocuments(++meta.currentPage)"
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div class="dataset_right" v-else>
                <h3>No Layers Found</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import LayersAddNewModal from "../../components/modals/LayersAddNewModal";
import LayersEditForm from "../../components/forms/LayersEditForm";

export default {
  name: "Dataset",
  components: {LayersEditForm, LayersAddNewModal},
  data() {
    return {
      loading: true,
      editLayer: null,
      layers: [],
      options: {
        filetypes: [],
        categories: []
      },
      selection: {
        fileType: null,
        category: null,
        search: ''
      },
      meta: {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: 10,
      },
    }
  },
  mounted() {
    this.getSelectionData();
    this.getDocuments();
  },
  methods: {
    async onEdit(layer) {
      this.editLayer = layer;
      await this.getDocuments();
      this.$refs.editBtn.click();
    },
    closeModal() {
      this.editLayer = null;
      this.$refs.closeBtn.click();
    },
    async onDelete(id) {
      await this.$confirm(
          {
            message: `Are you sure?`,
            button: {
              no: 'No',
              yes: 'Yes'
            },
            /**
             * Callback Function
             * @param {Boolean} confirm
             */
            callback: confirm => {
              if (confirm) {
                this.$repository.document.delete(id)
                    .then(() => {
                      this.getDocuments();
                    })
              }
            }
          }
      )

    },
    async getSelectionData() {
      await this.$repository.category.get()
          .then(res => {
            this.options.categories = res.data.results;
          })

      await this.$repository.fileType.get()
          .then(res => {
            this.options.filetypes = res.data.results;
          })
    },
    async getDocuments(page = 1) {

      let params = `?page_size=${this.meta.pageSize}`;
      this.meta.currentPage = page;

      if (this.meta.currentPage > 1) {
        params += `&page=${this.meta.currentPage}`
      }

      if (this.selection.category) {
        params += `&Category=${this.selection.category}`
      }

      if (this.selection.search !== '') {
        params += `&search=${this.selection.search}`
      }

      if (this.selection.fileType) {
        params += `&File_Type=${this.selection.fileType}`
      }

      await this.$repository.document.filter(params)
          .then(res => {
            this.layers = res.data.results;
            this.meta.totalItems = res.data.count;
            this.meta.totalPages = Math.ceil(res.data.count / this.meta.pageSize)

            this.loading = false
          })
    }
  }
}
</script>

<style scoped>

</style>