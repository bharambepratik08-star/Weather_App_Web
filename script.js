function getWeather(lat, lon) {

    let url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=surface_pressure_mean,relative_humidity_2m_mean,weather_code,sunrise,sunset,sunshine_duration,uv_index_max,temperature_2m_max,apparent_temperature_max,temperature_2m_min,apparent_temperature_min,daylight_duration,uv_index_clear_sky_max,rain_sum,showers_sum,snowfall_sum,precipitation_sum,precipitation_probability_max,et0_fao_evapotranspiration,wind_direction_10m_dominant,wind_gusts_10m_max,wind_speed_10m_max,shortwave_radiation_sum&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,weather_code,pressure_msl,surface_pressure,cloud_cover,visibility,wind_speed_10m,wind_gusts_10m,temperature_80m,snowfall&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=auto`;

    fetch(url)
        .then(function(response){
            content.classList.add("loading");
            
            return response.json();
        })
        .then(function(data){

            const extracted = weather_extract(data);

            output_data(extracted);

            forecast_card_edit(data);

            forecast_main_card_edit(data);

            const deta = auto_data_text(data);

            auto_text_up(deta);

            hourly_data(data);

            selected_forecast_day_info (data)

            const theme = weatherTheme (data.current.weather_code);

            document.querySelector(".weather-current-city").className = `weather-current-city ${theme}`;

            charts (data);

            data_on_click_button(data);
        })
        .finally(() => {
            content.classList.remove("loading");
        });

}

const content = document.querySelector(".content")

const search_bar = document.querySelector('#input_text_city');

const searchBtn = document.querySelector(".search-st");

searchBtn.addEventListener("click", order);

search_bar.addEventListener("keydown", enterfun);

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
            const cityName = data[0].name;

            getWeather(lat, lon);
            updateMap(lat,lon,cityName);
        });

        update_city(city);
        

}

function enterfun (event) {

    if (event.key === "Enter") {
        order();

        search_bar.value = "";
        search_bar.placeholder = "Search another city...";
    }

    
}

const humidity_text = document.querySelector('.humidity-js');
const wind_text = document.querySelector('.wind-js');
const pressure_text = document.querySelector('.pressure-js');
const uxindex_text = document.querySelector('.uxindex-js');
const sunrise_time = document.querySelector('.sunrise-time');
const sunset_time = document.querySelector('.sunset-time');
const visibility_range = document.getElementById('visibility-range');
const dew_point_meter = document.querySelector('.dew-point-time');
const cloud_cover = document.querySelector('.cloud-time');
const gust_speed = document.querySelector('.gust-time');
const rain_prob = document.querySelector('.prob-time');
const suntime = document.querySelector('.dura-time');


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
        dewPoint: data.hourly.dew_point_2m[0],
        windGust: data.daily.wind_gusts_10m_max[0],
        rainProb: data.daily.precipitation_probability_max[0],
        sunTime: data.daily.sunshine_duration[0]
    };
}

function output_data(parent) {
    humidity_text.innerHTML = `${parent.humidity} %`;
    pressure_text.innerHTML = `${parent.pressure} hPa`;
    wind_text.innerHTML = `${parent.wind} km/h`;
    cloud_cover.innerHTML = `${parent.cloud} %`;
    dew_point_meter.innerHTML = `${parent.dewPoint} °C`;
    uxindex_text.innerHTML = `${parent.uv}`;
    gust_speed.innerHTML = `${parent.windGust}`;
    rain_prob.innerHTML = `${parent.rainProb} %`;


    const visibility = (parent.visibility / 1000).toFixed(1);
    visibility_range.innerText = `${visibility} Km`;

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

    const totalSeconds = parent.sunTime;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    suntime.innerHTML = `${hours}h ${minutes}m`;
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

            <p class="mode-forecast">${weather_mode(value.daily.weather_code[index])}</p>

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
    const temp_val = document.querySelector('.temp-value');
    const img_val = document.querySelector('.logo-up');
    const mode_val = document.querySelector('.mode-value');

    temp_val.innerText = `${data.temp} °C`;
    mode_val.innerText = `${weather_mode(data.weatherCode)}`;
    img_val.src = `${weatherIcon(data.weatherCode)}`;

}

function update_city (city) {
    const city_val = document.querySelectorAll('.city-value');
    city_val.forEach(val => {
        val.innerText = city;
    })
}

function weather_mode (code) {
    switch (code) {
        case 0:
            return "Clear Sky";

        case 1:
            return "Mainly Clear";

        case 2:
            return "Partly Cloudy";

        case 3:
            return "Overcast";

        case 45:
            return "Fog";

        case 48:
            return "Depositing Rime Fog";

        case 51:
            return "Light Drizzle";

        case 53:
            return "Moderate Drizzle";

        case 55:
            return "Dense Drizzle";

        case 56:
            return "Light Freezing Drizzle";

        case 57:
            return "Dense Freezing Drizzle";

        case 61:
            return "Slight Rain";

        case 63:
            return "Moderate Rain";

        case 65:
            return "Heavy Rain";

        case 66:
            return "Light Freezing Rain";

        case 67:
            return "Heavy Freezing Rain";

        case 71:
            return "Light Snow";

        case 73:
            return "Moderate Snow";

        case 75:
            return "Heavy Snow";

        case 77:
            return "Snow Grains";

        case 80:
            return "Light Rain Showers";

        case 81:
            return "Moderate Rain Showers";

        case 82:
            return "Violent Rain Showers";

        case 85:
            return "Light Snow Showers";

        case 86:
            return "Heavy Snow Showers";

        case 95:
            return "Thunderstorm";

        case 96:
            return "Thunderstorm with Light Hail";

        case 99:
            return "Thunderstorm with Heavy Hail";

        default:
            return "Unknown Weather";
    }
}

function weatherTheme(code) {

    if (code === 0 || code === 1)
        return "sunny";

    if (code === 2)
        return "partly-cloudy";

    if (code === 3)
        return "cloudy";

    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82))
        return "rain";

    if (code >= 71 && code <= 86)
        return "snow";

    if (code >= 95)
        return "storm";

    if (code === 45 || code === 48)
        return "fog";

    return "default";
}

function hourly_data (data) {

    const box_print = document.querySelector(".hourly-cont");
    box_print.innerHTML = ""

    for (let i = 0; i < 24; i++) {

        const hour = new Date(data.hourly.time[i]).toLocaleTimeString([], {
                        hour: "numeric",
                        hour12: true
                    });

                    
        const card = document.createElement("div");
        card.classList.add("hourly-box");

        card.innerHTML = `
            <h3>${hour}</h3>
            <img src="${weatherIcon(data.hourly.weather_code[i])}" class="photo-hourly">
            <h4>${Math.round(data.hourly.temperature_2m[i])}°C</h4>
        `;

        box_print.appendChild(card);
    }

}

const leftBtn = document.querySelector(".lefta");
const rightBtn = document.querySelector(".righta");
const cont = document.querySelector(".hourly-cont");

leftBtn.addEventListener("click", () => {
    cont.scrollBy({
        left: -400,
        behavior: "smooth"
    });
});

rightBtn.addEventListener("click", () => {
    cont.scrollBy({
        left: 400,
        behavior: "smooth"
    });
});

function forecast_main_card_edit(value) {
    let forecast = [];

    for (let i = 0; i < 7; i++) {
        forecast.push({
            minTemp: value.daily.temperature_2m_min[i],
            maxTemp: value.daily.temperature_2m_max[i],
            weatherCode: value.daily.weather_code[i],
            dateCode: value.daily.time[i]
        });
    }

    const boxes = document.querySelectorAll(".forecast-box-m");

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

            <p class="mode-forecast-m">${weather_mode(value.daily.weather_code[index])}</p>

            <h3>${value.daily.temperature_2m_max[index]}°C</h3>

            <p>${value.daily.temperature_2m_min[index]}°C</p>
        `;
    });
}

const image_forecast = document.querySelector('.image-weather-mood');
const text_forecast_temp = document.querySelector('.temp-high');
const text_forecast_mood = document.querySelector('.temp-mood');
const buttonss = document.querySelectorAll(".forecast-box-m");

function selected_forecast_day_info(data) {

    image_forecast.src = weatherIcon(data.daily.weather_code[0]);

    text_forecast_temp.innerHTML =
        `${data.daily.temperature_2m_max[0]}°C`;

    text_forecast_mood.innerHTML =
        weather_mode(data.daily.weather_code[0]);

    const date = new Date(data.daily.time[0]);

    const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric"
    });

    const print_js = document.querySelector('.print-js')

    print_js.innerHTML = `${formattedDate}`;

    const sunrise = new Date(data.daily.sunrise[0]);

    const sunset = new Date(data.daily.sunset[0]);

    sunrise_js.innerHTML = sunrise.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    sunset_js.innerHTML = sunset.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    feels_like_print.innerHTML = `${data.daily.apparent_temperature_max[0]} °C`;
    rain_proba.innerHTML = `${data.daily.precipitation_probability_max[0]} %`;
    wind_speedo.innerHTML = `${data.daily.wind_speed_10m_max[0]} km/h`;
    humidity_js.innerHTML = `${data.daily.relative_humidity_2m_mean[0]} %`;
    uvindex_js.innerHTML = `${data.daily.uv_index_max[0]}`
    pressure_js.innerHTML = `${data.daily.surface_pressure_mean[0]} hPa`

    buttonss.forEach((button, index) => {

        button.addEventListener("click", () => {

            image_forecast.src = weatherIcon(data.daily.weather_code[index]);

            text_forecast_temp.innerHTML =
                `${data.daily.temperature_2m_max[index]}°C`;

            text_forecast_mood.innerHTML =
                weather_mode(data.daily.weather_code[index]);
            

            const date = new Date(data.daily.time[index]);

            const formattedDate = date.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric"
            });

            const print_js = document.querySelector('.print-js')

            print_js.innerHTML = `${formattedDate}`;

            const sunrise = new Date(data.daily.sunrise[index]);

            const sunset = new Date(data.daily.sunset[index]);

            sunrise_js.innerHTML = sunrise.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });

            sunset_js.innerHTML = sunset.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });

            feels_like_print.innerHTML = `${data.daily.apparent_temperature_max[index]} °C`;
            rain_proba.innerHTML = `${data.daily.precipitation_probability_max[index]} %`;
            wind_speedo.innerHTML = `${data.daily.wind_speed_10m_max[index]} km/h`;
            humidity_js.innerHTML = `${data.daily.relative_humidity_2m_mean[index]} %`;
            uvindex_js.innerHTML = `${data.daily.uv_index_max[index]}`
            pressure_js.innerHTML = `${data.daily.surface_pressure_mean[index]} hPa`

                });

            });

}

const feels_like_print = document.querySelector('.feels-like');
const rain_proba = document.querySelector('.rain-chances');
const wind_speedo = document.querySelector('.wind-speed');
const humidity_js = document.querySelector('.humidity-fore');
const sunrise_js = document.querySelector('.sunrise-js');
const sunset_js = document.querySelector('.sunset-js');
const uvindex_js = document.querySelector('.uvindex-js');
const pressure_js = document.querySelector('.pressures')


const buttons = document.querySelectorAll(".chartBtn");

buttons.forEach(button => {
    button.addEventListener("click", () => {

        buttons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");
    });
});

const tempBtn = document.querySelector('.tempBtn');
const rainBtn = document.querySelector('.rainBtn');
const windBtn = document.querySelector('.windBtn');
const humidityBtn = document.querySelector('.humidityBtn');
const pressureBtn = document.querySelector('.pressureBtn');

let myChart;

function charts (value) {

    if(myChart){
        myChart.destroy();
    }


    const labels = value.daily.time.map(day =>
        new Date(day).toLocaleDateString("en-US",{
            weekday:"short"
        })
    );

    const temperature = value.daily.temperature_2m_max;

    const ctx = document.getElementById("charts-cal");

    Chart.register(ChartDataLabels);

    myChart = new Chart(ctx,{        
        type:"line",

        data:{
            labels:labels,

            datasets:[{
                data:temperature,
                borderColor:"#3b82f6",
                backgroundColor:"rgba(59,130,246,.15)",
                fill:true,
                tension:0.45,
                borderWidth:4,

                pointRadius:5,
                pointHoverRadius:7,
                pointBackgroundColor:"#fff",
                pointBorderColor:"#3b82f6",
                pointBorderWidth:2,

                datalabels:{
                    align:"top",
                    anchor:"end",
                    color:"#111827",

                    formatter:(value)=>{
                        return Math.round(value) + curretUnit;
                    },

                    font:{
                        size:12,
                        weight:"bold"
                    }
                }
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true
                }
            },

            elements: {
                line: {
                    tension: 0.45
                }
            },

            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    display: true,

                    ticks: {
                        callback: function(value) {
                            return Math.round(value) + curretUnit;
                        }
                    }
                }
            }
        }
    });
}

let curretUnit = "°";

function updateChart(data, label, color, current) {
    curretUnit = current;

    myChart.data.datasets[0].data = data;
    myChart.data.datasets[0].label = label;
    myChart.data.datasets[0].borderColor = color;
    myChart.update();
}

function data_on_click_button(value){

    buttons.forEach(button=>{

        button.onclick = () => {

            buttons.forEach(btn=>btn.classList.remove("active"));
            button.classList.add("active");

            const type = button.dataset.chart;

            switch(type){

                case "temperature":
                    updateChart(value.daily.temperature_2m_max,"Temperature","#3b82f6", "°");
                    break;

                case "rain":
                    updateChart(value.daily.precipitation_probability_max,"Rain","#2563eb", "%");
                    break;

                case "wind":
                    updateChart(value.daily.wind_speed_10m_max,"Wind","#10b981", "km/h");
                    break;

                case "humidity":
                    updateChart(value.daily.relative_humidity_2m_mean,"Humidity","#8b5cf6", "%");
                    break;

                case "pressure":
                    updateChart(value.daily.surface_pressure_mean,"Pressure","#ef4444", "hPa");
                    break;
            }

        };

    });

}

buttonss.forEach(button => {
    button.addEventListener("click", () => {

        buttonss.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");
    });
});