// API Keys (Replace with your actual API keys)
const WEATHER_API_KEY = 'YOUR_OPENWEATHER_API_KEY';
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

// Global variables
let map;
let currentLocation = {
    lat: null,
    lon: null
};

// DOM Elements
const currentTemp = document.getElementById('current-temp');
const weatherCondition = document.getElementById('weather-condition');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const locationDisplay = document.getElementById('current-location');
const forecastContainer = document.getElementById('forecast-container');
const weatherAlerts = document.getElementById('weather-alerts');
const cropRecommendations = document.getElementById('crop-recommendations');
const irrigationAdvisory = document.getElementById('irrigation-advisory');
const pestAlert = document.getElementById('pest-alert');
const farmingCalendar = document.getElementById('farming-calendar');
const soilTemp = document.getElementById('soil-temp');
const soilMoisture = document.getElementById('soil-moisture');
const uvIndex = document.getElementById('uv-index');
const precipitation = document.getElementById('precipitation');

// Initialize the application
async function initApp() {
    await getCurrentLocation();
    initMap();
    setupEventListeners();
    loadSettings();
    startWeatherUpdates();
}

// Get current location
async function getCurrentLocation() {
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        currentLocation.lat = position.coords.latitude;
        currentLocation.lon = position.coords.longitude;

        // Get location name using reverse geocoding
        const response = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${currentLocation.lat}&lon=${currentLocation.lon}&limit=1&appid=${WEATHER_API_KEY}`);
        const data = await response.json();
        locationDisplay.textContent = `${data[0].name}, ${data[0].country}`;

        // Fetch weather data
        await fetchWeatherData();
    } catch (error) {
        console.error('Error getting location:', error);
        locationDisplay.textContent = 'Location access denied';
    }
}

// Fetch weather data from OpenWeather API
async function fetchWeatherData() {
    try {
        // Current weather
        const currentWeatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${currentLocation.lat}&lon=${currentLocation.lon}&units=metric&appid=${WEATHER_API_KEY}`
        );
        const currentWeatherData = await currentWeatherResponse.json();

        // One Call API for forecast, alerts, and more
        const oneCallResponse = await fetch(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${currentLocation.lat}&lon=${currentLocation.lon}&units=metric&appid=${WEATHER_API_KEY}`
        );
        const oneCallData = await oneCallResponse.json();

        updateWeatherDisplay(currentWeatherData, oneCallData);
        updateForecast(oneCallData.daily);
        updateAlerts(oneCallData.alerts);
        updateFarmingInsights(oneCallData);
        updateSoilConditions(oneCallData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// Update weather display
function updateWeatherDisplay(current, oneCall) {
    currentTemp.textContent = Math.round(current.main.temp);
    weatherCondition.textContent = current.weather[0].description;
    humidity.textContent = current.main.humidity;
    windSpeed.textContent = Math.round(current.wind.speed * 3.6); // Convert m/s to km/h

    // Update weather icon
    const weatherIcon = document.querySelector('.weather-icon i');
    updateWeatherIcon(weatherIcon, current.weather[0].id);
}

// Update weather icon based on condition code
function updateWeatherIcon(iconElement, conditionCode) {
    const iconMap = {
        2: 'fa-bolt',           // Thunderstorm
        3: 'fa-cloud-rain',     // Drizzle
        5: 'fa-cloud-showers-heavy', // Rain
        6: 'fa-snowflake',      // Snow
        7: 'fa-smog',           // Atmosphere
        800: 'fa-sun',          // Clear
        8: 'fa-cloud'           // Clouds
    };

    let iconClass = 'fa-sun'; // Default
    Object.keys(iconMap).forEach(code => {
        if (conditionCode.toString().startsWith(code)) {
            iconClass = iconMap[code];
        }
    });

    iconElement.className = `fas ${iconClass}`;
}

// Update 7-day forecast
function updateForecast(dailyForecast) {
    forecastContainer.innerHTML = '';
    
    dailyForecast.slice(1, 8).forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';
        forecastCard.innerHTML = `
            <div class="day">${dayName}</div>
            <i class="fas fa-sun"></i>
            <div class="temp">
                <span class="high">${Math.round(day.temp.max)}°</span>
                <span class="low">${Math.round(day.temp.min)}°</span>
            </div>
            <div class="condition">${day.weather[0].description}</div>
        `;
        
        forecastContainer.appendChild(forecastCard);
    });
}

// Update weather alerts
function updateAlerts(alerts = []) {
    weatherAlerts.innerHTML = '';
    
    if (alerts.length === 0) {
        weatherAlerts.innerHTML = '<div class="alert">No current weather alerts</div>';
        return;
    }

    alerts.forEach(alert => {
        const alertElement = document.createElement('div');
        alertElement.className = 'alert';
        alertElement.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <div>
                <h4>${alert.event}</h4>
                <p>${alert.description}</p>
            </div>
        `;
        weatherAlerts.appendChild(alertElement);
    });
}

// Update farming insights based on weather data
function updateFarmingInsights(weatherData) {
    // Crop recommendations based on weather conditions
    const temp = weatherData.current.temp;
    const humidity = weatherData.current.humidity;
    
    let crops = [];
    if (temp > 25 && humidity > 60) {
        crops = ['Rice', 'Sugarcane', 'Cotton'];
    } else if (temp > 20 && humidity > 40) {
        crops = ['Wheat', 'Corn', 'Soybeans'];
    } else {
        crops = ['Potatoes', 'Peas', 'Carrots'];
    }
    
    cropRecommendations.innerHTML = `
        <ul>
            ${crops.map(crop => `<li>${crop}</li>`).join('')}
        </ul>
    `;

    // Irrigation advisory
    const willRain = weatherData.daily[0].pop > 0.5;
    irrigationAdvisory.innerHTML = willRain ? 
        '<p class="advisory-text">Natural rainfall expected. Hold irrigation.</p>' :
        '<p class="advisory-text">No rainfall expected. Consider irrigation based on soil moisture.</p>';

    // Pest alert based on temperature and humidity
    const pestRisk = assessPestRisk(temp, humidity);
    pestAlert.innerHTML = `
        <p class="risk-level ${pestRisk.level}">${pestRisk.message}</p>
        <ul>
            ${pestRisk.pests.map(pest => `<li>${pest}</li>`).join('')}
        </ul>
    `;

    // Farming calendar
    updateFarmingCalendar();
}

// Assess pest risk based on weather conditions
function assessPestRisk(temperature, humidity) {
    if (temperature > 25 && humidity > 70) {
        return {
            level: 'high',
            message: 'High pest risk. Monitor crops closely.',
            pests: ['Aphids', 'Whiteflies', 'Fungal diseases']
        };
    } else if (temperature > 20 && humidity > 60) {
        return {
            level: 'medium',
            message: 'Moderate pest risk. Regular monitoring advised.',
            pests: ['Caterpillars', 'Mites']
        };
    } else {
        return {
            level: 'low',
            message: 'Low pest risk. Continue routine monitoring.',
            pests: ['Watch for early signs of common pests']
        };
    }
}

// Update farming calendar based on season and local conditions
function updateFarmingCalendar() {
    const currentMonth = new Date().getMonth();
    const seasons = {
        winter: [11, 0, 1],
        spring: [2, 3, 4],
        summer: [5, 6, 7],
        autumn: [8, 9, 10]
    };

    let currentSeason;
    Object.entries(seasons).forEach(([season, months]) => {
        if (months.includes(currentMonth)) {
            currentSeason = season;
        }
    });

    const seasonalTasks = getSeasonalTasks(currentSeason);
    farmingCalendar.innerHTML = `
        <div class="calendar-content">
            <h4>${currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)} Tasks:</h4>
            <ul>
                ${seasonalTasks.map(task => `<li>${task}</li>`).join('')}
            </ul>
        </div>
    `;
}

// Get seasonal farming tasks
function getSeasonalTasks(season) {
    const tasks = {
        winter: [
            'Prepare soil for spring planting',
            'Maintain greenhouse crops',
            'Check stored produce',
            'Repair farming equipment'
        ],
        spring: [
            'Start planting summer crops',
            'Apply fertilizers',
            'Set up irrigation systems',
            'Monitor frost warnings'
        ],
        summer: [
            'Regular irrigation',
            'Pest monitoring and control',
            'Harvest mature crops',
            'Plan for autumn planting'
        ],
        autumn: [
            'Harvest remaining crops',
            'Soil testing and amendments',
            'Plant winter crops',
            'Prepare greenhouses'
        ]
    };
    return tasks[season] || [];
}

// Update soil conditions
function updateSoilConditions(weatherData) {
    // Simulate soil temperature (usually 2-3°C less than air temperature)
    const soilTemperature = weatherData.current.temp - 2.5;
    soilTemp.textContent = Math.round(soilTemperature);

    // Estimate soil moisture based on recent precipitation
    const recentPrecipitation = weatherData.daily[0].rain || 0;
    const estimatedMoisture = Math.min(100, Math.round((recentPrecipitation / 25) * 100));
    soilMoisture.textContent = estimatedMoisture;

    // UV Index
    uvIndex.textContent = weatherData.current.uvi;

    // Precipitation probability
    precipitation.textContent = Math.round(weatherData.daily[0].pop * 100);
}

// Initialize Google Maps
function initMap() {
    if (!currentLocation.lat || !currentLocation.lon) return;

    map = new google.maps.Map(document.getElementById('weather-map'), {
        center: { lat: currentLocation.lat, lng: currentLocation.lon },
        zoom: 10
    });

    // Add weather layer
    const weatherLayer = new google.maps.weather.WeatherLayer({
        temperatureUnits: google.maps.weather.TemperatureUnit.CELSIUS
    });
    weatherLayer.setMap(map);
}

// Setup event listeners
function setupEventListeners() {
    // Map button
    document.getElementById('show-map').addEventListener('click', () => {
        document.getElementById('weather-map-modal').style.display = 'block';
        if (map) {
            google.maps.event.trigger(map, 'resize');
        }
    });

    // Settings button
    document.getElementById('show-settings').addEventListener('click', () => {
        document.getElementById('settings-modal').style.display = 'block';
    });

    // Close buttons
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.modal').style.display = 'none';
        });
    });

    // Settings form
    document.getElementById('temp-unit').addEventListener('change', saveSettings);
    document.getElementById('language').addEventListener('change', saveSettings);
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', saveSettings);
    });
}

// Save user settings
function saveSettings() {
    const settings = {
        tempUnit: document.getElementById('temp-unit').value,
        language: document.getElementById('language').value,
        notifications: {
            extremeWeather: document.getElementById('notify-extreme-weather').checked,
            dailyForecast: document.getElementById('notify-daily-forecast').checked
        }
    };
    localStorage.setItem('weatherSettings', JSON.stringify(settings));
    applySettings(settings);
}

// Load user settings
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('weatherSettings')) || {
        tempUnit: 'celsius',
        language: 'en',
        notifications: {
            extremeWeather: true,
            dailyForecast: false
        }
    };
    
    document.getElementById('temp-unit').value = settings.tempUnit;
    document.getElementById('language').value = settings.language;
    document.getElementById('notify-extreme-weather').checked = settings.notifications.extremeWeather;
    document.getElementById('notify-daily-forecast').checked = settings.notifications.dailyForecast;
    
    applySettings(settings);
}

// Apply settings to the UI
function applySettings(settings) {
    // Temperature unit conversion
    if (settings.tempUnit === 'fahrenheit') {
        // Convert all temperature displays to Fahrenheit
        convertTemperatures('C', 'F');
    }

    // Language
    if (settings.language !== 'en') {
        translateUI(settings.language);
    }
}

// Start periodic weather updates
function startWeatherUpdates() {
    // Update weather data every 30 minutes
    setInterval(fetchWeatherData, 30 * 60 * 1000);
    
    // Update time-sensitive information every minute
    setInterval(() => {
        updateFarmingCalendar();
    }, 60 * 1000);
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', initApp);
