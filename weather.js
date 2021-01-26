//declare variable to store api key
const apiKey ;

//function that fetches and parses data from urls
async function getJSON(url) {
  try {
    let data = await fetch(url);
    return await data.json();
  } catch (err) {
    throw err;
  }
}

//select the search button.
const search = document
  .getElementById("search")
  //makes search button functional with 'click'
  .addEventListener("click", () => {
    //grab user input from 'cityField'
    const cityField = document.getElementById("city").value.toLowerCase();
    //check for user input
    if (cityField.length === 0) {
      alert("Please enter a city");
    } else {
      //generates input-specific url
      const cityURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityField}&appid=${apiKey}`;
      //refer to functions for relevant comments
      const newData = getCity(cityURL)
        .then(displayDataFarenheit)
        .then(tempChangeButton)
        .catch(notFound);
      return newData;
    }
  });

//function that runs previously generated url through the getJSON function for retrieval and parsing as well as generating a second api call for future weather forecasts
async function getCity(url) {
  const currentCity = await getJSON(url);
  const locationURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentCity.coord.lat}&lon=${currentCity.coord.lon}&exclude={part}&appid=${apiKey}`;
  const cityInfo = await getJSON(locationURL);

  return Promise.all([currentCity, cityInfo]);
}

//generate current date
function getDate(data) {
  const date = new Date(data[0].dt * 1000);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  newHTML = `<div><h4 class="date">${date.toLocaleDateString(
    "en-US",
    options
  )}</h4>`;

  return newHTML;
}

//displays data for user to read information (degrees in farenheit)
function displayDataFarenheit(data) {
  const info = document.getElementById("info");
  let newHTML = getDate(data);
  newHTML += `<p>City/Country: <b>${data[0].name}</b> ,<b>${data[0].sys.country}</b></p>`;
  newHTML += `<p>Current Weather: <b>${data[0].weather[0].description}</b> </p>`;
  newHTML += `<p class='temp'>Temp: ${Math.round(
    ((data[0].main.temp - 273.5) * 9) / 5 + 32
  )}&deg <br> <img src='http://openweathermap.org/img/wn/${
    data[0].weather[0].icon
  }@4x.png'></p></div>`;
  newHTML += tableMaker(data);
  info.innerHTML = newHTML;

  return data;
}

//function to construct table using html elements
function tableMaker(data) {
  let newHTML = `<div class="table"><table class="weather-table">`;
  //headers
  newHTML += `<thead>
        <tr>
          <th class='outside-blocks'><b>Day</b></th><th class='outside-blocks'><b>Min</b></th><th class='outside-blocks'><b>Max</b></th><th class='outside-blocks'><b>Will Feel Like</b></th><th class='outside-blocks'><b>Weather</b></th>
        </tr>`;
  //write a loop to write information for all 7 days of weather in table (degrees in farenheit)
  for (i = 1; i < data[1].daily.length; i++) {
    newHTML += `<tr>
          <th class='outside-blocks'>${i}</th><th class='temp-min'>${Math.round(
      ((data[1].daily[i].temp.min - 273.5) * 9) / 5 + 32
    )}&deg</th><th class='temp-max'>${Math.round(
      ((data[1].daily[i].temp.max - 273.5) * 9) / 5 + 32
    )}&deg</th><th class='temp-feels-like'>${Math.round(
      ((data[1].daily[i].feels_like.day - 273.5) * 9) / 5 + 32
    )}&deg</th><th><img src='http://openweathermap.org/img/wn/${
      data[1].daily[i].weather[0].icon
    }.png'></th>
       </tr>`;
  }
  newHTML += `</table></div>`;

  return newHTML;
}

//button that allows the user to switch between farenheit and celsius temperatures
function tempChangeButton(data) {
  console.log(data)
  searchBox = document.getElementsByClassName("bg-dark")[0];
  tempButton = document.createElement("button");
  tempButton.innerHTML = `${data[0].name} to Celsius`;
  tempButton.className = "change-temp";
  searchBox.appendChild(tempButton);
  tempButton.addEventListener("click", (e) => {
    if (e.target.innerHTML === `${data[0].name} to Celsius`) {
      displayDataCelsius(data);
      e.target.innerHTML = `${data[0].name} to Farenheit`;
    } else {
      displayDataFarenheit(data);
      e.target.innerHTML = `${data[0].name} to Celsius`;
    }
  });
}

//function that converts temperatures to celsius
function displayDataCelsius(data) {
  const temp = document.querySelectorAll(
    ".temp, .temp-min, .temp-max, .temp-feels-like"
  );
  for (i = 0; i < temp.length; i++) {
    if (temp[i].className === "temp") {
      temp[i].innerHTML = `<p>Temp: ${Math.round((data[0].main.temp) - 273.15)}&deg <br> <img src='http://openweathermap.org/img/wn/${data[0].weather[0].icon}@4x.png'></p>`;
    }
    if (temp[i].className === "temp-min") {
      for (j = 0; j < data[1].daily.length; j++) {
        temp[i].innerHTML = `<th>${Math.round((data[1].daily[j].temp.min) - 273.15)}&deg</th>`;
      }
    }
    if (temp[i].className === "temp-max") {
      for (j = 0; j < data[1].daily.length; j++) {
        temp[i].innerHTML = `<th>${Math.round((data[1].daily[j].temp.max) - 273.15)}&deg</th>`;
      }
    }
    if (temp[i].className === "temp-feels-like") {
      for (j = 0; j < data[1].daily.length; j++) {
        temp[i].innerHTML = `<th>${Math.round((data[1].daily[j].feels_like.day) - 273.15)}&deg</th>`;
      }
    }
  }
}

//error handler
function notFound(err) {
  let newHTML = `<p>City not found. Please try again<p>`;
  document.getElementById("info").innerHTML = newHTML;
  console.log(err);
}
