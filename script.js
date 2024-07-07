const searchButton = document.querySelector(".search-btn");
const Cityinput = document.querySelector(".city-input");

const API_KEY="bd5e378503939ddaee76f12ad7a97608"; //API key for openweathermap API
const getCityCoordinates =()=>{
    const CityName= Cityinput.value.trim(); //Get user entered city name and remove extra spaces
    if(!CityName) return; //return if cityname is empty

    const GettingAPI=`http://api.openweathermap.org/geo/1.0/direct?q=${CityName}&limit=1&appid=${API_KEY}`;
    
    fetch(GettingAPI).then(res => res.json()).then(data =>{
    }).catch(()=>{
        alert("An error occured while fetching the coordinates!");
    });
}

searchButton.addEventListener("click" , getCityCoordinates);