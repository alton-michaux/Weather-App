const apiKey = "a12fb02034883e480f0f41431feb3261";

async function getJSON(url) {
  try {
    let data = await fetch(url);
    console.log(data);
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
      const newData = 
      getCity(cityURL)
        .then(displayData)
        .catch(err => console.log(err))
      console.log(newData)
    }
  });

async function getCity(url) {
  const currentCity = await getJSON(url);
  const locationURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentCity.coord.lat}&lon=${currentCity.coord.lon}&exclude={part}&appid=${apiKey}`;
  const cityInfo = await getJSON(locationURL)
  return Promise.all([currentCity, cityInfo])
}

async function displayData (data) {
    const date = new Date(data[0].dt * 1000);
    console.log(date)
    // const info = document.getElementById('info');
}
