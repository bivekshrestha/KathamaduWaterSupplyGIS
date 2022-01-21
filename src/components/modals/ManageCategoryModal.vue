<template>
  <div
      class="modal fade"
      id="manageCategoryModal"
      tabindex="-1"
      aria-labelledby="manageCategoryModalLabel"
      aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="manageCategoryModalLabel">Category List</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body px-4">
          <div class="d-flex justify-content-end align-items-center mb-4">
            <!--            <strong>Manage All Categories</strong>-->
            <button
                class="btn btn-primary rounded-0 px-2 mb-2 mb-lg-0 addnewbtn"
                @click.prevent="toggleCollapseAddForm"
            >
              Add New
            </button>
          </div>

          <div class="collapse mb-4 border p-4 mb-4" id="addNewCategory">
            <category-form
                @created="categoryAdded"
            >
              <template #cancel>
                <button type="button" class="btn btn-danger btn-sm px-5" @click.prevent="collapseAddForm('hide')">
                  Cancel
                </button>
              </template>
            </category-form>
          </div>

          <div class="collapse mb-4 border p-4" id="editCategory">
            <category-edit-form
                :category="category"
                @updated="categoryUpdated"
                @cancel="cancelUpdate"
            ></category-edit-form>
          </div>

          <table class="table table-bordered">
            <thead>
            <tr>
              <th>Name</th>
              <!--              <th>Description</th>-->
              <th width="20%" class="text-center">Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="category in categories" :key="category.id">
              <td>{{ category.Category }}</td>
              <!--              <td>{{ category.description ? category.description  : 'N/A' }}</td>-->
              <td class="d-flex justify-content-center">
                <button
                    class="btn btn-primary btn-sm me-3"
                    @click.prevent="editCategory(category)"
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
                    @click.prevent="deleteCategory(category.id)"
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
import CategoryForm from "../forms/CategoryForm";
import CategoryEditForm from "../forms/CategoryEditForm";

export default {
  name: "ManageCategoryModal",
  components: {CategoryEditForm, CategoryForm},
  data() {
    return {
      addCollapse: null,
      editCollapse: null,
      isUpdating: false,
      categories: [],
      meta: {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: 10,
      },
      category: null
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    toggleCollapseAddForm() {
      this.isUpdating = false;
      if (this.editCollapse) {
        this.editCollapse.hide();
      }
      if (!this.addCollapse) {
        this.addCollapse = new this.$bootstrap.Collapse(document.getElementById('addNewCategory'))
      }
      this.addCollapse.toggle();
    },
    collapseAddForm(type) {
      this.isUpdating = false;
      if (!this.addCollapse) {
        this.addCollapse = new this.$bootstrap.Collapse(document.getElementById('addNewCategory'))
      }
      if (type === 'show') {
        this.addCollapse.show();
        if(this.editCollapse){
          this.editCollapse.hide();
        }
      } else {
        this.addCollapse.hide();
      }
    },
    collapseEditForm(type) {
      if (!this.editCollapse) {
        this.editCollapse = new this.$bootstrap.Collapse(document.getElementById('editCategory'))
      }
      if (type === 'show') {
        this.editCollapse.show();
        if(this.addCollapse){
          this.addCollapse.hide();
        }
      } else {
        this.editCollapse.hide();
      }
    },
    collapseEditCategoryForm() {
      this.collapseEditForm('hide')
      this.category = null;
      this.isUpdating = false;
    },
    categoryUpdated() {
      this.collapseEditCategoryForm()
      this.getData();
      this.$emit('categoryUpdated')
    },
    cancelUpdate() {
      this.collapseEditCategoryForm()
    },
    categoryAdded() {
      this.addCollapse.hide();
      this.getData();
      this.$emit('categoryUpdated')
    },
    async deleteCategory(id) {
      await this.$confirm(
          {
            message: `Are you sure?`,
            button: {
              no: 'No',
              yes: 'Yes'
            },
            callback: confirm => {
              if (confirm) {
                this.$repository.category.delete(id)
                    .then(() => {
                      this.getData();
                      this.$emit('categoryUpdated')
                    })
              }
            }
          }
      )
    },
    editCategory(category) {
      if (this.addCollapse) {
        this.collapseAddForm('hide')
      }
      this.isUpdating = true;
      this.category = category
      this.collapseEditForm('show')
    },
    async getData(page = 1) {
      this.meta.currentPage = page;

      let params = `?page_size=${this.meta.pageSize}`;

      if (this.meta.currentPage > 1) {
        params += `&page=${this.meta.currentPage}`
      }

      await this.$repository.category.filter(params)
          .then(res => {
            this.categories = res.data.results;
            this.meta.totalItems = res.data.count;
            this.meta.totalPages = Math.ceil(res.data.count / 10)
          })
    }
  }
}
</script>

<style scoped>

</style>