/* ========================================
   SORTEO PAGE JAVASCRIPT
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Sorteo.js cargado - Iniciando funcionalidad');
    
    // Guardar el contenido original del contenedor para poder restaurarlo
    const container = document.querySelector('.sorteo-container .container');
    if (container) {
        window.originalContainerContent = container.innerHTML;
        console.log('💾 Contenido original guardado para restauración');
    }

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

    // Función para formatear DNI referido
    window.formatDNIReferido = function(input) {
        // Solo permitir números
        input.value = input.value.replace(/\D/g, '');
        // Limitar a 8 dígitos
        if (input.value.length > 8) {
            input.value = input.value.slice(0, 8);
        }
        
        // Limpiar feedback cuando se modifica el DNI
        document.getElementById('referidoFeedback').innerHTML = '';
    };

    // Función simplificada para validar referido (solo validaciones básicas)
    window.validarReferido = function() {
        const dniReferido = document.getElementById('dniReferido').value.trim();
        const dniComprador = document.getElementById('dni').value.trim();
        const feedback = document.getElementById('referidoFeedback');
        
        // Limpiar feedback si no hay DNI ingresado
        if (!dniReferido) {
            feedback.innerHTML = '';
            return;
        }
        
        // Validaciones básicas
        if (dniReferido.length !== 8) {
            feedback.innerHTML = '<div class="alert alert-warning alert-sm"><i class="bi bi-exclamation-triangle me-1"></i>El DNI debe tener 8 dígitos</div>';
            return;
        }
        
        if (dniReferido === dniComprador) {
            feedback.innerHTML = '<div class="alert alert-danger alert-sm"><i class="bi bi-x-circle me-1"></i>No podés referirte a vos mismo</div>';
            return;
        }
        
        // Si pasa las validaciones básicas, mostrar mensaje de éxito
        feedback.innerHTML = '<div class="alert alert-success alert-sm"><i class="bi bi-check-circle me-1"></i>DNI referido válido - Se validará manualmente</div>';
    };

    window.calculateTotal = function() {
        const cantidadChances = document.getElementById('cantidadChances').value;
        const chancesDisplay = document.getElementById('chancesDisplay');
        const totalPrecio = document.getElementById('totalPrecio');
        const referidoContainer = document.getElementById('referidoContainer');
        
        const precios = {
            '1': 1000,
            '3': 2800,
            '4': 4000,
            '6': 5500,
            '10': 9000
        };
        
        // Calcular chances totales (incluyendo regalos)
        const chancesRegalo = {
            '1': 0,
            '3': 0,
            '4': 1,
            '6': 2,
            '10': 3
        };
        
        // Mostrar/ocultar campo de referido según el pack seleccionado
        const packsValidos = ['4', '6', '10'];
        if (packsValidos.includes(cantidadChances)) {
            referidoContainer.style.display = 'block';
        } else {
            referidoContainer.style.display = 'none';
            // Limpiar campo de referido si se cambia a pack no válido
            document.getElementById('dniReferido').value = '';
            document.getElementById('referidoFeedback').innerHTML = '';
        }
        
        if (cantidadChances && precios[cantidadChances]) {
            const chancesTotales = parseInt(cantidadChances) + chancesRegalo[cantidadChances];
            chancesDisplay.textContent = chancesTotales;
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
        1: 'https://mpago.la/1dNkdK5', // $1000
        3: 'https://mpago.la/2sDNEXs', // $2800
        4: 'https://mpago.la/1f7bfZb', // $4000
        6: 'https://mpago.la/2jGc6UY', // $5500
        10: 'https://mpago.la/2L4x5Xw' // $9000
    };
    
    console.log('🔗 Enlaces de pago cargados:', paymentLinks);

    // Función para validar que el formulario esté completo (global para re-inicialización)
    window.validarFormularioCompleto = function() {
        const nombre = document.getElementById('nombre').value.trim();
        const apellido = document.getElementById('apellido').value.trim();
        const email = document.getElementById('email').value.trim();
        const dni = document.getElementById('dni').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const cantidadChances = document.getElementById('cantidadChances').value;
        
        return nombre && apellido && email && dni && telefono && cantidadChances;
    }

    // Función para actualizar el botón de pago (global para re-inicialización)
    window.actualizarBotonPago = function() {
        const formularioCompleto = validarFormularioCompleto();
        const cantidadChances = document.getElementById('cantidadChances').value;
        
        if (formularioCompleto && ["1","3","4","6","10"].includes(cantidadChances)) {
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
    const camposFormulario = ['nombre', 'apellido', 'email', 'dni', 'telefono', 'cantidadChances', 'dniReferido'];
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
            alert('Por favor completa todos los campos del formulario antes de proceder al pago. Recuerda volver a esta página después del pago.');
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
            const dniReferido = document.getElementById('dniReferido').value.trim();
            
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
                observaciones: dniReferido ? `REF:${dniReferido}` : '',
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

    // Limpiar datos antiguos al cargar la página
    limpiarDatosAntiguos();
    
    // Verificar si el usuario regresó de MercadoPago
    verificarRetornoDePago();

    console.log('✅ Sorteo.js inicializado correctamente');
});

// Función para limpiar datos antiguos del localStorage
function limpiarDatosAntiguos() {
    const sorteoPendiente = localStorage.getItem('sorteo_pendiente');
    
    if (sorteoPendiente) {
        try {
            const datosPendientes = JSON.parse(sorteoPendiente);
            const tiempoRegistro = datosPendientes.timestamp || datosPendientes.fechaRegistro;
            const tiempoActual = new Date().getTime();
            const tiempoTranscurrido = tiempoActual - tiempoRegistro;
            const veinticuatroHorasEnMs = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
            
            if (tiempoTranscurrido > veinticuatroHorasEnMs) {
                console.log('🧹 Limpiando datos muy antiguos del localStorage (más de 24 horas)');
                localStorage.removeItem('sorteo_pendiente');
            }
        } catch (error) {
            console.log('❌ Error al procesar datos antiguos - Limpiando localStorage');
            localStorage.removeItem('sorteo_pendiente');
        }
    }
}

// Función para verificar si el usuario regresó de MercadoPago
function verificarRetornoDePago() {
    // Verificar si hay parámetros en la URL que indiquen retorno de pago
    const urlParams = new URLSearchParams(window.location.search);
    const returnFromPayment = urlParams.get('return_from_payment');
    const paymentStatus = urlParams.get('status');
    const collectionStatus = urlParams.get('collection_status');
    const status = urlParams.get('status');
    
    // Verificar si hay datos en localStorage de un pago pendiente
    const sorteoPendiente = localStorage.getItem('sorteo_pendiente');
    
    // Solo mostrar agradecimiento si realmente hay indicios de pago exitoso
    const pagoExitoso = returnFromPayment === 'true' || 
                       paymentStatus === 'success' || 
                       collectionStatus === 'approved' || 
                       status === 'approved';
    
    if (pagoExitoso) {
        console.log('🔄 Usuario regresó de MercadoPago con pago exitoso - Mostrando mensaje de agradecimiento');
        console.log('📊 Parámetros de pago:', {
            returnFromPayment,
            paymentStatus,
            collectionStatus,
            status
        });
        
        // Limpiar datos del localStorage
        if (sorteoPendiente) {
            localStorage.removeItem('sorteo_pendiente');
        }
        
        // Limpiar parámetros de la URL
        const nuevaUrl = window.location.pathname;
        window.history.replaceState({}, document.title, nuevaUrl);
        
        // Mostrar mensaje de agradecimiento
        mostrarMensajeAgradecimiento();
    } else if (sorteoPendiente) {
        // Verificar si los datos pendientes son recientes (menos de 2 horas)
        try {
            const datosPendientes = JSON.parse(sorteoPendiente);
            const tiempoRegistro = datosPendientes.timestamp || datosPendientes.fechaRegistro;
            const tiempoActual = new Date().getTime();
            const tiempoTranscurrido = tiempoActual - tiempoRegistro;
            const dosHorasEnMs = 2 * 60 * 60 * 1000; // 2 horas en milisegundos
            
            if (tiempoTranscurrido < dosHorasEnMs) {
                // Si han pasado menos de 2 horas, mostrar mensaje de verificación
                console.log('⏳ Hay datos pendientes recientes - Mostrando mensaje de verificación');
                mostrarMensajeVerificacion();
            } else {
                // Si han pasado más de 2 horas, limpiar datos y mostrar formulario normal
                console.log('⏰ Datos pendientes muy antiguos - Limpiando y mostrando formulario normal');
                localStorage.removeItem('sorteo_pendiente');
                // No hacer nada más, el formulario se mostrará normalmente
            }
        } catch (error) {
            // Si hay error al parsear, limpiar datos
            console.log('❌ Error al procesar datos pendientes - Limpiando localStorage');
            localStorage.removeItem('sorteo_pendiente');
        }
    }
}

// Función para mostrar mensaje de verificación (cuando hay datos pendientes pero no confirmación de pago)
function mostrarMensajeVerificacion() {
    // Ocultar el formulario
    const formStep = document.getElementById('formStep');
    const productCard = document.querySelector('.product-card');
    
    if (formStep) formStep.style.display = 'none';
    if (productCard) productCard.style.display = 'none';
    
    // Crear y mostrar el mensaje de verificación
    const container = document.querySelector('.sorteo-container .container');
    if (container) {
        container.innerHTML = `
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="product-card">
                        <div class="product-details text-center">
                            <div class="mb-4">
                                <i class="bi bi-clock text-warning" style="font-size: 4rem;"></i>
                            </div>
                            <h2 class="product-title text-warning">Verificando tu pago...</h2>
                            <h4 class="product-subtitle">Tu participación está siendo procesada</h4>
                            
                            <div class="alert alert-info mt-4" role="alert">
                                <i class="bi bi-info-circle me-2"></i>
                                <strong>Información importante:</strong> Hemos registrado tu participación recientemente. Si realizaste el pago, será verificado manualmente y tus chances se actualizarán en las próximas 24 horas. Si no completaste el pago o quieres intentar nuevamente, podés usar el botón de abajo.
                            </div>
                            
                            <div class="mt-4">
                                <button onclick="limpiarYVolver()" class="btn btn-primary btn-lg me-3">
                                    <i class="bi bi-arrow-left me-2"></i>Intentar nuevamente
                                </button>
                                <a href="verificar-chances.html" class="btn btn-outline-primary btn-lg">
                                    <i class="bi bi-search me-2"></i>Consultar Chances
                                </a>
                            </div>
                            
                            <div class="mt-4">
                                <p class="text-muted">
                                    <i class="bi bi-envelope me-2"></i>
                                    Si tenés alguna pregunta, contactanos en: <a href="mailto:codes.unlu@gmail.com">codes.unlu@gmail.com</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Función global para limpiar localStorage y volver al formulario
window.limpiarYVolver = function() {
    console.log('🧹 Limpiando localStorage y volviendo al formulario...');
    
    // Limpiar localStorage
    localStorage.removeItem('sorteo_pendiente');
    
    // Limpiar parámetros de URL si los hay
    const nuevaUrl = window.location.pathname;
    window.history.replaceState({}, document.title, nuevaUrl);
    
    // Restaurar el contenido original del contenedor
    const container = document.querySelector('.sorteo-container .container');
    if (container && window.originalContainerContent) {
        container.innerHTML = window.originalContainerContent;
        console.log('✅ Contenido original restaurado');
        
        // Asegurar que el estado inicial sea correcto
        const formStep = document.getElementById('formStep');
        const productCard = document.querySelector('.product-card');
        
        console.log('🔍 Estado inicial después de restaurar:');
        console.log('📍 FormStep encontrado:', !!formStep);
        console.log('📍 ProductCard encontrado:', !!productCard);
        
        if (formStep) {
            formStep.style.display = 'none';
            console.log('✅ FormStep ocultado');
        }
        if (productCard) {
            productCard.style.display = 'block';
            console.log('✅ ProductCard mostrado');
        }
        
        // Re-inicializar los event listeners del formulario INMEDIATAMENTE
        console.log('🔄 Iniciando re-inicialización INMEDIATA...');
        
        try {
            // Re-inicializar el botón principal de navegación
            const nextStepBtn = document.getElementById('nextStepBtn');
            const formStep = document.getElementById('formStep');
            const productCard = document.querySelector('.product-card');
            
            console.log('🔍 Elementos encontrados en re-inicialización:');
            console.log('📍 nextStepBtn:', !!nextStepBtn);
            console.log('📍 formStep:', !!formStep);
            console.log('📍 productCard:', !!productCard);
            
            if (nextStepBtn) {
                // Remover event listeners existentes si los hay
                const newNextStepBtn = nextStepBtn.cloneNode(true);
                nextStepBtn.parentNode.replaceChild(newNextStepBtn, nextStepBtn);
                
                // Agregar nuevo event listener
                newNextStepBtn.addEventListener('click', function() {
                    console.log('🔄 Navegando al formulario...');
                    console.log('📍 ProductCard encontrado:', !!productCard);
                    console.log('📍 FormStep encontrado:', !!formStep);
                    
                    if (productCard) {
                        productCard.style.display = 'none';
                        console.log('✅ ProductCard ocultado');
                    }
                    if (formStep) {
                        formStep.style.display = 'block';
                        formStep.scrollIntoView({behavior: 'smooth'});
                        console.log('✅ FormStep mostrado y scrolleado');
                    }
                });
                console.log('🔄 Event listener del botón principal re-inicializado');
            } else {
                console.log('❌ No se encontró el botón nextStepBtn');
            }
            // Re-inicializar la función global goBackToProduct
            window.goBackToProduct = function() {
                console.log('🔄 Volviendo al producto...');
                if (formStep) formStep.style.display = 'none';
                if (productCard) {
                    productCard.style.display = 'block';
                    productCard.scrollIntoView({behavior: 'smooth'});
                }
            };
            
            // Re-inicializar la funcionalidad del formulario
            const cantidadChances = document.getElementById('cantidadChances');
            const goToPayContainer = document.getElementById('goToPayContainer');
            const goToPayBtn = document.getElementById('goToPayBtn');
            
            if (cantidadChances && goToPayContainer && goToPayBtn) {
                // Re-aplicar event listeners
                const camposFormulario = ['nombre', 'apellido', 'email', 'dni', 'telefono', 'cantidadChances', 'dniReferido'];
                camposFormulario.forEach(campo => {
                    const elemento = document.getElementById(campo);
                    if (elemento) {
                        elemento.addEventListener('input', actualizarBotonPago);
                        elemento.addEventListener('change', actualizarBotonPago);
                    }
                });
                
                // Re-inicializar el botón de pago
                actualizarBotonPago();
                console.log('🔄 Event listeners del formulario re-inicializados');
            }
        } catch (error) {
            console.error('❌ Error en re-inicialización:', error);
        }
    } else {
        // Si no hay contenido guardado, recargar la página
        console.log('🔄 No hay contenido guardado - Recargando página...');
        window.location.reload();
    }
}

// Función para mostrar mensaje de agradecimiento
function mostrarMensajeAgradecimiento() {
    // Ocultar el formulario
    const formStep = document.getElementById('formStep');
    const productCard = document.querySelector('.product-card');
    
    if (formStep) formStep.style.display = 'none';
    if (productCard) productCard.style.display = 'none';
    
    // Crear y mostrar el mensaje de agradecimiento
    const container = document.querySelector('.sorteo-container .container');
    if (container) {
        container.innerHTML = `
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="product-card">
                        <div class="product-details text-center">
                            <div class="mb-4">
                                <i class="bi bi-check-circle text-success" style="font-size: 4rem;"></i>
                            </div>
                            <h2 class="product-title text-success">¡Gracias por tu compra!</h2>
                            <h4 class="product-subtitle">Tu participación ha sido registrada</h4>
                            
                            <div class="alert alert-success mt-4" role="alert">
                                <i class="bi bi-info-circle me-2"></i>
                                <strong>Información importante:</strong> Tu pago será verificado manualmente y tus chances se actualizarán en las próximas 24 horas. Podés consultar tus chances actuales en la sección "Consultar Chances".
                            </div>
                            
                            <div class="mt-4">
                                <a href="index.html" class="btn btn-primary btn-lg me-3">
                                    <i class="bi bi-house me-2"></i>Volver al inicio
                                </a>
                                <a href="verificar-chances.html" class="btn btn-outline-primary btn-lg">
                                    <i class="bi bi-search me-2"></i>Consultar Chances
                                </a>
                            </div>
                            
                            <div class="mt-4">
                                <p class="text-muted">
                                    <i class="bi bi-envelope me-2"></i>
                                    Si tenés alguna pregunta, contactanos en: <a href="mailto:codes.unlu@gmail.com">codes.unlu@gmail.com</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
