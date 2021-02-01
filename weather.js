//declare variable to store api key
const apiKey = "a12fb02034883e480f0f41431feb3261";

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
        .then(resetButton)
        .catch(notFound);
      return newData;
    }
  });

const resetButton = (data) => {
  const reset = document.createElement("button");
  const jumbo = document.querySelector(".jumbotron");

  reset.innerHTML = "RESET";
  reset.classList.add("btn-outline-info", "btn");

  jumbo.appendChild(reset);

  reset.addEventListener("click", () => {
    location.reload();
  });

  return data;
};

//function that runs previously generated url through the getJSON function for retrieval and parsing as well as generating a second api call for future weather forecasts
async function getCity(url) {
  const currentCity = await getJSON(url);
  const locationURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentCity.coord.lat}&lon=${currentCity.coord.lon}&exclude={part}&appid=${apiKey}`;
  const cityInfo = await getJSON(locationURL);

  return Promise.all([currentCity, cityInfo]);
}

//generate current date
function getDate(data) {
  const welcome = document.getElementById("welcome-message");
  const date = new Date(data[0].dt * 1000);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  newHTML = `<div class="date"><h3 class="date">${date.toLocaleDateString(
    "en-US",
    options
  )}</h3></div`;

  welcome.innerHTML = newHTML;
}

//displays data for user to read information (degrees in farenheit)
function displayDataFarenheit(data) {
  const container = document.querySelector("body");
  const info = document.getElementById("info");
  const dateBox = document.getElementById("filler2");
  const weather = data[0].weather[0].description;

  getDate(data);

  newHTML = `<div class="cityInfo"<p>City/Country: <b>${data[0].name}</b> ,<b>${data[0].sys.country}</b></p>`;
  newHTML += `<p>Current Weather: <b>${weather}</b></p>`;
  newHTML += `<p class='temp'>Temp: ${Math.round(
    ((data[0].main.temp - 273.5) * 9) / 5 + 32
  )}&deg <br> <img src='http://openweathermap.org/img/wn/${
    data[0].weather[0].icon
  }@4x.png'></p></div>`;

  const backgroundChange = () => {
    switch (weather) {
      case "clear sky":
        container.style.backgroundImage =
          "url('https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500')";
        container.style.backgroundSize = "cover";
        break;
      case "few clouds":
      case "scattered clouds":
        container.style.backgroundImage =
          "url('https://www.haidagwaiiobserver.com/wp-content/uploads/2020/03/21121137_web1_200403-HGO-week-of-sun-blueskies_1.jpg')";
        container.style.backgroundSize = "cover";
        break;
      case "overcast clouds":
      case "broken clouds":
        container.style.backgroundImage =
          "url('https://c1.wallpaperflare.com/preview/735/805/144/overcast-cloudy-dramatic-sky-storm.jpg')";
        container.style.backgroundSize = "cover";
        break;
      case "moderate intensity rain":
      case "light intensity rain":
      case "rain":
        container.style.backgroundImage =
          "url('https://cdn.abcotvs.com/dip/images/5184599_031119-kgo-shutterstock-rain-img.jpg?w=800&r=16%3A9')";
        container.style.backgroundSize = "cover";
        break;
      case "heavy intensity rain":
        container.style.backgroundImage = "url('https://i.ytimg.com/vi/jB-7Y5eDfXk/maxresdefault.jpg')";
        container.style.backgroundSize = "cover";
        break;
      case "mist":
      case "fog":
        container.style.backgroundImage =
          "url('https://www.advancednanotechnologies.com/wp-content/uploads/2019/05/iStock-1055906130-1080x675.jpg')";
        container.style.backgroundSize = "cover";
        break;
      case "snow":
      case "light snow":
      case "heavy snow":
        container.style.backgroundImage =
          "url('https://www.nwahomepage.com/wp-content/uploads/sites/90/2021/01/Charles-Peek_Hwy-7-Snow-Covered_1-7-2021.jpg?w=2048')";
        container.style.backgroundSize = "cover";
        break;
      default:
        console.log("weather exists");
    }
  };

  newHTMLData = tableMaker(data);

  info.innerHTML = newHTMLData;
  dateBox.innerHTML = newHTML;

  backgroundChange();

  return data;
}

//function to construct table using html elements
function tableMaker(data) {
  let newHTMLData = `<div class="table"><table class="weather-table">`;
  //headers
  newHTMLData += `<thead>
        <tr>
          <th class='outside-blocks'><b>Day</b></th><th class='outside-blocks'><b>Min</b></th><th class='outside-blocks'><b>Max</b></th><th class='outside-blocks'><b>Will Feel Like</b></th><th class='outside-blocks'><b>Weather</b></th>
        </tr>`;
  //write a loop to write information for all 7 days of weather in table (degrees in farenheit)
  for (i = 1; i < data[1].daily.length; i++) {
    newHTMLData += `<tr>
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
  newHTMLData += `</table></div>`;

  return newHTMLData;
}

//button that allows the user to switch between farenheit and celsius temperatures
function tempChangeButton(data) {
  searchBox = document.getElementsByClassName("filler")[0];
  tempButton = document.createElement("button");
  tempButton.innerHTML = `Celsius`;
  tempButton.classList.add("btn-outline-info", "btn");
  searchBox.appendChild(tempButton);
  tempButton.addEventListener("click", (e) => {
    if (e.target.innerHTML === `Celsius`) {
      displayDataCelsius(data);
      e.target.innerHTML = `Farenheit`;
    } else {
      displayDataFarenheit(data);
      e.target.innerHTML = `Celsius`;
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
      temp[i].innerHTML = `<p>Temp: ${Math.round(
        data[0].main.temp - 273.15
      )}&deg <br> <img src='http://openweathermap.org/img/wn/${
        data[0].weather[0].icon
      }@4x.png'></p>`;
    }
    if (temp[i].className === "temp-min") {
      for (j = 0; j < data[1].daily.length; j++) {
        temp[i].innerHTML = `<th>${Math.round(
          data[1].daily[j].temp.min - 273.15
        )}&deg</th>`;
      }
    }
    if (temp[i].className === "temp-max") {
      for (j = 0; j < data[1].daily.length; j++) {
        temp[i].innerHTML = `<th>${Math.round(
          data[1].daily[j].temp.max - 273.15
        )}&deg</th>`;
      }
    }
    if (temp[i].className === "temp-feels-like") {
      for (j = 0; j < data[1].daily.length; j++) {
        temp[i].innerHTML = `<th>${Math.round(
          data[1].daily[j].feels_like.day - 273.15
        )}&deg</th>`;
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
