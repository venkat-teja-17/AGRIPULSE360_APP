const districts = [
    "Agra", "Aligarh", "Allahabad", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Azamgarh",
    "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi",
    "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah",
    "Faizabad", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur",
    "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi",
    "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur",
    "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad",
    "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar",
    "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"
];

const cropDatabase = {
    rice: {
        name: "Rice",
        icon: "fa-seedling",
        seasons: ["Monsoon"],
        soilTypes: ["Clay Soil", "Loamy Soil"],
        waterRequirement: "High",
        minBudget: 25000,
        temperature: { min: 20, max: 35 },
        rainfall: { min: 100, max: 200 },
        profitPotential: "High",
        duration: "120-150 days",
        tips: [
            "Maintain proper water level",
            "Use quality seeds",
            "Monitor for pests regularly",
            "Apply fertilizers as recommended"
        ]
    },
    wheat: {
        name: "Wheat",
        icon: "fa-wheat-awn",
        seasons: ["Winter"],
        soilTypes: ["Loamy Soil", "Clay Soil"],
        waterRequirement: "Medium",
        minBudget: 20000,
        temperature: { min: 15, max: 25 },
        rainfall: { min: 75, max: 100 },
        profitPotential: "Medium",
        duration: "120-150 days",
        tips: [
            "Timely sowing is crucial",
            "Proper field preparation",
            "Regular irrigation schedule",
            "Weed management in early stages"
        ]
    },
    cotton: {
        name: "Cotton",
        icon: "fa-cloud",
        seasons: ["Summer", "Monsoon"],
        soilTypes: ["Black Soil", "Loamy Soil"],
        waterRequirement: "Medium",
        minBudget: 35000,
        temperature: { min: 25, max: 35 },
        rainfall: { min: 50, max: 100 },
        profitPotential: "High",
        duration: "150-180 days",
        tips: [
            "Deep ploughing recommended",
            "Maintain proper spacing",
            "Regular pest monitoring",
            "Timely picking of cotton bolls"
        ]
    }
};

const stateDistricts = {
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
    "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem"]
};

const form = {
    landArea: document.getElementById('landArea'),
    state: document.getElementById('state'),
    district: document.getElementById('district'),
    soilType: document.getElementById('soilType'),
    season: document.getElementById('season'),
    waterAvailability: document.getElementById('waterAvailability'),
    budget: document.getElementById('budget')
};

const progressBar = document.querySelector('.progress');
const loadingSpinner = document.querySelector('.loading');

function updateProgress(percent) {
    progressBar.style.width = `${percent}%`;
}

function loadDistricts() {
    const selectedState = form.state.value;
    const districtSelect = form.district;
    
    // Clear existing options
    districtSelect.innerHTML = '<option value="">Select District</option>';
    
    if (selectedState && stateDistricts[selectedState]) {
        stateDistricts[selectedState].forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            districtSelect.appendChild(option);
        });
    }
    
    updateProgress(calculateProgress());
}

function calculateProgress() {
    const fields = Object.values(form);
    const filledFields = fields.filter(field => field.value).length;
    return (filledFields / fields.length) * 100;
}

function validateForm() {
    const requiredFields = ['landArea', 'state', 'district', 'soilType', 'season', 'waterAvailability'];
    let isValid = true;
    let firstInvalidField = null;

    requiredFields.forEach(fieldName => {
        const field = form[fieldName];
        const value = field.value.trim();
        
        if (!value) {
            field.classList.add('invalid');
            isValid = false;
            if (!firstInvalidField) firstInvalidField = field;
        } else {
            field.classList.remove('invalid');
        }
    });

    if (firstInvalidField) {
        firstInvalidField.focus();
    }

    return isValid;
}

async function fetchWeatherData(district) {
    // Simulate API call
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                temperature: Math.floor(Math.random() * (35 - 20) + 20),
                rainfall: Math.floor(Math.random() * (150 - 50) + 50),
                humidity: Math.floor(Math.random() * (90 - 40) + 40)
            });
        }, 1000);
    });
}

function updateWeatherDisplay(weather) {
    document.getElementById('temperature').textContent = `${weather.temperature}°C`;
    document.getElementById('rainfall').textContent = `${weather.rainfall} mm`;
    document.getElementById('humidity').textContent = `${weather.humidity}%`;
}

function calculateCropScore(crop, formData, weather) {
    let score = 0;
    
    // Season match
    if (crop.seasons.includes(formData.season)) score += 30;
    
    // Soil type match
    if (crop.soilTypes.includes(formData.soilType)) score += 20;
    
    // Water requirement match
    const waterScores = { "High": 3, "Medium": 2, "Low": 1 };
    if (waterScores[formData.waterAvailability] >= waterScores[crop.waterRequirement]) score += 20;
    
    // Budget check
    if (!formData.budget || formData.budget >= crop.minBudget) score += 15;
    
    // Weather suitability
    if (weather.temperature >= crop.temperature.min && 
        weather.temperature <= crop.temperature.max) score += 15;
    
    return score;
}

function createRecommendationCard(crop, score, weather) {
    return `
        <div class="recommendation-card">
            <div class="crop-header">
                <div class="crop-icon">
                    <i class="fas ${crop.icon}"></i>
                </div>
                <div class="crop-name">
                    <h3>${crop.name}</h3>
                    <p>${crop.duration}</p>
                </div>
            </div>
            <div class="crop-details">
                <div class="detail-item">
                    <i class="fas fa-tint"></i>
                    <span>Water: ${crop.waterRequirement}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-coins"></i>
                    <span>Profit: ${crop.profitPotential}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-rupee-sign"></i>
                    <span>Min Investment: ₹${crop.minBudget}/acre</span>
                </div>
            </div>
            <div class="confidence-meter">
                <div class="confidence-level" style="width: ${score}%"></div>
            </div>
            <div class="weather-match">
                <h4>Growing Tips:</h4>
                <ul>
                    ${crop.tips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

async function getRecommendations() {
    if (!validateForm()) return;

    // Show loading state
    loadingSpinner.classList.add('active');
    const recommendationsContainer = document.getElementById('recommendations-container');
    recommendationsContainer.style.display = 'none';

    // Gather form data
    const formData = {
        landArea: parseFloat(form.landArea.value),
        state: form.state.value,
        district: form.district.value,
        soilType: form.soilType.value,
        season: form.season.value,
        waterAvailability: form.waterAvailability.value,
        budget: parseFloat(form.budget.value) || 0
    };

    try {
        // Fetch weather data
        const weather = await fetchWeatherData(formData.district);
        updateWeatherDisplay(weather);

        // Calculate recommendations
        const recommendations = Object.values(cropDatabase)
            .map(crop => ({
                crop,
                score: calculateCropScore(crop, formData, weather)
            }))
            .filter(item => item.score > 50)
            .sort((a, b) => b.score - a.score);

        // Display recommendations
        const recommendationsDiv = document.getElementById('recommendations');
        recommendationsDiv.innerHTML = recommendations
            .map(item => createRecommendationCard(item.crop, item.score, weather))
            .join('');

        // Show results
        recommendationsContainer.style.display = 'block';
        recommendationsContainer.classList.add('active');
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching recommendations. Please try again.');
    } finally {
        loadingSpinner.classList.remove('active');
    }
}

Object.values(form).forEach(field => {
    field.addEventListener('change', () => {
        updateProgress(calculateProgress());
    });
});

function loadDistrictsList() {
    let districtSelect = document.getElementById("district");
    districtSelect.innerHTML = '<option value="">Select District</option>';
    districts.forEach(district => {
        let option = document.createElement("option");
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
    });
}

window.onload = loadDistrictsList;
