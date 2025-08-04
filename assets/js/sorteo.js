/* ========================================
   SORTEO PAGE JAVASCRIPT
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Sorteo.js cargado - Iniciando funcionalidad');

    // Initialize tooltips if Bootstrap is available
    if (typeof bootstrap !== 'undefined') {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // --- Funcionalidad del menú móvil ---
    // El menú móvil ahora usa un modal personalizado como en index.html
    // La funcionalidad está manejada por el script inline en sorteo.html
    console.log('🍔 Menú móvil usando modal personalizado');

    // --- Scroll suave para enlaces del menú ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                // Obtener altura del navbar
                const navbar = document.getElementById('header');
                const navbarHeight = navbar ? navbar.offsetHeight : 80;
                
                // Calcular posición objetivo con offset del navbar
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Scroll del header ---
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Modo oscuro mejorado ---
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

    // --- Botón volver arriba ---
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

    // Funciones para el modal de imagen
    window.showImageModal = function(imageSrc) {
        console.log('🖼️ Abriendo modal de imagen:', imageSrc);
        const modal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        
        modalImage.src = imageSrc;
        modal.style.display = 'block';
        
        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
    };

    window.closeImageModal = function() {
        console.log('🖼️ Cerrando modal de imagen');
        const modal = document.getElementById('imageModal');
        modal.style.display = 'none';
        
        // Restaurar scroll del body
        document.body.style.overflow = 'auto';
    };

    // Cerrar modal con ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeImageModal();
        }
    });

    // Cerrar modal haciendo clic fuera de la imagen
    const imageModal = document.getElementById('imageModal');
    if (imageModal) {
        imageModal.addEventListener('click', function(event) {
            if (event.target === this) {
                closeImageModal();
            }
        });
    }

    // --- Navegación entre pasos ---
    const nextStepBtn = document.getElementById('nextStepBtn');
    const formStep = document.getElementById('formStep');
    const productCard = document.querySelector('.product-card');

    if (nextStepBtn) {
        nextStepBtn.addEventListener('click', function() {
            console.log('🔄 Navegando al formulario...');
            if (productCard) productCard.style.display = 'none';
            if (formStep) {
                formStep.style.display = 'block';
                formStep.scrollIntoView({behavior: 'smooth'});
            }
        });
    }

    // Función global para volver al producto
    window.goBackToProduct = function() {
        console.log('🔄 Volviendo al producto...');
        if (formStep) formStep.style.display = 'none';
        if (productCard) {
            productCard.style.display = 'block';
            productCard.scrollIntoView({behavior: 'smooth'});
        }
    };

    // Funciones globales para el formulario
    window.formatDNI = function(input) {
        // Solo permitir números
        input.value = input.value.replace(/\D/g, '');
        // Limitar a 8 dígitos
        if (input.value.length > 8) {
            input.value = input.value.slice(0, 8);
        }
    };

    window.formatPhone = function(input) {
        // Solo permitir números
        input.value = input.value.replace(/\D/g, '');
        // Limitar a 10 dígitos
        if (input.value.length > 10) {
            input.value = input.value.slice(0, 10);
        }
    };

    window.calculateTotal = function() {
        const cantidadChances = document.getElementById('cantidadChances').value;
        const chancesDisplay = document.getElementById('chancesDisplay');
        const totalPrecio = document.getElementById('totalPrecio');
        
        const precios = {
            '1': 1000,
            '3': 2800,
            '4': 4000
        };
        
        if (cantidadChances && precios[cantidadChances]) {
            chancesDisplay.textContent = cantidadChances;
            totalPrecio.textContent = `$${precios[cantidadChances].toLocaleString()}`;
        } else {
            chancesDisplay.textContent = '0';
            totalPrecio.textContent = '$0';
        }
    };

    // Mostrar botón de ir a pagar cuando se complete el formulario
    const cantidadChances = document.getElementById('cantidadChances');
    const goToPayContainer = document.getElementById('goToPayContainer');
    const goToPayBtn = document.getElementById('goToPayBtn');

    // Links de pago según la cantidad de chances
    const paymentLinks = {
        1: 'https://mpago.la/1rXwpEV', // $1000
        3: 'https://mpago.la/1eSB8pw', // $2800
        4: 'https://mpago.la/1kM9Q6y'  // $4000
    };
    
    console.log('🔗 Enlaces de pago cargados:', paymentLinks);

    // Función para validar que el formulario esté completo
    function validarFormularioCompleto() {
        const nombre = document.getElementById('nombre').value.trim();
        const apellido = document.getElementById('apellido').value.trim();
        const email = document.getElementById('email').value.trim();
        const dni = document.getElementById('dni').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const cantidadChances = document.getElementById('cantidadChances').value;
        
        return nombre && apellido && email && dni && telefono && cantidadChances;
    }

    // Función para actualizar el botón de pago
    function actualizarBotonPago() {
        const formularioCompleto = validarFormularioCompleto();
        const cantidadChances = document.getElementById('cantidadChances').value;
        
        if (formularioCompleto && ["1","3","4"].includes(cantidadChances)) {
            console.log('✅ Formulario completo - Mostrando botón de pago para', cantidadChances, 'chances');
            goToPayContainer.style.display = "block";
            goToPayBtn.disabled = false;
            goToPayBtn.setAttribute('data-link', paymentLinks[cantidadChances]);
            goToPayBtn.innerHTML = `<i class="bi bi-credit-card me-2"></i> Ir a pagar (${cantidadChances} chance${cantidadChances=="1"?"":"s"})`;
        } else {
            console.log('❌ Formulario incompleto o cantidad inválida - Ocultando botón de pago');
            goToPayContainer.style.display = "none";
            goToPayBtn.disabled = true;
            goToPayBtn.removeAttribute('data-link');
            goToPayBtn.innerHTML = `<i class="bi bi-credit-card me-2"></i> Ir a pagar`;
        }
    }

    // Agregar event listeners a todos los campos del formulario
    const camposFormulario = ['nombre', 'apellido', 'email', 'dni', 'telefono', 'cantidadChances'];
    camposFormulario.forEach(campo => {
        const elemento = document.getElementById(campo);
        if (elemento) {
            elemento.addEventListener('input', actualizarBotonPago);
            elemento.addEventListener('change', actualizarBotonPago);
        }
    });

    // Validación inicial
    actualizarBotonPago();

    if (goToPayBtn) {
        console.log('✅ Botón de pago encontrado:', goToPayBtn);
        console.log('ℹ️ El botón de pago ahora usa onclick="irAPagar()"');
    } else {
        console.log('❌ No se encontró el botón de pago');
    }

    // --- Configuración de Google Sheets ---
    // URL directa sin proxy CORS para evitar problemas
    const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwQABnH9-rpvsOBmiR0UVJfK6u8AxQcbJcXZZWvlc2Q7Jyn5JlBs7e24IqUdExVv3XKiw/exec';

    // Función para enviar datos a Google Sheets
    async function enviarAGoogleSheets(datos) {
        try {
            console.log('📤 Enviando datos a Google Sheets...');
            console.log('📊 Datos a enviar:', datos);
            console.log('🌐 URL de destino:', GOOGLE_SHEETS_URL);
            
            const response = await fetch(GOOGLE_SHEETS_URL, {
                method: 'POST',
                mode: 'no-cors', // Usar no-cors para evitar problemas de CORS
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });
            
            console.log('📥 Respuesta del servidor:', response);
            console.log('📊 Estado de respuesta:', response.status);
            
            // Con no-cors, no podemos leer la respuesta, pero asumimos éxito si no hay error
            if (response.type === 'opaque') {
                console.log('✅ Respuesta recibida (no-cors mode)');
                return { success: true, message: 'Datos enviados exitosamente' };
            } else {
                console.log('✅ Respuesta recibida:', response);
                return { success: true, message: 'Datos enviados exitosamente' };
            }
            
        } catch (error) {
            console.error('❌ Error enviando a Google Sheets:', error);
            console.error('❌ Detalles del error:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            return { success: false, error: error.message };
        }
    }

    // Función para ir a pagar con Mercado Pago real
    window.irAPagar = async function() {
        console.log('💳 Iniciando proceso de pago...');
        
        // Validar que el formulario esté completo
        if (!validarFormularioCompleto()) {
            alert('Por favor completa todos los campos del formulario antes de proceder al pago.');
            return;
        }
        
        const cantidadChances = document.getElementById('cantidadChances').value;
        const goToPayBtn = document.getElementById('goToPayBtn');
        
        if (goToPayBtn) {
            // Cambiar el texto del botón
            goToPayBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Enviando datos...';
            goToPayBtn.disabled = true;
            
            console.log('📤 Enviando datos iniciales a Google Sheets...');
            
            // Obtener datos del formulario
            const nombre = document.getElementById('nombre').value;
            const apellido = document.getElementById('apellido').value;
            const email = document.getElementById('email').value;
            const dni = document.getElementById('dni').value;
            const telefono = document.getElementById('telefono').value;
            
            // Generar Session ID único
            const sessionId = 'SES_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            const datosIniciales = {
                sessionId: sessionId,
                timestamp: new Date().getTime(),
                cantidadChances: cantidadChances,
                nombre: nombre,
                apellido: apellido,
                email: email,
                dni: dni,
                telefono: telefono,
                estadoPago: 'PENDIENTE',
                pagoConfirmado: false,
                fechaRegistro: new Date().toISOString()
            };
            
            console.log('📊 Datos iniciales a enviar:', datosIniciales);
            
            try {
                // Enviar datos iniciales a Google Sheets
                const resultado = await enviarAGoogleSheets(datosIniciales);
                
                if (resultado.success) {
                    console.log('✅ Datos iniciales enviados exitosamente a Google Sheets');
                    
                    // Guardar datos en localStorage para tracking posterior
                    localStorage.setItem('sorteo_pendiente', JSON.stringify(datosIniciales));
                    console.log('✅ Datos guardados en localStorage - Continuando con pago');
                    
                    // Continuar con el proceso de pago
                    continuarConPago(cantidadChances, goToPayBtn);
                } else {
                    console.log('❌ Error enviando datos iniciales:', resultado.error);
                    alert('Error al enviar los datos. Por favor intenta nuevamente.');
                    
                    // Restaurar botón
                    goToPayBtn.innerHTML = `<i class="bi bi-credit-card me-2"></i> Ir a pagar (${cantidadChances} chance${cantidadChances=="1"?"":"s"})`;
                    goToPayBtn.disabled = false;
                }
            } catch (error) {
                console.error('❌ Error inesperado enviando datos:', error);
                alert('Error inesperado. Por favor intenta nuevamente.');
                
                // Restaurar botón
                goToPayBtn.innerHTML = `<i class="bi bi-credit-card me-2"></i> Ir a pagar (${cantidadChances} chance${cantidadChances=="1"?"":"s"})`;
                goToPayBtn.disabled = false;
            }
        } else {
            console.log('❌ No se encontró el botón de pago');
        }
    };

    // Función para continuar con el proceso de pago después de enviar datos iniciales
    function continuarConPago(cantidadChances, goToPayBtn) {
        // Cambiar texto del botón a "Procesando..."
        goToPayBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Procesando...';
        
        setTimeout(() => {
            console.log('🔍 Buscando enlace de pago para', cantidadChances, 'chances');
            console.log('📋 Enlaces disponibles:', paymentLinks);
            
            const paymentLink = paymentLinks[cantidadChances];
            console.log('🔗 Enlace encontrado:', paymentLink);
            
            if (paymentLink) {
                console.log('🌐 Abriendo MercadoPago:', paymentLink);
                console.log('✅ Redirigiendo a:', paymentLink);
                
                // Redirigir a MercadoPago
                window.location.href = paymentLink;
                
            } else {
                console.log('❌ No se encontró el link de pago para', cantidadChances, 'chances');
                console.log('📋 Enlaces disponibles:', Object.keys(paymentLinks));
                alert('Error: No se encontró el link de pago. Por favor selecciona otra cantidad de chances.');
                goToPayBtn.innerHTML = `<i class="bi bi-credit-card me-2"></i> Ir a pagar (${cantidadChances} chance${cantidadChances=="1"?"":"s"})`;
                goToPayBtn.disabled = false;
            }
        }, 500);
    }

    console.log('✅ Sorteo.js inicializado correctamente');
});
