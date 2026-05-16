// i18n.js
// Handles language switching for the site

document.addEventListener('DOMContentLoaded', () => {
    // Determine initial language
    let currentLang = localStorage.getItem('site_lang');
    if (!currentLang) {
        // Fallback to browser language if available and supported
        const browserLang = navigator.language.slice(0, 2);
        currentLang = (browserLang === 'es') ? 'es' : 'en';
    }

    // Apply the language on load
    setLanguage(currentLang);

    // Setup toggle buttons
    const toggleBtns = document.querySelectorAll('.lang-toggle-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const newLang = btn.getAttribute('data-lang');
            setLanguage(newLang);
        });
    });
});

function setLanguage(lang) {
    if (!window.translations || !window.translations[lang]) {
        console.error('Translations not found for language:', lang);
        return;
    }

    // Save preference
    localStorage.setItem('site_lang', lang);
    document.documentElement.lang = lang;

    // Update active state on toggle buttons
    document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = window.translations[lang][key];
        
        if (translation) {
            // Check if element has children that are not just text (like the gradient span in hero title)
            // For safety, we use innerHTML to allow tags like <strong> and <span> within translations
            el.innerHTML = translation;
        } else {
            console.warn(`Translation key missing: ${key} for language: ${lang}`);
        }
    });
}
