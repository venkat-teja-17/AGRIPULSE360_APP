const cropsData = {
    en: [
        {
            name: "Wheat",
            sowing: "October-November",
            growth: "Grows in 120-150 days",
            harvest: "March-April"
        },
        {
            name: "Rice",
            sowing: "May-June",
            growth: "Grows in 90-120 days",
            harvest: "September-October"
        }
    ],
    hi: [
        {
            name: "गेहूं",
            sowing: "अक्टूबर-नवंबर",
            growth: "120-150 दिनों में बढ़ता है",
            harvest: "मार्च-अप्रैल"
        },
        {
            name: "चावल",
            sowing: "मई-जून",
            growth: "90-120 दिनों में बढ़ता है",
            harvest: "सितंबर-अक्टूबर"
        }
    ]
};

let currentLanguage = 'en';

function displayCrops() {
    const cropListContainer = document.getElementById('cropList');
    cropListContainer.innerHTML = ''; // Clear previous list

    const crops = cropsData[currentLanguage];

    crops.forEach(crop => {
        const cropItem = document.createElement('div');
        cropItem.classList.add('crop-item');
        cropItem.innerHTML = `
            <h2>${crop.name}</h2>
            <p><strong>Sowing:</strong> ${crop.sowing}</p>
            <p><strong>Growth:</strong> ${crop.growth}</p>
            <p><strong>Harvest:</strong> ${crop.harvest}</p>
        `;
        cropListContainer.appendChild(cropItem);
    });
}

function searchCrop() {
    const searchQuery = document.getElementById('searchBar').value.toLowerCase();
    const cropListContainer = document.getElementById('cropList');
    cropListContainer.innerHTML = ''; // Clear previous list

    const crops = cropsData[currentLanguage];
    const filteredCrops = crops.filter(crop => crop.name.toLowerCase().includes(searchQuery));

    filteredCrops.forEach(crop => {
        const cropItem = document.createElement('div');
        cropItem.classList.add('crop-item');
        cropItem.innerHTML = `
            <h2>${crop.name}</h2>
            <p><strong>Sowing:</strong> ${crop.sowing}</p>
            <p><strong>Growth:</strong> ${crop.growth}</p>
            <p><strong>Harvest:</strong> ${crop.harvest}</p>
        `;
        cropListContainer.appendChild(cropItem);
    });

    if (filteredCrops.length === 0) {
        cropListContainer.innerHTML = '<p>No crops found</p>';
    }
}

function changeLanguage() {
    currentLanguage = document.getElementById('language').value;
    displayCrops(); // Refresh the crops when the language changes
}

// Initial load
displayCrops();
