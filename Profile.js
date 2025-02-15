// Get DOM elements
const profileImage = document.getElementById('profileImage');
const imageUpload = document.getElementById('imageUpload');
const allInputs = document.querySelectorAll('.input-group input');
const saveButton = document.getElementById('saveButton');
const cancelButton = document.getElementById('cancelButton');
const emailInput = document.getElementById('email');
const displayName = document.getElementById('displayName');
const fullNameInput = document.getElementById('fullName');

// Store original values for cancel functionality
let originalValues = {};

// Update display name when full name changes
fullNameInput.addEventListener('input', function() {
    displayName.textContent = this.value || 'User Name';
});

// Add click event to profile picture for upload
document.querySelector('.profile-pic').addEventListener('click', () => {
    imageUpload.click();
});

// Handle image upload
imageUpload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profileImage.src = e.target.result;
            // Save image to localStorage
            localStorage.setItem('profileImage', e.target.result);
            showToast('Profile picture updated successfully');
        };
        reader.readAsDataURL(file);
    }
});

// Load saved user data
window.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    loadProfileData();
});

// Load user data from localStorage
function loadUserData() {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
        displayName.textContent = savedName;
        fullNameInput.value = savedName;
    }
    
    // Load other saved form data
    const savedData = JSON.parse(localStorage.getItem('userData')) || {};
    Object.keys(savedData).forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.value = savedData[id];
            originalValues[id] = savedData[id];
        }
    });
}

// Save user data to localStorage
function saveUserData() {
    const userData = {};
    allInputs.forEach(input => {
        userData[input.id] = input.value;
        originalValues[input.id] = input.value;
    });
    
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('userName', fullNameInput.value);
    displayName.textContent = fullNameInput.value;
}

// Toggle edit mode
function toggleEditMode() {
    const isDisabled = allInputs[0].disabled;
    
    // Store original values before enabling edit
    if (isDisabled) {
        allInputs.forEach(input => {
            originalValues[input.id] = input.value;
        });
    }
    
    // Toggle input fields
    allInputs.forEach(input => {
        input.disabled = !isDisabled;
    });
    
    // Show/hide action buttons
    saveButton.style.display = isDisabled ? 'flex' : 'none';
    cancelButton.style.display = isDisabled ? 'flex' : 'none';
    
    // Add focus to first input if enabling
    if (!isDisabled) {
        allInputs[0].focus();
    }
}

// Save profile changes
function saveProfile() {
    saveUserData();
    toggleEditMode();
    showToast('Profile updated successfully');
}

// Cancel edit
function cancelEdit() {
    // Restore original values
    allInputs.forEach(input => {
        input.value = originalValues[input.id] || '';
        input.disabled = true;
    });
    
    // Hide action buttons
    saveButton.style.display = 'none';
    cancelButton.style.display = 'none';
    
    displayName.textContent = originalValues['fullName'] || 'User Name';
    showToast('Changes cancelled');
}

// Load saved profile data
function loadProfileData() {
    // Load profile image
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
        profileImage.src = savedImage;
    }
    
    // Load profile data
    const savedData = localStorage.getItem('profileData');
    if (savedData) {
        const profileData = JSON.parse(savedData);
        Object.keys(profileData).forEach(key => {
            const input = document.getElementById(key);
            if (input) {
                input.value = profileData[key];
            }
        });
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    let toast = document.querySelector('.toast');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';
    toast.style.opacity = '1';
    
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 3000);
}

// Back button functionality
function goBack() {
    window.history.back();
}

// Email input event listener
emailInput.addEventListener('input', function () {
    console.log('Email entered:', this.value);
});