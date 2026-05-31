// src/js/translate.js

// 1. Diccionario Manual: Define aquí tus textos críticos
const diccionario = {
    'nav-home': { es: 'Inicio', en: 'Home' }
    /*
    'nav-services': { es: 'Servicios', en: 'Services' },
    'nav-about': { es: 'Sobre Nosotros', en: 'About Us' },
    'nav-contact': { es: 'Contacto', en: 'Contact' }
    */
};

// Función para aplicar las traducciones manuales
function aplicarTraduccionesManuales(lang) {
    Object.keys(diccionario).forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.textContent = diccionario[id][lang];
        }
    });
}

// Inicializar Google Translate (oculto)
window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
        pageLanguage: 'es',
        includedLanguages: 'en,es',
        autoDisplay: false
    }, 'google_translate_element');
};

const script = document.createElement('script');
script.type = 'text/javascript';
script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
document.head.appendChild(script);

document.addEventListener('DOMContentLoaded', () => {
    const translateBtn = document.getElementById('translate-btn');
    const translateText = document.getElementById('translate-text');
    const translateSpinner = document.getElementById('translate-spinner');

    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }

    function setTranslateCookie(value) {
        document.cookie = `googtrans=${value}; path=/; domain=${window.location.hostname}`;
    }

    // 1. Determinar el idioma
    let currentLang = getCookie('googtrans') === '/es/en' ? 'en' : 'es';

    // 2. APLICAR TRADUCCIÓN MANUAL AL INSTANTE (Sin esperar a Google)
    aplicarTraduccionesManuales(currentLang);

    // Ajustar el texto del botón
    if (translateText) {
        translateText.textContent = currentLang === 'es' ? 'Translate to English' : 'Ver en Español';
    }

    // 3. Lógica del botón con recarga
    if (translateBtn) {
        translateBtn.addEventListener('click', () => {
            translateBtn.disabled = true;
            translateSpinner.classList.remove('d-none');
            translateText.textContent = 'Traduciendo...';

            if (currentLang === 'es') {
                setTranslateCookie('/es/en');
            } else {
                setTranslateCookie('/es/es');
            }

            setTimeout(() => {
                window.location.reload();
            }, 300);
        });
    }
});