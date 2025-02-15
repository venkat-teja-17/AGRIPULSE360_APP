// Get all the elements
const pushNotifications = document.getElementById('pushNotifications');
const emailNotifications = document.getElementById('emailNotifications');
const notificationSound = document.getElementById('notificationSound');
const volumeSlider = document.getElementById('volumeSlider');
const volumeValue = document.getElementById('volumeValue');
const soundType = document.getElementById('soundType');

// Load saved settings when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
});

// Save settings when they change
pushNotifications.addEventListener('change', saveSettings);
emailNotifications.addEventListener('change', saveSettings);
notificationSound.addEventListener('change', saveSettings);
volumeSlider.addEventListener('input', updateVolumeValue);
volumeSlider.addEventListener('change', saveSettings);
soundType.addEventListener('change', saveSettings);

// Update volume value display
function updateVolumeValue() {
    volumeValue.textContent = volumeSlider.value + '%';
}

// Save all settings to localStorage
function saveSettings() {
    const settings = {
        pushNotifications: pushNotifications.checked,
        emailNotifications: emailNotifications.checked,
        notificationSound: notificationSound.checked,
        volume: volumeSlider.value,
        soundType: soundType.value
    };
    
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    showSaveIndicator();
}

// Load settings from localStorage
function loadSettings() {
    const savedSettings = localStorage.getItem('notificationSettings');
    
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        pushNotifications.checked = settings.pushNotifications;
        emailNotifications.checked = settings.emailNotifications;
        notificationSound.checked = settings.notificationSound;
        volumeSlider.value = settings.volume;
        soundType.value = settings.soundType;
        
        updateVolumeValue();
    }
}

// Show a brief "Settings saved" indicator
function showSaveIndicator() {
    // Create indicator if it doesn't exist
    let indicator = document.getElementById('saveIndicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'saveIndicator';
        indicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        document.body.appendChild(indicator);
    }
    
    // Show the indicator
    indicator.textContent = 'Settings saved';
    indicator.style.opacity = '1';
    
    // Hide after 2 seconds
    setTimeout(() => {
        indicator.style.opacity = '0';
    }, 2000);
}

// Back button functionality
function goBack() {
    window.history.back();
}
