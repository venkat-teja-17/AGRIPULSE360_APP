const cropData = {
    wheat: { name: "Wheat", sowing: "October - December", growth: "120-150 days", harvest: "March - May" },
    rice: { name: "Rice", sowing: "June - July", growth: "100-180 days", harvest: "November - December" },
    corn: { name: "Corn", sowing: "April - June", growth: "60-100 days", harvest: "July - October" },
    soybean: { name: "Soybean", sowing: "May - June", growth: "80-120 days", harvest: "September - October" },
    maize: { name: "Maize", sowing: "June - July", growth: "90-120 days", harvest: "September - October" },
    sugarcane: { name: "Sugarcane", sowing: "February - March", growth: "10-16 months", harvest: "November - February" },
    pulses: { name: "Pulses", sowing: "October - November", growth: "90-120 days", harvest: "February - April" },
    horticulture: { name: "Horticultural Crops", sowing: "Varies", growth: "Varies", harvest: "Varies" }
};

function getCropDetails() {
    const selectedCrop = document.getElementById("cropSelect").value;
    const detailsDiv = document.getElementById("cropDetails");
    const details = cropData[selectedCrop];
    
    if (details) {
        detailsDiv.innerHTML = `
            <p><strong>Name:</strong> ${details.name}</p>
            <p><strong>Sowing Period:</strong> ${details.sowing}</p>
            <p><strong>Growth Duration:</strong> ${details.growth}</p>
            <p><strong>Harvest Time:</strong> ${details.harvest}</p>
        `;
        
        // Remove and re-add show class to trigger animation
        detailsDiv.classList.remove("show");
        setTimeout(() => {
            detailsDiv.classList.add("show");
        }, 10);
    }
}

// Initialize with first crop's details
document.addEventListener("DOMContentLoaded", () => {
    getCropDetails();
});
