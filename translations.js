

// Function to get the current language from localStorage
function getCurrentLanguage() {
    return localStorage.getItem('appLanguage') || 'en';
}

// Function to set language and broadcast change
function setLanguage(lang) {
    if (translations[lang]) {
        localStorage.setItem('appLanguage', lang);
        // Broadcast the language change event
        const event = new CustomEvent('languageChanged', { detail: { language: lang } });
        window.dispatchEvent(event);
        // Also trigger storage event for other tabs/windows
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'appLanguage',
            newValue: lang,
            storageArea: localStorage
        }));
        translatePage();
        return true;
    }
    return false;
}

// Function to translate the page
function translatePage() {
    const currentLang = getCurrentLanguage();
    const elements = document.querySelectorAll('[data-translate]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLang] && translations[currentLang][key]) {
            if (element.tagName === 'INPUT' && element.getAttribute('placeholder')) {
                element.placeholder = translations[currentLang][key];
            } else {
                element.textContent = translations[currentLang][key];
            }
        }
    });

    // Update HTML lang attribute
    document.documentElement.lang = currentLang;

    // Update direction for RTL languages if needed
    document.documentElement.dir = currentLang === 'ur' ? 'rtl' : 'ltr';
}

// Initialize translation system
function initTranslationSystem() {
    // Initial translation
    translatePage();

    // Listen for language changes
    window.addEventListener('languageChanged', (event) => {
        translatePage();
    });

    // Listen for storage changes (works across tabs/windows)
    window.addEventListener('storage', (event) => {
        if (event.key === 'appLanguage') {
            translatePage();
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initTranslationSystem);

// Export functions for use in other files
window.translations = translations;
window.getCurrentLanguage = getCurrentLanguage;
window.setLanguage = setLanguage;
window.translatePage = translatePage;
