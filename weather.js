const apiKey = 'a12fb02034883e480f0f41431feb3261';

async function getJSON (url) {
    try {
      let data = await fetch (url);
      return await data.json()
    } catch (err) {
      throw err;
    }
}

const search = document.getElementById('search')
    
search.addEventListener('click', () => {
    const cityField = document.getElementById('city').value.toLowerCase();
    const cityURL = `api.openweathermap.org/data/2.5/weather?q=${cityField}&appid=${apiKey}`
    getCity(cityURL)
      // .then()
      // .catch()
    // console.log(cityURL)
})

async function getCity (url) {
  const currentCity = await getJSON(url);
  console.log(currentCity)
  // const locationURL = `https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=${apiKey}`
}