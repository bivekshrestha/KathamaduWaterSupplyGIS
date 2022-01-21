<template>
  <div class="timeseriesdata locationseries" v-if="!loading">
    <div class="card border-0">
      <div class="card-body border-0 shadow">
        <div class=" mb-3 border-bottom pb-3">
          <div class="row">
            <div class="col-md-6 d-flex align-items-center">
              <div class="mainhead">
                <h4 class="fw-bold d-flex align-items-center">
                  <div class=" "><i class="bi bi-pin-map-fill"></i></div>
                  Measurement Stations
                </h4>
              </div>
            </div>
            <div class="col-md-6">
              <div class="d-block d-md-flex align-items-center justify-content-flex-end">
                <div class="timeseriestab me-1 me-1 mb-2 mb-md-0">
                  <ul class="nav nav-tabs border-0 " id="myTab" role="tablist">
                    <li class="nav-item" role="presentation">
                      <button class="nav-link active" id="map-tab" data-bs-toggle="tab" data-bs-target="#map1"
                              type="button" role="tab" aria-controls="map1" aria-selected="true">Map
                      </button>
                    </li>
                    <li class="nav-item" role="presentation">
                      <button class="nav-link" id="table1-tab" data-bs-toggle="tab" data-bs-target="#table1"
                              type="button" role="tab" aria-controls="table1" aria-selected="false">Table
                      </button>
                    </li>
<!--                    <li class="nav-item" role="presentation">-->
<!--                      <button class="nav-link" id="chart-tab" data-bs-toggle="tab" data-bs-target="#chart"-->
<!--                              type="button" role="tab" aria-controls="table1" aria-selected="false">Chart-->
<!--                      </button>-->
<!--                    </li>-->
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-md-12 mt-3">
              <div class="d-flex align-items-center justify-content-start">
                <div class="form-group me-3">
                  <div class="form-group">
                    <!-- <label class="control-label">Variables </label> -->
                    <select class="form-select form-control" v-model="selection.municipality"
                            @change="getLocationData">
                      <option value="null" disabled>Municipalities</option>
                      <option value="all">All</option>
                      <option
                          v-for="(item, index) in options.municipalities"
                          :key="index"
                          :value="item"
                      >{{ item }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="form-group me-3">
                  <select class="form-select form-control" v-model="selection.variable" @change="getLocationData">
                    <option value="null" disabled>Variable</option>
                    <option value="all">All</option>
                    <option
                        v-for="(item, index) in options.variables"
                        :key="index"
                        :value="item.variable"
                    >{{ item.variable }}
                    </option>
                  </select>
                </div>
                <div class="form-group me-3">
                  <button class="btn btn-outline-secondary rounded-0 py-1 btn-sm" @click.prevent="resetAll">
                    Reset All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- time line section starts -->
        <div class="water_timeline">
          <div class="tab-content" id="myTabContent">
            <div class="tab-pane fade show active" id="map1" role="tabpanel" aria-labelledby="map-tab">
              <vl-map
                  data-projection="EPSG:4326"
                  style="height: 400px;" :load-tiles-while-animating="true"
                  :load-tiles-while-interacting="true"
              >
                <vl-view :zoom.sync="map.zoom" :center.sync="map.center" :rotation.sync="map.rotation"></vl-view>

                <vl-layer-tile>
                  <vl-source-osm :attributions="[]"></vl-source-osm>
                </vl-layer-tile>

                <vl-interaction-select :features.sync="selected">
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
                      <section class="card" style="height: 10rem; overflow-y: scroll">
                        <div class="card-content">
                          <div class="content p-2">
                            <div class="h5 mt-2 pb-2 border-bottom">Station Details</div>
                            <div class="fa-sm text-capitalize">
                              <strong>Location</strong>: {{ feature.properties.Localname }},
                              {{ feature.properties.Municipality }}
                            </div>
                            <div class="fa-sm text-capitalize">
                              <strong>Source type</strong>:
                              {{ feature.properties.Sourcetype ? feature.properties.Sourcetype : 'N/A' }}
                            </div>
                            <template v-if="feature.properties.variable.length > 0">
                              <template v-for="(variable, index) in feature.properties.variable">
                                <div class="fa-sm text-capitalize" :key="variable.variable_id">
                                  <strong>Indicator Test v{{ index + 1 }}</strong>:
                                  {{ variable.Name ? variable.Name : variable.variable.replaceAll('_', ' ') }}
                                  <span class="text-lowercase">{{ variable.Unit }}</span>
                                </div>
                              </template>
                            </template>
                            <div class="fa-sm text-capitalize" v-else>
                              <strong>Indicator Test</strong>: N/A
                            </div>
                            <div class="fa-sm text-capitalize">
                              <strong>Started Date</strong>: {{ feature.properties.Started_date | formatDateWithMonth }}
                            </div>
                            <div class="fa-sm text-capitalize">
                              <strong>Operational</strong>: {{ feature.properties.Operational }}
                            </div>
                            <div class="fa-sm text-capitalize" v-if="feature.properties.Operational === 'false'">
                              <strong>Stopped Date</strong>: {{ feature.properties.End_date | formatDateWithMonth }}
                            </div>
                            <div class="fa-sm text-capitalize">
                              <strong>Updated At</strong>: {{ feature.properties.uploaded_at | formatDateWithMonth }}
                            </div>
                            <div class="fa-sm text-capitalize" v-if="feature.properties.owners_name">
                              <strong>Owner</strong>:
                              {{ feature.properties.owners_name ? feature.properties.owners_name : 'N/A' }}
                            </div>
                            <div class="fa-sm text-capitalize">
                              <strong>Station Altitude</strong>:
                              {{ feature.properties.Altitude ? feature.properties.Altitude : 'N/A' }}
                            </div>
                          </div>
                        </div>
                      </section>
                    </template>
                  </vl-overlay>
                </vl-interaction-select>

                <template v-if="locations.length > 0">
                  <vl-feature
                      v-for="location in locations"
                      :key="location.location_id"
                      :id="location.location_id"
                      :properties="location"
                  >
                    <vl-geom-point
                        :coordinates="[location.longitude, location.latitude]"
                    ></vl-geom-point>
                    <vl-style-box>
                      <vl-style-circle :radius="10">
                        <vl-style-fill color="red"></vl-style-fill>
                        <vl-style-stroke color="white"></vl-style-stroke>
                      </vl-style-circle>
                    </vl-style-box>
                  </vl-feature>
                </template>
              </vl-map>
            </div>
            <div class="tab-pane fade" id="table1" role="tabpanel" aria-labelledby="table1-tab">
              <div class="watersupplytable">
                <div class="table_card d-flex justify-content-end  mb-3">
                  <div class="table_search">
                  </div>
                </div>
                <div class="table-responsive" v-if="locations.length > 0">
                  <table class="table table-success table-striped table-hover table-bordered">
                    <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Address</th>
                      <th scope="col">Source Type</th>
                      <th scope="col">Indicator Test</th>
                      <th scope="col">Started Date</th>
                      <th scope="col">Operational</th>
                      <th scope="col">Stopped Date</th>
                      <th scope="col">Updated At</th>
                      <th scope="col">Owner</th>
                      <th scope="col">Altitude</th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr v-for="(location, index) in locations" :key="location.location_id">
                      <th scope="row">{{ ++index }}</th>
                      <td>{{ location.Localname }}, {{ location.Municipality }}</td>
                      <td>{{ location.Sourcetype ? location.Sourcetype : 'N/A' }}</td>
                      <td>
                        <template v-if="location.variable.length > 0">
                          <template v-for="(variable, index) in location.variable">
                            <span v-if="index > 0" :key="index">, </span>
                            {{ variable.Name ? variable.Name : variable.variable.replaceAll('_', ' ') }} {{ variable.unit }}
                          </template>
                        </template>
                        <span v-else>N/A</span>
                      </td>
                      <td>{{ location.Started_date | formatDate }}</td>
                      <td>{{ location.Operational }}</td>
                      <td>
                        <template v-if="location.Operational === 'false'">
                          {{ location.End_date | formatDate }}
                        </template>
                        <template v-else>
                          N/A
                        </template>
                      </td>
                      <td>{{ location.uploaded_at | formatDate }}</td>
                      <td>{{ location.owners_name ? location.owners_name : 'N/A' }}</td>
                      <td>{{ location.Altitude ? location.Altitude : 'N/A' }}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <div class="container pb-3 ps-5" v-else>
                  <h5>No records Found</h5>
                </div>
                <div class="container d-flex">
                  <nav>
                    <ul class="pagination" v-if="meta.totalPages > 1">
                      <li class="page-item" v-if="meta.currentPage !== 1 && meta.totalPages > 1">
                        <button
                            class="page-link"
                            @click.prevent="getLocationData(--meta.currentPage)"
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
                        <a class="page-link" href="#" @click.prevent="getLocationData(i)">{{ i }}</a>
                      </li>
                      <li class="page-item" v-if="meta.currentPage !== meta.totalPages && meta.totalPages > 1">
                        <button
                            class="page-link"
                            @click.prevent="getLocationData(++meta.currentPage)"
                            :disabled="meta.currentPage >= meta.totalPages"
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>

<!--            <div class="tab-pane fade" id="chart" role="tabpanel" aria-labelledby="table1-tab">-->
<!--              <highcharts :options="chartOptions"></highcharts>-->
<!--            </div>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {findPointOnSurface} from "vuelayers/dist/ol-ext";

export default {
  name: "LocationSeriesMap",
  data() {
    return {
      loading: true,
      locations: [],
      selected: [],
      meta: {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: 10,
      },
      map: {
        zoom: 11,
        center: [85.38982339512815, 27.68673136138436],
        rotation: 0
      },
      selection: {
        municipality: 'null',
        variable: 'null'
      },
      options: {
        municipalities: [],
        variables: []
      },
      datacollection: null,
      chartOptions: null
    }
  },
  mounted() {
    this.getSelectionData();
    this.getLocationData();
  },
  methods: {
    async getSelectionData() {
      await this.$repository.variables.all()
          .then(res => {
            this.options.variables = res.data.results;
          })
    },
    resetAll() {
      this.selection = {
        municipality: 'null',
        variable: 'null'
      };

      this.getLocationData(1);
    },
    async getLocationData(page = 1) {
      this.meta.currentPage = page;

      let params = `?page_size=${this.meta.pageSize}`;
      if (this.meta.currentPage > 1) {
        params += `&page=${this.meta.currentPage}`
      }

      if (this.selection.municipality !== 'null') {
        if (this.selection.municipality !== 'all') {
          params += `&Municipality=${this.selection.municipality}`
        }
      }

      if (this.selection.variable !== 'null') {
        if (this.selection.variable !== 'all') {
          params += `&variable__variable=${this.selection.variable}`
        }
      }

      await this.$repository.location.filter(params)
          .then(res => {
            this.locations = res.data.results

            this.meta.totalItems = res.data.count;
            this.meta.totalPages = Math.ceil(res.data.count / this.meta.pageSize)

            this.loading = false

            let arrLatitude = [];
            let arrLabel = [];

            this.locations.forEach(el => {
              if (!this.options.municipalities.includes(el.Municipality)) {
                this.options.municipalities.push(el.Municipality);
              }
              arrLatitude.push(el.latitude)
              arrLabel.push(el.Localname)
            })

            this.chartOptions = {
              series: [
                {
                  data: arrLatitude
                }
              ]
            }

            this.datacollection = {
              labels: arrLabel,
              datasets: [
                {
                  label: 'Latitude',
                  borderColor: this.$randomColor,
                  data: arrLatitude,
                  fill: false,
                }
              ]
            }
          })
    },
    pointOnSurface: findPointOnSurface
  }
}
</script>

<style scoped>
input, select {
  color: #6c757d;
  border-color: #6c757d;
}
</style>