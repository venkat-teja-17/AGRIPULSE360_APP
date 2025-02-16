// Get all permission toggle inputs
const permissionToggles = {
    camera: document.getElementById('camera'),
    location: document.getElementById('location'),
    storage: document.getElementById('storage'),
    microphone: document.getElementById('microphone'),
    contacts: document.getElementById('contacts')
};

// Load saved permissions when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadPermissions();
    setupPermissionListeners();
});

// Setup event listeners for all permission toggles
function setupPermissionListeners() {
    Object.entries(permissionToggles).forEach(([key, toggle]) => {
        toggle.addEventListener('change', () => {
            handlePermissionChange(key, toggle.checked);
        });
    });
}

// Handle permission change
async function handlePermissionChange(permission, isEnabled) {
    const permissionItem = document.getElementById(`${permission}Permission`);
    
    try {
        if (isEnabled) {
            // Request actual device permission
            await requestDevicePermission(permission);
            
            // Add animation class
            permissionItem.classList.add('permission-granted');
            setTimeout(() => {
                permissionItem.classList.remove('permission-granted');
            }, 300);
            
            showToast(`${permission.charAt(0).toUpperCase() + permission.slice(1)} access granted`);
        } else {
            showToast(`${permission.charAt(0).toUpperCase() + permission.slice(1)} access disabled`);
        }
        
        // Save permission state
        savePermissions();
        
    } catch (error) {
        console.error(`Error handling ${permission} permission:`, error);
        permissionToggles[permission].checked = false;
        showToast(`Unable to get ${permission} access`, 'error');
    }
}

// Request actual device permission
async function requestDevicePermission(permission) {
    switch (permission) {
        case 'camera':
            if ('mediaDevices' in navigator) {
                await navigator.mediaDevices.getUserMedia({ video: true });
            }
            break;
        case 'location':
            if ('geolocation' in navigator) {
                await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
            }
            break;
        case 'microphone':
            if ('mediaDevices' in navigator) {
                await navigator.mediaDevices.getUserMedia({ audio: true });
            }
            break;
        // Note: Storage and Contacts permissions might need different handling
        // depending on your specific implementation
    }
}

// Save permissions to localStorage
function savePermissions() {
    const permissions = {};
    Object.entries(permissionToggles).forEach(([key, toggle]) => {
        permissions[key] = toggle.checked;
    });
    localStorage.setItem('devicePermissions', JSON.stringify(permissions));
}

// Load permissions from localStorage
function loadPermissions() {
    const savedPermissions = localStorage.getItem('devicePermissions');
    if (savedPermissions) {
        const permissions = JSON.parse(savedPermissions);
        Object.entries(permissions).forEach(([key, value]) => {
            if (permissionToggles[key]) {
                permissionToggles[key].checked = value;
            }
        });
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    // Create toast if it doesn't exist
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            border-radius: 5px;
            color: white;
            font-size: 14px;
            z-index: 1000;
            transition: opacity 0.3s;
        `;
        document.body.appendChild(toast);
    }

    // Set toast style based on type
    toast.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';
    
    // Show message
    toast.textContent = message;
    toast.style.opacity = '1';
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 3000);
}

// Back button functionality
function goBack() {
    window.history.back();
}
