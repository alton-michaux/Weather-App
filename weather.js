//declare variable to store api key
const apiKey =;

//function that fetches and parses data from urls
async function getJSON(url) {
  try {
    let data = await fetch(url);
    return await data.json();
  } catch (err) {
    throw err;
  }
}

//function that selects the search button.
const search = document
  .getElementById("search")
  //makes search button functional 'click'
  .addEventListener("click", () => {
    //processes user input
    const cityField = document.getElementById("city").value.toLowerCase();
    if (cityField.length == "0") {
      alert("Please enter a city");
    } else {
      //generates input-specific url
      const cityURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityField}&appid=${apiKey}`;
      const newData = getCity(cityURL)
        .then(displayData)
        // .then(tempChangeButton)
        .catch(notFound);
      return newData;
    }
  });

//function that runs previously generated url through the getJSON function for retrieval and parsing as well as generating a second api call for future weather
async function getCity(url) {
  const currentCity = await getJSON(url);
  const locationURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentCity.coord.lat}&lon=${currentCity.coord.lon}&exclude={part}&appid=${apiKey}`;
  const cityInfo = await getJSON(locationURL);
  return Promise.all([currentCity, cityInfo]);
}

//displays data in html format for user to read information
function displayData(data) {
  const info = document.getElementById("info");
  //create a variable for date and format it to appear on page using options variable
  const date = new Date(data[0].dt * 1000);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  //write html to page
  let newHTML = `<div><h4 class="date">${date.toLocaleDateString(
    "en-US",
    options
  )}</h4>`;
  newHTML += `<p>City/Country: <b>${data[0].name}</b> ,<b>${data[0].sys.country}</b></p>`;
  newHTML += `<p>Current Weather: <b>${data[0].weather[0].description}</b> </p>`;
  newHTML += `<p class='temp'>Temp: ${Math.round(
    ((data[0].main.temp - 273.5) * 9) / 5 + 32
  )}&deg <br> <img src='http://openweathermap.org/img/wn/${
    data[0].weather[0].icon
  }@4x.png'></p></div>`;
  //build out table for 7 day forecast
  newHTML += `<div><table class="weather-table">`;
  //headers
  newHTML += `<thead>
        <tr>
          <th class='outside-blocks'><b>Day</b></th><th class='outside-blocks'><b>Min</b></th><th class='outside-blocks'><b>Max</b></th><th class='outside-blocks'><b>Will Feel Like</b></th><th class='outside-blocks'><b>Weather</b></th>
        </tr>`;
  //write a loop to write information for all 7 days of weather in table
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
  info.innerHTML = newHTML;
  //return the data for use by tempChangeButton function
  return data;
}

//error handler
function notFound(err) {
  newHTML = `<p>City not found. Please try again<p>`;
  document.getElementById("info").innerHTML = newHTML;
  console.log(err);
}
