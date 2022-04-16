//declaring all necessary variables
var button = document.querySelector(".button");
var form = document.getElementById("form");
var inputValue = document.querySelector(".inputValue");
var cityName = document.querySelector(".name");
var desc = document.querySelector(".desc");
var temp = document.querySelector(".temp");
var feelsLike = document.querySelector("#feelsLike");
var humidity = document.querySelector(".humidity");
var uv = document.querySelector(".uv");
var img = document.querySelector("img");
var daily = document.querySelector(".daily");
var locations = document.querySelector(".locations");
var futureImages = [];


//i forgot how to use local storage so this doesn't work
var allLocations = JSON.parse(localStorage.getItem("locations")) || [];

var saveContent = function(location) {
  var locations = location;
  allLocations.push(locations);

  localStorage.setItem("locations", JSON.stringify(allText));
};

//pulls the current tempurature,weather,humidity,etc along with the cities latitude and longitude
var displayWeather = function(city){
  fetch('https://api.openweathermap.org/data/2.5/weather?q='+ city +'&appid=d9e2cd6e2460bf24461750e07b7a7006')
  .then(response => response.json())
  .then(data => {
    // console.log(data);
    var nameValue = data['name'];
    var tempValue = "Temp: " + Math.round((data['main']['temp'] - 273.15)* 1.8000 + 32.00);
    var descValue = "Weather: " + data['weather'][0]['description'];
    var humidValue = "Humidity: " + data['main']['humidity'] + "%";
    var feelValue = "Feels like: " + Math.round((data['main']['feels_like'] - 273.15)* 1.8 + 32);
    var imgValue = data['weather'][0]['icon'];

    var lat = data['coord']['lat'];
    var lon = data['coord']['lon'];
    console.log(nameValue);
    commitLocation(nameValue);


    cityName.innerHTML = nameValue;
    temp.innerHTML = tempValue;
    feelsLike.innerHTML = feelValue;
    desc.innerHTML = descValue;
    humidity.innerHTML = humidValue;
    img.src = "http://openweathermap.org/img/wn/" +imgValue+ "@2x.png";
    

    //lat and lon are sent over to futureWeather so that the 5 day forecast
    //along with the uv index can display, as it uses a seperate api that requires latitude and longitude
    //but users aren't expected to type that in on their own
    futureWeather(lat, lon);
    displayFutureImages();
  })

  .catch(err => window.alert("please enter a valid city name"));
}
//grabs future forecast and uv index
var futureWeather = function(lat, lon){
  fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=minutely,hourly&appid=d9e2cd6e2460bf24461750e07b7a7006')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    var uvValue = "UV Index: " + data['current']['uvi'];
    uv.innerHTML = uvValue;
    //create next 5 day forecast, and clears previously displayed 5 day forecast
    daily.innerHTML = "";
    for (let i = 0; i < 5; i++) {
      var nextDay = document.createElement("div");
      nextDay.classList.add('future')

      var nextDayIcon = document.createElement("img");
      var nextDayDate = document.createElement("div");
      var nextDayTemp =document.createElement("div");
      var nextDayDesc = document.createElement("div");
      var nextDayHumid = document.createElement("div");
      var nextDayFeel = document.createElement("div");
      var nextDayUvi = document.createElement("div");
      
      nextDayIcon.classList.add('image'+i);

      let currentDate = new Date();
      let Day = currentDate.getDate()+ i;
      let Month = currentDate.getMonth(); 
      let Year = currentDate.getFullYear();
      var nextDayDateValue = new Date(Year, Month, Day);
      var MDY = nextDayDateValue.toString().split(" 00:00:00");
      console.log(MDY);
      var nextDayTempValue = data['daily'][i]['temp']['day'];
      var nextDayDescValue = data['daily'][i]['weather'][0]['description'];
      var nextDayIconValue = data['daily'][i]['weather'][0]['icon'];
      var nextDayHumidValue = data['daily'][i]['humidity'];
      var nextDayFeelValue = data['daily'][i]['feels_like']['day'];
      var nextDayUviValue = data['daily'][i]['uvi']

      nextDayDate.textContent = MDY[0];
      nextDayDate.classList.add('date')
      nextDayTemp.textContent = "Temp: " + nextDayTempValue;
      nextDayDesc.textContent = "Weather: " + nextDayDescValue;
      nextDayHumid.textContent = "Humidity: "+nextDayHumidValue + "%";
      nextDayFeel.textContent = "Feels like: " + nextDayFeelValue;
      nextDayUvi.textContent = "UV Index: " + nextDayUviValue;

      //trying to set the image source just doesn't work. have no idea what i'm doing wrong
      var image = document.getElementsByClassName("image"+i);
      console.log(image);
      var imageString = "http://openweathermap.org/img/wn/" +nextDayIconValue+ "@2x.png";
      futureImages.push(imageString);
      
      daily.appendChild(nextDay);
      nextDay.appendChild(nextDayIcon);
      nextDay.appendChild(nextDayDate);
      nextDay.appendChild(nextDayTemp);
      nextDay.appendChild(nextDayDesc);
      nextDay.appendChild(nextDayHumid);
      nextDay.appendChild(nextDayFeel);
      nextDay.appendChild(nextDayUvi);
    } 
  })
}

//this was going to be a hacky solution, but it does not work
var displayFutureImages = function(){
  document.getElementsByClassName("image0").src = img.src.replace(futureImages[0]);
}

//creates button for previous locations entered
var commitLocation = function(location){
  var locationEl = document.createElement("div");
  locationEl.textContent = location;
  locationEl.classList.add('locBtn');
  locationEl.setAttribute("href", location);
  locations.appendChild(locationEl);
  // saveContent(location);
}

form.addEventListener("submit", function(){ 
  event.preventDefault(); 
  displayWeather(inputValue.value); 
});