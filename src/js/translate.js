// src/js/translate.js

// 1. Diccionario Manual: Se queda exactamente igual
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
    const translateSpinner = document.getElementById('translate-spinner');

    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }

    function setTranslateCookie(value) {
        document.cookie = `googtrans=${value}; path=/; domain=${window.location.hostname}`;
    }

    // NUEVA FUNCIÓN: Borra la cookie por completo para apagar Google Translate de raíz
    function deleteTranslateCookie() {
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
    }

    // 1. Detectar el idioma real según la cookie de Google
    // Si no hay cookie o no es /es/en, asumimos por defecto 'es'
    let currentLang = getCookie('googtrans') === '/es/en' ? 'en' : 'es';

    // 2. Aplicar los textos manuales del diccionario (Inicio -> Home)
    aplicarTraduccionesManuales(currentLang);

    // 3. POSICIÓN VISUAL INICIAL DEL SWITCH
    if (translateBtn) {
        if (currentLang === 'es') {
            translateBtn.classList.remove('active'); // Círculo a la izquierda (México)
        } else {
            translateBtn.classList.add('active');    // Círculo a la derecha (USA)
        }
    }

    // 4. LÓGICA DEL CLIC CORREGIDA
    if (translateBtn) {
        translateBtn.addEventListener('click', () => {
            translateBtn.style.pointerEvents = 'none';
            if (translateSpinner) translateSpinner.classList.remove('d-none');

            // SI ESTÁ EN ESPAÑOL: Traducir a INGLÉS
            if (currentLang === 'es') {
                translateBtn.classList.add('active'); 
                setTranslateCookie('/es/en'); // Activamos traducción a Inglés
            } 
            // SI ESTÁ EN INGLÉS: Regresar a ESPAÑOL apagando el traductor
            else {
                translateBtn.classList.remove('active'); 
                deleteTranslateCookie(); // ¡Aquí está la magia! Borramos la cookie para desactivar a Google
            }

            // Recarga sutil de la página para que surta efecto limpio
            setTimeout(() => {
                window.location.reload();
            }, 300);
        });
    }
});