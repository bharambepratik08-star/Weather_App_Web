const overview = document.querySelector('.overview');
const forecast = document.querySelector('.forecast-main-page');
const map = document.querySelector('.map-main-page');
const alertss = document.querySelector('.alerts-main-page');
const airquality = document.querySelector('.air-quality-page');
const setting = document.querySelector('.setting-main-page');
const overviewBtn = document.querySelector('.overview-btn');
const forecastBtn = document.querySelector('.forecast-btn');
const mapBtn = document.querySelector('.map-btn');
const alertsBtn = document.querySelector('.alerts-btn');
const airqualityBtn = document.querySelector('.air-quality-btn');
const settingBtn = document.querySelector('.setting-btn');
const all  = document.querySelectorAll('.aside-btn');

overviewBtn.addEventListener("click", () => {
    overview.classList.remove('deview');
    forecast.classList.add('deview');
    map.classList.add('deview');
    airquality.classList.add('deview');
    alertss.classList.add('deview');
    setting.classList.add('deview');
})

forecastBtn.addEventListener("click", () => {
    overview.classList.add('deview');
    forecast.classList.remove('deview');
    map.classList.add('deview');
    airquality.classList.add('deview');
    alertss.classList.add('deview');
    setting.classList.add('deview');
})

mapBtn.addEventListener("click", () => {
    overview.classList.add('deview');
    forecast.classList.add('deview');
    map.classList.remove('deview');
    airquality.classList.add('deview');
    alertss.classList.add('deview');
    setting.classList.add('deview');
})

alertsBtn.addEventListener("click", () => {
    overview.classList.add('deview');
    forecast.classList.add('deview');
    map.classList.add('deview');
    airquality.classList.add('deview');
    alertss.classList.remove('deview');
    setting.classList.add('deview');
})

airqualityBtn.addEventListener("click", () => {
    overview.classList.add('deview');
    forecast.classList.add('deview');
    map.classList.add('deview');
    airquality.classList.remove('deview');
    alertss.classList.add('deview');
    setting.classList.add('deview');
})

settingBtn.addEventListener("click", () => {
    overview.classList.add('deview');
    forecast.classList.add('deview');
    map.classList.add('deview');
    airquality.classList.add('deview');
    alertss.classList.add('deview');
    setting.classList.remove('deview');
})
