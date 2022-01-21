<template>
  <div class="waterquality h-100">
    <div class="card border-0 h-100">
      <div class="card-body border-0 shadow">
        <div class="row mb-3">
          <div class="col-md-12 d-flex align-items-center">
            <div class="mainhead">
              <h4 class="fw-bold d-flex align-items-center mb-4">
                <div class=" "><i class="bi bi-moisture"></i></div>
                Water Quality
              </h4>
            </div>
          </div>
          <div class="col-md-12">
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
                              :id="`location-${index}-water`"
                              v-model="selection.locations"
                              :value="location.Localname"
                              @change="getData"
                          >
                          <label class="form-check-label" :for="`location-${index}-water`">
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
                              :id="`variable-${index}-water`"
                              v-model="selection.variables"
                              :value="variable.variable"
                              @change="getData"
                          >
                          <label class="form-check-label" :for="`variable-${index}-water`">
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
        <div class="water_timeline watermap" v-if="!loading" @click.prevent="viewLarge">
<!--          <div id="chart-container"></div>-->
          <highcharts :constructorType="'stockChart'" :options="chartOptions"></highcharts>
        </div>
      </div>
    </div>

    <button
        class="d-none"
        ref="viewLarge"
        data-bs-toggle="modal"
        data-bs-target="#waterQualityModal"></button>

    <div class="modal fade " id="waterQualityModal" tabindex="-1" aria-labelledby="waterQualityModalLabel"
         aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="waterQualityModalLabel">Water Quality</h5>
            <button type="button" ref="closeBtn" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="!loading">
            <highcharts :constructorType="'stockChart'" :options="chartOptions"></highcharts>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "WaterQualityChart",
  data() {
    return {
      loading: true,
      timeSeries: [],
      meta: {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: 10,
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
    viewLarge() {
      this.$refs.viewLarge.click()
    },
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
    selectAll(type){
      if(type === 'variable'){
        this.selection.variables = ['all'];
        this.getData();
      }

      if(type === 'location'){
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

      this.getData();
    },
    async getData() {
      let params = `?page_size=9999`;
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

            this.timeSeries.forEach(el => {
              el.var = el.variable.variable
            })

            let result = this.timeSeries.reduce(function (r, a) {
              r[a.var] = r[a.var] || [];
              r[a.var].push(a);
              return r;
            }, Object.create(null));

            let dataArray = [];
            for (let i in result){
              let arr = [];
              result[i].forEach(el => {
                arr.push({
                  x: new Date(el.date).getTime(),
                  y: el.value,
                  unit: el.variable.Unit
                })
              })

              dataArray.push({
                name: i.replaceAll('_', ' ').toUpperCase(),
                data: arr
              });
            }

            this.chartOptions = {
              yAxis: {
                labels: {
                  formatter: function () {
                    return (this.value > 0 ? ' + ' : '') + this.value;
                  }
                },
                plotLines: [{
                  value: 0,
                  width: 2,
                  color: 'silver'
                }]
              },

              tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> {point.unit}<br/>',
                valueDecimals: 4,
                split: true
              },

              series: dataArray,
            }

            this.loading = false;
          })
    },
  }
}
</script>

<style scoped>
input {
  color: #6c757d;
  border-color: #6c757d;
}

.form-check-label {
  font-weight: normal;
  font-size: 14px;
}
</style>