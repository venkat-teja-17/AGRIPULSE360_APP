// UP Districts
const upDistricts = [
    "Agra", "Aligarh", "Prayagraj", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Azamgarh", "Baghpat", 
    "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", 
    "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Ayodhya", "Farrukhabad", 
    "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", 
    "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", 
    "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", 
    "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Raebareli", 
    "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", 
    "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"
];

// Indian States
const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal"
];

// State-wise Districts
const stateDistricts = {
    "Uttar Pradesh": upDistricts,
    // Add other states' districts here
};

// Crop Data for UP
const cropData = {
    wheat: {
        season: "Rabi",
        duration: 120,
        averageYield: 40, // quintals per acre
        marketPrice: 2015, // per quintal
        timeline: [
            { day: 0, stage: "Land Preparation", tasks: ["Ploughing", "Leveling", "Fertilizer application"] },
            { day: 1, stage: "Sowing", tasks: ["Seed treatment", "Sowing", "Initial irrigation"] },
            { day: 30, stage: "Vegetative Growth", tasks: ["First irrigation", "Weed control"] },
            { day: 60, stage: "Flowering", tasks: ["Second irrigation", "Disease monitoring"] },
            { day: 90, stage: "Grain Filling", tasks: ["Final irrigation", "Pest control"] },
            { day: 120, stage: "Harvesting", tasks: ["Crop cutting", "Threshing", "Storage"] }
        ]
    },
    rice: {
        season: "Kharif",
        duration: 120,
        averageYield: 45,
        marketPrice: 2040,
        timeline: [
            { day: 0, stage: "Nursery Preparation", tasks: ["Seed treatment", "Nursery sowing"] },
            { day: 25, stage: "Transplanting", tasks: ["Field preparation", "Transplanting"] },
            { day: 45, stage: "Tillering", tasks: ["Fertilizer application", "Weed management"] },
            { day: 75, stage: "Panicle Initiation", tasks: ["Disease monitoring", "Water management"] },
            { day: 95, stage: "Grain Filling", tasks: ["Pest control", "Irrigation management"] },
            { day: 120, stage: "Harvesting", tasks: ["Drainage", "Harvesting", "Post-harvest"] }
        ]
    },
    sugarcane: {
        season: "Year-round",
        duration: 360,
        averageYield: 800,
        marketPrice: 285,
        timeline: [
            { day: 0, stage: "Land Preparation", tasks: ["Deep ploughing", "Fertilizer application"] },
            { day: 7, stage: "Planting", tasks: ["Sett treatment", "Planting"] },
            { day: 90, stage: "Tillering", tasks: ["Earthing up", "Irrigation"] },
            { day: 180, stage: "Grand Growth", tasks: ["Propping", "Pest management"] },
            { day: 270, stage: "Maturity", tasks: ["Water stress", "Growth monitoring"] },
            { day: 360, stage: "Harvesting", tasks: ["Harvesting", "Transportation"] }
        ]
    },
    potato: {
        season: "Rabi",
        duration: 90,
        averageYield: 200,
        marketPrice: 1200,
        timeline: [
            { day: 0, stage: "Land Preparation", tasks: ["Ploughing", "Ridge making"] },
            { day: 1, stage: "Planting", tasks: ["Seed treatment", "Planting"] },
            { day: 30, stage: "Vegetative Growth", tasks: ["Earthing up", "Fertilization"] },
            { day: 45, stage: "Tuber Initiation", tasks: ["Disease monitoring", "Irrigation"] },
            { day: 75, stage: "Tuber Development", tasks: ["Pest control", "Final irrigation"] },
            { day: 90, stage: "Harvesting", tasks: ["Dehaulming", "Harvesting"] }
        ]
    },
    mustard: {
        season: "Rabi",
        duration: 110,
        averageYield: 15,
        marketPrice: 5050,
        timeline: [
            { day: 0, stage: "Land Preparation", tasks: ["Field preparation", "Fertilizer application"] },
            { day: 1, stage: "Sowing", tasks: ["Line sowing", "First irrigation"] },
            { day: 35, stage: "Vegetative Growth", tasks: ["Thinning", "Weed control"] },
            { day: 55, stage: "Flowering", tasks: ["Disease monitoring", "Irrigation"] },
            { day: 85, stage: "Pod Formation", tasks: ["Pest control", "Irrigation"] },
            { day: 110, stage: "Harvesting", tasks: ["Harvesting", "Threshing"] }
        ]
    }
};

// Global Variables
let currentCrop = null;
let expenses = {
    seeds: 0,
    fertilizers: 0,
    labor: 0,
    machinery: 0,
    irrigation: 0,
    pesticides: 0
};
let currentExpenseCategory = '';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadStates();
    setupEventListeners();
    updateFinancialSummary();
});

// Load States
function loadStates() {
    const stateSelect = document.getElementById('state');
    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state.toLowerCase();
        option.textContent = state;
        stateSelect.appendChild(option);
    });
}

// Load Districts based on State
function loadDistricts(state) {
    const districtSelect = document.getElementById('district');
    districtSelect.innerHTML = '<option value="">Select District</option>';
    
    const districts = stateDistricts[state] || [];
    districts.forEach(district => {
        const option = document.createElement('option');
        option.value = district.toLowerCase();
        option.textContent = district;
        districtSelect.appendChild(option);
    });
}

// Setup Event Listeners
function setupEventListeners() {
    document.getElementById('state').addEventListener('change', (e) => {
        const selectedState = e.target.options[e.target.selectedIndex].text;
        loadDistricts(selectedState);
    });
    document.getElementById('cropType').addEventListener('change', updateCropInfo);
    document.getElementById('landArea').addEventListener('input', updateFinancialSummary);
    document.getElementById('expenseForm').addEventListener('submit', handleExpenseSubmit);
}

// Update Crop Information
function updateCropInfo() {
    const cropType = document.getElementById('cropType').value;
    if (cropType) {
        currentCrop = cropData[cropType];
        updateTimeline();
        updateFinancialSummary();
    }
}

// Show Expense Modal
function showExpenseModal(category) {
    currentExpenseCategory = category;
    const modal = document.getElementById('expenseModal');
    const modalTitle = document.getElementById('modalTitle');
    modalTitle.textContent = `Add ${category.charAt(0).toUpperCase() + category.slice(1)} Expense`;
    modal.style.display = 'block';
}

// Close Expense Modal
function closeExpenseModal() {
    document.getElementById('expenseModal').style.display = 'none';
    document.getElementById('expenseForm').reset();
}

// Handle Expense Submit
function handleExpenseSubmit(e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    expenses[currentExpenseCategory] += amount;
    document.getElementById(`${currentExpenseCategory}Cost`).textContent = `₹${expenses[currentExpenseCategory]}`;
    updateFinancialSummary();
    closeExpenseModal();
}

// Update Financial Summary
function updateFinancialSummary() {
    const landArea = parseFloat(document.getElementById('landArea').value) || 0;
    
    // Calculate total cost
    const totalCost = Object.values(expenses).reduce((sum, cost) => sum + cost, 0);
    document.getElementById('totalCost').textContent = `₹${totalCost}`;

    if (currentCrop) {
        // Calculate estimated yield
        const estimatedYield = currentCrop.averageYield * landArea;
        document.getElementById('estimatedYield').textContent = `${estimatedYield} quintals`;

        // Calculate expected income
        const expectedIncome = estimatedYield * currentCrop.marketPrice;
        document.getElementById('expectedIncome').textContent = `₹${expectedIncome}`;

        // Calculate profit/loss
        const profitLoss = expectedIncome - totalCost;
        const profitLossElement = document.getElementById('profitLoss');
        profitLossElement.textContent = `₹${profitLoss}`;
        profitLossElement.style.color = profitLoss >= 0 ? 'var(--success-color)' : 'var(--danger-color)';
    }
}

// Update Timeline
function updateTimeline() {
    if (!currentCrop) return;

    const timeline = document.getElementById('cropTimeline');
    timeline.innerHTML = '';

    const startDate = new Date(document.getElementById('startDate').value);
    
    currentCrop.timeline.forEach((stage, index) => {
        const stageDate = new Date(startDate);
        stageDate.setDate(stageDate.getDate() + stage.day);

        const stageElement = document.createElement('div');
        stageElement.className = 'timeline-item';
        stageElement.innerHTML = `
            <div class="timeline-content">
                <h3>${stage.stage}</h3>
                <p class="date">${stageDate.toLocaleDateString()}</p>
                <ul>
                    ${stage.tasks.map(task => `<li>${task}</li>`).join('')}
                </ul>
            </div>
        `;
        timeline.appendChild(stageElement);
    });
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('expenseModal');
    if (event.target === modal) {
        closeExpenseModal();
    }
};
