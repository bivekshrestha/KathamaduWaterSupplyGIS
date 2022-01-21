<template>
  <div class="row">
    <div class="col-xl-6 col-md-6 mb-4">
      <div class="icon bg-indigo"><i class="bi bi-bookmarks-fill"></i></div>
      <div class="card shadow border-0 card-widget h-100">
        <div class="card-body d-flex align-items-center justify-content-between">

          <div class="text">
            <h6 class="mb-0 fw-bold text-black">Total Layers</h6>
          </div>
          <div class="maptext">
            <h3>{{ totalLayers }}</h3>
          </div>
        </div>
      </div>
    </div>
    <div class="col-xl-6 col-md-6 mb-4">
      <div class="icon bg-indigo"><i class="bi bi-bounding-box"></i></div>
      <div class="card shadow border-0 card-widget h-100">
        <div class="card-body d-flex align-items-center justify-content-between">

          <div class="text">
            <h6 class="mb-0 fw-bold text-black">Total Variables</h6>
          </div>
          <div class="maptext">
            <h3>{{ totalVariables }}</h3>
          </div>
        </div>
      </div>
    </div>

    <div class="col-xl-6 col-md-6 mb-4">
      <div class="icon bg-indigo"><i class="bi bi-clock-history"></i></div>
      <div class="card shadow border-0 card-widget h-100">
        <div class="card-body d-flex align-items-center justify-content-between">

          <div class="text">
            <h6 class="mb-0 fw-bold text-black">Total Timeseries </h6>
          </div>
          <div class="maptext">
            <h3>{{ totalTimeSeries }}</h3>
          </div>
        </div>
      </div>
    </div>


    <div class="col-xl-6 col-md-6 mb-4">
      <div class="icon bg-indigo"><i class="bi bi-moisture"></i></div>
      <div class="card shadow border-0 card-widget h-100">
        <div class="card-body d-flex align-items-center justify-content-between">

          <div class="text">
            <h6 class="mb-0 fw-bold text-black">Total Watersupply</h6>
          </div>
          <div class="maptext">
            <h3>{{ totalWaterSupply }}</h3>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
export default {
  name: "TotalCount",
  data() {
    return {
      totalLayers: 0,
      totalVariables: 0,
      totalTimeSeries: 0,
      totalWaterSupply: 0,
    }
  },
  mounted() {
    this.getAllCounts();
  },
  methods: {
    async getAllCounts() {
      await this.$repository.category.get().then(res => {
         this.totalLayers = res.data.count;
      })

      await this.$repository.variables.get().then(res => {
        this.totalVariables = res.data.count;
      })

      await this.$repository.timeSeries.get().then(res => {
        this.totalTimeSeries = res.data.count;
      })

      // await this.$repository.category.get().then(res => {
      //   this.totalWaterSupply = res.data.count;
      // })
    }
  }
}
</script>

<style scoped>

</style>