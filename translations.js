const translations = {
    en: {
        // Dashboard
        dashboard: "Dashboard",
        weather: "Weather",
        cropManagement: "Crop Management",
        marketPrices: "Market Prices",
        settings: "Settings",
        premium: "Premium",
        accessExclusiveFeatures: "Access exclusive features",
        learningResources: "Learning Resources",
        logout: "Logout",
        
        // Settings
        accountSettings: "Account Settings",
        language: "Language",
        notifications: "Notifications",
        help: "Help",
        
        // Common
        welcome: "Welcome",
        search: "Search",
        profile: "Profile",
    },
    hi: {
        // Dashboard
        dashboard: "डैशबोर्ड",
        weather: "मौसम",
        cropManagement: "फसल प्रबंधन",
        marketPrices: "बाजार के भाव",
        settings: "सेटिंग्स",
        premium: "प्रीमियम",
        accessExclusiveFeatures: "विशेष सुविधाओं का उपयोग करें",
        learningResources: "शिक्षण संसाधन",
        logout: "लॉग आउट",
        
        // Settings
        accountSettings: "खाता सेटिंग्स",
        language: "भाषा",
        notifications: "सूचनाएं",
        help: "सहायता",
        
        // Common
        welcome: "स्वागत है",
        search: "खोज",
        profile: "प्रोफ़ाइल",
    },
    // Add more languages as needed
};

// Function to translate the page
function translatePage() {
    const currentLang = localStorage.getItem('appLanguage') || 'en';
    const elements = document.querySelectorAll('[data-translate]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLang] && translations[currentLang][key]) {
            // Handle different element types
            if (element.tagName === 'INPUT' && element.type === 'placeholder') {
                element.placeholder = translations[currentLang][key];
            } else {
                element.textContent = translations[currentLang][key];
            }
        }
    });
}

// Function to set language
function setLanguage(lang) {
    localStorage.setItem('appLanguage', lang);
    translatePage();
}

// Initialize translation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    translatePage();
});
