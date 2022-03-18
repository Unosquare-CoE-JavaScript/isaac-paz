const zip = 55455;
const apiKey = "aea6ed7326cf54f68221915b6840e362";
import { OpenWeather } from "./open_weather";

const Weather = (dt, temp) => ({
  dt,
  temp,
});

const toWeather = (det, temp) => Weather(toDate(dt), toFarenheit(temp));

const getWeatherItem = zip;
OpenWeather.fetch({ zip, apiKey })
  .map((response) => response.list)
  .map((weathers) => weathers.map((w) => Weather((w.main.dt, w.main.temp))));

///================
const app = () => {
  const goButton = document.getElementById("go");
  const input = document.getElementById("zip");
  const results = document.getElementById("result");

  goButton.addEventListener("click", () => {
    const zip = input.value.trim();
    getWeatherItem(zip).fork(console.error, (html) => {
      results.innerHTML = html;
    });
  });
};
