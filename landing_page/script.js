const translations = {
    es: {
        nav_features: "Características",
        nav_reviews: "Opiniones",
        nav_download: "Descargar",
        nav_contact: "Contacto",
        hero_title: "Domina el campo de batalla.",
        hero_desc: "Mapas interactivos, marcadores colaborativos en tiempo real y medición táctica de distancias. La ventaja definitiva para tu equipo.",
        btn_app: "Descargar App",
        btn_web: "Versión Web",
        feat_title: "Herramientas Tácticas",
        feat_desc: "Diseñado específicamente para jugadores de Airsoft y MilSim.",
        feat_1_title: "Salas Colaborativas",
        feat_1_desc: "Crea una sala segura con contraseña para tu equipo. Todos verán los marcadores y movimientos en tiempo real.",
        feat_2_title: "Marcadores Tácticos",
        feat_2_desc: "Añade snipers, puntos de respawn, enemigos u objetivos con iconos personalizados al instante sobre el mapa satélite.",
        feat_3_title: "Medición Precisa",
        feat_3_desc: "Calcula distancias exactas entre tu posición y el objetivo para ajustar la mira y asegurar el impacto.",
        rev_title: "Lo que dicen los operativos",
        rev_desc: "Comentarios reales de nuestra comunidad en la fase Beta.",
        dl_title: "Lleva la ventaja en tu bolsillo",
        dl_desc: "Descarga la aplicación oficial de AirsoftMaps para Android y obtén notificaciones, mejor rendimiento y acceso sin conexión parcial.",
        ft_slogan: "Elevando el nivel táctico del Airsoft en España.",
        ft_legal: "Legal y Ayuda",
        ft_privacy: "Política de Privacidad",
        ft_manual: "Manual de Usuario PDF",
        ft_terms: "Términos y Soporte",
        ft_follow: "Síguenos"
    },
    en: {
        nav_features: "Features",
        nav_reviews: "Reviews",
        nav_download: "Download",
        nav_contact: "Contact",
        hero_title: "Dominate the battlefield.",
        hero_desc: "Interactive maps, real-time collaborative markers, and tactical distance measurement. The ultimate advantage for your squad.",
        btn_app: "Download App",
        btn_web: "Web Version",
        feat_title: "Tactical Tools",
        feat_desc: "Specifically designed for Airsoft and MilSim players.",
        feat_1_title: "Collaborative Rooms",
        feat_1_desc: "Create a secure password-protected room for your team. Everyone will see markers and movements in real-time.",
        feat_2_title: "Tactical Markers",
        feat_2_desc: "Instantly add snipers, respawn points, enemies, or objectives with custom icons on the satellite map.",
        feat_3_title: "Precise Measurement",
        feat_3_desc: "Calculate exact distances between your position and the objective to adjust your scope and secure the hit.",
        rev_title: "What operatives say",
        rev_desc: "Real feedback from our community in the Beta phase.",
        dl_title: "Carry the advantage in your pocket",
        dl_desc: "Download the official AirsoftMaps Android app for notifications, better performance, and partial offline access.",
        ft_slogan: "Elevating the tactical level of Airsoft globally.",
        ft_legal: "Legal & Support",
        ft_privacy: "Privacy Policy",
        ft_manual: "User Manual PDF",
        ft_terms: "Terms & Support",
        ft_follow: "Follow Us"
    }
};

let currentLang = localStorage.getItem('airsoftmaps_lang') || 'es';

function applyTranslations(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (el.tagName === 'INPUT' && el.type === 'placeholder') {
                el.placeholder = translations[lang][key];
            } else {
                el.innerHTML = translations[lang][key];
            }
        }
    });

    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        langBtn.innerHTML = lang === 'es' ? '🇬🇧 EN' : '🇪🇸 ES';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Menú hamburguesa (Móvil)
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Cerrar menú al hacer clic en un enlace (Móvil)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (hamburger) {
                    hamburger.querySelector('i').classList.remove('fa-xmark');
                    hamburger.querySelector('i').classList.add('fa-bars');
                }
            }
        });
    });

    // Animaciones al hacer scroll (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observar elementos del Hero
    document.querySelectorAll('.fade-in-up').forEach(el => {
        setTimeout(() => {
            el.classList.add('visible');
        }, 100);
    });

    // Observar las tarjetas de características
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        card.classList.add('fade-in-up');
        card.style.transitionDelay = (index * 0.15) + 's';
        observer.observe(card);
    });

    // Apply translations logic
    applyTranslations(currentLang);
    
    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            currentLang = currentLang === 'es' ? 'en' : 'es';
            localStorage.setItem('airsoftmaps_lang', currentLang);
            applyTranslations(currentLang);
        });
    }
});

