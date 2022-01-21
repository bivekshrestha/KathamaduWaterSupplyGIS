<template>
  <div class="m-5 main_container">
    <div id="map" class="map_container" style="height: 600px; width: 100%"></div>
    <div class="legend_container" v-if="range.length > 0">
      <strong>Legends</strong>
      <ul class="list-unstyled ms-3">
        <li>
          <span class="color_box" style="background-color: #FF7F7F"></span> {{ range[0] }} - {{ range[1] }}
        </li>
        <li>
          <span class="color_box" style="background-color: #377eb8"></span> {{ range[2] }} - {{ range[3] }}
        </li>
        <li>
          <span class="color_box" style="background-color: #4daf4a"></span> {{ range[4] }} - {{ range[5] }}
        </li>
        <li>
          <span class="color_box" style="background-color: #FFFF00"></span> {{ range[6] }} - {{ range[7] }}
        </li>
        <li>
          <span class="color_box" style="background-color: #ff7f00"></span> {{ range[8] }} - {{ range[9] }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

import Image from 'ol/layer/Image'
import Map from 'ol/Map'
import OSM from 'ol/source/OSM'
import TileLayer from 'ol/layer/Tile'
import View from 'ol/View'
import {fromLonLat} from 'ol/proj'
import ImageStatic from 'ol/source/ImageStatic'

import {fromArrayBuffer} from 'geotiff';
import * as plotty from "plotty";

export default {
  name: "TiffTest",
  data() {
    return {
      geotiffLayer: null,
      map: null,
      imgURL: '/dem.tif',
      range: []
    }
  },
  mounted() {
    this.geotiffLayer = new Image();
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM({
            attributions: ''
          })
        }),
        this.geotiffLayer
      ],
      view: new View({
        // center: fromLonLat([17.1144, 50.4100]),
        center: fromLonLat([85.38982339512815, 27.68673136138436]),
        // center: fromLonLat([-87.665, 41.868]),
        zoom: 9
      })
    });
    this.onGeotiffLoaded()
  },
  methods: {
    rangeCalculator(min, max) {
      const divider = Math.floor((max - min) / 5);
      const second = min + divider;
      const third = second + divider;
      const fourth = third + divider;
      const fifth = fourth + divider;

      this.range.push(
          min, second,
          second + 1, third,
          third + 1, fourth,
          fourth + 1, fifth,
          fifth + 1, max
      )
    },
    async onGeotiffLoaded() {
      const response = await fetch(this.imgURL);
      const arrayBuffer = await response.arrayBuffer();
      const tiff = await fromArrayBuffer(arrayBuffer);
      const image = await tiff.getImage();
      const rawBox = image.getBoundingBox();
      const bands = await image.readRasters();

      const uniq = [...new Set(bands[0])];

      let canvas = document.createElement('canvas');
      const minValue = Math.min(...uniq);
      const maxValue = Math.max(...uniq);

      this.rangeCalculator(minValue, maxValue)

      const average = (array) => array.reduce((a, b) => a + b) / array.length;
      const avg = average(uniq) * image.getWidth();
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
        data: bands[0],
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
        imageExtent: rawBox,
        projection: 'EPSG:4326'
      })

      this.geotiffLayer.setSource(imgSource);
      this.geotiffLayer.setOpacity(0.9);
    },
  }
}
</script>

<style scoped>
.main_container {
  position: relative;
}

.legend_container {
  position: absolute;
  right: 0;
  top: 0;
  height: 15rem;
  width: 15rem;
  background-color: white;
  padding: 10px;
}

.color_box {
  padding: 1px 15px;
  border: 1px solid black;
  margin-right: 5px;
}
</style>