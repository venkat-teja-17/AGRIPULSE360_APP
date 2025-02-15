// Replace with your OpenWeatherMap API key
const API_KEY = "YOUR_WEATHER_API_KEY";

// Function to get weather data
function getWeather() {
    let location = document.getElementById("location").value;
    if (!location) {
        alert("Please enter a location.");
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`)
        .then(response => response.json())
        .then(data => {
            let temp = data.main.temp;
            let humidity = data.main.humidity;
            let rain = data.rain ? data.rain["1h"] : 0;  // Rainfall in last 1 hour

            document.getElementById("weatherInfo").innerHTML = 
                `Temperature: ${temp}°C | Humidity: ${humidity}% | Rain: ${rain}mm`;
        })
        .catch(error => alert("Error fetching weather data."));
}

// Crop Water Requirements (mm per day)
const cropWaterNeeds = {
    rice: {
        sowing: 6,
        vegetative: 8,
        flowering: 10,
        fruiting: 7,
        maturity: 4
    },
    wheat: {
        sowing: 4,
        vegetative: 5,
        flowering: 7,
        fruiting: 6,
        maturity: 3
    },
    sugarcane: {
        sowing: 6,
        vegetative: 9,
        flowering: 11,
        fruiting: 8,
        maturity: 5
    },
    cotton: {
        sowing: 5,
        vegetative: 7,
        flowering: 9,
        fruiting: 8,
        maturity: 4
    },
    maize: {
        sowing: 4,
        vegetative: 6,
        flowering: 8,
        fruiting: 7,
        maturity: 3
    },
    potato: {
        sowing: 4,
        vegetative: 5,
        flowering: 6,
        fruiting: 5,
        maturity: 3
    }
};

// Weather Adjustment Factors
const weatherFactors = {
    temperature: {
        high: 1.2,    // Increase water needs by 20%
        normal: 1.0,
        low: 0.8      // Decrease water needs by 20%
    },
    humidity: {
        high: 0.8,
        normal: 1.0,
        low: 1.2
    },
    rainfall: {
        heavy: 0.5,
        moderate: 0.8,
        light: 1.0,
        none: 1.2
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadStatesAndDistricts();
    setupEventListeners();
    updateMoistureMeter();
});

// Load States and Districts
function loadStatesAndDistricts() {
    const stateSelect = document.getElementById('state');
    const states = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
        "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
        "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
        "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ];

    // State-wise districts mapping
    const stateDistricts = {
        "Uttar Pradesh": [
            "Agra", "Aligarh", "Prayagraj", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Azamgarh", "Baghpat",
            "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor",
            "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Ayodhya", "Farrukhabad",
            "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur",
            "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar",
            "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri",
            "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Raebareli",
            "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar",
            "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"
        ]
        // Add other states' districts here as needed
    };

    // Load states dropdown
    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state.toLowerCase().replace(/\s+/g, '-');
        option.textContent = state;
        stateSelect.appendChild(option);
    });

    // Add event listener for state change
    stateSelect.addEventListener('change', function() {
        const selectedState = this.options[this.selectedIndex].text;
        const districtSelect = document.getElementById('district');
        districtSelect.innerHTML = '<option value="">Select District</option>';

        // Load districts for selected state
        const districts = stateDistricts[selectedState] || [];
        districts.forEach(district => {
            const option = document.createElement('option');
            option.value = district.toLowerCase().replace(/\s+/g, '-');
            option.textContent = district;
            districtSelect.appendChild(option);
        });
    });
}

// Setup Event Listeners
function setupEventListeners() {
    document.getElementById('state').addEventListener('change', updateWeatherInfo);
    document.getElementById('crop').addEventListener('change', updateRecommendations);
    document.getElementById('cropStage').addEventListener('change', updateRecommendations);
    document.getElementById('soilMoisture').addEventListener('input', updateMoistureMeter);
    document.getElementById('waterSource').addEventListener('change', updateRecommendations);
    document.getElementById('waterQuality').addEventListener('change', updateRecommendations);
    document.getElementById('reminderForm').addEventListener('submit', handleReminderSubmit);
}

// Update Moisture Meter
function updateMoistureMeter() {
    const moisture = document.getElementById('soilMoisture').value;
    document.getElementById('moistureValue').textContent = `${moisture}%`;
    
    const status = document.getElementById('moistureStatus');
    if (moisture < 30) {
        status.textContent = 'Critical - Immediate Irrigation Needed';
        status.style.color = 'var(--danger-color)';
    } else if (moisture < 50) {
        status.textContent = 'Low - Plan Irrigation Soon';
        status.style.color = 'var(--warning-color)';
    } else if (moisture > 80) {
        status.textContent = 'High - Risk of Waterlogging';
        status.style.color = 'var(--warning-color)';
    } else {
        status.textContent = 'Optimal Moisture Level';
        status.style.color = 'var(--success-color)';
    }
}

// Update Weather Information
async function updateWeatherInfo() {
    const state = document.getElementById('state').value;
    const district = document.getElementById('district').value;
    
    try {
        // Simulate weather API call
        const weatherInfo = await getWeatherData(state, district);
        displayWeatherInfo(weatherInfo);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// Simulate Weather API Call
async function getWeatherData(state, district) {
    // In a real application, this would be an API call
    return {
        temperature: 28,
        humidity: 65,
        rainfall: 0,
        forecast: "Clear sky with moderate humidity"
    };
}

// Display Weather Information
function displayWeatherInfo(weather) {
    const weatherInfo = document.getElementById('weatherInfo');
    weatherInfo.innerHTML = `
        <div class="weather-details">
            <p><i class="fas fa-temperature-high"></i> Temperature: ${weather.temperature}°C</p>
            <p><i class="fas fa-tint"></i> Humidity: ${weather.humidity}%</p>
            <p><i class="fas fa-cloud-rain"></i> Rainfall: ${weather.rainfall}mm</p>
            <p><i class="fas fa-cloud"></i> Forecast: ${weather.forecast}</p>
        </div>
    `;
}

// Generate Irrigation Schedule
function generateSchedule() {
    const crop = document.getElementById('crop').value;
    const stage = document.getElementById('cropStage').value;
    const moisture = document.getElementById('soilMoisture').value;
    
    const schedule = calculateIrrigationSchedule(crop, stage, moisture);
    displaySchedule(schedule);
}

// Calculate Irrigation Schedule
function calculateIrrigationSchedule(crop, stage, moisture) {
    const waterNeed = cropWaterNeeds[crop][stage];
    const currentDate = new Date();
    const schedule = [];

    for (let i = 0; i < 7; i++) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() + i);
        
        schedule.push({
            date: date,
            waterAmount: waterNeed,
            duration: Math.round(waterNeed * 10) // minutes
        });
    }

    return schedule;
}

// Display Schedule
function displaySchedule(schedule) {
    const scheduleContainer = document.getElementById('irrigationSchedule');
    scheduleContainer.innerHTML = schedule.map(item => `
        <div class="schedule-item">
            <div class="schedule-date">${item.date.toLocaleDateString()}</div>
            <div class="schedule-details">
                <p>Water Amount: ${item.waterAmount}mm</p>
                <p>Duration: ${item.duration} minutes</p>
            </div>
        </div>
    `).join('');
}

// Show Reminder Modal
function setReminder() {
    document.getElementById('notificationModal').style.display = 'block';
}

// Handle Reminder Submit
function handleReminderSubmit(e) {
    e.preventDefault();
    const date = document.getElementById('reminderDate').value;
    const time = document.getElementById('reminderTime').value;
    const note = document.getElementById('reminderNote').value;

    // In a real application, this would set up notifications
    alert(`Reminder set for ${date} at ${time}`);
    
    document.getElementById('notificationModal').style.display = 'none';
    document.getElementById('reminderForm').reset();
}

// Update Recommendations
function updateRecommendations() {
    const crop = document.getElementById('crop').value;
    const stage = document.getElementById('cropStage').value;
    const waterSource = document.getElementById('waterSource').value;
    const waterQuality = document.getElementById('waterQuality').value;

    if (!crop || !stage) return;

    const recommendations = generateRecommendations(crop, stage, waterSource, waterQuality);
    displayRecommendations(recommendations);
}

// Generate Recommendations
function generateRecommendations(crop, stage, waterSource, waterQuality) {
    const baseWaterNeed = cropWaterNeeds[crop][stage];
    
    const recommendations = {
        waterNeed: `${baseWaterNeed}mm per day`,
        frequency: getIrrigationFrequency(crop, stage),
        method: getIrrigationMethod(crop, waterSource),
        conservation: getConservationTips(waterSource, waterQuality)
    };

    return recommendations;
}

// Get Irrigation Frequency
function getIrrigationFrequency(crop, stage) {
    const frequencies = {
        rice: { sowing: "Daily", vegetative: "Every 2-3 days", flowering: "Daily", fruiting: "Every 2 days", maturity: "As needed" },
        wheat: { sowing: "Every 2 days", vegetative: "Every 3-4 days", flowering: "Every 2 days", fruiting: "Every 3 days", maturity: "As needed" }
        // Add more crops as needed
    };

    return frequencies[crop]?.[stage] || "Every 2-3 days";
}

// Get Irrigation Method
function getIrrigationMethod(crop, waterSource) {
    const methods = {
        rice: "Flood irrigation",
        wheat: "Sprinkler or Furrow irrigation",
        sugarcane: "Drip or Furrow irrigation",
        cotton: "Drip irrigation",
        maize: "Sprinkler or Furrow irrigation",
        potato: "Drip or Sprinkler irrigation"
    };

    return methods[crop] || "Drip irrigation recommended for water conservation";
}

// Get Conservation Tips
function getConservationTips(waterSource, waterQuality) {
    const tips = [
        "Use mulching to reduce evaporation",
        "Irrigate during early morning or evening",
        "Maintain proper field leveling",
        "Regular monitoring of soil moisture",
        "Fix leaks in irrigation system promptly"
    ];

    if (waterQuality === 'poor') {
        tips.push("Consider water treatment or filtration");
    }

    if (waterSource === 'rainwater') {
        tips.push("Install additional storage capacity");
    }

    return tips;
}

// Display Recommendations
function displayRecommendations(recommendations) {
    const waterRecommendation = document.getElementById('waterRecommendation');
    const conservationTips = document.getElementById('conservationTips');

    waterRecommendation.innerHTML = `
        <h3><i class="fas fa-tint"></i> Water Requirements</h3>
        <ul>
            <li>Daily Water Need: ${recommendations.waterNeed}</li>
            <li>Irrigation Frequency: ${recommendations.frequency}</li>
            <li>Recommended Method: ${recommendations.method}</li>
        </ul>
    `;

    conservationTips.innerHTML = `
        <h3><i class="fas fa-leaf"></i> Conservation Tips</h3>
        <ul>
            ${recommendations.conservation.map(tip => `<li>${tip}</li>`).join('')}
        </ul>
    `;
}

// Close Modal
window.onclick = function(event) {
    const modal = document.getElementById('notificationModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Water requirement data based on crop, stage, and season
const waterRequirements = {
    "wheat": {
        "summer": { "land_preparation": 40, "sowing": 50, "fertilization": 70, "harvesting": 30 },
        "winter": { "land_preparation": 30, "sowing": 40, "fertilization": 60, "harvesting": 20 },
        "monsoon": { "land_preparation": 20, "sowing": 30, "fertilization": 50, "harvesting": 10 }
    },
    "rice": {
        "summer": { "land_preparation": 60, "sowing": 80, "fertilization": 100, "harvesting": 50 },
        "winter": { "land_preparation": 40, "sowing": 60, "fertilization": 80, "harvesting": 30 },
        "monsoon": { "land_preparation": 20, "sowing": 40, "fertilization": 60, "harvesting": 20 }
    }
};

// Function to give water recommendation and correction
function getWaterRecommendation() {
    let crop = document.getElementById("crop").value;
    let season = document.getElementById("season").value;
    let stage = document.getElementById("stage").value;
    let moisture = parseInt(document.getElementById("moisture").value);

    let requiredMoisture = waterRequirements[crop][season][stage];
    let recommendation = "";
    let correction = "";

    if (moisture < requiredMoisture - 10) {
        recommendation = "🚨 Increase irrigation, soil moisture is too low.";
        correction = "✔ Correction: Water the field in the early morning or late evening to reduce evaporation.";
    } else if (moisture >= requiredMoisture - 10 && moisture <= requiredMoisture + 10) {
        recommendation = "✅ Moisture is optimal, no extra irrigation needed.";
        correction = "✔ Correction: Maintain the current irrigation schedule.";
    } else {
        recommendation = "❌ Soil moisture is too high, reduce watering.";
        correction = "✔ Correction: Improve drainage, reduce watering frequency, or let the soil dry naturally.";
    }

    document.getElementById("recommendation").innerHTML = recommendation;
    document.getElementById("correction").innerHTML = correction;
}
