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

var locations = document.querySelector(".locations");

  // fetch('http://api.openweathermap.org/v3/uvi/' + lat + ',' + lon +'/current.json?appid=d9e2cd6e2460bf24461750e07b7a7006')
  // .then(response => response.json())
  // .then(data => {
  //   console.log(data);
  // })
// });

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
    console.log(lat+" "+lon)
    commitLocation(nameValue);

    cityName.innerHTML = nameValue;
    temp.innerHTML = tempValue;
    feelsLike.innerHTML = feelValue;
    desc.innerHTML = descValue;
    humidity.innerHTML = humidValue;
    img.src = "http://openweathermap.org/img/wn/" +imgValue+ "@2x.png";
    console.log(lat+" "+lon);
    futureWeather(lat, lon);
  })

  .catch(err => window.alert("please enter a valid city name"));
}

var futureWeather = function(lat, lon){
  var a = 40.5684;
  var b = 74.5385;
  fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=hourly,daily&appid=d9e2cd6e2460bf24461750e07b7a7006')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    var uvValue = "UV Index: " + data['current']['uvi'];

    uv.innerHTML = uvValue;
  })
}

var commitLocation = function(location){
  var locationEl = document.createElement("a");
  locationEl.textContent = location;
  locationEl.setAttribute("href", location);
  locations.appendChild(locationEl);
}
// form.addEventListener('submit',);
form.addEventListener("submit", function(){ 
  event.preventDefault(); 
  displayWeather(inputValue.value); 
});