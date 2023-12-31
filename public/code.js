const form = document.getElementById("form");
const search = document.getElementById("search");
const container = document.querySelector("#container");
const apiKey = "35260a6010a72194c616b209e339db17";
function getWeatherByLocation(location) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`
  )
    .then((res) => res.json())
    .then((result) => {
      addWeatherInfoToPage(result);
    });
}

function addWeatherInfoToPage(data) {
  console.log(data);
  const temperature = KtoC(data.main.temp);
  const feelslike = KtoC(data.main.feels_like);
  const maxTemp = KtoC(data.main.temp_max);
  const minTemp = KtoC(data.main.temp_min);
  const weather = document.createElement("div");
  weather.classList.add("weather");
  weather.innerHTML = `
        <div class="temp">
            <p> دما : ${temperature}C </p>
            <p> دما (feels like) : ${feelslike}C </p>
            <p> حداکثر دما : ${maxTemp}C </p>
            <p> حداقل دما : ${minTemp}C </p>
            <p> سرعت باد : ${data.wind.speed} متر / ثانیه </p>
            <p>  رطوبت : ${data.main.humidity}% </p>
        </div>
    `;
  container.innerHTML = "";
  container.appendChild(weather);

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
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const location = search.value;
  if (location) {
    getWeatherByLocation(location);
  }
});
