/* ========================================
   INDEX PAGE JAVASCRIPT
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeHeader();
    initializeSearch();
    initializeDarkMode();
    initializeBackToTop();
    initializeScrollIndicator();
    initializeExternalLinks();
    initializeMobileMenu();
    initializeRifaButton();
    initializeTooltips();
});

/**
 * Initialize header functionality
 */
function initializeHeader() {
    const header = document.getElementById('header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

/**
 * Initialize search functionality
 */
function initializeSearch() {
    const searchToggle = document.getElementById('searchToggle');
    const searchModal = document.getElementById('searchModal');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (searchToggle && searchModal) {
        searchToggle.addEventListener('click', function() {
            const searchModalInstance = new bootstrap.Modal(searchModal);
            searchModalInstance.show();
            
            // Focus on search input
            setTimeout(() => {
                if (searchInput) {
                    searchInput.focus();
                }
            }, 500);
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            performSearch(query, searchResults);
        });
    }
}

/**
 * Perform search functionality
 */
function performSearch(query, resultsContainer) {
    if (!resultsContainer) return;
    
    // Define searchable content
    const searchableContent = [
        {
            title: 'Nosotros',
            content: 'Centro Organizado de Estudiantes de Sistemas',
            url: '#nosotros'
        },
        {
            title: 'Integrantes',
            content: 'Comisión directiva y vocales',
            url: '#integrantes'
        },
        {
            title: 'Actividades',
            content: 'Talleres, CACIC, Expo UNLu',
            url: '#eventos'
        },
        {
            title: 'Recursos',
            content: 'Bibliografía, apuntes, Discord',
            url: '#extra'
        },
        {
            title: 'FAQ',
            content: 'Preguntas frecuentes sobre la carrera',
            url: '#faq'
        },
        {
            title: 'Contacto',
            content: 'Información de contacto',
            url: '#contacto'
        }
    ];
    
    // Filter results
    const filteredResults = searchableContent.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.content.toLowerCase().includes(query)
    );
    
    // Display results
    displaySearchResults(filteredResults, resultsContainer);
}

/**
 * Display search results
 */
function displaySearchResults(results, container) {
    if (!container) return;
    
    if (results.length === 0) {
        container.innerHTML = '<p class="text-muted">No se encontraron resultados.</p>';
        return;
    }
    
    const resultsHTML = results.map(result => `
        <div class="search-result-item p-3 border-bottom">
            <h6 class="mb-1">
                <a href="${result.url}" class="text-decoration-none">${result.title}</a>
            </h6>
            <p class="mb-0 text-muted small">${result.content}</p>
        </div>
    `).join('');
    
    container.innerHTML = resultsHTML;
}

/**
 * Initialize dark mode functionality
 */
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', currentTheme);
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update toggle icon
            const icon = this.querySelector('i');
            if (icon) {
                icon.className = newTheme === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
            }
        });
        
        // Set initial icon
        const icon = darkModeToggle.querySelector('i');
        if (icon && body.getAttribute('data-theme') === 'dark') {
            icon.className = 'bi bi-sun';
        }
    }
}

/**
 * Initialize back to top button
 */
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Initialize scroll indicator
 */
function initializeScrollIndicator() {
    const scrollProgress = document.getElementById('scrollProgress');
    
    if (scrollProgress) {
        window.addEventListener('scroll', function() {
            const scrollTop = document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            
            scrollProgress.style.width = scrollPercent + '%';
        });
    }
}

/**
 * Initialize external links with loading indicators
 */
function initializeExternalLinks() {
    const externalLinks = document.querySelectorAll('.external-link');
    
    externalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const spinner = this.querySelector('.loading-spinner');
            if (spinner) {
                spinner.classList.remove('d-none');
                spinner.classList.add('spin');
            }
            
            // Track external link clicks
            if (typeof gtag !== 'undefined') {
                gtag('event', 'external_link_click', {
                    'event_category': 'navigation',
                    'event_label': this.href
                });
            }
        });
    });
}

/**
 * Initialize mobile menu functionality
 */
function initializeMobileMenu() {
    const toggler = document.querySelector('.navbar-toggler');
    const modalEl = document.getElementById('mobileMenuModal');
    
    if (toggler && modalEl) {
        const mobileMenuModal = new bootstrap.Modal(modalEl, { backdrop: true });
        
        toggler.addEventListener('click', function(e) {
            if (window.innerWidth <= 991) {
                e.preventDefault();
                mobileMenuModal.show();
            }
        });
        
        // Close when clicking outside
        modalEl.addEventListener('click', function(e) {
            if (e.target === modalEl) {
                mobileMenuModal.hide();
            }
        });
        
        // Close when clicking on a link
        modalEl.querySelectorAll('.nav-link').forEach(function(link) {
            link.addEventListener('click', function() {
                mobileMenuModal.hide();
            });
        });
    }
}

/**
 * Initialize rifa button functionality
 */
function initializeRifaButton() {
    const goToRifaBtn = document.getElementById('goToRifaBtn');
    
    if (goToRifaBtn) {
        goToRifaBtn.addEventListener('click', function() {
            const rifaCard = document.getElementById('rifa-event');
            if (rifaCard) {
                const y = rifaCard.getBoundingClientRect().top + window.pageYOffset - 90;
                window.scrollTo({ top: y, behavior: 'smooth' });
                
                // Track rifa button click
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'rifa_button_click', {
                        'event_category': 'sorteo',
                        'event_label': 'ir_a_rifa'
                    });
                }
            }
        });
    }
}

/**
 * Initialize tooltips
 */
function initializeTooltips() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * Smooth scroll to section
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const y = section.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
}

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
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
 * Track page views and events
 */
function trackPageView() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            'page_title': 'CODES++ - Centro de Estudiantes de Sistemas',
            'page_location': window.location.href
        });
    }
}

/**
 * Track section visibility
 */
function trackSectionVisibility() {
    const sections = document.querySelectorAll('section[id]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log(`Section visible: ${entry.target.id}`);
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Initialize tracking
trackPageView();
trackSectionVisibility();

// Export functions for global access
window.indexFunctions = {
    scrollToSection,
    showNotification,
    performSearch,
    displaySearchResults
}; 