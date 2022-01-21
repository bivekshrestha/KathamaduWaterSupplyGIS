<template>
  <div class="">
    <!-- Banner -->
    <hero-section></hero-section>
    <!-- End of Banner -->

    <!-- Water Supply section starts -->
    <section class="pt-40">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <water-quality-chart></water-quality-chart>
          </div>
          <div class="col-md-6">
            <news-and-reports></news-and-reports>
          </div>
        </div>
      </div>
    </section>
    <!-- Water Supply section Ends -->

    <!-- Timeseries and location section starts -->
    <section class="pt-40">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <time-series-map></time-series-map>
          </div>

          <div class="col-md-6">
            <location-series-map></location-series-map>
          </div>
        </div>
      </div>
    </section>
    <!-- Timeseries and location section Ends -->

    <!-- Modals -->
    <water-quality-add-new-modal></water-quality-add-new-modal>

    <upload-map-modal></upload-map-modal>

    <water-quality-view-modal></water-quality-view-modal>
    <!-- End of Modals -->

  </div>
</template>

<script>

import WaterQualityChart from "../components/charts/WaterQualityChart";
import NewsAndReports from "../components/sections/landing/NewsAndReports";
import TimeSeriesMap from "../components/maps/TimeSeriesMap";
import LocationSeriesMap from "../components/maps/LocationSeriesMap";
import WaterQualityAddNewModal from "../components/modals/WaterQualityAddNewModal";
import UploadMapModal from "../components/modals/UploadMapModal";
import WaterQualityViewModal from "../components/modals/WaterQualityViewModal";
import HeroSection from "../components/sections/landing/HeroSection";

export default {
  name: "Home",
  components: {
    HeroSection,
    WaterQualityViewModal,
    UploadMapModal,
    WaterQualityAddNewModal,
    LocationSeriesMap,
    TimeSeriesMap, NewsAndReports, WaterQualityChart
  },
};
</script>
