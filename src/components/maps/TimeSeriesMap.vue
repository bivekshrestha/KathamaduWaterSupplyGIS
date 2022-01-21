<template>
  <div class="timeseriesdata" v-if="!loading">
    <div class="card border-0">
      <div class="card-body border-0 shadow">
        <div class=" mb-3 border-bottom pb-3">
          <div class="row">
            <div class="col-md-6 d-flex align-items-center">
              <div class="mainhead">
                <h4 class="fw-bold d-flex align-items-center">
                  <div class=" "><i class="bi bi-clock-history"></i></div>
                  Latest Measurement
                </h4>
              </div>
            </div>
            <div class="col-md-6">
              <div class="d-block d-md-flex align-items-center justify-content-flex-end">
                <div class="timeseriestab me-1 mb-2 mb-md-0">
                  <ul class="nav nav-tabs border-0" id="myTab" role="tablist">
                    <li class="nav-item" role="presentation">
                      <button
                          class="nav-link active" id="home-tab" data-bs-toggle="tab"
                          data-bs-target="#home" type="button" role="tab" aria-controls="home"
                          aria-selected="true"
                      >
                        Map
                      </button>
                    </li>
                    <li class="nav-item" role="presentation">
                      <button
                          class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile"
                          type="button" role="tab" aria-controls="profile" aria-selected="false"
                      >
                        Table
                      </button>
                    </li>
                    <!--                    <li class="nav-item" role="presentation">-->
                    <!--                      <button class="nav-link" id="chart-tab" data-bs-toggle="tab" data-bs-target="#chart1"-->
                    <!--                              type="button" role="tab" aria-controls="table1" aria-selected="false">Chart-->
                    <!--                      </button>-->
                    <!--                    </li>-->
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-md-12 mt-3">
              <div class="d-flex align-items-center w-100 justify-content-start">
                <div class="form-group me-3">
                  <div class="flex-row d-flex justify-content-center">
                    <div class="input-group input-daterange">
                      <input
                          type="date"
                          class="form-control"
                          v-model="selection.date"
                          @change="getData"
                      />
                    </div>
                  </div>
                </div>
                <div class="form-group me-3">
                  <div class="btn-group">
                    <button
                        class="btn btn-outline-secondary btn-sm rounded-0 dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                      Select Locations
                    </button>
                    <ul class="dropdown-menu p-3"
                        style="height: 20rem;width: 12rem; overflow-y: scroll; overflow-x: hidden"
                    >
                      <li class="row">
                        <div class="col-md-12">
                          <div class="form-check">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                id="location-all"
                                v-model="selection.locations"
                                value="all"
                                @change="selectAll('location')"
                            >
                            <label class="form-check-label" for="location-all">
                              All
                            </label>
                          </div>
                        </div>
                      </li>
                      <li class="row">
                        <div
                            class="col-md-12"
                            v-for="(location, index) in options.locations"
                            :key="index"
                        >
                          <div class="form-check">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                :id="`location-${index}`"
                                v-model="selection.locations"
                                :value="location.Localname"
                                @change="getData"
                            >
                            <label class="form-check-label" :for="`location-${index}`">
                              {{ location.Localname }}
                            </label>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="form-group me-3">
                  <div class="btn-group">
                    <button
                        class="btn btn-outline-secondary btn-sm rounded-0 dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                      Select Variables
                    </button>
                    <ul class="dropdown-menu p-3"
                        style="height: 20rem;width: 12rem; overflow-y: scroll; overflow-x: hidden">
                      <li class="row">
                        <div class="col-md-12">
                          <div class="form-check">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                id="variable-all"
                                v-model="selection.variables"
                                value="all"
                                @change="selectAll('variable')"
                            >
                            <label class="form-check-label" for="variable-all">
                              All
                            </label>
                          </div>
                        </div>
                      </li>
                      <li class="row">
                        <div
                            class="col-md-12"
                            v-for="(variable, index) in options.variables"
                            :key="index"
                        >
                          <div class="form-check">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                :id="`variable-${index}`"
                                v-model="selection.variables"
                                :value="variable.variable"
                                @change="getData"
                            >
                            <label class="form-check-label" :for="`variable-${index}`">
                              {{ variable.variable }}
                            </label>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="form-group me-3">
                  <button class="btn btn-outline-secondary rounded-0 btn-sm" @click.prevent="resetAll">
                    Reset All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- time line section starts -->
        <div class="tab-content" id="myTabContent">
          <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
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
                          <div class="h5 mt-2 pb-2 border-bottom">Latest Measurement</div>
                          <div class="fa-sm text-capitalize">
                            <strong>Location</strong>: {{ feature.properties.location.Localname }},
                            {{ feature.properties.location.Municipality }}
                          </div>
                          <div class="fa-sm text-capitalize">
                            <strong>Source Type</strong>:
                            {{ feature.properties.Sourcetype ? feature.properties.Sourcetype : 'N/A' }}
                          </div>
                          <div class="fa-sm text-capitalize">
                            <strong>Measured On</strong>: {{ feature.properties.date | formatDateWithMonth }}
                          </div>
                          <div class="fa-sm text-capitalize">
                            <strong>Variable</strong>:
                            {{
                              feature.properties.variable.Name ? feature.properties.variable.Name : feature.properties.variable.variable.replaceAll('_', ' ')
                            }}
                            <span class="text-lowercase"> {{ feature.properties.variable.Unit }}</span>
                          </div>
                        </div>
                      </div>
                    </section>
                  </template>
                </vl-overlay>
              </vl-interaction-select>

              <template v-if="timeSeries.length > 0">
                <vl-feature
                    v-for="item in timeSeries"
                    :key="item.id"
                    :id="item.id"
                    :properties="item"
                >
                  <vl-geom-point
                      :coordinates="[item.location.longitude, item.location.latitude]"
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
          <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
            <div class="watersupplytable">
              <div class="table_card d-flex justify-content-end  mb-3">
                <div class="table_search">
                  <!--                  <div class="input-group">-->
                  <!--                    <div class="input-group-prepend">-->
                  <!--                      <span class="input-group-text" id="search"> <i class="fas fa-search"></i> </span>-->
                  <!--                    </div>-->
                  <!--                    <input-->
                  <!--                        type="text" class="form-control f-13" placeholder="Search now" aria-label="search"-->
                  <!--                        aria-describedby="search">-->
                  <!--                  </div>-->
                </div>
              </div>

              <div class="table-responsive" v-if="timeSeries.length > 0">
                <table class="table table-success table-striped table-hover table-bordered">
                  <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Address</th>
                    <th scope="col">Source type</th>
                    <th scope="col">Measured On</th>
                    <th scope="col">Variable</th>
                    <th scope="col">Measured By</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item, index) in timeSeries" :key="item.id">
                    <th scope="row">{{ ++index }}</th>
                    <td>{{ item.location.Localname }}, {{ item.location.Municipality }}</td>
                    <td>{{ item.Sourcetype ? item.Sourcetype : 'N/A' }}</td>
                    <td>{{ item.date }}</td>
                    <td>{{ item.variable.Name ? item.variable.Name : item.variable.variable.replaceAll('_', ' ') }}
                      {{ item.variable.Unit }}
                    </td>
                    <td>{{ item.measured_by ? item.measured_by : 'N/A' }}</td>
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
            </div>
          </div>

          <!--          <div class="tab-pane fade" id="chart1" role="tabpanel" aria-labelledby="table1-tab">-->
          <!--            <highcharts :constructorType="'stockChart'" :options="chartOptions"></highcharts>-->
          <!--          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {findPointOnSurface} from "vuelayers/dist/ol-ext";

export default {
  name: "TimeSeriesMap",
  data() {
    return {
      loading: true,
      timeSeries: [],
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
        variables: ['all'],
        locations: ['all'],
        date: ''
      },
      options: {
        variables: [],
        locations: [],
      },
      chartOptions: null,
    }
  },
  mounted() {
    this.getSelectionData();
    this.getData();
  },
  methods: {
    async getSelectionData() {
      await this.$repository.variables.all()
          .then(res => {
            this.options.variables = res.data.results;
          })

      await this.$repository.location.all()
          .then(res => {
            this.options.locations = res.data.results
          })
    },
    selectAll(type) {
      if (type === 'variable') {
        this.selection.variables = ['all'];
        this.getData();
      }

      if (type === 'location') {
        this.selection.locations = ['all'];
        this.getData();
      }
    },
    resetAll() {
      this.selection = {
        variables: ['all'],
        locations: ['all'],
        date: ''
      };

      this.getData(1);
    },
    async getData(page = 1) {
      this.meta.currentPage = page;

      let params = `?page_size=${this.meta.pageSize}`;
      if (this.meta.currentPage > 1) {
        params += `&page=${this.meta.currentPage}`
      }

      if (this.selection.variables.length > 0) {
        if (this.selection.variables.length > 1) {
          const index = this.selection.variables.indexOf('all');
          if (index > -1) {
            this.selection.variables.splice(index, 1);
          }
        }
        if (!this.selection.variables.includes('all')) {
          let variables = '';
          this.selection.variables.forEach(el => {
            variables += `${el},`
          })
          params += `&variable__in=${variables}`
        }
      }

      if (this.selection.locations.length > 0) {
        if (this.selection.locations.length > 1) {
          const index = this.selection.locations.indexOf('all');
          if (index > -1) {
            this.selection.locations.splice(index, 1);
          }
        }
        if (!this.selection.locations.includes('all')) {
          let locations = '';
          this.selection.locations.forEach(el => {
            locations += `${el},`
          })
          params += `&location__Localname__in=${locations}`
        }
      }

      if (this.selection.date !== '') {
        params += `&date=${this.selection.date}`
      }

      await this.$repository.timeSeries.filter(params)
          .then(res => {
            this.timeSeries = res.data.results

            this.meta.totalItems = res.data.count;
            this.meta.totalPages = Math.ceil(res.data.count / 10)

            let arr = [];
            this.timeSeries.forEach(el => {
              arr.push([new Date(el.date).getTime(), el.value])
            })

            this.chartOptions = {
              title: {
                text: "Time series line graph"
              },
              series: [
                {
                  name: 'Values',
                  data: arr
                }
              ],
              yAxis: {
                title: {
                  text: 'Value'
                }
              },

              xAxis: {
                title: {
                  text: 'Measured On'
                },
                type: "date"
              },
            }

            this.loading = false;
          })
    },
    pointOnSurface: findPointOnSurface
  }
}
</script>

<style scoped>
.form-check-label {
  font-weight: normal;
  font-size: 14px;
}

input {
  color: #6c757d;
  border-color: #6c757d;
}
</style>