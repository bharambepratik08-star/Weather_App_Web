function getWeather(lat, lon) {

    let url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,sunrise,sunset,sunshine_duration,uv_index_max,temperature_2m_max,apparent_temperature_max,temperature_2m_min,apparent_temperature_min,daylight_duration,uv_index_clear_sky_max,rain_sum,showers_sum,snowfall_sum,precipitation_sum,precipitation_probability_max,et0_fao_evapotranspiration,wind_direction_10m_dominant,wind_gusts_10m_max,wind_speed_10m_max,shortwave_radiation_sum&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,weather_code,pressure_msl,surface_pressure,cloud_cover,visibility,wind_speed_10m,wind_gusts_10m,temperature_80m,snowfall&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=auto`;

    fetch(url)
        .then(function(response){
            return response.json();
        })
        .then(function(data){

            const extracted = weather_extract(data);

            output_data(extracted);

            forecast_card_edit(data);

            const deta = auto_data_text(data);

            auto_text_up(deta);
        });

}

const searchBtn = document.querySelector(".search-st");

searchBtn.addEventListener("click", order);

function order(){

    const city = search_bar.value.trim();

    if(city === ""){
        return;
    }

    const city_url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=beb3da527e6c5a7af2ba1a7e725c78cd`;

    fetch(city_url)
        .then(function(response){
            return response.json();
        })
        .then(function(data){

            if(data.length === 0){
                alert("City not found");
                return;
            }

            const lat = data[0].lat;
            const lon = data[0].lon;

            getWeather(lat, lon);

        });

}

const search_bar = document.querySelector('#input_text_city');
const humidity_text = document.querySelector('.humidity-js');
const wind_text = document.querySelector('.wind-js');
const pressure_text = document.querySelector('.pressure-js');
const uxindex_text = document.querySelector('.uxindex-js');
const sunrise_time = document.querySelector('.sunrise-time');
const sunset_time = document.querySelector('.sunset-time');
const visibility_range = document.getElementById('visibility-range');
const dew_point_meter = document.querySelector('.dew-point-time');
const cloud_cover = document.querySelector('.cloud-time');


function weather_extract(data) {
    return {
        humidity: data.current.relative_humidity_2m,
        pressure: data.current.pressure_msl,
        wind: data.current.wind_speed_10m,
        visibility: data.hourly.visibility[0],
        sunrise: data.daily.sunrise[0],
        sunset: data.daily.sunset[0],
        cloud: data.current.cloud_cover,
        uv: data.daily.uv_index_max[0],
        dewPoint: data.hourly.dew_point_2m[0]
    };
}

function output_data(parent) {
    humidity_text.innerHTML = parent.humidity;
    pressure_text.innerHTML = parent.pressure;
    wind_text.innerHTML = parent.wind;
    cloud_cover.innerHTML = parent.cloud;
    dew_point_meter.innerHTML = parent.dewPoint;
    uxindex_text.innerHTML = parent.uv;


    const visibility = (parent.visibility / 1000).toFixed(1);
    visibility_range.innerText = visibility;

    const sunrise = new Date(parent.sunrise);
    const sunset = new Date(parent.sunset);

    sunrise_time.innerHTML = sunrise.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    sunset_time.innerHTML = sunset.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function weatherIcon(code) {
    switch (code) {
        case 0:
            return "svg/sun.svg";
        case 1:
            return "svg/less-cloud.svg";
        case 2:
            return "svg/large-cloud.svg";
        case 3:
            return "svg/clouds.svg";
        case 61:
            return "svg/rain.svg";
        default:
            return "svg/thunder.svg";
    }
} 

function forecast_card_edit(value) {
    let forecast = [];

    for (let i = 0; i < 5; i++) {
        forecast.push({
            minTemp: value.daily.temperature_2m_min[i],
            maxTemp: value.daily.temperature_2m_max[i],
            weatherCode: value.daily.weather_code[i],
            dateCode: value.daily.time[i]
        });
    }

    const boxes = document.querySelectorAll(".forecast-box");

    boxes.forEach((card, index) => {
        const day = new Date(forecast[index].dateCode)
        .toLocaleDateString("en-US", {
            weekday: "short"
        });
        card.innerHTML = `
            <h2>${day}</h2>
            <div class="icon">
                <img class="img_forecast_box_logo" src=${weatherIcon(value.daily.weather_code[index])}>
            </div>

            <h3>${value.daily.temperature_2m_max[index]}°C</h3>

            <p>${value.daily.temperature_2m_min[index]}°C</p>
        `;
    });
}

function auto_data_text (edit) {
    return {
        temp: edit.daily.temperature_2m_max[0],
        weatherCode: edit.daily.weather_code[0],
    }
}

function auto_text_up (data) {
    const text_edit = document.querySelector('.weather-current-city');
    text_edit.innerHTML = `
        <img class="logo-up" src=${weatherIcon(data.weatherCode)}>
        <h1 class-"temp">${data.temp} °C</h1>
    `
}