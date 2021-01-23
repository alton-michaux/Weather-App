const apiKey = 'a12fb02034883e480f0f41431feb3261';

async function getJSON(url) {
  try {
    let data = await fetch(url);
    console.log(data)
    return await data.json()
  } catch (err) {
    throw err;
  }
}

const search = document.getElementById('search')

search.addEventListener('click', () => {
  const cityField = document.getElementById('city').value.toLowerCase();
  if (cityField.length == '0') {
    alert('Please enter a city')
  } else {
    const cityURL = `api.openweathermap.org/data/2.5/weather?q=${cityField}&appid=${apiKey}`
    getCity(cityURL)
    // .then(data => console.log(data))
    // .catch(err => console.log(err))
  }
})

async function getCity(url) {
  const currentCity = await getJSON(url);
  console.log(currentCity)
  const locationURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentCity.coord.lat}&lon=${currentCity.coord.lon}&exclude={part}&appid=${apiKey}`
  console.log(locationURL)
}