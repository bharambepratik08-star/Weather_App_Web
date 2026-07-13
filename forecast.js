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
