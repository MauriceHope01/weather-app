const apiKey= "f5148911822a73a0015c33c68f4ad9d9";
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const recentCitiesList = document.getElementById('recent-cities');
const weatherInfo = document.getElementById('weather-info');
const loader = document.getElementById('loader');
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const cityName = document.getElementById('city-name');
const tempElement = document.getElementById('temp');
const weatherDescription = document.getElementById('weather-description');
const weatherIcon = document.getElementById('weather-icon');
const humidityElement = document.getElementById('humidity');

async function getWeather(city) {
  showLoader(true);

  try {
    const response = await fetch(`${apiUrl}?q=${city}&appid=${apiKey}&units=metric`);
    if (!response.ok) throw new Error('Città non trovata');

    const data = await response.json();
    updateWeatherInfo(data);
    saveRecentCity(city);
    showLoader(false);
  } catch (error) {
    alert(error.message);
    showLoader(false);
  }
}

function updateWeatherInfo(data) {
  cityName.textContent = data.name;
  tempElement.textContent = Math.round(data.main.temp);
  weatherDescription.textContent = data.weather[0].description;
  weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  humidityElement.querySelector('span').textContent = data.main.humidity;
}

function saveRecentCity(city) {
  let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
  if (!recentCities.includes(city)) {
    recentCities.push(city);
    if (recentCities.length > 5) recentCities.shift(); // Mantieni solo le ultime 5 città
    localStorage.setItem('recentCities', JSON.stringify(recentCities));
  }
  displayRecentCities();
}

function displayRecentCities() {
  const recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
  recentCitiesList.innerHTML = '';
  recentCities.forEach(city => {
    const listItem = document.createElement('li');
    listItem.textContent = city;
    listItem.addEventListener('click', () => getWeather(city));
    recentCitiesList.appendChild(listItem);
  });
}

function showLoader(visible) {
  loader.style.display = visible ? 'block' : 'none';
}

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  } else {
    alert('Inserisci il nome di una città');
  }
});

