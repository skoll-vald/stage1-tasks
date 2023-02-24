//TIMEDATE
// JavaScript
const timeEl = document.querySelector('.time');
const dateEl = document.querySelector('.date');

function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  const dateString = now.toLocaleDateString();
  timeEl.textContent = timeString;
  dateEl.textContent = dateString;
}

updateTime(); // Set initial values
setInterval(updateTime, 1000); // Update every second

//LANGSWITCHER
// Set up language toggle button
const langSwitcherButton = document.getElementById('lang-switcher');
let currentLang = 'en';
updateLangButtonText();

langSwitcherButton.addEventListener('click', () => {
  if (currentLang === 'en') {
    currentLang = 'ru';
  } else {
    currentLang = 'en';
  }
  updateLangButtonText();
});

// Update language button text to indicate current language
function updateLangButtonText() {
  const langText = currentLang === 'en' ? 'English' : 'Русский';
  langSwitcherButton.textContent = `${langText} (${currentLang.toUpperCase()})`;
}
