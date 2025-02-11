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

function loadDistricts() {
    let districtSelect = document.getElementById("district");
    districtSelect.innerHTML = '<option value="">Select District</option>';
    districts.forEach(district => {
        let option = document.createElement("option");
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
    });
}

function getRecommendations() {
    let season = document.getElementById("season").value;
    let soilType = document.getElementById("soilType").value;
    let waterAvailability = document.getElementById("waterAvailability").value;

    let recommendations = [];

    if (season === "Monsoon (July - October)" && soilType.includes("Clay")) {
        recommendations = [
            { name: "Rice", img: "https://upload.wikimedia.org/wikipedia/commons/6/67/Rice_grains.jpg" },
            { name: "Sugarcane", img: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Sugarcane_field.jpg" }
        ];
    } else if (season === "Winter (November - February)" && soilType.includes("Loamy")) {
        recommendations = [
            { name: "Wheat", img: "https://upload.wikimedia.org/wikipedia/commons/6/64/Wheat_seed.jpg" },
            { name: "Mustard", img: "https://upload.wikimedia.org/wikipedia/commons/5/55/Mustard_crop.jpg" }
        ];
    } else if (season === "Summer (March - June)" && soilType.includes("Sandy")) {
        recommendations = [
            { name: "Cotton", img: "https://upload.wikimedia.org/wikipedia/commons/8/85/Cotton_plant.jpg" },
            { name: "Groundnut", img: "https://upload.wikimedia.org/wikipedia/commons/2/28/Groundnuts.jpg" }
        ];
    } else {
        recommendations = [{ name: "No suitable crops found", img: "" }];
    }

    displayRecommendations(recommendations);
}

function displayRecommendations(crops) {
    let container = document.getElementById("recommendations");
    container.innerHTML = "";
    
    crops.forEach(crop => {
        let cropDiv = document.createElement("div");
        cropDiv.classList.add("crop");
        cropDiv.innerHTML = `
            <img src="${crop.img}" alt="${crop.name}">
            <p>${crop.name}</p>
        `;
        container.appendChild(cropDiv);
    });
}

window.onload = loadDistricts;
