/**
 * CODES++ - Centro de Estudiantes
 * Main JavaScript File
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all functionality
    initScrollEffects();
    initSmoothScrolling();
    initAnimations();
    initSearchFunctionality();
    initDarkMode();
    initBreadcrumbs();
    initTooltips();
    initLoadingStates();
    initHeroAnimations();
    initMobileMenu();
    initAnalytics(); // Initialize analytics tracking
    
});

/**
 * Header scroll effects and progress indicator
 */
function initScrollEffects() {
    const header = document.getElementById('header');
    const scrollProgress = document.getElementById('scrollProgress');
    
    window.addEventListener('scroll', function() {
        // Header scroll effect
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll progress indicator
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        if (scrollProgress) {
            scrollProgress.style.width = scrollPercent + '%';
        }
    });
}

/**
 * Smooth scrolling for navigation links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                // Get navbar height to offset the scroll
                const navbar = document.getElementById('header');
                const navbarHeight = navbar ? navbar.offsetHeight : 80;
                
                // Calculate the target position with navbar offset
                const targetPosition = target.offsetTop - navbarHeight - 20; // 20px extra padding
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Intersection Observer for fade-in animations
 */
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    const animatedElements = document.querySelectorAll('.card, .event-card, .resource-item, .vocal-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * Utility function to add loading states to buttons
 */
function addLoadingState(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="bi bi-arrow-clockwise spin"></i> Cargando...';
    button.disabled = true;
    
    return function() {
        button.innerHTML = originalText;
        button.disabled = false;
    };
}

/**
 * Utility function to show notifications
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

/**
 * Form validation utility
 */
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
        }
    });
    
    return isValid;
}

/**
 * Lazy loading for images
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/**
 * Mobile menu toggle enhancement
 */
function initMobileMenu() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // Close mobile menu when clicking on a link
        const navLinks = navbarCollapse.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992) {
                    navbarCollapse.classList.remove('show');
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isNavbarOpen = navbarCollapse.classList.contains('show');
            const isClickInsideNavbar = navbarCollapse.contains(event.target) || navbarToggler.contains(event.target);
            if (isNavbarOpen && !isClickInsideNavbar && window.innerWidth < 992) {
                navbarCollapse.classList.remove('show');
            }
        });
    }
}

/**
 * Back to top button functionality
 */
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (!backToTopButton) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    // Scroll to top when clicked
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Initialize search functionality
 */
function initSearchFunctionality() {
    const searchToggle = document.getElementById('searchToggle');
    const searchModal = new bootstrap.Modal(document.getElementById('searchModal'));
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    // Search content data
    const searchContent = [
        {
            title: '¿Cómo me cambio de plan de estudios?',
            content: 'Enviar mail a tramitesunlu@unlu.edu.ar con DNI y materias aprobadas',
            section: 'FAQ',
            url: '#faq'
        },
        {
            title: '¿Por qué perdí la regularidad?',
            content: 'Se pierde si no aprobás al menos dos materias con final en un año',
            section: 'FAQ',
            url: '#faq'
        },
        {
            title: 'Taller de Resolución de Problemas',
            content: 'Técnicas de resolución, análisis de complejidad y estrategias',
            section: 'Actividades',
            url: '#eventos'
        },
        {
            title: 'CACIC 2025',
            content: 'Competencia de programación para estudiantes',
            section: 'Actividades',
            url: '#eventos'
        },
        {
            title: 'Bibliografía recomendada',
            content: 'Libros y manuales usados en las materias de la carrera',
            section: 'Recursos',
            url: '#extra'
        },
        {
            title: 'Grupos de estudio (Discord)',
            content: 'Servidor para consultas y organización de grupos',
            section: 'Recursos',
            url: '#extra'
        },
        {
            title: 'Federico Rizzo',
            content: 'Presidente del Centro de Estudiantes',
            section: 'Integrantes',
            url: '#integrantes'
        },
        {
            title: 'Juan Cruz Rodríguez',
            content: 'Vice Presidente del Centro de Estudiantes',
            section: 'Integrantes',
            url: '#integrantes'
        }
    ];
    
    // Open search modal
    searchToggle.addEventListener('click', function() {
        searchModal.show();
        setTimeout(() => searchInput.focus(), 500);
    });
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const results = searchContent.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.content.toLowerCase().includes(query)
        );
        
        displaySearchResults(results);
    });
    
    function displaySearchResults(results) {
        if (results.length === 0) {
            searchResults.innerHTML = '<p class="text-muted text-center">No se encontraron resultados</p>';
            return;
        }
        
        searchResults.innerHTML = results.map(item => `
            <div class="search-result-item" onclick="navigateToSection('${item.url}')">
                <h6>${item.title}</h6>
                <p>${item.content}</p>
                <small class="text-muted">${item.section}</small>
            </div>
        `).join('');
    }
}

/**
 * Initialize dark mode toggle
 */
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    // El logo ya no cambia, solo se gestiona el modo oscuro

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        updateDarkModeIcon(savedTheme === 'dark');
    }
    
    darkModeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateDarkModeIcon(newTheme === 'dark');
    });
    
    function updateDarkModeIcon(isDark) {
        const icon = darkModeToggle.querySelector('i');
        icon.className = isDark ? 'bi bi-sun' : 'bi bi-moon';
        darkModeToggle.setAttribute('title', isDark ? 'Modo claro' : 'Modo oscuro');
    }
}

/**
 * Initialize breadcrumbs navigation
 */
function initBreadcrumbs() {
    const breadcrumbList = document.getElementById('breadcrumbList');
    const sections = [
        { id: 'nosotros', name: 'Nosotros' },
        { id: 'integrantes', name: 'Integrantes' },
        { id: 'eventos', name: 'Actividades' },
        { id: 'extra', name: 'Recursos' },
        { id: 'faq', name: 'FAQ' },
        { id: 'contacto', name: 'Contacto' }
    ];
    
    let lastTrackedSection = 'Inicio';
    
    function updateBreadcrumbs() {
        const scrollPosition = window.scrollY + 100;
        let currentSection = 'Inicio';
        
        sections.forEach(section => {
            const element = document.getElementById(section.id);
            if (element) {
                const elementTop = element.offsetTop;
                const elementBottom = elementTop + element.offsetHeight;
                
                if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
                    currentSection = section.name;
                }
            }
        });
        
        // Track section changes for analytics
        if (currentSection !== lastTrackedSection) {
            trackPageView(currentSection);
            lastTrackedSection = currentSection;
        }
        
        breadcrumbList.innerHTML = `
            <li class="breadcrumb-item">
                <a href="#" class="breadcrumb-link">Inicio</a>
            </li>
            <li class="breadcrumb-item active" aria-current="page">${currentSection}</li>
        `;
    }
    
    window.addEventListener('scroll', updateBreadcrumbs);
    updateBreadcrumbs();
}

/**
 * Initialize tooltips
 */
function initTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * Initialize loading states for external links
 */
function initLoadingStates() {
    const externalLinks = document.querySelectorAll('.external-link');
    
    externalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const spinner = this.querySelector('.loading-spinner');
            if (spinner) {
                spinner.classList.remove('d-none');
                spinner.classList.add('spin');
                
                // Remove spinner after a short delay (simulating loading)
                setTimeout(() => {
                    spinner.classList.remove('spin');
                    spinner.classList.add('d-none');
                }, 1000);
            }
        });
    });
}

/**
 * Navigate to section (for search results)
 */
function navigateToSection(sectionId) {
    const target = document.querySelector(sectionId);
    if (target) {
        const navbar = document.getElementById('header');
        const navbarHeight = navbar ? navbar.offsetHeight : 80;
        const targetPosition = target.offsetTop - navbarHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Close search modal
        const searchModal = bootstrap.Modal.getInstance(document.getElementById('searchModal'));
        if (searchModal) {
            searchModal.hide();
        }
    }
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initLazyLoading();
    initMobileMenu();
    initBackToTop();
});

/**
 * Initialize hero section animations
 */
function initHeroAnimations() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Create dynamic particles
    const particlesContainer = hero.querySelector('.hero-particles');
    if (particlesContainer) {
        createDynamicParticles(particlesContainer);
    }

    // Add scroll-based parallax effect
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    // Add mouse movement effect
    hero.addEventListener('mousemove', function(e) {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        const x = (clientX / innerWidth - 0.5) * 20;
        const y = (clientY / innerHeight - 0.5) * 20;
        
        const floatingElements = hero.querySelectorAll('.hero-floating::before, .hero-floating::after');
        floatingElements.forEach((element, index) => {
            if (element) {
                element.style.transform = `translate(${x * (index + 1)}px, ${y * (index + 1)}px)`;
            }
        });
    });
}

/**
 * Create dynamic particles for hero section
 */
function createDynamicParticles(container) {
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random positioning and timing
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        
        container.appendChild(particle);
    }
}

/**
 * Analytics tracking functions
 */
function trackEvent(eventName, parameters = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
        console.log('Analytics event tracked:', eventName, parameters);
    } else {
        console.warn('Google Analytics not loaded');
    }
}

/**
 * Track page views for single page application
 */
function trackPageView(section) {
    if (typeof gtag !== 'undefined') {
        gtag('config', 'G-C73GLNE05C', {
            page_title: `CODES++ - ${section}`,
            page_location: window.location.href + '#' + section,
            send_page_view: true
        });
        console.log('Page view tracked:', section);
    }
}

/**
 * Initialize analytics tracking
 */
function initAnalytics() {
    // Track navigation clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            const section = this.getAttribute('href').substring(1);
            trackEvent('navigation_click', {
                section: section,
                link_text: this.textContent
            });
        });
    });

    // Track search usage
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            if (this.value.length > 2) {
                trackEvent('search_input', {
                    search_term: this.value,
                    search_term_length: this.value.length
                });
            }
        });
    }

    // Track external link clicks
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('external_link_click', {
                link_url: this.href,
                link_text: this.textContent
            });
        });
    });

    // Track dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            const currentTheme = document.body.getAttribute('data-theme');
            trackEvent('theme_toggle', {
                theme: currentTheme === 'dark' ? 'light' : 'dark'
            });
        });
    }

    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
            maxScroll = scrollPercent;
            trackEvent('scroll_depth', {
                scroll_percent: scrollPercent
            });
        }
    });

    console.log('Analytics tracking initialized');
}

// Export functions for potential use in other scripts
window.CODES = {
    showNotification,
    validateForm,
    addLoadingState,
    trackEvent,
    trackPageView
}; 