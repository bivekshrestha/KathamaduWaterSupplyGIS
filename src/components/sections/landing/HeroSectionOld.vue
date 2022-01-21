<template>
  <section class="topmap  mt-4">
    <div class="container">
      <div class="row">
        <div class="col-md-4">
          <div class="mapdataleft">
            <total-count></total-count>
            <!-- Category -->
            <div class="availablelayers">
              <div class="card shadow border-0 card-widget h-100">
                <div class="card-body p-0">
                  <div class="d-flex align-items-center justify-content-between">
                    <div class="card_head">
                      <h6>Available Category</h6>
                    </div>
                    <div class="mybtn pad_left pe-4">
                      <button
                          class="btn btn-primary rounded-0 px-2 mb-2 mb-lg-0 addnewbtn allbtn"
                          data-bs-toggle="modal"
                          data-bs-target="#categoryAddModal"
                      >
                        <span class="d-flex align-items-center"><span class="small">Add New Category</span></span>
                      </button>
                    </div>
                  </div>
                  <ul class="list-unstyled row pad1 pt-0 pb-0 mt-3">
                    <li
                        class="pb-2 text-capitalize col-md-6"
                        v-for="(category) in categories"
                        :key="category.id"
                    >
                      <a
                          class="fw-bold"
                          href="#"
                          @click="toggleModal('single')"
                      >
                        <input
                            :id="'category-'+category.id"
                            class="form-check-input mt-2 me-2"
                            type="radio"
                            name="Category"
                            :value="category.Category"
                            v-model="selection.category"
                            @change="getLayers"
                        >
                        <label :for="'category-'+category.id"> {{ category.Category.replaceAll('_', ' ') }}</label>
                      </a>
                    </li>
                  </ul>
                  <div class="col-md-12 text-end mb-3 pe-4 rounded-3">
                    <button
                        class="btn btn-primary rounded-0 px-2 mb-2 mb-lg-0 viewallbtn allbtn"
                        data-bs-toggle="modal"
                        data-bs-target="#viewallayerModal"
                    >
                      <span class="d-flex align-items-center"><span class="small">View All Layer</span></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <!-- End of Category -->
          </div>
        </div>

        <!-- Map -->
        <div class="col-md-8">
          <div class="mapdataright mt-4 mt-md-0">
            <div ref="document">
              <vl-map data-projection="EPSG:4326" style="height: 500px;" :load-tiles-while-animating="false"
                      id="my_map"
                      :load-tiles-while-interacting="false">
                <vl-view :zoom.sync="map.zoom" :center.sync="map.center" :rotation.sync="map.rotation"></vl-view>

                <vl-layer-tile>
                  <vl-source-osm :attributions="[]"></vl-source-osm>
                </vl-layer-tile>
                <!--              :condition="eventCondition"-->
                <vl-interaction-select

                    :features.sync="selected"
                >
                  <vl-overlay class="feature-popup" v-for="feature in selected" :key="feature.id" :id="feature.id"
                              :position="pointOnSurface(feature.geometry)" :auto-pan="true"
                              :auto-pan-animation="{ duration: 300 }">
                    <template slot-scope="">
                      <section class="card">
                        <div class="card-content">
                          <div class="content p-2">
                            <template v-for="(property, key, index) in feature.properties">
                              <div
                                  v-if="selection.attributes.includes(key)"
                                  class="fa-sm text-capitalize"
                                  :key="index"
                              >
                                <strong>{{ key }}</strong>: {{ property }}
                              </div>
                            </template>
                          </div>
                        </div>
                      </section>
                    </template>
                  </vl-overlay>
                </vl-interaction-select>

                <template v-if="map.features.length > 0">
                  <template v-for="item in map.features">
                    <vl-feature
                        v-for="(feature, index) in item.features"
                        :key="String(item.id) + String(index)"
                        :id="String(item.id) + String(index)"
                        :properties="feature.properties"
                    >
                      <vl-geom-multi-polygon
                          :coordinates="feature.geometry.coordinates"
                          v-if="feature.geometry.type === 'MultiPolygon'"
                      ></vl-geom-multi-polygon>
                      <vl-geom-point
                          :coordinates="feature.geometry.coordinates"
                          v-if="feature.geometry.type  === 'Point'"
                      ></vl-geom-point>
                      <vl-geom-line-string
                          :coordinates="feature.geometry.coordinates"
                          v-if="feature.geometry.type === 'LineString'"
                      ></vl-geom-line-string>

                      <template v-if="feature.geometry.type  === 'Point'">
                        <vl-style-box>
                          <vl-style-circle :radius="8">
                            <vl-style-fill color="red"></vl-style-fill>
                            <vl-style-stroke color="white"></vl-style-stroke>
                          </vl-style-circle>
                        </vl-style-box>
                      </template>

                      <template v-if="feature.geometry.type  === 'MultiPolygon'">
                        <vl-style-box>
                          <vl-style-fill :color="feature.color"></vl-style-fill>
                          <vl-style-stroke color="white"></vl-style-stroke>
                        </vl-style-box>
                      </template>

                      <template v-if="feature.geometry.type  === 'LineString'">
                        <vl-style-box>
                          <vl-style-stroke color="red" :width="3"></vl-style-stroke>
                        </vl-style-box>
                      </template>
                    </vl-feature>
                  </template>
                </template>

              </vl-map>
            </div>
            <div class="legendbox border p-3 homemaplegend d-none d-md-block" v-if="map.features.length > 0">
              <div class="my-legend">
                <div class="mainhead  d-flex align-items-center">
                  <h4 class="fw-bold">Legends</h4>
                </div>
                <div class="legend-scale" v-for="item in map.features" :key="item.id + 'key'">
                  <strong>{{ item.name }}</strong>
                  <template v-for="attribute in map.attributes">
                    <template v-if="selection.attributes.includes(attribute)">
                      <div class="ms-2" :key="attribute">
                        <strong>{{ attribute }}</strong>
                        <ul class="legend-labels ms-2">
                          <template v-for="(feature, index) in item.features">
                            <li :key="feature.color + index">
                              <span v-if="feature.geometry.type  === 'MultiPolygon'" class="legend1" :style="{'background': feature.color}"></span>
                              {{ feature.properties[attribute] }}
                            </li>
                          </template>
                        </ul>
                      </div>
                    </template>
                  </template>
                </div>
              </div>
            </div>
            <div class="mappara">
              <div class="row py-2">
                <div class="col-md-3 d-flex align-items-center">
                  <div class="btn-group mx-4">
                    <button
                        class="btn btn-secondary sec1 btn-sm dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                      Selected Layers
                    </button>
                    <ul class="dropdown-menu border-0 shadow"
                        style="height: 20rem; overflow-y: scroll; overflow-x: hidden">
                      <li class="row">
                        <div
                            class="col-md-12"
                            v-for="(layer, index) in selection.layers"
                            :key="index"
                        >
                          <div class="form-check">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                :id="`layer-selected-${index}`"
                                v-model="selection.layers"
                                :value="layer"
                                @change="getData(layer.id)"
                            >
                            <label class="form-check-label" :for="`layer-selected-${index}`">
                              <i class="fas fa-ellipsis-v"></i> {{ layer.Layer_Name }}
                            </label>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div class="btn-group mx-md-auto me-auto">
                    <button
                        class="btn btn-secondary sec1 btn-sm dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                      Map Attributes
                    </button>
                    <ul class="dropdown-menu border-0 shadow"
                        style="height: 20rem; overflow-y: scroll; overflow-x: hidden">
                      <li class="row">
                        <div
                            class="col-md-12"
                            v-for="(attribute, index) in map.attributes"
                            :key="index"
                        >
                          <div class="form-check">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                :id="`${index}-attrs-${attribute}`"
                                v-model="selection.attributes"
                                :value="attribute"
                            >
                            <label class="form-check-label" :for="`${index}-attrs-${attribute}`">
                              <i class="fas fa-ellipsis-v"></i> {{ attribute }}
                            </label>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="col-md-9">
                  <p class="text-white mb-0 mapbtm">
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="mapoptions">
            <div class="my_map d-block d-md-flex justify-content-between align-items-center">
              <!-- imapleft start -->
              <div class="mapoptions_header">
                <div class="mapoptions_header_icon"><i class="fas fa-map"></i></div>
                <div class="header-title" id="test_mi">
                  <h2 class="font-weight-bold">Map Options</h2>
                </div>
              </div>
              <!-- map left end -->
              <div class="mybtn  mt-md-0 mt-3">
                <button
                    class="btn btn-primary rounded-0 px-2 mb-2 mb-lg-0 viewallbtn allbtn"
                    @click.prevent="exportMap"
                >
                  <span class="d-flex align-items-center"><span class="small fw-bold">Export Map</span></span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- End of Map -->
      </div>
    </div>

    <layers-add-new-modal></layers-add-new-modal>

    <category-add-modal @added="getCategories"></category-add-modal>

    <div class="modal fade" id="layers-view-modal" tabindex="-1" aria-labelledby="viewalcatModalLabel"
         aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="viewalcatModalLabel">Layers</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!--            <div class="allnewlayer d-flex align-items-center justify-content-between">-->
            <!--              <div class="d-flex align-items-center">-->
            <!--                <div class="input-group">-->
            <!--                  <input-->
            <!--                      type="text"-->
            <!--                      class="form-control f-11"-->
            <!--                      placeholder="Search now"-->
            <!--                      aria-label="search"-->
            <!--                      aria-describedby="search"-->
            <!--                  >-->
            <!--                  <div class="input-group-prepend">-->
            <!--                    <span class="input-group-text" id="search"><i class="fas fa-search"></i></span>-->
            <!--                  </div>-->
            <!--                </div>-->
            <!--              </div>-->
            <!--              <div class="btn-group">-->
            <!--                <button-->
            <!--                    class="btn btn-secondary sec1 btn-sm dropdown-toggle border text-dark"-->
            <!--                    type="button"-->
            <!--                    data-bs-toggle="dropdown"-->
            <!--                    aria-expanded="false"-->
            <!--                >-->
            <!--                  Filter Layer-->
            <!--                </button>-->
            <!--                <ul class="dropdown-menu layerdrop border-0 shadow p-2">-->
            <!--                  <li class="row">-->
            <!--                    <div class="col-md-3">-->
            <!--                      <div class="form-check pb-2">-->
            <!--                        <input class="form-check-input" type="checkbox" value="A" id="defaultCheck1">-->
            <!--                        <label class="form-check-label" for="defaultCheck1">-->
            <!--                          A-->
            <!--                        </label>-->
            <!--                      </div>-->
            <!--                    </div>-->
            <!--                  </li>-->
            <!--                </ul>-->
            <!--              </div>-->
            <!--            </div>-->
            <div class="filter_right">
              <form class="" method="get" action="">
                <div
                    class="form-check form-check-inline"
                    v-for="letter in letters"
                    :key="letter"
                >
                  <input
                      type="checkbox"
                      class="form-check-input"
                      :id="letter"
                      v-model="selection.sortLayer"
                      :value="letter"
                  >
                  <label
                      class="btn btn-rounded small"
                      :class="selection.sortLayer.includes(letter) ? 'btn-primary' : 'btn-outline-primary'"
                      :for="letter"
                  >
                    {{ letter }}
                  </label>

                </div>

                <button class="btn btn-outline-primary btn-sm ms-2" @click.prevent="selection.sortLayer = []">
                  Clear
                </button>
              </form>
            </div>
            <hr>

            <div class="layer-inner mt-2">
              <p class="mb-0 fw-bold pb-0">Available Layers</p>
              <div class="row">
                <div class="col-md-3 layerinner" v-for="(layer, index) in sortedLayers" :key="index">
                  <div class="form-check">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        :id="'layer-' + layer.id"
                        v-model="selection.layers"
                        :value="layer"
                    >
                    <label class="form-check-label" :for="'layer-' + layer.id">
                      <i class="fas fa-ellipsis-v"></i> {{ layer.Layer_Name }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <div class="mybtn">
              <button
                  class="btn btn-primary rounded-0 px-2 mb-2 mb-lg-0 me-2 addnewbtn allbtn"
                  @click.prevent="addLayerToMap('single')"
              >
                <span class="d-flex align-items-center"><span class="small">Add Layer to Map</span></span>
              </button>
              <button ref="closeBtn" class="btn btn-danger border-0 rounded-0 px-2 mb-2 mb-lg-0  allbtn"
                      @click.prevent="toggleModal('single')">
                <span class="d-flex align-items-center"><span class="small">Close</span></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--    <layers-view-modal></layers-view-modal>-->

    <div class="modal fade" id="viewallayerModal" tabindex="-1" aria-labelledby="viewallayerModalLabel"
         aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="viewallayerModalLabel">Layers</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-3">
                <div class="filterbar p-2">
                  <div class="box border-bottom">
                    <div class="box-label text-uppercase d-flex align-items-center">Category
                      <button
                          class="btn ml-auto"
                          type="button"
                          data-toggle="collapse"
                          data-target="#inner-box"
                          aria-expanded="false"
                          aria-controls="inner-box"
                          id="out"
                      >
                        <!--                      <span class="fas fa-plus"></span>-->
                      </button>
                    </div>
                    <div id="inner-box" class=" mt-2 mr-1">
                      <ul class="list-unstyled row pad1 pt-0 pb-0 mt-3">
                        <li
                            class="pb-2 text-capitalize"
                            v-for="(category) in categories"
                            :key="'key-' + category.id"
                        >
                          <a
                              class="fw-bold"
                              href="#"
                          >
                            <input
                                :id="'category-all-'+category.id"
                                class="form-check-input mt-2 me-2"
                                type="radio"
                                name="Category"
                                :value="category.Category"
                                v-model="selection.category"
                                @change="getLayers"
                            >
                            <label :for="'category-all-'+category.id"> {{
                                category.Category.replaceAll('_', ' ')
                              }}</label>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
              <div class="col-md-8">
                <div class="filter_right">
                  <form class="" method="get" action="">
                    <div
                        class="form-check form-check-inline"
                        v-for="letter in letters"
                        :key="letter"
                    >
                      <input
                          type="checkbox"
                          class="form-check-input"
                          :id="letter"
                          v-model="selection.sortLayer"
                          :value="letter"
                      >
                      <label
                          class="btn btn-rounded small"
                          :class="selection.sortLayer.includes(letter) ? 'btn-primary' : 'btn-outline-primary'"
                          :for="letter"
                      >
                        {{ letter }}
                      </label>

                    </div>

                    <button class="btn btn-outline-primary btn-sm ms-2" @click.prevent="selection.sortLayer = []">
                      Clear
                    </button>
                  </form>
                </div>
                <hr>
                <div class="category_list">
                  <p class="mb-0 fw-bold pb-0">Please Select Layers</p>
                  <div class="row">
                    <div class="col-md-3 layerinner" v-for="(layer, index) in sortedLayers" :key="index + layer.id">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" :id="'layer-all-' + layer.id"
                               v-model="selection.layers" :value="layer">
                        <label class="form-check-label" :for="'layer-all-' + layer.id">
                          <i class="fas fa-ellipsis-v"></i> {{ layer.Layer_Name }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div class="modal-footer">
            <div class="mybtn">
              <button class="btn btn-primary rounded-0 px-2 mb-2 mb-lg-0 me-3 addnewbtn allbtn"
                      @click.prevent="addLayerToMap('all')">
                <span class="d-flex align-items-center"><span class="small">Add to Map</span></span>
              </button>
              <button class="btn btn-danger border-0 rounded-0 px-2 mb-2 mb-lg-0  allbtn" @click.prevent="toggleModal('all')">
                <span class="d-flex align-items-center"><span class="small">Close</span></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<script>
import TotalCount from "./TotalCount";
import LayersAddNewModal from "../../modals/LayersAddNewModal";
import shp from "shpjs";
import {findPointOnSurface} from 'vuelayers/lib/ol-ext'
import CategoryAddModal from "../../modals/CategoryAddModal";
import {pointerMove} from 'ol/events/condition'
import html2pdf from 'html2pdf.js'

export default {
  name: "HeroSection",
  components: {CategoryAddModal, LayersAddNewModal, TotalCount},
  data() {
    return {
      loading: true,
      modal: null,
      viewAllModal: null,
      categories: [],
      layers: [],
      map: {
        zoom: 7,
        center: [84.42302652012802, 28.336579178429957],
        rotation: 0,
        features: [],
        attributes: []
      },
      selected: [],
      selection: {
        category: null,
        layers: [],
        attributes: [],
        sortLayer: []
      }
    }
  },
  computed: {
    eventCondition() {
      return pointerMove;
    },
    letters() {
      let letters = []
      for (let i = "A".charCodeAt(0); i <= "Z".charCodeAt(0); i++) {
        letters.push(String.fromCharCode([i]))
      }
      return letters
    },
    sortedLayers() {
      if (this.selection.sortLayer.length > 0) {
        return this.layers.filter(el => {
          let found = false;
          this.selection.sortLayer.forEach(letter => {
            if (el.Layer_Name.toLowerCase().startsWith(letter.toLowerCase())) {
              found = true;
            }
          })
          return found;
        })
      } else {
        return this.layers;
      }
    }
  },
  mounted() {
    this.getCategories()
    this.modal = new this.$bootstrap.Modal(document.getElementById('layers-view-modal'))
    this.viewAllModal = new this.$bootstrap.Modal(document.getElementById('viewallayerModal'))
  },
  methods: {
    async getCategories() {
      await this.$repository.category.get()
          .then(res => {
            this.categories = res.data.results;
          });
    },
    async getLayers() {
      if (this.selection.category) {
        this.selection.layers = [];
        this.layers = [];
        this.map.features = [];
        let params = `?Category=${this.selection.category}`
        await this.$repository.document.filter(params)
            .then(res => {
              this.layers = res.data.results
            })
      }
    },
    async getData(id) {
      let item = this.map.features.find(el => el.id === id);
      if (item) {
        this.map.features.splice(this.map.features.indexOf(item), 1)
        this.map.attributes = [];
      } else {
        await this.$repository.document.show(id)
            .then(async res => {
              this.getDocument(res.data.document)
                  .then((shapeFile) => shp(shapeFile)
                      .then(geoJson => {
                        let array = {
                          id: res.data.id,
                          name: res.data.Layer_Name,
                          features: geoJson.features
                        }

                        // this.map.attributes = Object.keys(array.features[0].properties)

                        let attrs = array.features[0].properties;
                        let newAttrs = [];
                        for (let key in attrs) {
                          if (typeof attrs[key] === 'number') {
                            newAttrs.push(key)
                          }
                        }

                        this.map.attributes = newAttrs;

                        this.selection.attributes.push(this.map.attributes[0])

                        for (let featuresKey in array.features) {
                          array.features[featuresKey].color = this.$randomColor()
                        }
                        this.map.features.push(array)
                      }));

              this.loading = false;
            });
      }
    },
    async addLayerToMap(from) {

      this.map.features.forEach((map, index, object) => {
        let item = this.selection.layers.find(el => el.id === map.id);
        if (!item) {
          object.splice(index, 1)
        }
      })

      this.selection.layers.forEach(layer => {
        let item = this.map.features.find(el => el.id === layer.id);
        if (!item) {
          this.getDocument(layer.document)
              .then((shapeFile) => shp(shapeFile)
                  .then(geoJson => {
                    let array = {
                      id: layer.id,
                      name: layer.Layer_Name,
                      features: geoJson.features
                    }

                    let attrs = array.features[0].properties;
                    let newAttrs = [];
                    for (let key in attrs) {
                      if (typeof attrs[key] === 'number') {
                        newAttrs.push(key)
                      }
                    }

                    this.map.attributes = newAttrs;

                    this.selection.attributes.push(this.map.attributes[0])

                    for (let featuresKey in array.features) {
                      array.features[featuresKey].color = this.$randomColor()
                    }
                    this.map.features.push(array)
                  }));
          this.selection.sortLayer = [];
          this.toggleModal(from)
        }
      })
    },
    toggleModal(type) {
      this.selection.sortLayer = [];
      this.layers = [];
      this.selection.category = null;
      // this.selection.layers = [];

      if (type === 'all') {
        this.viewAllModal.toggle();
      }

      if (type === 'single') {
        this.modal.toggle();
      }
    },
    async getDocument(url) {
      const resp = await fetch(url);
      if (resp.status > 299) {
        throw new Error(resp.statusText);
      }
      return resp.arrayBuffer();
    },
    async exportMap() {
      html2pdf(this.$refs.document, {
        margin: 1,
        filename: 'document.pdf',
        image: {type: 'jpeg', quality: 0.98},
        html2canvas: {dpi: 192, letterRendering: true},
        jsPDF: {unit: 'in', format: 'letter', orientation: 'landscape'}
      })
    },
    pointOnSurface: findPointOnSurface
  }
}
</script>

<style scoped>
.legendbox {
  height: 20rem;
  overflow-y: scroll;
}
</style>