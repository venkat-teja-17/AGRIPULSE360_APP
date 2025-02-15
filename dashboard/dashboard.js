// DOM Elements
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggle-btn');
const searchInput = document.querySelector('.search-bar input');
const gridItems = document.querySelectorAll('.grid-item');
const notificationBell = document.querySelector('.notification-bell');

// Function to load and display user profile in sidebar
function loadSidebarProfile() {
    const sidebarUserName = document.getElementById('sidebarUserName');
    const sidebarProfileImage = document.getElementById('sidebarProfileImage');
    
    // Get user data from localStorage
    const userName = localStorage.getItem('userFullName');
    const userImage = localStorage.getItem('userProfileImage');
    
    // Update sidebar elements if data exists
    if (userName && sidebarUserName) {
        sidebarUserName.textContent = userName;
    }
    
    if (userImage && sidebarProfileImage) {
        sidebarProfileImage.src = userImage;
    }
}

// Toggle Sidebar
function toggleSidebar() {
    document.body.classList.toggle('sidebar-open');
    sidebar.classList.toggle('sidebar-hidden');
    
    // Store sidebar state in localStorage
    const isSidebarOpen = document.body.classList.contains('sidebar-open');
    localStorage.setItem('sidebarOpen', isSidebarOpen);
}

// Initialize sidebar state from localStorage
function initializeSidebar() {
    const isSidebarOpen = localStorage.getItem('sidebarOpen') === 'true';
    if (isSidebarOpen) {
        document.body.classList.add('sidebar-open');
        sidebar.classList.remove('sidebar-hidden');
    } else {
        document.body.classList.remove('sidebar-open');
        sidebar.classList.add('sidebar-hidden');
    }
}

// Initialize Toggle Button
toggleBtn.addEventListener('click', toggleSidebar);

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    const isMobile = window.innerWidth <= 768;
    const clickedOutsideSidebar = !sidebar.contains(e.target) && !toggleBtn.contains(e.target);
    
    if (isMobile && clickedOutsideSidebar && document.body.classList.contains('sidebar-open')) {
        toggleSidebar();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile && sidebar.classList.contains('sidebar-hidden')) {
        document.body.classList.remove('sidebar-open');
    }
});

// Search Functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    gridItems.forEach(item => {
        const title = item.querySelector('h3').textContent.toLowerCase();
        const description = item.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});

// Notification Bell Click Handler
notificationBell.addEventListener('click', () => {
    // You can implement notification panel logic here
    alert('Notifications feature coming soon!');
});

// Update Weather Stats
function updateWeatherStats() {
    // This is a placeholder function that would typically
    // fetch real weather data from an API
    const temperature = document.querySelector('.stat-card:nth-child(1) .stat-info p');
    const humidity = document.querySelector('.stat-card:nth-child(2) .stat-info p');
    const weather = document.querySelector('.stat-card:nth-child(3) .stat-info p');
    
    // Simulate real-time updates
    setInterval(() => {
        const temp = 20 + Math.floor(Math.random() * 10);
        const hum = 60 + Math.floor(Math.random() * 10);
        const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'];
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        
        temperature.textContent = `${temp}`;
        humidity.textContent = `${hum}`;
        weather.textContent = randomCondition;
    }, 300000); // Update every 5 minutes
}

// Add smooth scrolling to all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add loading animation to grid items
function addLoadingAnimation() {
    gridItems.forEach(item => {
        item.addEventListener('click', () => {
            item.style.opacity = '0.7';
            setTimeout(() => {
                item.style.opacity = '1';
            }, 200);
        });
    });
}

// Handle user status
function updateUserStatus() {
    const userStatus = document.querySelector('.user-status');
    // This would typically be fetched from a backend
    const status = 'Premium Member';
    userStatus.textContent = status;
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    loadSidebarProfile();

    // Listen for changes in localStorage (in case profile is updated in another tab)
    window.addEventListener('storage', (event) => {
        if (event.key === 'userFullName' || event.key === 'userProfileImage') {
            loadSidebarProfile();
        }
    });

    updateWeatherStats();
    addLoadingAnimation();
    updateUserStatus();
});