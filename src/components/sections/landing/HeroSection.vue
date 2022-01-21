<template>
  <section class="topmap  mt-4">
    <div class="container">
      <div class="row">
        <div class="col-md-4">
          <div class="mapdataleft">
            <total-count></total-count>
            <!-- Category -->
            <div class="availablelayers">
              <div class="card border-0 card-widget h-100">
                <div class="card-body p-0">
                  <div class="d-flex justify-content-between">
                    <div class="card_head">
                      <h6>Available Category</h6>
                    </div>
                    <button
                        v-if="$store.state.auth.isStaff"
                        class="btn btn-primary rounded-0 mb-2 mb-lg-0 addnewbtn allbtn manage_category"
                        data-bs-toggle="modal"
                        data-bs-target="#manageCategoryModal"
                    >
                      <span class="d-flex align-items-center"><span class="small">Manage Category</span></span>
                    </button>
                  </div>
                  <ul class="list-unstyled row pad1 pt-0 pb-0 mt-3">
                    <template v-if="categoryLoading">
                      <li class="text-capitalize col-md-6 pb-2" v-for="i in 10" :key="i">
                        <span class="li_skeleton">Category is Loading {{ i }}</span>
                      </li>
                    </template>
                    <template v-else>
                      <template v-for="(category, index) in categories">
                        <li
                            v-if="index < 10"
                            class="pb-2 text-capitalize col-md-6"
                            :key="category.id"
                        >
                          <input
                              :id="'category-'+category.id"
                              class="form-check-input mt-2 me-2"
                              type="checkbox"
                              name="Category"
                              :value="category.Category"
                              v-model="selection.category"
                              @change="getLayers"
                          >
                          <label :for="'category-'+category.id"> {{ category.Category.replaceAll('_', ' ') }}</label>
                        </li>
                      </template>
                      <template v-if="categories.length < 10">
                        <li class="text-capitalize col-md-6 pb-2" v-for="i in (10 - categories.length)" :key="i">
                          <span class="li_skeleton_white">Category is Loading {{ i }}</span>
                        </li>
                      </template>
                    </template>
                  </ul>
                  <div class="col-md-12 px-0 rounded-3">
                    <button
                        class="btn btn-primary allbtn float-start manage_layers addnewbtn"
                        data-bs-toggle="modal"
                        data-bs-target="#manageLayerModal"
                        v-if="$store.state.auth.isStaff"
                    >
                      <span class="d-flex align-items-center"><span class="small">Manage Layers</span></span>
                    </button>
                    <button
                        class="btn btn-primary allbtn float-end view_layers addnewbtn px-4"
                        data-bs-toggle="modal"
                        data-bs-target="#viewallayerModal"
                    >
                      <span class="d-flex align-items-center"><span class="small">View All Layers</span></span>
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
          <div class="mapdataright mt-4 mt-md-0 h-100 d-flex flex-column justify-content-between">
            <div ref="document" class="my_map_box h-100">
              <vl-map
                  id="my_map"
                  ref="map"
                  style="height: 500px"
                  data-projection="EPSG:4326"
                  :load-tiles-while-animating="true"
                  :load-tiles-while-interacting="true"
              >
                <vl-view :zoom.sync="map.zoom" :center.sync="map.center" :rotation.sync="map.rotation"></vl-view>

                <vl-layer-tile>
                  <vl-source-osm :attributions="[]"></vl-source-osm>
                </vl-layer-tile>

                <vl-interaction-select

                    :features.sync="selected"
                >
                  <vl-overlay class="feature-popup" v-for="feature in selected" :key="feature.id" :id="feature.id"
                              :position="pointOnSurface(feature.geometry)" :auto-pan="true"
                              :auto-pan-animation="{ duration: 300 }">
                    <template slot-scope="">
                      <section class="card" style="height: 10rem; overflow-y: scroll">
                        <div class="card-content">
                          <div class="content p-2">
                            <template v-for="(property, key, index) in feature.properties">
                              <!--                              v-if="selection.attributes.includes(key)"-->
                              <div

                                  class="fa-sm text-capitalize"
                                  :key="index"
                              >
                                <template v-if="typeof property !== 'object' && !key.includes('id')">
                                  <strong>{{ key }}</strong>: {{ property }}
                                </template>
                              </div>
                            </template>
                          </div>
                        </div>
                      </section>
                    </template>
                  </vl-overlay>
                </vl-interaction-select>

                <template v-if="selection.layers.length > 0 && !loading">
                  <template v-for="layer in selection.layers">
                    <vl-layer-vector
                        :opacity="layerOpacity"
                        :key="String(layer.id) + String(layer.slug)"
                        :z-index="5"
                    >
                      <vl-source-vector>
                        <vl-feature
                            v-for="(feature, index) in layer.features"
                            :key="String(layer.id) + String(index)"
                            :id="String(layer.id) + String(index)"
                            :properties="feature.properties"
                        >
                          <vl-geom-multi-polygon
                              :coordinates="feature.geometry.coordinates"
                              v-if="feature.geometry.type === 'MultiPolygon'"
                          ></vl-geom-multi-polygon>
                          <vl-geom-polygon
                              :coordinates="feature.geometry.coordinates"
                              v-if="feature.geometry.type === 'Polygon'"
                          ></vl-geom-polygon>
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
                              <vl-style-circle
                                  :radius="layer.selectedAttributes ? getRadius(feature.properties[layer.selectedAttributes], layer.range) : 8">
                                <vl-style-fill color="darkgreen"></vl-style-fill>
                                <vl-style-stroke color="white"></vl-style-stroke>
                              </vl-style-circle>
                            </vl-style-box>
                          </template>

                          <template
                              v-if="(feature.geometry.type  === 'MultiPolygon' || feature.geometry.type  === 'Polygon') && layer.selectedAttributes">
                            <vl-style-box>
                              <vl-style-fill
                                  :color="getColor(feature.properties[layer.selectedAttributes], layer.range)"></vl-style-fill>
                              <vl-style-stroke color="white"></vl-style-stroke>
                            </vl-style-box>
                          </template>

                          <template v-if="feature.geometry.type  === 'LineString'">
                            <vl-style-box>
                              <vl-style-stroke color="blue" :width="3"></vl-style-stroke>
                            </vl-style-box>
                          </template>
                        </vl-feature>
                      </vl-source-vector>
                    </vl-layer-vector>
                  </template>
                </template>

              </vl-map>
              <img class="my_compass" src="@/assets/img/compass.png" alt="compass" v-if="!loading">
              <div class="my_legend">
                <div
                    class="legendbox border p-3 d-none d-md-block"
                    v-if="selection.layers.length > 0 && !loading"
                >
                  <div class="my-legend">
                    <div class="mainhead  d-flex align-items-center">
                      <h5 class="fw-bold">Legends</h5>
                    </div>
                    <div
                        class="legend-scale"
                        v-for="(layer, index) in selection.layers"
                        :key="layer.id"
                    >
                      <template v-if="layer.File_Type.Filetype === 'Raster'">
                        <div class="legend_layer_title">{{ layer.Layer_Name }}</div>
                        <ul class="legend-labels ms-2">
                          <template v-if="layer.range && layer.range.length > 1">
                            <li>
                              <span :style="{'background':rasterColor[0]}"></span>
                              {{ layer.range[0] }} - {{ layer.range[1] }}
                            </li>
                            <li>
                              <span :style="{'background':rasterColor[1]}"></span>
                              {{ layer.range[2] }} - {{ layer.range[3] }}
                            </li>
                            <li>
                              <span :style="{'background':rasterColor[2]}"></span>
                              {{ layer.range[4] }} - {{ layer.range[5] }}
                            </li>
                            <li>
                              <span :style="{'background':rasterColor[3]}"></span>
                              {{ layer.range[6] }} - {{ layer.range[7] }}
                            </li>
                            <li>
                              <span :style="{'background':rasterColor[4]}"></span>
                              {{ layer.range[8] }} - {{ layer.range[9] }}
                            </li>
                          </template>
                        </ul>
                        <hr class="my-3">
                      </template>
                      <template v-else>
                        <template v-if="layer.shapeType === 'LineString'">
                          <div class="legend_layer_title">{{ layer.Layer_Name }}</div>
                          <ul class="legend-labels ms-2">
                            <li>
                              <span style="background-color: blue"></span>
                              {{ layer.Layer_Name }}
                            </li>
                          </ul>
                          <hr class="my-3">
                        </template>
                        <template v-if="selection.attributes[index] && selection.attributes[index].length > 0">
                          <template>
                            <div class="legend_layer_title">{{ layer.Layer_Name }}</div>
                            <template v-if="layer.shapeType === 'Point' && layer.range.length > 0">
                            <span class="ms-2 text-capitalize legend_selected_attribute">{{
                                layer.selectedAttributes.replaceAll('_', ' ')
                              }}</span>
                              <ul class="legend-labels ms-2">
                                <template v-if="layer.range.length > 1">
                                  <li v-for="i in 5" :key="i">
                                    <div class="d-flex justify-content-center" style="width: 20px; margin-right: 10px">
                                      <div class="point" :class="'point-'+i" :style="{'background': 'darkgreen'}"></div>
                                    </div>
                                    {{ layer.range[i - 1] }} - {{ layer.range[i] }}
                                  </li>
                                </template>
                                <li v-else>
                                  <div class="d-flex justify-content-center" style="width: 20px; margin-right: 10px">
                                    <div class="point point-3"></div>
                                  </div>
                                  {{ layer.range[0] }}
                                </li>
                              </ul>
                            </template>
                            <template v-else-if="layer.shapeType === 'MultiPolygon' && layer.range.length > 0">
                              <div class="ms-2 text-capitalize legend_selected_attribute">
                                {{ layer.selectedAttributes.replaceAll('_', ' ') }}
                              </div>
                              <ul class="legend-labels ms-2">
                                <template v-if="layer.range.length > 1">
                                  <li v-for="i in 5" :key="i">
                                    <span :style="{'background':colors[i-1]}"></span>
                                    {{ layer.range[i - 1] }} - {{ layer.range[i] }}
                                  </li>
                                </template>
                                <li v-else>
                                  <div class="d-flex justify-content-center" style="width: 20px; margin-right: 10px">
                                    <span></span>
                                  </div>
                                  {{ layer.range[0] }}
                                </li>
                              </ul>
                            </template>
                          </template>
                          <hr class="my-3">
                        </template>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mappara shadow">
              <div class="row py-2 h-100">
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
                                :id="`layer-${index}`"
                                v-model="selection.layers"
                                :value="layer"
                                @change="removeLayer(layer.Layer_Name)"
                            >
                            <label class="form-check-label" :for="`layer-${index}`">
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
                    <ul
                        class="dropdown-menu border-0 shadow"
                        style="height: 20rem; overflow-y: scroll; overflow-x: hidden"

                    >
                      <li class="row" v-if="selection.layers.length > 0">
                        <div
                            class="col-md-12"
                            v-for="(layer, index) in selection.layers"
                            :key="layer.id"
                        >
                          <template v-if="layer.shapeType !== 'LineString' && layer.File_Type.Filetype !== 'Raster'">
                            <strong>{{ layer.Layer_Name }}</strong>
                            <div class="form-check" v-for="attribute in layer.attributes" :key="attribute">
                              <input
                                  class="form-check-input"
                                  type="radio"
                                  :id="`${index}-attrs-${attribute}`"
                                  :name="'selection'+index"
                                  v-model="selection.attributes[index]"
                                  :value="attribute"
                                  @change="rangeCalculator(index, attribute)"
                              >
                              <label class="form-check-label" :for="`${index}-attrs-${attribute}`">
                                <i class="fas fa-ellipsis-v"></i> {{ attribute }}
                              </label>
                            </div>
                          </template>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="col-md-9 d-flex align-items-center justify-content-end pe-4">
                  <button
                      v-if="$store.state.auth.isLoggedIn"
                      class="btn btn-primary rounded-0 px-2 mb-2 mb-lg-0 viewallbtn allbtn"
                      @click.prevent="startExport"
                  >
                    <span class="d-flex align-items-center"><span class="small fw-bold">Export Map</span></span>
                  </button>
                </div>
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
                  @click.prevent="mapLayers('view')"
              >
                <span class="d-flex align-items-center"><span class="small">Add Layer to Map</span></span>
              </button>
              <button ref="closeBtn" class="btn btn-danger border-0 rounded-0 px-2 mb-2 mb-lg-0  allbtn"
                      @click.prevent="toggleModal('view')">
                <span class="d-flex align-items-center"><span class="small">Close</span></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

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
                    <div class="box-label text-uppercase d-flex align-items-center justify-content-between">Category
                      <!--                      <button-->
                      <!--                          class="btn btn-sm btn-primary ml-auto"-->
                      <!--                          data-toggle="modal"-->
                      <!--                          data-target="#manageCategoryModal"-->
                      <!--                      >-->
                      <!--                        Manage-->
                      <!--                      </button>-->
                    </div>
                    <div id="inner-box" class=" mt-2 mr-1 category_listing_box">
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
                                type="checkbox"
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
              <div class="col-md-9">
                <div class="filter_right">
                  <form>
                    <div
                        class="form-check form-check-inline"
                        v-for="letter in letters"
                        :key="letter"
                    >
                      <input
                          type="checkbox"
                          class="form-check-input"
                          :id="'all' + letter"
                          v-model="selection.sortLayer"
                          :value="letter"
                      >
                      <label
                          class="btn btn-rounded small"
                          :class="selection.sortLayer.includes(letter) ? 'btn-primary' : 'btn-outline-primary'"
                          :for="'all' + letter"
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
                <div class="category_list" v-if="!layerLoading">
                  <!--                  <p class="mb-0 fw-bold pb-0">Please Select Layers</p>-->
                  <div
                      class="row"
                      v-for="(item, index) in selection.category"
                      :key="index"
                  >
                    <hr v-if="index !== 0" class="my-3">
                    <div class="col-12 text-capitalize category_label">
                      <i class="fas fa-globe"></i> <strong>{{ item.replaceAll('_', ' ') }}</strong>
                    </div>
                    <template v-for="layer in sortedLayers">
                      <div
                          class="col-md-4 layerinner"
                          v-if="layer.Category.Category === item"
                          :key="layer.id"
                      >
                        <div class="form-check" v-if="layer.Layer_Name">
                          <input class="form-check-input" type="checkbox" :id="'layer-all-' + layer.id"
                                 v-model="selection.layers" :value="layer">
                          <label class="form-check-label fw-normal" :for="'layer-all-' + layer.id">
                            <i class="fas fa-ellipsis-v"></i> {{ layer.Layer_Name }}
                          </label>
                        </div>
                        <div v-else>
                          Layers not available
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
                <div class="d-flex justify-content-center align-items-center category_list_spinner" v-else>
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div class="modal-footer">
            <div class="mybtn">
              <button
                  class="btn btn-primary rounded-0 px-2 mb-2 mb-lg-0 me-3 addnewbtn allbtn"
                  @click.prevent="mapLayers('all')"
                  :disabled="mapLoading"
              >
                <span class="d-flex align-items-center"><span class="small">Add to Map</span></span>
              </button>
              <button
                  class="btn btn-danger border-0 rounded-0 px-2 mb-2 mb-lg-0  allbtn"
                  @click.prevent="toggleModal('all')"
                  :disabled="mapLoading"
              >
                <span class="d-flex align-items-center"><span class="small">Close</span></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <manage-category-modal @categoryUpdated="getCategories"></manage-category-modal>

    <manage-layers-modal></manage-layers-modal>

  </section>
</template>

<script>

import TotalCount from "./TotalCount";
import LayersAddNewModal from "../../modals/LayersAddNewModal";
import CategoryAddModal from "../../modals/CategoryAddModal";
import ManageCategoryModal from "../../modals/ManageCategoryModal";
import ManageLayersModal from "../../modals/ManageLayersModal";

import ImageStatic from "ol/source/ImageStatic";
import {ScaleLine} from 'ol/control';
import {findPointOnSurface} from 'vuelayers/dist/ol-ext'

import html2pdf from "html2pdf.js";
import shp from "shpjs";
import {fromArrayBuffer} from "geotiff";
import * as plotty from "plotty";
import Image from "ol/layer/Image";

export default {
  name: "HeroSection",
  components: {ManageLayersModal, ManageCategoryModal, CategoryAddModal, LayersAddNewModal, TotalCount},
  data() {
    return {
      layerOpacity: 0.8,
      loading: true,
      categoryLoading: true,
      layerLoading: false,
      mapLoading: false,
      modal: null,
      viewAllModal: null,
      manageCategoryModal: null,
      categories: [],
      layers: [],
      map: {
        zoom: 11,
        center: [85.38982339512815, 27.68673136138436],
        rotation: 0,
      },
      selected: [],
      selection: {
        category: [],
        layers: [],
        attributes: [],
        sortLayer: []
      },
      radius: [5, 8, 11, 14, 17],
      colors: [],
      rasterColor: []
    }
  },
  computed: {
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
    },
  },
  mounted() {
    this.getCategories()
    this.modal = new this.$bootstrap.Modal(document.getElementById('layers-view-modal'))
    this.viewAllModal = new this.$bootstrap.Modal(document.getElementById('viewallayerModal'))

    this.colors[0] = '#ff8f8f'
    this.colors[1] = '#ff6b6b'
    this.colors[2] = '#ff4747'
    this.colors[3] = '#ff2424'
    this.colors[4] = '#910c05'

    this.rasterColor[0] = '#FF7F7F'
    this.rasterColor[1] = '#377eb8'
    this.rasterColor[2] = '#4daf4a'
    this.rasterColor[3] = '#FFFF00'
    this.rasterColor[4] = '#ff7f00'
  },
  methods: {
    async getCategories() {
      await this.$repository.category.get()
          .then(res => {
            this.categories = res.data.results;
            this.loading = false;
            this.categoryLoading = false;

            let scaleLine = new ScaleLine({
              units: "metric",
              bar: true,
              steps: 4,
              text: false,
              minWidth: 130,
            });

            this.$refs.map.$map.addControl(scaleLine)
          });
    },
    async getLayers() {
      this.layerLoading = true;
      if (this.selection.category.length > 0) {
        this.selection.layers.forEach(el => {
          this.removeLayer(el.Layer_Name)
        })
        this.selection.layers = [];
        this.layers = [];

        for (const cat of this.selection.category) {
          let params = `?Category=${cat}`
          await this.$repository.document.filter(params)
              .then(res => {
                if (res.data.results.length > 0) {
                  res.data.results.forEach(el => {
                    this.layers.push(el);
                  })
                } else {
                  this.layers.push({
                    Category: {
                      Category: cat
                    },
                    Layer_Name: null,
                    id: Math.floor(Math.random())
                  })
                }
              })
        }
      }
      this.layerLoading = false;
    },
    async getDocument(url) {
      const resp = await fetch(url);
      if (resp.status > 299) {
        throw new Error(resp.statusText);
      }
      return resp.arrayBuffer();
    },
    newLayerAdded() {
      this.$refs.addLayerBtn.click();
      this.getLayers();
    },
    getRadius(value, range) {
      if (range.length > 1) {
        if (value < range[1]) {
          return this.radius[0];
        } else if (value < range[2]) {
          return this.radius[1];
        } else if (value < range[3]) {
          return this.radius[2];
        } else if (value < range[4]) {
          return this.radius[3];
        } else {
          return this.radius[4];
        }
      } else {
        return this.radius[1];
      }
    },
    getColor(value, range) {
      if (range.length > 0) {
        if (value < range[1]) {
          return this.colors[0];
        } else if (value < range[2]) {
          return this.colors[1];
        } else if (value < range[3]) {
          return this.colors[2];
        } else if (value < range[4]) {
          return this.colors[3];
        } else {
          return this.colors[4];
        }
      } else {
        return this.colors[2];
      }
    },
    rangeCalculator(index, attribute) {
      this.selection.layers[index].range = [];
      this.selection.layers[index].selectedAttributes = attribute
      let numbers = [];
      this.selection.layers[index].features.forEach(feature => {
        const current = feature.properties[attribute]
        numbers.push(current);
      })
      const min = Math.min(...numbers)
      const max = Math.max(...numbers)
      const divider = (max - min) / 5

      if (divider > 0) {
        const first = min;
        const second = first + divider;
        const third = second + divider;
        const fourth = third + divider;
        const fifth = fourth + divider;

        this.selection.layers[index].range.push(first.toFixed(2))
        this.selection.layers[index].range.push(second.toFixed(2))
        this.selection.layers[index].range.push(third.toFixed(2))
        this.selection.layers[index].range.push(fourth.toFixed(2))
        this.selection.layers[index].range.push(fifth.toFixed(2))
        this.selection.layers[index].range.push(max.toFixed(2))
      } else {
        this.selection.layers[index].range.push(min)
      }

    },
    raterRangeCalculator(min, max, layer) {
      const divider = Math.floor((max - min) / 5);
      const second = min + divider;
      const third = second + divider;
      const fourth = third + divider;
      const fifth = fourth + divider;

      layer.range.push(
          min, second,
          second + 1, third,
          third + 1, fourth,
          fourth + 1, fifth,
          fifth + 1, max
      )
    },
    toggleModal(type) {
      this.selection.sortLayer = [];
      this.layers = [];
      this.selection.category = [];
      // this.selection.layers = [];

      if (type === 'all') {
        this.viewAllModal.toggle();
      }

      if (type === 'view') {
        this.modal.toggle();
      }

      this.loading = false
    },
    removeLayer(layer) {
      this.$refs.map.$map.getLayers().forEach(el => {
        if (el.get('name') === layer) {
          this.$refs.map.$map.removeLayer(el)
        }
      });
    },
    mapLayers(fromModal) {
      this.mapLoading = true;
      this.selection.layers.forEach((layer, index) => {
        layer.range = [];
        if (layer.File_Type.Filetype === 'Raster') {
          this.onGeotiffLoaded(layer)
        } else {
          this.getDocument(layer.document)
              .then((shapeFile) => shp(shapeFile)
                  .then(geoJson => {
                    layer.features = geoJson.features

                    let attrs = layer.features[0].properties;
                    let newAttrs = [];
                    for (let key in attrs) {
                      if (typeof attrs[key] === 'number') {
                        newAttrs.push(key)
                      }
                    }
                    layer.attributes = newAttrs;

                    layer.color = this.$randomColor()

                    layer.shapeType = layer.features[0].geometry.type
                    this.selection.attributes[index] = []
                    layer.selectedAttributes = null;
                    layer.range = [];
                  }));
        }
      })

      this.selection.sortLayer = [];
      setTimeout(() => {
        this.mapLoading = false;
        this.toggleModal(fromModal)
      }, 1000)
    },
    async startExport(){
      this.layerOpacity = 1;

      setTimeout(() => {
        this.exportMap();
      }, 500)

      setTimeout(() => {
        this.layerOpacity = 0.8;
      }, 2000)
    },
    async exportMap() {
      html2pdf(this.$refs.document, {
        margin: 10,
        filename: 'document.pdf',
        image: {type: 'jpeg', quality: 1},
        html2canvas: {dpi: 300, letterRendering: true},
        jsPDF: {unit: 'mm', format: 'a4', orientation: 'l', precision: 16}
      })
    },
    pointOnSurface: findPointOnSurface,
    async onGeotiffLoaded(layer) {

      const response = await fetch(layer.document);
      const arrayBuffer = await response.arrayBuffer();
      const tiff = await fromArrayBuffer(arrayBuffer);

      const image = await tiff.getImage();
      const boundingBoxData = image.getBoundingBox();
      const imageData = await image.readRasters(); // format = data:array(pixels), width:int, height:int

      const uniquePixelData = [...new Set(imageData[0])];

      let canvas = document.createElement('canvas');
      const minValue = this.arrayMin(uniquePixelData) //Math.min(...uniquePixelData);
      const maxValue = this.arrayMax(uniquePixelData) //Math.max(...uniquePixelData);

      this.raterRangeCalculator(minValue, maxValue, layer)

      const average = (array) => array.reduce((a, b) => a + b) / array.length;

      const avg = average(uniquePixelData) * image.getWidth();
      const divider = ((maxValue / avg - minValue / avg) / 5)

      const first = minValue / avg;
      const second = first + divider;
      const third = second + divider;
      const fourth = third + divider;
      const fifth = fourth + divider;

      let range = [];

      range.push(
          first, second,
          second + 1 / avg, third,
          third + 1 / avg, fourth,
          fourth + 1 / avg, fifth,
          fifth + 1 / avg, (maxValue / avg)
      );

      plotty.addColorScale("mycolorscale",
          [
            "#FF7F7F", "#FF7F7F",
            "#377eb8", "#377eb8",
            "#4daf4a", "#4daf4a",
            "#FFFF00", "#FFFF00",
            "#ff7f00", "#ff7f00"
          ],
          range
      )

      const plot = new plotty.plot({
        canvas: canvas,
        data: imageData[0],
        width: image.getWidth(),
        height: image.getHeight(),
        domain: [minValue, maxValue],
        displayRange: [1, maxValue],
        applyDisplayRange: true,
        colorScale: "mycolorscale",
        clampLow: true,
        clampHigh: true,
        useWebGL: true
      });

      plot.render();

      const imgSource = new ImageStatic({
        url: canvas.toDataURL(),
        imageExtent: boundingBoxData,
        projection: 'EPSG:4326'
      })
      let geotiffLayer = new Image();
      geotiffLayer.set('name', layer.Layer_Name)
      geotiffLayer.set('type', 'Image')
      geotiffLayer.setZIndex(1)

      geotiffLayer.setSource(imgSource);
      geotiffLayer.setOpacity(0.9);

      this.$refs.map.$map.addLayer(geotiffLayer);
    },
    arrayMin(arr) {
      let len = arr.length, min = Infinity;
      while (len--) {
        if (arr[len] < min) {
          min = arr[len];
        }
      }
      return min;
    },
    arrayMax(arr) {
      let len = arr.length, max = -Infinity;
      while (len--) {
        if (arr[len] > max) {
          max = arr[len];
        }
      }
      return max;
    }
  }
}
</script>

<style scoped>

::v-deep .ol-scale-bar-inner > div > div.ol-scale-step-text {
  padding-top: 10px !important;
}

::v-deep .ol-scale-step-text {
  position: unset !important;
  font-size: 10px !important;
}

.my_map_box {
  position: relative;
}

.my_compass {
  width: 90px;
  height: 90px;
  object-fit: contain;
  position: absolute;
  right: 1rem;
  bottom: 1rem;
}

.my_legend {
  position: absolute;
  top: 0;
  right: 0;
}

.legend_layer_title {
  font-weight: 700;
  color: #00749E;
}

.legend_selected_attribute {
  font-weight: 700;
}

.li_skeleton {
  color: #EFEFEF;
  background-color: #EFEFEF;
  animation: pulse 1s cubic-bezier(.4, 0, .6, 1) infinite
}
.li_skeleton_white {
  color: #FFFFFF;
  background-color: #FFFFFF;
  animation: pulse 1s cubic-bezier(.4, 0, .6, 1) infinite
}

@keyframes pulse {
  50% {
    opacity: .9
  }
}

.legendbox {
  font-size: 90%;
  background-color: #ffffff;
  height: 15rem;
  min-width: 12rem;
  overflow-y: scroll;
}

.category_listing_box {
  height: 50vh;
}

.category_list {
  height: 40vh;
}

.category_listing_box, .category_list {
  overflow-y: scroll;
  overflow-x: hidden;
}

.category_label > strong {
  text-decoration: underline;
}

.manage_category {
  padding: 10px 20px;
  border-radius: 0 21px !important;
}

.view_layers {
  padding: 10px 20px;
  border-radius: 21px 0 !important;
}

.manage_layers {
  padding: 10px 20px;
  border-radius: 0 21px !important;
}

.point {
  border-radius: 50%;
  background-color: red;
}

.point-1 {
  height: 10px;
  width: 10px;
}

.point-2 {
  height: 12px;
  width: 12px;
}

.point-3 {
  height: 14px;
  width: 14px;
}

.point-4 {
  height: 16px;
  width: 16px;
}

.point-5 {
  height: 18px;
  width: 18px;
}

.mappara {
  height: inherit;
}

</style>