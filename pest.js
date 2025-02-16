// Comprehensive crop database with diseases and seasonal information
const cropDatabase = {
    rice: {
        diseases: {
            'Bacterial Leaf Blight': {
                symptoms: ['Yellow to white lesions along leaf veins', 'Wilting', 'Leaf curling', 'Pale yellow leaves'],
                treatment: [
                    'Use disease-resistant varieties',
                    'Apply copper-based bactericides',
                    'Maintain proper field drainage',
                    'Remove infected plants'
                ],
                prevention: [
                    'Use certified disease-free seeds',
                    'Practice crop rotation',
                    'Maintain proper spacing between plants',
                    'Avoid excessive nitrogen fertilization'
                ],
                seasons: ['Kharif']
            },
            'Rice Blast': {
                symptoms: ['Diamond-shaped lesions', 'White to gray centers', 'Brown borders', 'Infected panicles'],
                treatment: [
                    'Apply fungicides containing tricyclazole',
                    'Improve field drainage',
                    'Balance nitrogen fertilization',
                    'Remove infected plant parts'
                ],
                prevention: [
                    'Use resistant varieties',
                    'Avoid excessive nitrogen',
                    'Maintain proper water management',
                    'Time planting to avoid peak disease periods'
                ],
                seasons: ['Kharif', 'Rabi']
            },
            'Brown Spot': {
                symptoms: ['Oval or circular brown spots', 'Dark brown margins', 'Yellow halo', 'Infected grains'],
                treatment: [
                    'Apply appropriate fungicides',
                    'Correct soil nutrient deficiencies',
                    'Proper irrigation management',
                    'Remove infected debris'
                ],
                prevention: [
                    'Use healthy seeds',
                    'Maintain balanced soil fertility',
                    'Proper spacing',
                    'Crop rotation'
                ],
                seasons: ['Kharif']
            }
        },
        seasons: ['Kharif', 'Rabi']
    },
    wheat: {
        diseases: {
            'Leaf Rust': {
                symptoms: ['Orange-brown pustules on leaves', 'Circular to oval lesions', 'Premature leaf drying'],
                treatment: [
                    'Apply fungicides with propiconazole',
                    'Remove infected plant debris',
                    'Improve air circulation',
                    'Early harvest if severe'
                ],
                prevention: [
                    'Plant resistant varieties',
                    'Early sowing',
                    'Proper spacing',
                    'Monitor regularly'
                ],
                seasons: ['Rabi']
            },
            'Powdery Mildew': {
                symptoms: ['White powdery patches on leaves', 'Yellowing of leaves', 'Reduced grain quality'],
                treatment: [
                    'Apply sulfur-based fungicides',
                    'Remove infected parts',
                    'Improve ventilation',
                    'Balanced fertilization'
                ],
                prevention: [
                    'Use resistant cultivars',
                    'Avoid overhead irrigation',
                    'Proper plant spacing',
                    'Optimal sowing time'
                ],
                seasons: ['Rabi']
            }
        },
        seasons: ['Rabi']
    },
    cotton: {
        diseases: {
            'Bacterial Blight': {
                symptoms: ['Angular leaf spots', 'Dark brown lesions', 'Boll rot', 'Stem blackening'],
                treatment: [
                    'Copper oxychloride spray',
                    'Remove infected plants',
                    'Improve drainage',
                    'Balanced fertilization'
                ],
                prevention: [
                    'Use resistant varieties',
                    'Crop rotation',
                    'Clean cultivation',
                    'Proper spacing'
                ],
                seasons: ['Kharif']
            },
            'Fusarium Wilt': {
                symptoms: ['Yellowing of leaves', 'Wilting', 'Vascular browning', 'Stunted growth'],
                treatment: [
                    'Soil solarization',
                    'Biological control agents',
                    'Proper irrigation',
                    'Remove affected plants'
                ],
                prevention: [
                    'Resistant varieties',
                    'Crop rotation',
                    'Soil pH management',
                    'Clean cultivation'
                ],
                seasons: ['Kharif']
            }
        },
        seasons: ['Kharif']
    },
    sugarcane: {
        diseases: {
            'Red Rot': {
                symptoms: ['Red patches in stem', 'Dried leaves', 'Internal tissue reddening', 'White spots'],
                treatment: [
                    'Remove infected plants',
                    'Hot water treatment of setts',
                    'Proper field drainage',
                    'Balanced fertilization'
                ],
                prevention: [
                    'Use healthy setts',
                    'Resistant varieties',
                    'Crop rotation',
                    'Field sanitation'
                ],
                seasons: ['All']
            },
            'Smut': {
                symptoms: ['Black whip-like structures', 'Stunted growth', 'Thin stalks', 'Multiple shoots'],
                treatment: [
                    'Remove smut whips',
                    'Rogue out infected plants',
                    'Hot water treatment',
                    'Fungicide application'
                ],
                prevention: [
                    'Disease-free setts',
                    'Resistant varieties',
                    'Field sanitation',
                    'Proper spacing'
                ],
                seasons: ['All']
            }
        },
        seasons: ['All']
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeCropSelect();
    setupImageUpload();
    setupDragAndDrop();
});

// Initialize crop selection dropdown
function initializeCropSelect() {
    const cropSelect = document.getElementById('cropSelect');
    cropSelect.innerHTML = '<option value="">-- Select Crop --</option>';
    
    Object.keys(cropDatabase).forEach(crop => {
        const option = document.createElement('option');
        option.value = crop;
        option.textContent = crop.charAt(0).toUpperCase() + crop.slice(1);
        cropSelect.appendChild(option);
    });

    // Add event listener for crop selection
    cropSelect.addEventListener('change', updateSeasonSelect);
}

// Update season selection based on selected crop
function updateSeasonSelect() {
    const cropSelect = document.getElementById('cropSelect');
    const seasonSelect = document.getElementById('seasonSelect');
    const selectedCrop = cropSelect.value;

    seasonSelect.innerHTML = '<option value="">-- Select Season --</option>';

    if (selectedCrop && cropDatabase[selectedCrop]) {
        const seasons = cropDatabase[selectedCrop].seasons;
        seasons.forEach(season => {
            const option = document.createElement('option');
            option.value = season.toLowerCase();
            option.textContent = season;
            seasonSelect.appendChild(option);
        });
    }
}

// Setup image upload functionality
function setupImageUpload() {
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const retakeButton = document.getElementById('retakeButton');
    const analysisSection = document.getElementById('analysisSection');

    imageInput.addEventListener('change', function(e) {
        if (validateSelection()) {
            handleImageSelection(e.target.files[0]);
        }
    });

    retakeButton.addEventListener('click', function() {
        imageInput.value = '';
        imagePreview.classList.add('hidden');
        analysisSection.classList.add('hidden');
    });
}

// Validate crop and season selection
function validateSelection() {
    const cropSelect = document.getElementById('cropSelect');
    const seasonSelect = document.getElementById('seasonSelect');

    if (!cropSelect.value) {
        alert('Please select a crop first');
        return false;
    }
    if (!seasonSelect.value) {
        alert('Please select a growing season');
        return false;
    }
    return true;
}

// Setup drag and drop functionality
function setupDragAndDrop() {
    const dragDropArea = document.getElementById('dragDropArea');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dragDropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dragDropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dragDropArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        if (validateSelection()) {
            dragDropArea.classList.add('drag-over');
        }
    }

    function unhighlight(e) {
        dragDropArea.classList.remove('drag-over');
    }

    dragDropArea.addEventListener('drop', handleDrop, false);
}

function handleDrop(e) {
    if (validateSelection()) {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        handleImageSelection(file);
    }
}

// Handle image selection and analysis
function handleImageSelection(file) {
    if (!file || !file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
    }

    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const analysisSection = document.getElementById('analysisSection');
    const reader = new FileReader();

    reader.onload = function(e) {
        previewImg.src = e.target.result;
        imagePreview.classList.remove('hidden');
        analysisSection.classList.remove('hidden');
        analyzeImage(file);
    };

    reader.readAsDataURL(file);
}

// Analyze image and detect disease
function analyzeImage(file) {
    const loadingSpinner = document.querySelector('.loading-spinner');
    const resultsContainer = document.querySelector('.results-container');
    
    loadingSpinner.classList.remove('hidden');
    resultsContainer.classList.add('hidden');

    // Get selected crop and season
    const selectedCrop = document.getElementById('cropSelect').value;
    const selectedSeason = document.getElementById('seasonSelect').value;

    // Simulate API call delay
    setTimeout(() => {
        const diseases = cropDatabase[selectedCrop].diseases;
        // Filter diseases by season if applicable
        const seasonalDiseases = Object.entries(diseases).filter(([_, disease]) => 
            disease.seasons.includes('All') || disease.seasons.includes(selectedSeason)
        );
        
        if (seasonalDiseases.length > 0) {
            const [diseaseName, diseaseInfo] = seasonalDiseases[Math.floor(Math.random() * seasonalDiseases.length)];
            displayResults(diseaseName, diseaseInfo);
        } else {
            alert('No common diseases found for this crop in the selected season');
        }
    }, 2000);
}

// Display analysis results
function displayResults(diseaseName, diseaseInfo) {
    const loadingSpinner = document.querySelector('.loading-spinner');
    const resultsContainer = document.querySelector('.results-container');
    const diseaseNameElement = document.getElementById('diseaseName');
    const confidenceBar = document.getElementById('confidenceBar');
    const confidenceValue = document.getElementById('confidenceValue');
    const treatmentList = document.getElementById('treatmentList');
    const preventionList = document.getElementById('preventionList');

    // Update disease name and confidence
    diseaseNameElement.textContent = diseaseName;
    const confidence = Math.floor(Math.random() * 20) + 80; // Random confidence between 80-99%
    confidenceBar.style.width = `${confidence}%`;
    confidenceValue.textContent = `${confidence}% Confidence`;

    // Update treatments
    treatmentList.innerHTML = diseaseInfo.treatment
        .map(treatment => `<li>${treatment}</li>`)
        .join('');

    // Update prevention tips
    preventionList.innerHTML = diseaseInfo.prevention
        .map(tip => `<li>${tip}</li>`)
        .join('');

    // Show results with animation
    loadingSpinner.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
    resultsContainer.style.opacity = '0';
    resultsContainer.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        resultsContainer.style.transition = 'all 0.5s ease-out';
        resultsContainer.style.opacity = '1';
        resultsContainer.style.transform = 'translateY(0)';
    }, 100);

    // Add to history
    addToHistory(diseaseName, diseaseInfo);
}

// Add detection to history
function addToHistory(diseaseName, diseaseInfo) {
    const historyGrid = document.getElementById('detectionHistory');
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    const crop = document.getElementById('cropSelect').options[document.getElementById('cropSelect').selectedIndex].text;
    const season = document.getElementById('seasonSelect').value;

    historyItem.innerHTML = `
        <div style="background: var(--card-background); padding: 1rem; border-radius: var(--border-radius); 
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1); cursor: pointer;">
            <h4>${diseaseName}</h4>
            <p>Crop: ${crop}</p>
            <p>Season: ${season}</p>
            <p>Detected: ${new Date().toLocaleDateString()}</p>
        </div>
    `;

    historyItem.addEventListener('click', () => showDetailedModal(diseaseName, diseaseInfo, crop, season));
    historyGrid.insertBefore(historyItem, historyGrid.firstChild);
}

// Show detailed modal
function showDetailedModal(diseaseName, diseaseInfo, crop, season) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <h3>${diseaseName}</h3>
        <p><strong>Crop:</strong> ${crop}</p>
        <p><strong>Season:</strong> ${season}</p>
        <div style="margin-top: 1rem;">
            <h4>Symptoms:</h4>
            <ul>${diseaseInfo.symptoms.map(symptom => `<li>${symptom}</li>`).join('')}</ul>
            
            <h4>Treatment:</h4>
            <ul>${diseaseInfo.treatment.map(treatment => `<li>${treatment}</li>`).join('')}</ul>
            
            <h4>Prevention:</h4>
            <ul>${diseaseInfo.prevention.map(prevention => `<li>${prevention}</li>`).join('')}</ul>
        </div>
    `;

    modal.classList.remove('hidden');

    // Close modal when clicking outside or on close button
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    document.querySelector('.close-modal').addEventListener('click', () => {
        modal.classList.add('hidden');
    });
}
