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
                    <h4 class="fw-bold text-dark"> Location Data</h4>
                  </div>

                  <div class="Filter_btn">
                    <button
                        v-if="$store.state.auth.isStaff"
                        class="btn btn-primary rounded-0 px-2 mb-2 mb-lg-0 addnewbtn allbtn"
                        data-bs-toggle="modal"
                        data-bs-target="#addLocationModal"
                    >
                          <span class="d-flex align-items-center">
                              <span class="small fw-bold">Upload Location</span>
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

    <add-location-modal></add-location-modal>

    <!-- explore layer -->
    <section v-if="!loading">
      <div class="container">
        <div class="explore_inner_layer">
          <div class="row">
            <div class="col-md-3">
              <div class="card shadow">
                <div class="card-body">
                  <div class="company_footer">

                    <div class="form-group pt-3">
                      <label class="control-label fw-bolder text-dark fs-6">View Mode</label>

                      <div class="timeseriestab me-1 me-1 mb-2 mb-md-0">
                        <ul class="nav nav-pills nav-fill" id="myTab" role="tablist">
                          <li class="nav-item" role="presentation">
                            <button class="nav-link active py-0" id="map-tab" data-bs-toggle="tab" data-bs-target="#map1"
                                    type="button" role="tab" aria-controls="map1" aria-selected="true">Map
                            </button>
                          </li>
                          <li class="nav-item" role="presentation">
                            <button class="nav-link py-0" id="table1-tab" data-bs-toggle="tab" data-bs-target="#table1"
                                    type="button" role="tab" aria-controls="table1" aria-selected="false">Table
                            </button>
                          </li>
                          <li class="nav-item" role="presentation">
                            <button class="nav-link py-0" id="chart-tab" data-bs-toggle="tab" data-bs-target="#chart"
                                    type="button" role="tab" aria-controls="table1" aria-selected="false">Chart
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div class="timeseries_filter mt-3">
                      <div class="form-group pt-3">
                        <label class="control-label fw-bolder text-dark fs-6">Municipality</label>
                        <select class="form-select form-control" v-model="selection.municipality"
                                @change="getLocationData">
                          <option value="null" disabled>Select Municipality</option>
                          <option
                              v-for="(item, index) in options.municipalities"
                              :key="index"
                              :value="item"
                          >{{ item }}
                          </option>
                        </select>
                      </div>

                      <div class="form-group pt-3">
                        <label class="control-label fw-bolder text-dark fs-6">Variables</label>
                        <select class="form-select form-control" v-model="selection.variable" @change="getLocationData">
                          <option value="null" disabled>Select Variable</option>
                          <option
                              v-for="(item, index) in options.variables"
                              :key="index"
                              :value="item.variable"
                          >{{ item.variable }}
                          </option>
                        </select>
                      </div>
                      <!--                      <button class="btn btn-primary rounded-0 px-2 mb-2 mb-lg-0 addnewbtn allbtn mt-3">-->
                      <!--                        <span class="d-flex align-items-center"><i class="bi-filter-circle me-2"></i><span-->
                      <!--                            class="small fw-bold">Filter Location Data</span></span>-->
                      <!--                      </button>-->
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-9">
              <div class="timeseries_right">
                <div class="card mb-3">
                  <div class="row g-0">
                    <div class="col-md-12">
                      <div class="timeseries_img">
                        <div class="tab-content" id="myTabContent">
                          <div class="tab-pane fade show active" id="map1" role="tabpanel" aria-labelledby="map-tab">
                            <vl-map
                                data-projection="EPSG:4326"
                                style="height: 600px;"
                                :load-tiles-while-animating="true"
                                :load-tiles-while-interacting="true"
                            >
                              <vl-view :zoom.sync="map.zoom" :center.sync="map.center"
                                       :rotation.sync="map.rotation"></vl-view>

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
                                            <strong>Location</strong>: {{ feature.properties.Localname }}, {{ feature.properties.Municipality }}
                                          </div>
                                          <div class="fa-sm text-capitalize">
                                            <strong>Source type</strong>: {{ feature.properties.Sourcetype ? feature.properties.Sourcetype : 'N/A' }}
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
                                            <strong>Owner</strong>: {{ feature.properties.owners_name ? feature.properties.owners_name : 'N/A' }}
                                          </div>
                                          <div class="fa-sm text-capitalize">
                                            <strong>Station Altitude</strong>: {{ feature.properties.Altitude ? feature.properties.Altitude : 'N/A' }}
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
<!--                                  <div class="input-group">-->
<!--                                    <div class="input-group-prepend">-->
<!--                                      <span class="input-group-text" id="search"><i class="fas fa-search"></i></span>-->
<!--                                    </div>-->
<!--                                    <input type="text" class="form-control f-13" placeholder="Search now"-->
<!--                                           aria-label="search" aria-describedby="search">-->
<!--                                  </div>-->
                                </div>
                              </div>
                              <table class="table table-success table-striped table-hover table-bordered" v-if="locations.length > 0">
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
                              <div class="container pb-3 ps-5" v-else>
                                <h5>No records Found</h5>
                              </div>
                              <div class="container d-flex">
                                <nav>
                                  <ul class="pagination" v-if="meta.totalPages > 1">
                                    <li class="page-item">
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
                                    <li class="page-item">
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

                          <div class="tab-pane fade" id="chart" role="tabpanel" aria-labelledby="table1-tab">
                            <highcharts :options="chartOptions"></highcharts>
                          </div>
                        </div>
                      </div>
                    </div>
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
import {findPointOnSurface} from "vuelayers/dist/ol-ext";
import AddLocationModal from "../../components/modals/AddLocationModal";

export default {
  name: "LocationData",
  components: {AddLocationModal},
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

    async getLocationData(page = 1) {
      this.meta.currentPage = page;

      let params = `?page_size=${this.meta.pageSize}`;
      if (this.meta.currentPage > 1) {
        params += `&page=${this.meta.currentPage}`
      }

      if (this.selection.municipality !== 'null') {
        params += `&Municipality=${this.selection.municipality}`
      }

      if (this.selection.variable !== 'null') {
        params += `&variable__variable=${this.selection.variable}`
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
          })
    },
    pointOnSurface: findPointOnSurface
  }
}
</script>

<style scoped>

</style>