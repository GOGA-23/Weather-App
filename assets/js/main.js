// Getting all the elements from HTML file using querySelector & getElementById and in separate variable to easily access

const containerEl = document.querySelector(".container");
const inputData = document.querySelector(".container .input-data");
const APIkey = "aa18b2acde071abb6f43e7725f9135bc";
const infoTxt = document.querySelector(".input-data .info-txt");
const inputField = document.getElementById("input-field");
const locationBtn = document.querySelector("button");
const weatherIcon = document.querySelector(".weather-field img");
const prevBtn = document.querySelector(".prev-btn");
let api;

// Adding event listener of keyup event to access or getting the data
inputField.addEventListener("keyup", (e) => {
  // if user pressed enter btn and input value should not be empty to get the data
  if (e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});

//  Adding event listener of click event to access or getting the data
locationBtn.addEventListener("click", () => {
  // if user clicked the button and get the data of location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setSuccess, setError);
  } else {
    alert("your browser won't support geolocation");
  }
});

function setSuccess(position) {
  const { latitude, longitude } = position.coords;

  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIkey}&units=metric`;
  fetchData();
}

function setError() {
  infoTxt.innerHTML = "User Denied Location Access";
  infoTxt.classList.add("error");
}

function requestApi(city) {
  // getting api response and returning it with parsing the data
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=metric`;
  fetchData();
}

function fetchData() {
  infoTxt.innerHTML = "Getting Weather Info....";
  infoTxt.classList.add("success");

  // getting api response and returning it with parsing the data from string to json object
  // then function calling weatherinfo function with passing api result as argument
  fetch(api)
    .then((response) => {
      return response.json();
    })
    .then((result) => weatherInfo(result))
    .catch(() => {
      infoTxt.innerText = "Something went wrong";
      infoTxt.classList.replace("pending", "error");
    });
}

function weatherInfo(details) {
  if (details.cod == "404") {
    infoTxt.classList.replace("success", "error");
    infoTxt.innerHTML = `${inputField.value} not found`;
  } else {
    // getting all the properties data from the details object
    let city = details.name;
    let { country } = details.sys;
    let { description, id } = details.weather[0];
    let { feels_like, humidity, temp } = details.main;

    // passing all the properties data into their inner text or inner html to execute value on screen

    containerEl.querySelector(".weather span").innerHTML = `${temp}°C`;
    containerEl.querySelector(".temp span").innerHTML = `${feels_like}°C`;
    containerEl.querySelector(".hum-temp span").innerHTML = `${humidity}%`;
    containerEl.querySelector(".weather-type p").innerHTML = description;
    containerEl.querySelector(
      ".weather-loc-name span"
    ).innerHTML = `${city}, ${country}`;

    // switching the weather type according api id's returns to it

    if (id == 800) {
      weatherIcon.src = "./assets/images/day.svg";
    } else if (id >= 200 && id <= 232) {
      weatherIcon.src = "./assets/images/thunder.svg";
    } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
      weatherIcon.src = "./assets/images/rain.svg";
    } else if (id >= 600 && id <= 622) {
      weatherIcon.src = "./assets/images/snowy.svg";
    } else if (id >= 700 && id <= 781) {
      weatherIcon.src = "./assets/images/cloudy.svg";
    } else if (id >= 801 && id <= 804) {
      weatherIcon.src = "./assets/images/Drizzle.svg";
    }

    infoTxt.classList.remove("success", "error");
    infoTxt.innerHTML = "";
    inputField.value = "";
    containerEl.classList.add("active");
  }
}

// Adding event listener of click event to remove the active classlist

prevBtn.addEventListener("click", () => {
  containerEl.classList.remove("active");
});
