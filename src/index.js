const apiKey = '243c35ae9f7ea3d71bc48f19f87319db';
const cityInput = document.querySelector('.city');

//TRANSLATIONS
const translations = {
  'Wind': 'Ветер',
  'Humidity': 'Влажность'
};

//LANGSWITCHER
// Set up language toggle button
const langSwitcherButton = document.getElementById('lang-switcher');
let currentLang = localStorage.getItem('currentLang') || 'en-US';
let langCode = currentLang.split('-')[0]; // Define langCode here
updateLangButtonText();

langSwitcherButton.addEventListener('click', () => {
  if (currentLang === 'en-US') {
    currentLang = 'ru-RU';
  } else {
    currentLang = 'en-US';
  }
  localStorage.setItem('currentLang', currentLang);
  updateLangButtonText();
});

// Update language button text to indicate current language
function updateLangButtonText() {
  const langCode = currentLang.split('-')[0];
  console.log('langCode in updateLangButtonText:', langCode);
  langSwitcherButton.textContent = currentLang;
  localStorage.setItem('currentLang', currentLang);
  const storedCity = localStorage.getItem('storedCity');
  if (storedCity) {
    getWeatherData(storedCity, langCode);
  } else {
    getWeatherData('Minsk', langCode);
  }
}




//TIMEDATE
// JavaScript
const timeEl = document.querySelector('.time');
const dateEl = document.querySelector('.date');

function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const dateString = now.toLocaleDateString(currentLang, options);
  const dateStringCapitalized = dateString.replace(/(^|\s)\S/g, (l) => l.toUpperCase());

  timeEl.textContent = timeString;
  dateEl.textContent = dateStringCapitalized;
}

updateTime(); // Set initial values
setInterval(updateTime, 1000); // Update every second

//TIMEOFDAY
function getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 11) {
        return 'morning';
    } else if (hour >= 12 && hour <= 17) {
        return 'afternoon';
    } else if (hour >= 18 && hour <= 23) {
        return 'evening';
    } else {
        return 'night';
    }
}

//NAMETOLOCALSTORAGE
// Get the saved name from localStorage
let name = localStorage.getItem('name');

// Set the name input value to the stored name
document.querySelector('.name').value = name;

// Listen for changes to the name input and update localStorage
document.querySelector('.name').addEventListener('input', () => {
  const input = document.querySelector('.name');
  input.value = input.value.replace('!', '') + '!';
  localStorage.setItem('name', input.value);
});


//GREETINGS
const timeOfDay = getTimeOfDay();
userName = localStorage.getItem('name') || '';

const greetingElement = document.querySelector('.greeting');
greetingElement.textContent = `Good ${timeOfDay},`;

//BG
const bgImageEl = document.querySelector('body');
const bgImageUrlTemplate = 'https://github.com/skoll-vald/stage1-tasks/blob/assets/images/';

let currentBgIndex = getRandomIndex();
setBgImage(currentBgIndex);

document.querySelector('.slide-prev').addEventListener('click', () => {
  currentBgIndex = currentBgIndex > 1 ? currentBgIndex - 1 : 20;
  setBgImage(currentBgIndex);
});

document.querySelector('.slide-next').addEventListener('click', () => {
  currentBgIndex = currentBgIndex < 20 ? currentBgIndex + 1 : 1;
  setBgImage(currentBgIndex);
});

function pad(number) {
  if (number < 10) {
    return `0${number}`;
  }
  return number.toString();
}

async function setBgImage(bgIndex) {
    const timeOfDay = getTimeOfDay();
    const bgImageUrl = `${bgImageUrlTemplate}${timeOfDay}/${pad(bgIndex)}.jpg?raw=true`;
    
    // Create new image elements for the previous and next images
    const prevImg = new Image();
    const nextImg = new Image();
    prevImg.src = `${bgImageUrlTemplate}${timeOfDay}/${pad(bgIndex - 1)}.jpg?raw=true`;
    nextImg.src = `${bgImageUrlTemplate}${timeOfDay}/${pad(bgIndex + 1)}.jpg?raw=true`;
  
    // Set the background image of the body element to the current image URL
    bgImageEl.style.backgroundImage = `url(${bgImageUrl})`;
  }
  

function getRandomIndex() {
  return Math.floor(Math.random() * 20) + 1;
}

setInterval(setBgImage, 60000); // Update background image every minute

//WEATHER
// Set initial language toggle button text
updateLangButtonText();

// Call weather API with default city on page load
let storedCity = localStorage.getItem('storedCity');
if (storedCity) {
  cityInput.value = storedCity;
  getWeatherData(storedCity, langCode);
} else {
  getWeatherData('Minsk', langCode);
}

// Add event listener to the input field
const inputField = document.getElementById('city-input');

inputField.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    const city = inputField.value.trim();
    const langCode = currentLang.split('-')[0];
    getWeatherData(cityInput.value, langCode);
    localStorage.setItem('storedCity', cityInput.value);
    inputField.blur();
  }
});

inputField.addEventListener('blur', () => {
  const city = inputField.value.trim();
  const langCode = currentLang.split('-')[0];
  getWeatherData(city, langCode);
});


// Function to call weather API and update weather information on the page
async function getWeatherData(city, langCode) {
  const currentLang = localStorage.getItem('currentLang') || 'en-US';

  console.log('getWeatherData function called with city=', city, 'and langCode=', langCode);
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=${langCode}&units=metric&appid=${apiKey}`;
  try {
    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      // Clear error message
      const errorEl = document.querySelector('.weather-error');
      errorEl.textContent = '';
      // Update weather information on the page
      updateWeatherInfo(data);
    } else {
      throw new Error('City not found');
    }
  } catch (error) {
    // Display error message
    const errorEl = document.querySelector('.weather-error');
    errorEl.textContent = error.message;
    // Clear weather information on the page
    const temperatureEl = document.querySelector('.temperature');
    const descriptionEl = document.querySelector('.weather-description');
    const iconEl = document.querySelector('.weather-icon');
    const windEl = document.querySelector('.wind');
    const humidityEl = document.querySelector('.humidity');
    temperatureEl.textContent = '';
    descriptionEl.textContent = '';
    iconEl.className = 'weather-icon owf';
    windEl.textContent = '';
    humidityEl.textContent = '';
  }
}


// Function to update weather information on the page
function updateWeatherInfo(data) {
  const temperatureEl = document.querySelector('.temperature');
  const descriptionEl = document.querySelector('.weather-description');
  const iconEl = document.querySelector('.weather-icon');
  const windEl = document.querySelector('.wind');
  const humidityEl = document.querySelector('.humidity');
  
  const temperature = Math.round(data.main.temp);
  temperatureEl.textContent = temperature + '°C';
  descriptionEl.textContent = data.weather[0].description;
  iconEl.className = `weather-icon owf owf-${data.weather[0].id}`;
  const windSpeed = Math.round(data.wind.speed);
  windEl.textContent = 'Wind: ' + windSpeed + ' m/s';

  const humidity = Math.round(data.main.humidity);
  humidityEl.textContent = 'Humidity: ' + humidity + '%';
  // Translate wind and humidity strings if language is set to Russian
  if (currentLang === 'ru-RU') {
    windEl.textContent = `${translations['Wind']}: ${data.wind.speed} м/с`;
    humidityEl.textContent = `${translations['Humidity']}: ${data.main.humidity}%`;
  } else {
    windEl.textContent = `Wind: ${data.wind.speed} m/s`;
    humidityEl.textContent = `Humidity: ${data.main.humidity}%`;
  }
}

//QUOTES
const quoteElement = document.querySelector('.quote');
const authorElement = document.querySelector('.author');
const changeQuoteButton = document.querySelector('.change-quote');

async function getRandomQuote() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    const { quote, author } = data[Math.floor(Math.random() * data.length)];
    quoteElement.textContent = quote;
    authorElement.textContent = author;
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', getRandomQuote);

changeQuoteButton.addEventListener('click', getRandomQuote);