const searchButton = document.querySelector(".search-btn");
const Cityinput = document.querySelector(".city-input");
const weathercardsdiv = document.querySelector(".weather-cards")
const currentweatherdiv = document.querySelector(".current-weather")


const API_KEY = "f128a0926011690876a20df4ebe8c9ba"; //API key for openweathermap API


const createWeatherCard = (cityname, weatherItem, index) => {
    if (index === 0) {
        return ` <div class="details">
        <h2>London (2024-07-05)</h2>
        <h4>Temperature: 21°C</h4>
        <h4>Wind: 4.31 M/S</h4>
        <h4>Humidity: 74%</h4>
    </div>
    <div class="icon">
        <img src="https://openweathermap.org/img/wn/10d@4x.png" alt="weather-icon">
        <h4>Moderate Rain</h4>
    </div>`
    } else {
        return ` <li class="card">
                        <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                        <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                        <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                        <h4>Humidity: ${weatherItem.main.humidity} %</h4>
                    </li>`;
    }}
    const getWeatherDetails = (CityName, lat, lon) => {
        const WeatherAPI = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

        fetch(WeatherAPI).then(res => res.json()).then(data => {
            //Filter the forecasts get only one forecast per day.
            const uniqueForecastDays = [];
            const fivedaysforecast = data.list.filter(forecast => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastDate)) {
                    return uniqueForecastDays.push(forecastDate);
                }

            });
            // Clearing previous weather data
            Cityinput.value = "";
            currentweatherdiv.innerHTML = "";
            weathercardsdiv.innerHTML = "";
            console.log(fivedaysforecast);
            fivedaysforecast.forEach((weatherItem, index) => {
                if (index === 0) {
                    currentweatherdiv.insertAdjacentHTML("beforeend", createWeatherCard(CityName, weatherItem, index));
                } else {
                    weathercardsdiv.insertAdjacentHTML("beforeend", createWeatherCard(CityName, weatherItem, index));
                }
            });
        }).catch(() => {
            alert("An error occured while fetching the weather forecast!");
        });
    }


    const getCityCoordinates = () => {
        const CityName = Cityinput.value.trim(); //Get user entered city name and remove extra spaces
        if (!CityName) return; //return if cityname is empty

        const GettingAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${CityName}&limit=1&appid=${API_KEY}`;

        fetch(GettingAPI).then(res => res.json()).then(data => {
            if (!data.length) return alert(`No coordinates found for ${CityName}`);
            const { name, lat, lon } = data[0];
            getWeatherDetails(name, lat, lon);
        }).catch(() => {
            alert("An error occured while fetching the coordinates!");
        });
    }

    searchButton.addEventListener("click", getCityCoordinates);