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

function selected_forecast_print_text (enter) {

    const date = new Date(enter.daily.time[0]);

    const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric"
    });

    const print_js = document.querySelector('.print-js')

    print_js.innerHTML = `${formattedDate}`;

}

const image_forecast = document.querySelector('.image-weather-mood');
const text_forecast_temp = document.querySelector('.temp-high');
const text_forecast_mood = document.querySelector('.temp-mood');

function selected_forecast_day_info (data) {

    image_forecast.setAttribute("src", `${weatherIcon(data.daily.weather_code[0])}`)
    text_forecast_temp.innerHTML = `${data.daily.temperature_2m_max[0]}`
    text_forecast_mood.innerHTML = `${weather_mode(data.daily.weather_code[0])}`

}

const feels_like_print = document.querySelector('.feels-like');
const rain_proba = document.querySelector('.rain-chances');
const wind_speedo = document.querySelector('.wind-speed');
const humidity_js = document.querySelector('.humidity-fore');
const sunrise_js = document.querySelector('.sunrise-js');
const sunset_js = document.querySelector('.sunset-js');
const uvindex_js = document.querySelector('.uvindex-js');
const pressure_js = document.querySelector('.pressures')

function data_extract_index (data) {
        return {
        humidity: data.daily.relative_humidity_2m_mean[0],
        wind: data.daily.wind_speed_10m_max[0],
        sunrise: data.daily.sunrise[0],
        sunset: data.daily.sunset[0],
        uv: data.daily.uv_index_max[0],
        rainProb: data.daily.precipitation_probability_max[0],
        feelsLike: data.daily.apparent_temperature_max[0],
        pressureS: data.daily.surface_pressure_mean[0]
        };
}

function print_js_forecast_detail (parent) {

    const sunrise = new Date(parent.sunrise);
    const sunset = new Date(parent.sunset);

    sunrise_js.innerHTML = sunrise.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    sunset_js.innerHTML = sunset.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    feels_like_print.innerHTML = `${parent.feelsLike}`;
    rain_proba.innerHTML = `${parent.rainProb}`;
    wind_speedo.innerHTML = `${parent.wind}`;
    humidity_js.innerHTML = `${parent.humidity}`;
    uvindex_js.innerHTML = `${parent.uv}`
    pressure_js.innerHTML = `${parent.pressureS}`
}
const buttons = document.querySelectorAll(".chartBtn");

buttons.forEach(button => {
    button.addEventListener("click", () => {

        // Remove active from every button
        buttons.forEach(btn => btn.classList.remove("active"));

        // Add active to clicked button
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
                        return value + "°";
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
                            return value + "°";
                        }
                    }
                }
            }
        }
    });
}

function updateChart(data, label, color) {
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
                    updateChart(value.daily.temperature_2m_max,"Temperature","#3b82f6");
                    break;

                case "rain":
                    updateChart(value.daily.precipitation_probability_max,"Rain","#2563eb");
                    break;

                case "wind":
                    updateChart(value.daily.wind_speed_10m_max,"Wind","#10b981");
                    break;

                case "humidity":
                    updateChart(value.daily.relative_humidity_2m_mean,"Humidity","#8b5cf6");
                    break;

                case "pressure":
                    updateChart(value.daily.surface_pressure_mean,"Pressure","#ef4444");
                    break;
            }

        };

    });

}

