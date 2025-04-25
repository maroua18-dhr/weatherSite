const apiKey = "a7fecaeb5ad451fddd0d095302502bf6";
let currentCityTime = null;

document.getElementById("search-btn").addEventListener("click", () => {
    const city = document.getElementById("city-input").value.trim();
    const unit = document.getElementById("unit-select").value;
    if (city !== "") {
        fetchWeather(city, unit);
    }
});

document.getElementById("show-time").addEventListener("click", () => {
    const timeBox = document.getElementById('time-box');
    const button = document.getElementById('show-time');
    
   
    if (timeBox.style.display === "none" || timeBox.style.display === "") {
        if (currentCityTime !== null) {
            formatLocalTimeAndDate(currentCityTime);
        }
        timeBox.style.display = "block";
        button.textContent = "Hide Local Time"; // Change button text to "Hide Local Time"
    } else {
        timeBox.style.display = "none";
        button.textContent = "Show Local Time"; // Change button text back to "Show Local Time"
    }
});

document.getElementById("toggle-theme").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    document.querySelector(".container").classList.toggle("dark-mode");

    document.querySelectorAll("button").forEach(button => button.classList.toggle("dark-mode"));
   
    const weatherCard = document.querySelector(".weather-card");
    if (weatherCard) weatherCard.classList.toggle("dark-mode");

    const errorEl = document.querySelector(".error-message");
    if (errorEl) errorEl.classList.toggle("dark-mode");
});

function fetchWeather(city, unit) {
    const loadingEl = document.querySelector(".loading");
    const errorEl = document.querySelector(".error-message");
    const weatherCard = document.querySelector(".weather-card");
    loadingEl.style.display = "block";
    errorEl.textContent = "";
    weatherCard.style.display = "none";

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("City not found");
            }
            return response.json();
        })
        .then((data) => {
            displayWeatherData(data, unit);
            loadingEl.style.display = "none";
            weatherCard.style.display = "block";
        })
        .catch((error) => {
            loadingEl.style.display = "none";
            errorEl.textContent = error.message;
        });
}

function displayWeatherData(data, unit) {
    const tempSymbol = unit === "metric" ? "°C" : "°F";
    document.getElementById("city-name").textContent = data.name;
    document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}${tempSymbol}`;
    document.getElementById("description").textContent = data.weather[0].description;
    document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    setWeatherBackground(data.weather[0].main);
    currentCityTime = data.timezone;

    document.getElementById("time-box").style.display = "none";
}

function setWeatherBackground(weatherMain) {
    document.body.classList.remove("clear-sky", "cloudy", "rainy", "snowy", "default-background");

    switch (weatherMain.toLowerCase()) {
        case "clear":
            document.body.classList.add("clear-sky");
            break;
        case "clouds":
            document.body.classList.add("cloudy");
            break;
        case "rain":
        case "drizzle":
        case "thunderstorm":
            document.body.classList.add("rainy");
            break;
        case "snow":
            document.body.classList.add("snowy");
            break;
        default:
            document.body.classList.add("default-background");
            break;
    }
}

function formatLocalTimeAndDate(timezoneOffset) {
    const nowUTC = new Date(new Date().toUTCString().slice(0, -4));
    const localDateTime = new Date(nowUTC.getTime() + timezoneOffset * 1000);

    const hours = localDateTime.getHours().toString().padStart(2, '0');
    const minutes = localDateTime.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;

    const dateStr = localDateTime.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    document.getElementById('local-time').textContent = timeStr;
    document.getElementById('local-date').textContent = dateStr;
}
