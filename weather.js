const apiKey = ;

async function getJSON(url) {
  try {
    let data = await fetch(url);
    return await data.json();
  } catch (err) {
    throw err;
  }
}

const search = document
  .getElementById("search")
  .addEventListener("click", () => {
    const cityField = document.getElementById("city").value.toLowerCase();
    if (cityField.length == "0") {
      alert("Please enter a city");
    } else {
      const cityURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityField}&appid=${apiKey}`;
      const newData = getCity(cityURL)
        .then(displayData)
        .catch((err) => console.log(err));

      return newData;
    }
  });

async function getCity(url) {
  const currentCity = await getJSON(url);
  const locationURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentCity.coord.lat}&lon=${currentCity.coord.lon}&exclude={part}&appid=${apiKey}`;
  const cityInfo = await getJSON(locationURL);
  return Promise.all([currentCity, cityInfo]);
}

async function displayData(data) {
  console.log(data);
  const info = document.getElementById("info");
  const date = await new Date(data[0].dt * 1000);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  let newHTML = `<div><h3>${date.toLocaleDateString("en-US", options)}</h3>`;
  newHTML += `<h2>City: <b>${data[0].name}</b> <br> Country: <b>${data[0].sys.country}</b></h2>`;
  newHTML += `<h3>Current Weather: <b>${data[0].weather[0].description}</b> </h3>`;
  newHTML += `<h4>Temp: ${data[0].main.temp} <br> <b>Max</b>: ${data[0].main.temp_max} <b>Feels Like</b>: ${data[0].main.feels_like} <b>Min</b>: ${data[0].main.temp_min}</h4>`;
  newHTML += `<table class="weather-table">`;
  newHTML += `<thead>
        <tr>
          <th>Day</th><th>Min</th><th>Max</th><th></th>Feels Like<th>Weather</th>
        </tr>`
  for ( i = 0; i < data[1].daily.length; i++) {
        <tr>
          
        </tr>
  }
  newHTML += `</table></div>`;
  info.innerHTML = newHTML;
}
