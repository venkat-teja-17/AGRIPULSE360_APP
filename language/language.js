document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('language-search');
    const languageButtons = document.querySelectorAll('.language-btn');

    // Search functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();

        languageButtons.forEach(button => {
            const languageName = button.getAttribute('data-name').toLowerCase();
            const languageText = button.textContent.toLowerCase();

            if (languageName.includes(searchTerm) || languageText.includes(searchTerm)) {
                button.style.display = 'inline-block';
            } else {
                button.style.display = 'none';
            }
        });
    });

    // Language selection event listener
    languageButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedLang = button.getAttribute('data-lang');
            const selectedName = button.getAttribute('data-name');

            // Save language preference
            localStorage.setItem('appLanguage', selectedLang);
            localStorage.setItem('appLanguageName', selectedName);

            // Update the page content
            document.querySelector('h2').textContent = `Selected Language: ${selectedName}`;
            document.querySelector('p').textContent = `AGRIPULSE360 will be displayed in ${selectedName}`;

            // Redirect to dashboard after a brief delay
            setTimeout(() => {
                window.location.href = '../dashboard/index.html';
            }, 1000);
        });
    });

    // Set initial language if exists
    const currentLang = localStorage.getItem('appLanguage');
    const currentLangName = localStorage.getItem('appLanguageName');
    if (currentLang && currentLangName) {
        document.querySelector('h2').textContent = `Selected Language: ${currentLangName}`;
        document.querySelector('p').textContent = `AGRIPULSE360 will be displayed in ${currentLangName}`;
    }
});
