const searchTab = document.querySelector("[data-searchWeather]");
const userTab= document.querySelector("[data-userWeather]");

const userContainer= document.querySelector(".container");
const grantAccess = document.querySelector(".grant-location");

const searchForm = document.querySelector(".search-formContainer"); 

const loadingScreen = document.querySelector(".loading-container");

const weatherInfo = document.querySelector(".weatherInfo");


const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
let currTab = userTab;
currTab.classList.add("current-tab");

// Event Listeners for the Tabs
searchTab.addEventListener('click', ()=>{
        toggleTabs(searchTab);    
});

userTab.addEventListener('click', ()=>{
        toggleTabs(userTab);
});


function toggleTabs(clickedTab){
    if (currTab != clickedTab) {
        currTab.classList.remove("current-tab");
        currTab = clickedTab;
        currTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            weatherInfo.classList.remove("active");
            grantAccess.classList.remove("active");
            searchForm.classList.add("active");
        }else{
          
            // Mai pahle search wale tab pr tha,, ab mujhe current location tab ko visible krna hai
    
            searchForm.classList.remove("active");
            weatherInfo.classList.remove("active");
            // grantAccess.classList.add( "active" );
            getfromSessionStorage();
        }
    }
}

function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        grantAccess.classList.add("active");
    }else{
        // convert in json object
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeather(coordinates);
    }
}

async function fetchUserWeather(coordinates){
    const {lat, lon} = coordinates;

    // make grantAccess container invisible
    grantAccess.classList.remove("active");
    loadingScreen.classList.add("active");
    
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json( );
        loadingScreen.classList.remove("active");
        weatherInfo.classList.add("active");
        console.log(data);
         renderWeather(data); 
    }catch(error){
        loadingScreen.classList.remove("active");
        // alert(error);
    }
}

function renderWeather(weatherData){
    //  fetch data
    // console.log(weatherData);
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temprature = document.querySelector("[data-temprature]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloud = document.querySelector("[data-cloudiness]")
    // console.log(weatherData.weather.sys.country);
    cityName.innerText = weatherData?.name;
    countryIcon.src = `https://flagcdn.com/48x36/${weatherData?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherData?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherData?.weather?.[0]?.icon}.png`;
    temprature.innerText = weatherData?.main?.temp;
    windSpeed.innerText = `${weatherData?.wind?.speed} m/s`;
    humidity.innerText = `${weatherData?.main?.humidity} %`;
    cloud.innerText = `${weatherData?.clouds?.all} %`;
}


const grantAccessBtn = document.querySelector('[data-grantAccess]');
grantAccessBtn.addEventListener('click', getLocation);

function getLocation(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(showPosition);
        }else{
            console.log("geoLocation not support");
        }
    } 
    
function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeather(userCoordinates);
       
}



let cityArray = [];

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    weatherInfo.classList.remove("active");
    grantAccess.classList.remove("active");
    try{
        const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        const wtr = await result.json();
        loadingScreen.classList.remove("active");
        weatherInfo.classList.add("active");
        renderWeather(wtr)
    }catch(err){
        console.log(err);
    }
}

const searchInput = document.querySelector("[data-searchInput]");


    //    var count=0; 

function subFunc(){
    let cityName = searchInput.value;
    // cityArray[count++] = searchInput.value;

    if(cityName ===""){
        alert("Please enter a valid City Name!");
        return;
    }else{
        fetchSearchWeatherInfo(cityName);
        
    }
    
}






// optional chaning operator "a?.b?.c?"


















