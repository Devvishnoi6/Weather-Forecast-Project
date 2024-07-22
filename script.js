const Button = document.querySelector(".search-btn");
const CaptureCity = document.querySelector(".city-input");
const Buttonforlocation = document.querySelector(".location-btn");
const Cardsforweather = document.querySelector(".weather-cards")
const liveweather = document.querySelector(".current-weather")
const DropdownforRecentCities = document.querySelector(".recent-cities");
const dropdowncontainer = document.querySelector(".dropdown-container");


//openweathaer API key
const API_KEY = "f128a0926011690876a20df4ebe8c9ba";

const Weathercardgenerate = (cityname, weatherItem, index) => {

    //Big weather card HTML.
    if (index === 0) { 
        return ` <div class="details">
        <h2>${cityname} (${weatherItem.dt_txt.split(" ")[0]})</h2>
        <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                        <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                        <h4>Humidity: ${weatherItem.main.humidity} %</h4>
    </div>
    <div class="icon">
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
        <h4>${weatherItem.weather[0].description}</h4>
    </div>`
    } else
    
    //5 small weather cards HTML.
    { 
        return ` <li class="card">
                        <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                        <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                        <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                        <h4>Humidity: ${weatherItem.main.humidity} %</h4>
                    </li>`;
    }
}
    const Detailsofweather = (CityName, lat, lon) => {
        const WeatherAPI = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

        fetch(WeatherAPI).then(res => res.json()).then(data => {

            //Extract one forecast per day
            const specialForecastdays = [];
            const forecastfor5days = data.list.filter(forecast => {
                const Forecastdate = new Date(forecast.dt_txt).getDate();
                if (!specialForecastdays.includes(Forecastdate)) {
                    return specialForecastdays.push(Forecastdate);
                }

            });

            // delete last weather data
            CaptureCity.value = "";
            liveweather.innerHTML = "";
            Cardsforweather.innerHTML = "";




           //Including DOM  and generating weather card 
            forecastfor5days.forEach((weatherItem, index) => {
                if (index === 0) {
                    liveweather.insertAdjacentHTML("beforeend", Weathercardgenerate(CityName, weatherItem, index));
                } else {
                    Cardsforweather.insertAdjacentHTML("beforeend", Weathercardgenerate(CityName, weatherItem, index));
                }
            });
            addCityToRecent(CityName);
        }).catch(() => {
            alert("An error occured while fetching the weather forecast!");
        });
    }
    

    const CoordinatesofCity = () => {

     //Capure city name entered by user and excludes the extra spaces.

        const CityName = CaptureCity.value.trim(); 


        //return if cityname is left vacant.
        if (!CityName) return; 

        const GettingAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${CityName}&limit=1&appid=${API_KEY}`;

        fetch(GettingAPI).then(res => res.json()).then(data => {
            if (!data.length) return alert(`No coordinates found for ${CityName}`);
            const { name, lat, lon } = data[0];
            Detailsofweather(name, lat, lon);
        }).catch(() => {
            alert("An error occured while fetching the coordinates!");
        });
    }

    const CatchingCoordinatesofUser = () =>{
        navigator.geolocation.getCurrentPosition(
            position=>{


                //Capuring User's location coordinates
               const {latitude , longitude}= position.coords;
               const reversegeocodingURL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
               

        //By applying reverse geocodingAPI getting the name of city.

        fetch(reversegeocodingURL).then(res => res.json()).then(data => {
            const { name } = data[0];
            Detailsofweather(name, latitude, longitude);
        }).catch(() => {
            alert("An error occured while fetching the city!");
        });
    },


    //It will give an alert if user denied to access there current location.
            error =>{  
                if(error.code === error.PERMISSION_DENIED){
                    alert("Geolocation request denied. Please reset location permission to grant access again.")
                }
            }
        )
    }
    const loadRecentCities =()  => {
        let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
        if (recentCities.length > 0) {
            DropdownforRecentCities.style.display = 'block';
            DropdownforRecentCities.innerHTML = '<option value="" disabled selected>Select a city</option>';
            recentCities.forEach(city => {
                let option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                DropdownforRecentCities.appendChild(option);
            });
        } else {
            DropdownforRecentCities.style.display = 'none';
        }
    };
    
    const addCityToRecent = (city) => {
        let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
        if (!recentCities.includes(city)) {
            recentCities.push(city);
            localStorage.setItem('recentCities', JSON.stringify(recentCities));
            loadRecentCities();
        }
    };


    Button.addEventListener("click", CoordinatesofCity);
    Buttonforlocation.addEventListener("click", CatchingCoordinatesofUser);
    CaptureCity.addEventListener('keyup' ,e => e.key === "Enter" && CoordinatesofCity());

    DropdownforRecentCities.addEventListener('change' , function(){
        const selectedcity = this.value;
        if(selectedcity){
            CaptureCity.value = selectedcity;
            CoordinatesofCity();
        }
    });

    //Load recent cities on page load
    document.addEventListener('DOMContentLoaded', loadRecentCities());