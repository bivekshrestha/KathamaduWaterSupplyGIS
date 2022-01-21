<template>
  <div>
    <!-- explore layer css -->
    <section v-if="!loading" class="mt-4">
      <div class="container">
        <div class="explore_inner_layer">
          <div class="row g-0">
            <div class="col-md-9">
              <div ref="document">
                <div class="map_left">
                  <div class="mapimg viewmapimg position-relative">
                    <vl-map
                        id="my_map"
                        ref="map"
                        style="height: 500px;"
                        :load-tiles-while-animating="false"
                        :load-tiles-while-interacting="false"
                    >
                      <vl-view :zoom.sync="map.zoom" :center.sync="map.center" :rotation.sync="map.rotation"
                               projection="EPSG:4326"></vl-view>

                      <vl-layer-tile>
                        <vl-source-osm :attributions="[]"></vl-source-osm>
                      </vl-layer-tile>

                      <vl-interaction-select
                          :features.sync="selected"
                      >
                        <vl-overlay
                            class="feature-popup"
                            v-for="feature in selected"
                            :key="feature.id"
                            :id="feature.id"
                            :position="pointOnSurface(feature.geometry)"
                            :auto-pan="true"
                            :auto-pan-animation="{ duration: 300 }"
                        >
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
                        <vl-layer-vector :opacity="layerOpacity">
                          <vl-source-vector>
                            <vl-feature
                                v-for="(feature, index) in map.features"
                                :key="index"
                                :id="index"
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
                                      :radius="map.selectedAttributes ? getRadius(feature.properties[map.selectedAttributes], map.range) : 8">
                                    <vl-style-fill color="red"></vl-style-fill>
                                    <vl-style-stroke color="white"></vl-style-stroke>
                                  </vl-style-circle>
                                </vl-style-box>
                              </template>

                              <template
                                  v-if="(feature.geometry.type  === 'MultiPolygon' || feature.geometry.type  === 'Polygon') && map.selectedAttributes">
                                <vl-style-box>
                                  <vl-style-fill
                                      :color="getColor(feature.properties[map.selectedAttributes], map.range)"></vl-style-fill>
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
                    </vl-map>
                    <img class="my_compass" src="@/assets/img/compass.png" alt="compass" v-if="!loading">
                  </div>
                </div>
                <div class="legendbox border p-3">
                  <div class="my-legend">
                    <div class="mainhead  d-flex align-items-center">
                      <h4 class="fw-bold">Legends</h4>
                    </div>
                    <div class='legend-scale'>
                      <template v-if="layer.File_Type.Filetype === 'Raster'">
                        <div class="ms-2 text-capitalize legend_selected_attribute">
                          {{ layer.Layer_Name.replaceAll('_', ' ') }}
                        </div>
                        <ul class="legend-labels ms-2" v-if="!layerLoading">
                          <template v-if="layer.range.length > 0">
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
                          <li v-else>
                            <div class="d-flex justify-content-center" style="width: 20px; margin-right: 10px">
                              <span></span>
                            </div>
                            {{ layer.range[0] }}
                          </li>
                        </ul>
                      </template>
                      <template v-else>
                        <template v-if="map.shapeType === 'LineString'">
                          <ul class="legend-labels ms-2">
                            <li>
                              <span style="background-color: blue"></span>
                              {{ layer.Layer_Name }}
                            </li>
                          </ul>
                        </template>
                        <template v-else>
                          <template v-if="map.shapeType === 'Point' && map.range.length > 0">
                            <span class="ms-2">Attribute: {{ layer.selectedAttributes }}</span>
                            <ul class="legend-labels ms-2">
                              <template v-if="map.range.length > 1">
                                <li v-for="i in 5" :key="i">
                                  <div class="d-flex justify-content-center" style="width: 20px; margin-right: 10px">
                                    <div class="point" :class="'point-'+i" :style="{'background': 'red'}"></div>
                                  </div>
                                  {{ map.range[i - 1] }} - {{ map.range[i] }}
                                </li>
                              </template>
                              <li v-else>
                                <div class="d-flex justify-content-center" style="width: 20px; margin-right: 10px">
                                  <div class="point point-3"></div>
                                </div>
                                {{ map.range[0] }}
                              </li>
                            </ul>
                          </template>
                          <template v-else-if="map.shapeType === 'MultiPolygon' && map.range.length > 0">
                            <span class="ms-2">Attribute: {{ map.selectedAttributes }}</span>
                            <ul class="legend-labels ms-2">
                              <template v-if="map.range.length > 1">
                                <li v-for="i in 5" :key="i">
                                  <span :style="{'background':colors[i-1]}"></span>
                                  {{ map.range[i - 1] }} - {{ map.range[i] }}
                                </li>
                              </template>
                              <li v-else>
                                <div class="d-flex justify-content-center" style="width: 20px; margin-right: 10px">
                                  <span></span>
                                </div>
                                {{ map.range[0] }}
                              </li>
                            </ul>
                          </template>
                        </template>
                      </template>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div class="col-md-3">
              <div class="card shadow rounded-0">
                <div class="card-body">
                  <!-- sratInfo -->
                  <div class="legendbox border p-3 mt-3">
                    <div class="my-legend">
                      <div class="mainhead  d-flex align-items-center">
                        <h4 class="fw-bold">Info</h4>
                      </div>
                      <div class='legend-scale'>
                        <ul class='legend-labels'>
                          <li class="text-capitalize"> Layer Name: {{ layer.Layer_Name }}</li>
                          <li class="text-capitalize"> Uploaded At: {{ layer.uploaded_at | formatDate }}</li>
                          <li class="text-capitalize"> File Type: {{ layer.File_Type.Filetype }}</li>
                          <li class="text-capitalize"> Category: {{ layer.Category.Category.replaceAll('_', ' ') }}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <!-- end info -->

                  <!--Attributes Start -->
                  <div class="legendbox border p-3 mt-3"
                       v-if="map.shapeType !== 'LineString' && layer.File_Type.Filetype !== 'Raster'">
                    <div class="my-legend">
                      <div class="mainhead  d-flex align-items-center">
                        <h4 class="fw-bold">Attributes</h4>
                      </div>
                      <div class='legend-scale'>
                        <ul class='legend-labels mylayers myattributes row'>
                          <li class="col-md-6"
                              v-for="(attribute, index) in map.attributes"
                              :key="index"
                          >
                            <div class="form-check">
                              <input
                                  v-model="selection.attributes"
                                  class="form-check-input"
                                  type="radio"
                                  :id="`attr${index}`"
                                  :value="attribute"
                                  @change="rangeCalculator(attribute)"
                              >
                              <label class="form-check-label" :for="`attr${index}`">
                                <!--                                <i class="fas fa-ellipsis-v"></i> -->
                                {{ attribute }}
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <!-- Attributes End-->

                  <!-- mybtn -->
                  <div class="mybtn">
                    <a
                        v-if="$store.state.auth.isLoggedIn"
                        class="btn btn-primary rounded-0 px-2 mb-2 mb-lg-0 addnewbtn allbtn w-100 mt-2"
                        :href="layer.document"
                        target="_blank"
                    >
                      <span class="d-flex align-items-center justify-content-between"><span class="small fw-bold">Download Layer</span><i
                          class="fas fa-download me-2"></i></span>
                    </a>
                    <button
                        v-if="$store.state.auth.isLoggedIn"
                        class="btn btn-primary rounded-0 px-2 mb-2 mb-lg-0 viewallbtn allbtn w-100 mt-2"
                        @click.prevent="startExport"
                    >
                      <span class="d-flex align-items-center justify-content-between"><span class="small fw-bold">Export Layer</span><i
                          class="fas fa-file-export  me-2"></i></span>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
import shp from "shpjs";
import {findPointOnSurface} from "vuelayers/dist/ol-ext";
import html2pdf from "html2pdf.js";
import {ScaleLine} from "ol/control";
import {fromArrayBuffer} from "geotiff";
import * as plotty from "plotty";
import ImageStatic from "ol/source/ImageStatic";
import Image from "ol/layer/Image";

// import gdal from 'gdal';

export default {
  name: "ViewDataset",
  data() {
    return {
      layerOpacity: 0.8,
      loading: true,
      layerLoading: true,
      map: {
        zoom: 10,
        center: [85.3434304327227, 27.63451937048214],
        rotation: 0,
        features: [],
        attributes: [],
        selectedAttributes: '',
        shapeType: '',
        range: []
      },
      layer: {},
      selection: {
        attributes: ''
      },
      selected: [],
      radius: [5, 8, 11, 14, 17],
      colors: [],
      rasterColor: []
    }
  },
  mounted() {
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

    this.getData();
  },
  methods: {
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
    displayScaleBars() {
      let scaleLine = new ScaleLine({
        units: "metric",
        bar: true,
        steps: 4,
        text: false,
        minWidth: 130,
      });

      this.$refs.map.$map.addControl(scaleLine)
    },
    async getData() {
      await this.$repository.document.show(this.$route.params.id)
          .then(async res => {
            this.layer = res.data
            this.layer.range = [];
            this.loading = false;
            if (this.layer.File_Type.Filetype === 'Raster') {
              await this.onGeotiffLoaded()
              this.displayScaleBars()
            } else {
              this.getDocument()
                  .then((shapeFile) => shp(shapeFile)
                      .then(geoJson => {
                        this.map.features = geoJson.features
                        this.map.attributes = Object.keys(this.map.features[0].properties)

                        for (let key in this.map.features) {
                          this.map.features[key].color = this.$randomColor()
                        }

                        let attrs = this.map.features[0].properties;
                        let newAttrs = [];
                        for (let key in attrs) {
                          if (typeof attrs[key] === 'number') {
                            newAttrs.push(key)
                          }
                        }
                        this.map.attributes = newAttrs;

                        this.map.shapeType = this.map.features[0].geometry.type
                        this.selection.attributes = []
                        this.map.range = [];
                        this.displayScaleBars()
                      }));
            }
          });
    },
    rangeCalculator(attribute) {
      this.map.range = [];
      this.map.selectedAttributes = attribute
      let numbers = [];
      this.map.features.forEach(feature => {
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

        this.map.range.push(first.toFixed(2))
        this.map.range.push(second.toFixed(2))
        this.map.range.push(third.toFixed(2))
        this.map.range.push(fourth.toFixed(2))
        this.map.range.push(fifth.toFixed(2))
        this.map.range.push(max.toFixed(2))
      } else {
        this.map.range.push(min)
      }

    },
    rasterRangeCalculator(min, max) {

      let divider = (max - min) / 5;

      if (min > 1) {
        divider = Math.floor(divider)
      }

      const second = min + divider;
      const third = second + divider;
      const fourth = third + divider;
      const fifth = fourth + divider;

      this.layer.range = [];

      let rangeSeparator = min < 1 ? 1 / 100 : 1;

      this.layer.range.push(
          min, second,
          second + rangeSeparator, third,
          third + rangeSeparator, fourth,
          fourth + rangeSeparator, fifth,
          fifth + rangeSeparator, max
      )

      // for(let i = 0; i < this.layer.range.length; i++){
      //   this.layer.range[i] = this.layer.range[i].toFixed(4)
      // }

    },
    async getDocument() {
      const resp = await fetch(this.layer.document);
      if (resp.status > 299) {
        throw new Error(resp.statusText);
      }
      return resp.arrayBuffer();
    },
    async startExport() {
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
        filename: `${this.layer.Layer_Name}.pdf`,
        image: {type: 'jpeg', quality: 1},
        html2canvas: {dpi: 300, letterRendering: true},
        jsPDF: {unit: 'mm', format: 'a4', orientation: 'l', precision: 16}
      })

    },
    pointOnSurface: findPointOnSurface,
    async onGeotiffLoaded() {
      // const response = await fetch('/test.tif');
      const response = await fetch(this.layer.document);
      const arrayBuffer = await response.arrayBuffer();
      const tiff = await fromArrayBuffer(arrayBuffer);

      const image = await tiff.getImage();

      let noData = image.fileDirectory.GDAL_NODATA.replace('\u0000', '');

      const boundingBox = await image.getBoundingBox();
      console.log(boundingBox);
      const boundingBoxData = [85.19087620500005, 27.40275214500008, 85.56809842752405, 27.81747436755408] //image.getBoundingBox();
      const imageData = await image.readRasters(); // format = data:array(pixels), width:int, height:int

      // let val = -3.4028230607370965e+38;

      // const valueToRemove = parseInt(noData);
      const dataset = imageData[0]

      for (let i = 0; i < dataset.length; i++) {
        if (parseInt(dataset[i]) == parseInt(noData)) {
          dataset[i] = null;
        }
      }

      const uniquePixelData = [...new Set(dataset)];

      let index = uniquePixelData.indexOf(0);
      if (index > -1) {
        uniquePixelData.splice(index, 1)
      }

      let canvas = document.createElement('canvas');
      let minValue = this.arrayMin(uniquePixelData) //Math.min(...uniquePixelData);
      const maxValue = this.arrayMax(uniquePixelData) //Math.max(...uniquePixelData);

      this.rasterRangeCalculator(minValue, maxValue)

      const average = (array) => array.reduce((a, b) => a + b) / array.length;

      const avg = average(uniquePixelData) * image.getWidth();

      let divider = (maxValue / avg - minValue / avg) / 5
      let first = minValue / avg;
      if (minValue < 1) {
        divider = (maxValue - minValue) / 5
        first = minValue;
      }

      const second = first + divider;
      const third = second + divider;
      const fourth = third + divider;
      const fifth = fourth + divider;

      let range = [];

      // range.push(
      //     first, second,
      //     second + 1 / avg, third,
      //     third + 1 / avg, fourth,
      //     fourth + 1 / avg, fifth,
      //     fifth + 1 / avg, (maxValue / avg)
      // );

      range.push(
          first,
          second,
          third,
          fourth,
          fifth,
      );

      // plotty.addColorScale("mycolorscale",
      //     [
      //       "#FF7F7F", "#FF7F7F",
      //       "#377eb8", "#377eb8",
      //       "#4daf4a", "#4daf4a",
      //       "#FFFF00", "#FFFF00",
      //       "#ff7f00", "#ff7f00"
      //     ],
      //     range
      // )

      plotty.addColorScale("mycolorscale",
          [
            "#FF7F7F",
            "#377eb8",
            "#4daf4a",
            "#FFFF00",
            "#ff7f00",
          ],

          [0, 0.25, 0.5, 0.75, 1]
      )

      const plot = new plotty.plot({
        canvas: canvas,
        data: dataset,
        width: image.getWidth(),
        height: image.getHeight(),
        domain: [minValue, maxValue],
        displayRange: [minValue, maxValue],
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
      geotiffLayer.set('name', this.layer.Layer_Name)
      geotiffLayer.set('type', 'Image')
      geotiffLayer.setZIndex(1)

      geotiffLayer.setSource(imgSource);
      geotiffLayer.setOpacity(0.9);

      this.$refs.map.$map.addLayer(geotiffLayer);
      this.layerLoading = false;
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

.my_compass {
  width: 90px;
  height: 90px;
  object-fit: contain;
  position: absolute;
  right: 1rem;
  bottom: 1rem;
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
</style>