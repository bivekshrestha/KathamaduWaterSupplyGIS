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
                    <h4 class="fw-bold text-dark">Timeseries Data</h4>
                  </div>

                  <div class="Filter_btn">
                    <button
                        v-if="$store.state.auth.isStaff"
                        class="btn btn-primary rounded-0 px-2 mb-2 mb-lg-0 addnewbtn allbtn"
                        data-bs-toggle="modal"
                        data-bs-target="#addTimeSeriesModal"
                    >
                          <span class="d-flex align-items-center">
                              <span class="small fw-bold">Upload TimeSeries</span>
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

    <add-time-series-modal></add-time-series-modal>

    <!-- explore layer css -->
    <section v-if="!loading">
      <div class="container">
        <div class="explore_inner_layer">
          <div class="row">
            <div class="col-md-3">
              <div class="card shadow">
                <div class="card-body">
                  <div class="company_footer">
                    <div class="form-group pt-3">
                      <label class="control-label fw-bolder text-dark fs-6">View Mode </label>
                      <ul class="nav nav-pills nav-fill" id="myTab" role="tablist">
                        <li class="nav-item" role="presentation">
                          <button
                              class="nav-link active py-0" id="home-tab" data-bs-toggle="tab"
                              data-bs-target="#home" type="button" role="tab" aria-controls="home"
                              aria-selected="true"
                          >
                            Map
                          </button>
                        </li>
                        <li class="nav-item" role="presentation">
                          <button
                              class="nav-link py-0" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile"
                              type="button" role="tab" aria-controls="profile" aria-selected="false"
                          >
                            Table
                          </button>
                        </li>
                        <li class="nav-item" role="presentation">
                          <button class="nav-link py-0" id="chart-tab" data-bs-toggle="tab" data-bs-target="#chart1"
                                  type="button" role="tab" aria-controls="table1" aria-selected="false">Chart
                          </button>
                        </li>
                      </ul>
                    </div>

                    <div class="timeseries_filter mt-3">
                      <div class="form-group ">
                        <label class="control-label fw-bolder text-dark fs-6">Date </label>
                        <input
                            type="date"
                            class="form-control"
                            v-model="selection.date"
                            @change="getData"
                        />
                      </div>

                      <div class="form-group pt-3">
                        <label class="control-label fw-bolder text-dark fs-6">Variables </label>
                        <select class="form-select form-control" v-model="selection.variable" @change="getData">
                          <option value="null" disabled>Select Variable</option>
                          <option
                              v-for="(item, index) in options.variables"
                              :key="index"
                              :value="item.variable"
                          >{{ item.variable }}
                          </option>
                        </select>
                      </div>
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
                          <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                            <vl-map
                                data-projection="EPSG:4326"
                                style="height: 600px;" :load-tiles-while-animating="true"
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
                                          <div class="h5 mt-2 pb-2 border-bottom">Latest Measurement</div>
                                          <div class="fa-sm text-capitalize">
                                            <strong>Location</strong>: {{ feature.properties.location.Localname }}, {{ feature.properties.location.Municipality }}
                                          </div>
                                          <div class="fa-sm text-capitalize">
                                            <strong>Source Type</strong>: {{ feature.properties.Sourcetype ? feature.properties.Sourcetype  : 'N/A'}}
                                          </div>
                                          <div class="fa-sm text-capitalize">
                                            <strong>Measured On</strong>: {{ feature.properties.date | formatDateWithMonth }}
                                          </div>
                                          <div class="fa-sm text-capitalize">
                                            <strong>Variable</strong>:
                                            {{ feature.properties.variable.Name ? feature.properties.variable.Name : feature.properties.variable.variable.replaceAll('_', ' ') }}
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
                                  <!--                                  <div class="input-group">-->
                                  <!--                                    <div class="input-group-prepend">-->
                                  <!--                                      <span class="input-group-text" id="search"> <i class="fas fa-search"></i> </span>-->
                                  <!--                                    </div>-->
                                  <!--                                    <input-->
                                  <!--                                        type="text" class="form-control f-13" placeholder="Search now" aria-label="search"-->
                                  <!--                                        aria-describedby="search">-->
                                  <!--                                  </div>-->
                                </div>
                              </div>
                              <table class="table table-success table-striped table-hover table-bordered"
                                     v-if="timeSeries.length > 0">
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
                                  <td>{{ item.Sourcetype ? item.Sourcetype : 'N/A'}}</td>
                                  <td>{{ item.date }}</td>
                                  <td>{{ item.variable.Name ? item.variable.Name : item.variable.variable.replaceAll('_', ' ') }} {{ item.variable.Unit }}</td>
                                  <td>{{ item.measured_by ? item.measured_by : 'N/A' }}</td>
                                </tr>

                                </tbody>
                              </table>

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
                                    <li class="page-item"
                                        v-if="meta.currentPage !== meta.totalPages && meta.totalPages > 1">
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
                          <div class="tab-pane fade" id="chart1" role="tabpanel" aria-labelledby="table1-tab">
                            <highcharts :constructorType="'stockChart'" :options="chartOptions"></highcharts>
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
import AddTimeSeriesModal from "../../components/modals/AddTimeSeriesModal";

export default {
  name: "TimeSeries",
  components: {AddTimeSeriesModal},
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
        variable: 'null',
        date: 'null'
      },
      options: {
        variables: []
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
    },
    async getData(page = 1) {
      this.meta.currentPage = page;

      let params = `?page_size=${this.meta.pageSize}`;
      if (this.meta.currentPage > 1) {
        params += `&page=${this.meta.currentPage}`
      }

      if (this.selection.variable !== 'null') {
        params += `&variable=${this.selection.variable}`
      }

      if (this.selection.date !== 'null') {
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
                  data: arr
                }
              ],
              yAxis: {
                title: {
                  text: 'Value'
                }
              },
              rangeSelector: {
                selected: 1
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

</style>