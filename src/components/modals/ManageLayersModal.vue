<template>
  <div
      class="modal fade"
      id="manageLayerModal"
      tabindex="-1"
      aria-labelledby="manageLayerModalLabel"
      aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="manageLayerModalLabel">Layer List</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body px-4">
          <div class="d-flex justify-content-end align-items-center mb-4">
            <!--            <strong>Manage All Categories</strong>-->
            <button
                class="btn btn-primary rounded-0 px-2 mb-2 mb-lg-0 addnewbtn"
                @click.prevent="addFormCollapse('toggle')"
            >
              Add New
            </button>
          </div>

          <div class="collapse mb-4 border p-4 mb-4" id="addLayer">
            <layers-form-alternate @created="layerAdded">
              <template #cancel>
                <button type="button" class="btn btn-danger btn-sm rounded-0" @click.prevent="addFormCollapse('hide')">
                  Cancel
                </button>
              </template>
            </layers-form-alternate>
          </div>

          <div class="collapse mb-4 border p-4" id="editLayer">
            <layers-edit-form-alternate
                :layer="layer"
                @updated="layerUpdated"
            >
              <template #cancel>
                <button type="button" class="btn btn-danger btn-sm rounded-0" @click.prevent="cancelEdit">
                  Cancel
                </button>
              </template>
            </layers-edit-form-alternate>
          </div>

          <table class="table table-bordered">
            <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>File Type</th>
              <th>Uploaded At</th>
              <th width="20%" class="text-center">Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="layer in layers" :key="layer.id">
              <td>{{ layer.Layer_Name }}</td>
              <td>{{ layer.Category.Category }}</td>
              <td>{{ layer.File_Type.Filetype }}</td>
              <td>{{ layer.uploaded_at | formatDateWithMonth }}</td>
              <td class="d-flex justify-content-center">
                <button
                    class="btn btn-primary btn-sm me-3"
                    @click.prevent="editLayer(layer)"
                    :disabled="isUpdating"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Edit"
                >
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button
                    class="btn btn-danger btn-sm"
                    :disabled="isUpdating"
                    @click.prevent="deleteLayer(layer.id)"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Delete"
                >
                  <i class="bi bi-trash-fill"></i>
                </button>
              </td>
            </tr>
            </tbody>
          </table>

          <nav>
            <ul class="pagination" v-if="meta.totalPages > 1">
              <li class="page-item" v-if="meta.currentPage !== 1 && meta.totalPages > 1">
                <button
                    class="page-link"

                    @click.prevent="getData(--meta.currentPage)"
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
                <a class="page-link" href="#" @click.prevent="getData(i)">{{ i }}</a>
              </li>
              <li class="page-item" v-if="meta.currentPage !== meta.totalPages && meta.totalPages > 1">
                <button
                    class="page-link"
                    @click.prevent="getData(++meta.currentPage)"
                    :disabled="meta.currentPage >= meta.totalPages"
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LayersFormAlternate from "../forms/LayersFormAlternate";
import LayersEditFormAlternate from "../forms/LayersEditFormAlternate";

export default {
  name: "ManageLayersModal",
  components: {LayersEditFormAlternate, LayersFormAlternate},
  data() {
    return {
      addCollapse: null,
      editCollapse: null,
      isUpdating: false,
      layers: [],
      meta: {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: 10,
      },
      layer: null
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData(page = 1) {
      this.meta.currentPage = page;

      let params = `?page_size=${this.meta.pageSize}`;

      if (this.meta.currentPage > 1) {
        params += `&page=${this.meta.currentPage}`
      }

      await this.$repository.document.filter(params)
          .then(res => {
            this.layers = res.data.results;
            this.meta.totalItems = res.data.count;
            this.meta.totalPages = Math.ceil(res.data.count / 10)
          })
    },
    addFormCollapse(type) {
      this.isUpdating = false;
      if (!this.addCollapse) {
        this.addCollapse = new this.$bootstrap.Collapse(document.getElementById('addLayer'))
      }
      if (type === 'toggle') {
        this.addCollapse.toggle();
        if(this.editCollapse){
          this.editCollapse.hide();
        }
      } else if (type === 'show') {
        this.addCollapse.show();
        if(this.editCollapse){
          this.editCollapse.hide();
        }
      } else if (type === 'hide') {
        this.addCollapse.hide();
      }
    },
    layerAdded() {
      this.getData()
      this.addFormCollapse('hide')
    },
    editFormCollapse(type) {
      if (!this.editCollapse) {
        this.editCollapse = new this.$bootstrap.Collapse(document.getElementById('editLayer'))
      }
      if (type === 'toggle') {
        this.editCollapse.toggle();
        if(this.addCollapse){
          this.addCollapse.hide();
        }
      } else if (type === 'show') {
        this.editCollapse.show();
        if(this.addCollapse){
          this.addCollapse.hide();
        }
      } else if (type === 'hide') {
        this.editCollapse.hide();
      }
    },
    editLayer(layer) {
      if (this.addCollapse) {
        this.addFormCollapse('hide')
      }
      this.isUpdating = true;
      this.layer = layer
      this.editFormCollapse('show')
    },
    layerUpdated() {
      this.getData();
      this.cancelEdit();
    },
    cancelEdit() {
      this.layer = null;
      this.isUpdating = false;
      this.editFormCollapse('hide');
    },
    async deleteLayer(id) {
      await this.$confirm(
          {
            message: `Are you sure?`,
            button: {
              no: 'No',
              yes: 'Yes'
            },
            callback: confirm => {
              if (confirm) {
                this.$repository.document.delete(id)
                    .then(() => {
                      this.getData();
                    })
              }
            }
          }
      )
    }
  }
}
</script>

<style scoped>

</style>