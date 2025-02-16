// Get DOM elements
const profileImage = document.getElementById('profileImage');
const imageUpload = document.getElementById('imageUpload');
const allInputs = document.querySelectorAll('.input-group input');
const saveButton = document.getElementById('saveButton');
const cancelButton = document.getElementById('cancelButton');
const emailInput = document.getElementById('email');
const displayName = document.getElementById('displayName');
const fullNameInput = document.getElementById('fullName');

// Global variables to track edit mode and original data
let isEditMode = false;
let originalData = {};

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
            alert('Profile picture updated successfully');
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

// Function to save profile data
function saveProfile() {
    try {
        // Get all form values
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();
        const acresOwned = document.getElementById('acres-owned').value;
        const acresCultivating = document.getElementById('acres-cultivating').value;
        const crops = document.getElementById('crops').value.trim();
        const experience = document.getElementById('experience').value;

        // Validate required fields
        if (!fullName) {
            alert('Please enter your full name');
            return;
        }

        // Create profile data object
        const profileData = {
            fullName,
            email,
            phone,
            address,
            acresOwned,
            acresCultivating,
            crops,
            experience
        };

        // Save to localStorage
        localStorage.setItem('userProfileData', JSON.stringify(profileData));
        localStorage.setItem('userFullName', fullName);

        // Save profile image if it has been changed
        const profileImage = document.getElementById('profileImage');
        if (profileImage.src && !profileImage.src.includes('profile.png')) {
            localStorage.setItem('userProfileImage', profileImage.src);
        }

        // Update display name
        const displayName = document.getElementById('displayName');
        displayName.textContent = fullName;

        // Disable all inputs
        const inputs = document.querySelectorAll('.profile-form input');
        inputs.forEach(input => {
            input.disabled = true;
        });

        // Hide action buttons
        document.getElementById('saveButton').style.display = 'none';
        document.getElementById('cancelButton').style.display = 'none';

        // Reset edit button
        const editBtn = document.querySelector('.edit-btn');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';

        // Exit edit mode
        isEditMode = false;

        // Show success message
        alert('Profile updated successfully!');

        // Trigger storage event for other tabs
        window.dispatchEvent(new Event('storage'));
    } catch (error) {
        console.error('Error saving profile:', error);
        alert('Error saving profile. Please try again.');
    }
}

// Function to toggle edit mode
function toggleEditMode() {
    const inputs = document.querySelectorAll('.profile-form input');
    const saveButton = document.getElementById('saveButton');
    const cancelButton = document.getElementById('cancelButton');
    const editBtn = document.querySelector('.edit-btn');

    isEditMode = !isEditMode;

    if (isEditMode) {
        // Store original values
        inputs.forEach(input => {
            originalData[input.id] = input.value;
        });
        originalData.profileImage = document.getElementById('profileImage').src;

        // Enable inputs
        inputs.forEach(input => {
            input.disabled = false;
        });

        // Show action buttons
        saveButton.style.display = 'block';
        cancelButton.style.display = 'block';
        editBtn.innerHTML = '<i class="fas fa-times"></i>';
    } else {
        // Disable inputs
        inputs.forEach(input => {
            input.disabled = true;
        });

        // Hide action buttons
        saveButton.style.display = 'none';
        cancelButton.style.display = 'none';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    }
}

// Function to cancel editing
function cancelEdit() {
    // Restore original values
    const inputs = document.querySelectorAll('.profile-form input');
    inputs.forEach(input => {
        if (originalData[input.id]) {
            input.value = originalData[input.id];
        }
    });

    // Restore original image
    if (originalData.profileImage) {
        document.getElementById('profileImage').src = originalData.profileImage;
    }

    // Disable all inputs
    inputs.forEach(input => {
        input.disabled = true;
    });

    // Hide action buttons
    document.getElementById('saveButton').style.display = 'none';
    document.getElementById('cancelButton').style.display = 'none';

    // Reset edit button
    document.querySelector('.edit-btn').innerHTML = '<i class="fas fa-edit"></i>';

    // Exit edit mode
    isEditMode = false;

    alert('Changes cancelled');
}

// Function to handle image upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const profileImage = document.getElementById('profileImage');
            profileImage.src = e.target.result;
        };
        reader.onerror = function() {
            alert('Error reading image file');
        };
        reader.readAsDataURL(file);
    }
}

// Function to load saved profile data
function loadProfileData() {
    try {
        // Load profile data
        const savedData = localStorage.getItem('userProfileData');
        if (savedData) {
            const profileData = JSON.parse(savedData);
            
            // Update input fields
            Object.keys(profileData).forEach(key => {
                const input = document.getElementById(key);
                if (input) {
                    input.value = profileData[key];
                }
            });

            // Update display name
            const displayName = document.getElementById('displayName');
            if (displayName) {
                displayName.textContent = profileData.fullName || 'User Name';
            }
        }

        // Load profile image
        const savedImage = localStorage.getItem('userProfileImage');
        if (savedImage) {
            const profileImage = document.getElementById('profileImage');
            if (profileImage) {
                profileImage.src = savedImage;
            }
        }
    } catch (error) {
        console.error('Error loading profile data:', error);
    }
}

// Function to go back
function goBack() {
    window.history.back();
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Set up image upload
    const imageUpload = document.getElementById('imageUpload');
    const profilePicContainer = document.querySelector('.profile-pic-container');
    
    if (profilePicContainer && imageUpload) {
        profilePicContainer.addEventListener('click', () => {
            if (isEditMode) {
                imageUpload.click();
            }
        });
        
        imageUpload.addEventListener('change', handleImageUpload);
    }
    
    // Load saved profile data
    loadProfileData();
});

// Email input event listener
emailInput.addEventListener('input', function () {
    console.log('Email entered:', this.value);
});