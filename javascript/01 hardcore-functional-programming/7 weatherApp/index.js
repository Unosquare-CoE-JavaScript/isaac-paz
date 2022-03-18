const zip = 55455;
const apiKey = "aea6ed7326cf54f68221915b6840e362";
import { OpenWeather } from "./open_weather";

const Weather = (dt, temp) => ({
  dt,
  temp,
});

const toFahrenheit = (k) => k + 1000;

const toWeather = (dt, temp) =>
  Weather(new Date(dt).toLocaleDateString(), toFahrenheit(temp));

const prepareItem = (weather) => toWeather(weather.dt, weather.main.temp);

const getWeatherItem = (zip) =>
  OpenWeather.fetch({ zip, apiKey })
    .map((json) => json.list.map(prepareItem))
    .map((weathers) => weathers.map(toLi));

const toLi = (weather) => `<li>${weather.dt}, ${weather.temp} </li>`;

///================
const app = () => {
  const goButton = document.getElementById("go");
  const input = document.getElementById("zip");
  const results = document.getElementById("results");

  goButton.addEventListener("click", () => {
    const zip = input.value.trim();
    getWeatherItem(zip).fork(console.error, (html) => {
      results.innerHTML = html;
    });
  });
};

app();
