const openWeatherAPIKey = "437ee608f57e4cb33069a1c0a398fa3b";
const googleServerAPIKey = "AIzaSyAZOSPmuSbcCc6Cr-qka7GDEoo5YcW5mes";

function fetchWeather(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherAPIKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById("temperature").innerText = `Temperature: ${data.main.temp}°C`;
            document.getElementById("description").innerText = `Description: ${data.weather[0].description}`;
        })
        .catch(error => console.error("Error fetching weather data:", error));
}

function fetchLocationName(lat, lon) {
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${googleServerAPIKey}`;

    fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data.status === "OK" && data.results.length > 0) {
                document.getElementById("location").innerText = `Location: ${data.results[0].formatted_address}`;
            } else {
                document.getElementById("location").innerText = "Location not found.";
            }
        })
        .catch(error => console.error("Error fetching location name:", error));
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchLocationName(lat, lon);
            fetchWeather(lat, lon);
        }, () => {
            document.getElementById("location").innerText = "Location access denied.";
        });
    } else {
        document.getElementById("location").innerText = "Geolocation not supported.";
    }
}

function getWeeklyWeather() {
    alert("Fetching weekly data (to be implemented)");
}

window.onload = getLocation;
