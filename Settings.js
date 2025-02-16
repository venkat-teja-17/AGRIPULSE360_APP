// Function to open the popup
function openPopup() {
    const popup = document.getElementById("popup");
    popup.style.display = "flex"; // Show the popup
}

// Function to close the popup
function closePopup() {
    const popup = document.getElementById("popup");
    popup.style.display = "none"; // Hide the popup
}

// Function to go back (if needed)
function goBack() {
    window.history.back();
}

// Theme switcher
const themeSwitch = document.querySelector('#checkbox');
const body = document.querySelector('body');

// Check for saved theme preference
if (localStorage.getItem('theme') === 'dark') {
    body.setAttribute('data-theme', 'dark');
    themeSwitch.checked = true;
}

themeSwitch.addEventListener('change', function(e) {
    if (e.target.checked) {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    }
});

// Search functionality
const searchBtn = document.querySelector('.search-btn');
const searchBar = document.querySelector('#search-bar');
const searchInput = document.querySelector('#settings-search');
const clearSearchBtn = document.querySelector('.clear-search');
const settingsSections = document.querySelectorAll('.settings-section');

searchBtn.addEventListener('click', () => {
    searchBar.style.display = searchBar.style.display === 'flex' ? 'none' : 'flex';
    if (searchBar.style.display === 'flex') {
        searchInput.focus();
    }
});

clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    filterSettings('');
});

searchInput.addEventListener('input', (e) => {
    filterSettings(e.target.value.toLowerCase());
});

function filterSettings(query) {
    settingsSections.forEach(section => {
        const items = section.querySelectorAll('li');
        let hasVisibleItems = false;

        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(query)) {
                item.style.display = 'flex';
                hasVisibleItems = true;
            } else {
                item.style.display = 'none';
            }
        });

        section.style.display = hasVisibleItems ? 'block' : 'none';
    });
}

// Navigation
function navigateTo(url) {
    window.location.href = url;
}

// Popup handling
function openPopup(popupId) {
    const popup = document.getElementById(popupId);
    popup.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    popup.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openTermsPopup() {
    openPopup('terms-popup');
    // Load terms content dynamically
    fetch('../terms/tc.html')
        .then(response => response.text())
        .then(html => {
            document.querySelector('.terms-content').innerHTML = html;
        })
        .catch(error => {
            showToast('Failed to load terms and conditions', 'error');
        });
}

// Profile handling
function openProfilePopup() {
    openPopup('profile-popup');
}

function saveProfile() {
    // Add profile saving logic here
    showToast('Profile updated successfully', 'success');
    closePopup('profile-popup');
}

// Support chat
function openSupportChat() {
    // Implement support chat functionality
    showToast('Support chat will be available soon', 'info');
}

// Toast notifications
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Logout functionality
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Add logout logic here
        localStorage.clear();
        window.location.href = '../login.html';
    }
}

// Language selection
const languageSelect = document.querySelector('.language-select');
languageSelect.addEventListener('change', (e) => {
    const selectedLanguage = e.target.value;
    // Add language change logic here
    showToast(`Language changed to ${languageSelect.options[languageSelect.selectedIndex].text}`, 'success');
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set initial search bar state
    searchBar.style.display = 'none';

    // Add click event listeners for all buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            button.appendChild(ripple);
            setTimeout(() => ripple.remove(), 1000);
        });
    });
});