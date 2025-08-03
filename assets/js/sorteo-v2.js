/**
 * Sorteo JavaScript v2.0
 * Versión reorganizada con mejor estructura y funcionalidades
 */

class SorteoApp {
    constructor() {
        this.currentStep = 1;
        this.participantData = {};
        this.paymentLinks = {
            1: 'https://mpago.la/1chance',
            3: 'https://mpago.la/3chances',
            4: 'https://mpago.la/4chances'
        };
        this.init();
    }

    init() {
        this.initializeComponents();
        this.bindEvents();
        this.checkPaymentStatus();
    }

    initializeComponents() {
        // Inicializar tooltips de Bootstrap
        this.initTooltips();
        
        // Inicializar modo oscuro
        this.initDarkMode();
        
        // Inicializar botón de volver arriba
        this.initBackToTop();
        
        // Inicializar carrusel de imágenes
        this.initImageCarousel();
        
        // Inicializar formulario
        this.initForm();
    }

    initTooltips() {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el));
    }

    initDarkMode() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                
                const icon = darkModeToggle.querySelector('i');
                if (icon) {
                    icon.classList.toggle('bi-moon');
                    icon.classList.toggle('bi-sun');
                }
            });
            
            // Aplicar tema guardado
            const savedTheme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', savedTheme);
            
            const icon = darkModeToggle.querySelector('i');
            if (icon && savedTheme === 'dark') {
                icon.classList.remove('bi-moon');
                icon.classList.add('bi-sun');
            }
        }
    }

    initBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    backToTopBtn.style.display = 'block';
                } else {
                    backToTopBtn.style.display = 'none';
                }
            });

            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    initImageCarousel() {
        const images = document.querySelectorAll('.carousel-img');
        let current = 0;
        
        if (images.length > 1) {
            setInterval(() => {
                images[current].classList.remove('active');
                current = (current + 1) % images.length;
                images[current].classList.add('active');
            }, 3000);
        }
    }

    initForm() {
        const form = document.getElementById('sorteoForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Inicializar validación en tiempo real
        this.initFormValidation();
        
        // Inicializar estado del formulario
        this.initFormState();
    }

    bindEvents() {
        // Evento para el botón de siguiente paso
        const nextStepBtn = document.getElementById('nextStepBtn');
        if (nextStepBtn) {
            nextStepBtn.addEventListener('click', () => this.nextStep());
        }

        // Evento para el botón de volver
        const backBtn = document.querySelector('[onclick="goBackToProduct()"]');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.goBackToProduct());
        }

        // Evento para cambio en cantidad de chances
        const chancesSelect = document.getElementById('cantidadChances');
        if (chancesSelect) {
            chancesSelect.addEventListener('change', () => this.handleChancesChange());
        }

        // Evento para el botón de ir a pagar
        const payBtn = document.getElementById('goToPayBtn');
        if (payBtn) {
            payBtn.addEventListener('click', (e) => this.handlePayment(e));
        }


    }

    nextStep() {
        const productCard = document.querySelector('.product-card');
        const formStep = document.getElementById('formStep');
        
        console.log('Product card:', productCard);
        console.log('Form step:', formStep);
        
        if (productCard && formStep) {
            // Ocultar el contenido del producto
            const productContent = productCard.querySelector('.product-details');
            if (productContent) {
                productContent.style.opacity = '0';
                productContent.style.transform = 'translateY(-20px)';
            }
            
            setTimeout(() => {
                // Ocultar el contenido del producto
                if (productContent) {
                    productContent.style.display = 'none';
                }
                
                // Mostrar el formulario con transición
                formStep.style.display = 'block';
                formStep.style.opacity = '0';
                formStep.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    formStep.style.opacity = '1';
                    formStep.style.transform = 'translateY(0)';
                    formStep.scrollIntoView({ behavior: 'smooth' });
                }, 50);
                
                this.currentStep = 2;
            }, 300);
        } else {
            console.error('No se encontraron los elementos necesarios');
            // Fallback: mostrar el formulario directamente
            if (formStep) {
                formStep.style.display = 'block';
                formStep.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    goBackToProduct() {
        const productCard = document.querySelector('.product-card');
        const formStep = document.getElementById('formStep');
        const productContent = productCard.querySelector('.product-details');
        
        if (productCard && formStep) {
            // Ocultar el formulario con transición
            formStep.style.opacity = '0';
            formStep.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                formStep.style.display = 'none';
                
                // Mostrar el contenido del producto con transición
                if (productContent) {
                    productContent.style.display = 'block';
                    productContent.style.opacity = '0';
                    productContent.style.transform = 'translateY(-20px)';
                    
                    setTimeout(() => {
                        productContent.style.opacity = '1';
                        productContent.style.transform = 'translateY(0)';
                        productCard.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                }
                
                this.currentStep = 1;
            }, 300);
        }
    }

    handleChancesChange() {
        const select = document.getElementById('cantidadChances');
        const goToPayContainer = document.getElementById('goToPayContainer');
        const goToPayBtn = document.getElementById('goToPayBtn');
        const chancesDisplay = document.getElementById('chancesDisplay');
        const totalPrecio = document.getElementById('totalPrecio');
        const submitBtn = document.querySelector('.btn-submit');

        if (select && goToPayContainer && goToPayBtn) {
            const value = select.value;
            const prices = { 1: 1000, 3: 2800, 4: 4000 };

            if (["1", "3", "4"].includes(value)) {
                goToPayContainer.style.display = "block";
                goToPayBtn.disabled = false;
                goToPayBtn.innerHTML = `<i class="bi bi-credit-card me-2"></i> Ir a pagar (${value} chance${value == "1" ? "" : "s"})`;
                
                // Ocultar el botón de registrar participación
                if (submitBtn) {
                    submitBtn.style.display = "none";
                }
                
                // Actualizar display
                if (chancesDisplay) chancesDisplay.textContent = value;
                if (totalPrecio) totalPrecio.textContent = `$${prices[value]}`;
            } else {
                goToPayContainer.style.display = "none";
                goToPayBtn.disabled = true;
                
                // Mantener oculto el botón de registrar participación
                if (submitBtn) {
                    submitBtn.style.display = "none";
                }
            }
        }
    }

    handlePayment(e) {
        e.preventDefault();
        const btn = e.target;
        const select = document.getElementById('cantidadChances');
        const value = select ? select.value : '1';

        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Redirigiendo...';
        btn.disabled = true;

        // Para desarrollo: simular pago exitoso
        const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        if (isDevelopment) {
            // Simular pago exitoso después de 2 segundos
            setTimeout(() => {
                console.log('Simulando pago exitoso...');
                this.showPaymentSuccess();
                btn.innerHTML = `<i class="bi bi-credit-card me-2"></i> Ir a pagar (${value} chance${value == "1" ? "" : "s"})`;
                btn.disabled = false;
            }, 2000);
        } else {
            // Redirigir al pago real
            setTimeout(() => {
                const paymentLink = this.paymentLinks[value] || this.paymentLinks[1];
                console.log('Redirigiendo a:', paymentLink);
                window.location.href = paymentLink;
            }, 1000);
        }
    }

    initFormValidation() {
        // Validación de DNI
        const dniInput = document.getElementById('dni');
        if (dniInput) {
            dniInput.addEventListener('input', (e) => {
                this.formatDNI(e.target);
            });
        }

        // Validación de teléfono
        const phoneInput = document.getElementById('telefono');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                this.formatPhone(e.target);
            });
        }
    }

    initFormState() {
        // Ocultar el botón de ir a pagar al inicio
        const goToPayContainer = document.getElementById('goToPayContainer');
        if (goToPayContainer) {
            goToPayContainer.style.display = 'none';
        }

        // Ocultar el botón de registrar participación al inicio
        const submitBtn = document.querySelector('.btn-submit');
        if (submitBtn) {
            submitBtn.style.display = 'none';
        }
    }

    formatDNI(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 8) {
            value = value.substring(0, 8);
        }
        input.value = value;
    }

    formatPhone(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 10) {
            value = value.substring(0, 10);
        }
        
        // Formatear como (XXX) XXX-XXXX
        if (value.length >= 6) {
            value = `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6)}`;
        } else if (value.length >= 3) {
            value = `(${value.substring(0, 3)}) ${value.substring(3)}`;
        }
        
        input.value = value;
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('.btn-submit');
        const formData = new FormData(form);

        // Deshabilitar botón durante el envío
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Procesando...';
        }

        try {
            const response = await fetch('api/process_sorteo.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                this.showSuccessMessage(result.message, result.data);
            } else {
                this.showErrorMessage(result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            this.showErrorMessage('Error de conexión. Inténtalo de nuevo.');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i> Registrar Participación';
            }
        }
    }

    showSuccessMessage(message, data) {
        // Crear alerta de éxito
        const alert = document.createElement('div');
        alert.className = 'alert alert-success alert-dismissible fade show';
        alert.innerHTML = `
            <i class="bi bi-check-circle me-2"></i>
            <strong>¡Éxito!</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        const form = document.getElementById('sorteoForm');
        form.parentNode.insertBefore(alert, form);

        // Redirigir al pago si hay datos
        if (data && data.payment_link) {
            setTimeout(() => {
                window.location.href = data.payment_link;
            }, 2000);
        }
    }

    showErrorMessage(message) {
        // Crear alerta de error
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger alert-dismissible fade show';
        alert.innerHTML = `
            <i class="bi bi-exclamation-triangle me-2"></i>
            <strong>Error:</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        const form = document.getElementById('sorteoForm');
        form.parentNode.insertBefore(alert, form);
    }

    checkPaymentStatus() {
        const urlParams = new URLSearchParams(window.location.search);
        const pagado = urlParams.get('pagado');
        const status = urlParams.get('status');
        const simular = urlParams.get('simular');

        if (pagado === 'ok' || status === 'approved' || simular === 'pago') {
            this.showPaymentSuccess();
        }
    }

    showPaymentSuccess() {
        const formStep = document.getElementById('formStep');
        const chancesSelect = document.getElementById('cantidadChances');
        const value = chancesSelect ? chancesSelect.value : '1';

        // Crear la pantalla de agradecimiento
        const thankYouContent = `
            <div class="product-details">
                <div class="text-center mb-4">
                    <i class="bi bi-heart-fill text-danger" style="font-size: 3rem;"></i>
                </div>
                
                <h2 class="product-title text-center mb-4">¡Gracias por tu colaboración!</h2>
                
                <div class="alert alert-success text-center">
                    <i class="bi bi-check-circle me-2"></i>
                    <strong>¡Pago procesado correctamente!</strong><br>
                    Tu participación ha sido registrada con ${value} chance${value == "1" ? "" : "s"}.
                </div>

                <div class="card mb-4" style="background: var(--background-alt);">
                    <div class="card-body text-center">
                        <h5 class="card-title">
                            <i class="bi bi-calendar-event text-primary me-2"></i>
                            Información del Sorteo
                        </h5>
                        <div class="row">
                            <div class="col-md-6">
                                <p class="mb-2"><strong>Fecha del Sorteo:</strong></p>
                                <p class="text-primary fw-bold">30 de septiembre de 2025</p>
                            </div>
                            <div class="col-md-6">
                                <p class="mb-2"><strong>Premio:</strong></p>
                                <p class="text-primary fw-bold">Tablet Android 15</p>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-6">
                                <p class="mb-2"><strong>Organiza:</strong></p>
                                <p class="text-primary fw-bold">Centro de Estudiantes CODES++</p>
                            </div>
                            <div class="col-md-6">
                                <p class="mb-2"><strong>Destino de los fondos:</strong></p>
                                <p class="text-primary fw-bold">CACIC 2025</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="text-center">
                    <p class="mb-3">
                        <i class="bi bi-info-circle me-2"></i>
                        <strong>Recordatorio:</strong> Participás con tu número de DNI. ¡Más chances, más oportunidades de ganar!
                    </p>
                    
                    <div class="d-flex justify-content-center gap-3">
                        <button class="btn btn-outline-primary" onclick="goBackToProduct()">
                            <i class="bi bi-arrow-left me-2"></i>Volver al Inicio
                        </button>
                        <button class="btn btn-primary" onclick="window.location.href='index.html'">
                            <i class="bi bi-house me-2"></i>Ir al Sitio Principal
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Reemplazar el contenido del formulario con la pantalla de agradecimiento
        if (formStep) {
            formStep.innerHTML = thankYouContent;
            formStep.scrollIntoView({ behavior: 'smooth' });
        }

        this.currentStep = 3;
    }
}

// La inicialización se hace al final del archivo

// Funciones globales para compatibilidad con el HTML existente
window.nextStep = function() {
    const app = window.sorteoApp;
    if (app) app.nextStep();
};

window.goBackToProduct = function() {
    const app = window.sorteoApp;
    if (app) app.goBackToProduct();
};

window.formatDNI = function(input) {
    const app = window.sorteoApp;
    if (app) app.formatDNI(input);
};

window.formatPhone = function(input) {
    const app = window.sorteoApp;
    if (app) app.formatPhone(input);
};

window.calculateTotal = function() {
    const app = window.sorteoApp;
    if (app) app.handleChancesChange();
};



// Inicializar la aplicación globalmente
window.sorteoApp = null;
document.addEventListener('DOMContentLoaded', () => {
    window.sorteoApp = new SorteoApp();
}); 