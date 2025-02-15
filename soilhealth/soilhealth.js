// Constants and Configuration
const STORAGE_KEY = 'soilHealthHistory';
const MAX_HISTORY_ITEMS = 10;

const soilParameters = {
    pH: { min: 6.0, max: 7.5, unit: '', weight: 1.0 },
    moisture: { min: 40, max: 60, unit: '%', weight: 0.8 },
    nitrogen: { min: 30, max: 100, unit: '%', weight: 0.7 },
    phosphorus: { min: 30, max: 100, unit: '%', weight: 0.7 },
    potassium: { min: 30, max: 100, unit: '%', weight: 0.7 }
};

const cropRecommendations = {
    excellent: [
        { name: 'Tomatoes', conditions: 'All conditions optimal' },
        { name: 'Leafy Greens', conditions: 'Perfect for rapid growth' },
        { name: 'Corn', conditions: 'Ideal NPK levels' }
    ],
    good: [
        { name: 'Beans', conditions: 'Tolerant to slight variations' },
        { name: 'Potatoes', conditions: 'Adaptable to good conditions' },
        { name: 'Squash', conditions: 'Hardy in various conditions' }
    ],
    poor: [
        { name: 'Cover Crops', conditions: 'To improve soil health' },
        { name: 'Legumes', conditions: 'To fix nitrogen' },
        { name: 'Hardy Herbs', conditions: 'Tolerant to poor conditions' }
    ]
};

// Initialize charts and UI
let npkChart, historyChart;

document.addEventListener('DOMContentLoaded', function() {
    initializeUI();
    loadHistory();
    updateStatus();
    initializeCharts();
    setupEventListeners();
    loadQuickTips();
    initializeWeatherWidget();
    setupHelpModal();
});

function initializeUI() {
    // Initialize input method toggle
    const inputToggle = document.querySelector('.input-toggle');
    if (inputToggle) {
        inputToggle.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                document.querySelectorAll('.input-toggle button').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                const method = e.target.dataset.method;
                document.getElementById('manualInput').style.display = method === 'manual' ? 'block' : 'none';
                document.getElementById('sensorInput').style.display = method === 'sensor' ? 'block' : 'none';
            }
        });
    }

    // Initialize sliders with event listeners
    Object.keys(soilParameters).forEach(param => {
        const slider = document.getElementById(param);
        if (slider) {
            slider.addEventListener('input', updateStatus);
            slider.addEventListener('change', () => {
                updateStatus();
                saveToHistory();
            });
        }
    });
}

function setupEventListeners() {
    // Export button
    const exportBtn = document.getElementById('exportData');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportData);
    }

    // Sensor buttons
    const connectSensorBtn = document.getElementById('connectSensor');
    const readSensorBtn = document.getElementById('readSensor');
    
    if (connectSensorBtn && readSensorBtn) {
        connectSensorBtn.addEventListener('click', connectSensor);
        readSensorBtn.addEventListener('click', readSensorData);
    }
}

// Main update function
function updateStatus() {
    try {
        const values = getSoilValues();
        updateSliderValues(values);
        const conditions = checkSoilConditions(values);
        updateHealthMeter(conditions.overallScore);
        updateNPKChart(values);
        updateRecommendations(conditions);
        updateUI(conditions);
    } catch (error) {
        console.error('Error updating soil status:', error);
        displayError('An error occurred while analyzing soil conditions.');
    }
}

// Get values from sliders
function getSoilValues() {
    const values = {};
    for (const param in soilParameters) {
        const element = document.getElementById(param);
        if (!element) {
            throw new Error(`Element with id "${param}" not found`);
        }
        values[param] = parseFloat(element.value);
    }
    return values;
}

// Update displayed values
function updateSliderValues(values) {
    for (const [param, value] of Object.entries(values)) {
        const valueElement = document.getElementById(`${param}Value`);
        if (valueElement) {
            valueElement.innerText = value + soilParameters[param].unit;
        }
    }
}

// Check soil conditions and calculate scores
function checkSoilConditions(values) {
    let totalScore = 0;
    let maxPossibleScore = 0;
    const details = {};

    for (const [param, value] of Object.entries(values)) {
        const { min, max, weight } = soilParameters[param];
        const isGood = value >= min && value <= max;
        const score = isGood ? weight : (value < min ? weight * value/min : weight * max/value);
        
        totalScore += score;
        maxPossibleScore += weight;
        
        details[param] = {
            value,
            isGood,
            isTooLow: value < min,
            isTooHigh: value > max,
            score
        };
    }

    const overallScore = (totalScore / maxPossibleScore) * 100;
    
    return {
        details,
        overallScore,
        status: overallScore >= 80 ? 'excellent' : overallScore >= 60 ? 'good' : 'poor'
    };
}

// Update Health Meter
function updateHealthMeter(score) {
    const meterFill = document.querySelector('.meter-fill');
    if (meterFill) {
        meterFill.style.width = `${score}%`;
    }
}

// Initialize Charts
function initializeCharts() {
    // NPK Chart
    const npkCtx = document.getElementById('npkChart');
    if (npkCtx) {
        npkChart = new Chart(npkCtx, {
            type: 'radar',
            data: {
                labels: ['Nitrogen', 'Phosphorus', 'Potassium'],
                datasets: [{
                    label: 'Current Levels',
                    data: [0, 0, 0],
                    backgroundColor: 'rgba(42, 122, 42, 0.2)',
                    borderColor: 'rgba(42, 122, 42, 1)',
                    pointBackgroundColor: 'rgba(42, 122, 42, 1)'
                }]
            },
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    // History Chart
    const historyCtx = document.getElementById('historyChart');
    if (historyCtx) {
        historyChart = new Chart(historyCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Soil Health Score',
                    data: [],
                    borderColor: 'rgba(42, 122, 42, 1)',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
}

// Update NPK Chart
function updateNPKChart(values) {
    if (npkChart) {
        npkChart.data.datasets[0].data = [
            values.nitrogen,
            values.phosphorus,
            values.potassium
        ];
        npkChart.update();
    }
}

// History Management
function saveToHistory() {
    const values = getSoilValues();
    const conditions = checkSoilConditions(values);
    const timestamp = new Date().toISOString();

    let history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    history.unshift({
        timestamp,
        values,
        score: conditions.overallScore,
        status: conditions.status
    });

    history = history.slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));

    updateHistoryDisplay();
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    updateHistoryDisplay(history);
}

function updateHistoryDisplay(history = null) {
    if (!history) {
        history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    }

    // Update history chart
    if (historyChart) {
        historyChart.data.labels = history.map(item => 
            new Date(item.timestamp).toLocaleDateString()
        );
        historyChart.data.datasets[0].data = history.map(item => item.score);
        historyChart.update();
    }

    // Update history table
    const tbody = document.getElementById('historyTableBody');
    if (tbody) {
        tbody.innerHTML = history.map(item => `
            <tr>
                <td>${new Date(item.timestamp).toLocaleDateString()}</td>
                <td>${item.values.pH}</td>
                <td>${item.values.moisture}%</td>
                <td>${item.values.nitrogen}%</td>
                <td>${item.values.phosphorus}%</td>
                <td>${item.values.potassium}%</td>
                <td class="${item.status}">${item.status.charAt(0).toUpperCase() + item.status.slice(1)}</td>
            </tr>
        `).join('');
    }
}

// Export functionality
function exportData() {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const csv = [
        ['Date', 'pH', 'Moisture', 'Nitrogen', 'Phosphorus', 'Potassium', 'Score', 'Status'],
        ...history.map(item => [
            new Date(item.timestamp).toLocaleDateString(),
            item.values.pH,
            item.values.moisture,
            item.values.nitrogen,
            item.values.phosphorus,
            item.values.potassium,
            item.score.toFixed(2),
            item.status
        ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'soil_health_history.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Sensor Integration
function connectSensor() {
    const connectBtn = document.getElementById('connectSensor');
    const readBtn = document.getElementById('readSensor');
    const status = document.getElementById('sensorStatus');

    // Simulated sensor connection
    connectBtn.disabled = true;
    status.textContent = 'Connecting...';

    setTimeout(() => {
        connectBtn.disabled = false;
        readBtn.disabled = false;
        status.textContent = 'Connected';
        status.style.color = 'green';
    }, 2000);
}

function readSensorData() {
    const status = document.getElementById('sensorStatus');
    status.textContent = 'Reading data...';

    // Simulated sensor reading
    setTimeout(() => {
        const mockData = {
            pH: (Math.random() * (7.5 - 6.0) + 6.0).toFixed(1),
            moisture: Math.floor(Math.random() * (60 - 40) + 40),
            nitrogen: Math.floor(Math.random() * (80 - 30) + 30),
            phosphorus: Math.floor(Math.random() * (80 - 30) + 30),
            potassium: Math.floor(Math.random() * (80 - 30) + 30)
        };

        Object.entries(mockData).forEach(([param, value]) => {
            const slider = document.getElementById(param);
            if (slider) {
                slider.value = value;
            }
        });

        updateStatus();
        status.textContent = 'Data updated';
    }, 1500);
}

// Weather Integration
function initializeWeatherWidget() {
    // Simulated weather data
    const temperature = Math.floor(Math.random() * (30 - 20) + 20);
    const humidity = Math.floor(Math.random() * (80 - 40) + 40);

    const tempElement = document.getElementById('temperature');
    const humidityElement = document.getElementById('humidity');

    if (tempElement && humidityElement) {
        tempElement.textContent = `${temperature}°C`;
        humidityElement.textContent = `${humidity}% Humidity`;
    }
}

// Help Modal
function setupHelpModal() {
    const modal = document.getElementById('helpModal');
    const btn = document.getElementById('helpBtn');
    const span = document.querySelector('.close');
    const content = document.querySelector('.help-content');

    if (modal && btn && span && content) {
        btn.onclick = () => {
            modal.style.display = 'block';
            content.innerHTML = `
                <h3>How to Use the Soil Health Analyzer</h3>
                <ol>
                    <li>Choose your input method: manual sliders or sensor data</li>
                    <li>Adjust values or connect a sensor to input data</li>
                    <li>View real-time analysis of soil health</li>
                    <li>Check recommendations based on soil conditions</li>
                    <li>Track historical data and export if needed</li>
                </ol>
                <h3>Understanding the Metrics</h3>
                <ul>
                    <li><strong>pH:</strong> Measures soil acidity (0-14)</li>
                    <li><strong>Moisture:</strong> Water content percentage</li>
                    <li><strong>NPK:</strong> Essential nutrients for plant growth</li>
                </ul>
            `;
        };

        span.onclick = () => modal.style.display = 'none';
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    }
}

// Quick Tips
function loadQuickTips() {
    const quickTips = [
        'Test soil regularly for best results',
        'Maintain proper drainage for optimal moisture',
        'Add organic matter to improve soil structure',
        'Consider crop rotation for soil health',
        'Monitor pH levels for nutrient availability'
    ];

    const quickTipsList = document.getElementById('quickTips');
    if (quickTipsList) {
        quickTipsList.innerHTML = quickTips.map(tip => `<li>${tip}</li>`).join('');
    }
}

// Error handling
function displayError(message) {
    console.error(message);
    const status = document.getElementById('status');
    if (status) {
        status.textContent = 'Error ⚠️';
        status.className = 'status error';
    }
}