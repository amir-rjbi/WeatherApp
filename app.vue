<template>
  <div>
    <div id="wrapper">
      <div class="infoWrapper">
        <form @submit.prevent="formListener" id="form">
          <input
            type="text"
            v-model="search"
            autocomplete="false"
            placeholder="شهر خود را وارد کنید "
            style="text-align: right"
          />
        </form>

        <div id="container" v-if="flag">
          <div class="loc">{{ test }}</div>
          <div class="weather">
            <div class="temp">
              <p>دما : {{ temperature }}C</p>
              <p>دما (feels like) : {{ feelslike }}C</p>
              <p>حداکثر دما : {{ maxTemp }}C</p>
              <p>حداقل دما : {{ minTemp }}C</p>
              <p>سرعت باد : {{ wind }} متر / ثانیه</p>
              <p>رطوبت : {{ humidity }}%</p>
            </div>
          </div>
        </div>
      </div>

      <div id="map"></div>
    </div>
  </div>
</template>
<script setup>
import { useToast } from "vue-toastification";
const toast = useToast();
const flag = ref(false);
const test = ref("مشهد");
const temperature = ref("");
const feelslike = ref("");
const maxTemp = ref("");
const minTemp = ref("");
const wind = ref("");
const humidity = ref("");
const search = ref("");
onBeforeMount(() => {
  getWeatherByLocation("مشهد");
  getWeatherByLocation("مشهد");
});

useHead({
  script: [
    {
      src: "https://api.mapbox.com/mapbox-gl-js/v2.2.0/mapbox-gl.js",
      tagPosition: "head",
    },
  ],
});
const apiKey = "35260a6010a72194c616b209e339db17";
const getWeatherByLocation = async (location) => {
  const res = await $fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`
  )
    .then((res) => {
      if (res.cod == 200) {
        flag.value = true;
        addWeatherInfoToPage(res);
      }
    })
    .catch((err) => {
      toast.error("شهر خود را به درستی وارد کنید ", {
        timeout: 2000,
      });
    });
};

function addWeatherInfoToPage(data) {
  console.log(data);
  temperature.value = KtoC(data.main.temp);
  feelslike.value = KtoC(data.main.feels_like);
  maxTemp.value = KtoC(data.main.temp_max);
  minTemp.value = KtoC(data.main.temp_min);
  wind.value = data.wind.speed;
  humidity.value = data.main.humidity;

  mapboxgl.accessToken =
    "pk.eyJ1IjoibWFoZGloYXNhbnphZGVoOCIsImEiOiJja21idms4cTMxdG01MnBtejgzaTE4bW82In0.RpjSN_MZtRzqtFFtVgvFeA";
  var map = new mapboxgl.Map({
    container: "map", // container id
    style: "mapbox://styles/mapbox/dark-v10", // style URL
    center: [data.coord.lon, data.coord.lat], // starting position [lng, lat]
    zoom: 9, // starting zoom
  });

  map.on("load", function () {
    // Load an image from an external URL.
    map.loadImage(
      `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      function (error, image) {
        if (error) throw error;

        // Add the image to the map style.
        map.addImage("cat", image);

        // Add a data source containing one point feature.
        map.addSource("point", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [data.coord.lon, data.coord.lat],
                },
              },
            ],
          },
        });

        // Add a layer to use the image to represent the data.
        map.addLayer({
          id: "points",
          type: "symbol",
          source: "point", // reference the data source
          layout: {
            "icon-image": "cat", // reference the image
            "icon-size": 0.6,
          },
        });
      }
    );
  });
}

function KtoC(temp) {
  return parseInt(temp - 273.15);
}
const formListener = () => {
  const location = search.value;
  test.value = search.value;
  if (location) {
    getWeatherByLocation(location);
  }
};
</script>
<style>
@import url("./public/style.css");
@import url("https://api.mapbox.com/mapbox-gl-js/v2.2.0/mapbox-gl.css");
.loc {
  text-align: center;
  margin: 10px;
  color: brown;
}
h1 {
  color: red;
}
</style>
