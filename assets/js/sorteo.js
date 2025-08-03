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

    // --- Carrusel automático de imágenes ---
    const images = document.querySelectorAll('.carousel-img');
    let current = 0;
    if (images.length > 1) {
        setInterval(() => {
            images[current].classList.remove('active');
            current = (current + 1) % images.length;
            images[current].classList.add('active');
        }, 3000); // Cambia cada 3 segundos
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
            '1': 1,
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

    // Mostrar botón de ir a pagar cuando se seleccione cantidad de chances válida
    const cantidadChances = document.getElementById('cantidadChances');
    const goToPayContainer = document.getElementById('goToPayContainer');
    const goToPayBtn = document.getElementById('goToPayBtn');

    // Links de pago según la cantidad de chances
    const paymentLinks = {
        1: 'https://mpago.la/2YQW3HX',
        3: 'https://mpago.la/2YQW3HX', // Usar el mismo link por ahora
        4: 'https://mpago.la/2YQW3HX'  // Usar el mismo link por ahora
    };

    if (cantidadChances) {
        console.log('✅ Select de chances encontrado:', cantidadChances);
        cantidadChances.addEventListener('change', function() {
            console.log('🔄 Cantidad de chances cambiada a:', this.value);
            if (["1","3","4"].includes(this.value)) {
                console.log('✅ Mostrando botón de pago para', this.value, 'chances');
                goToPayContainer.style.display = "block";
                goToPayBtn.disabled = false;
                goToPayBtn.setAttribute('data-link', paymentLinks[this.value]);
                goToPayBtn.innerHTML = `<i class="bi bi-credit-card me-2"></i> Ir a pagar (${this.value} chance${this.value=="1"?"":"s"})`;
            } else {
                console.log('❌ Ocultando botón de pago - cantidad inválida');
                goToPayContainer.style.display = "none";
                goToPayBtn.disabled = true;
                goToPayBtn.removeAttribute('data-link');
                goToPayBtn.innerHTML = `<i class="bi bi-credit-card me-2"></i> Ir a pagar`;
            }
        });
    } else {
        console.log('❌ No se encontró el select de chances');
    }

    if (goToPayBtn) {
        console.log('✅ Botón de pago encontrado:', goToPayBtn);
        // Removemos el event listener anterior ya que ahora usamos onclick
        console.log('ℹ️ El botón de pago ahora usa onclick="simularPagoCompleto()"');
    } else {
        console.log('❌ No se encontró el botón de pago');
    }

    // Detectar si vuelve de la pasarela de pago (?pagado=ok)
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
    const pagado = getQueryParam('pagado');

    // --- Control robusto del botón submit ---
    const submitBtn = document.querySelector('.btn-submit');
    console.log('Botón submit encontrado:', submitBtn);
    
    function mostrarBotonSubmit() {
        if (submitBtn) {
            submitBtn.style.display = 'inline-block';
            submitBtn.disabled = false;
            console.log('Botón submit mostrado');
        } else {
            console.log('No se encontró el botón submit');
        }
    }
    function ocultarBotonSubmit() {
        if (submitBtn) {
            submitBtn.style.display = 'none';
            submitBtn.disabled = true;
            console.log('Botón submit oculto');
        }
    }

    console.log('Valor de pagado:', pagado);
    if (pagado === 'ok') {
        console.log('Pago confirmado, mostrando botón submit');
        if (goToPayContainer) goToPayContainer.style.display = 'none';
        mostrarBotonSubmit();
        submitBtn && submitBtn.scrollIntoView({behavior: 'smooth'});
    } else {
        console.log('Pago no confirmado, ocultando botón submit');
        ocultarBotonSubmit();
    }

    // --- Configuración de Google Sheets ---
    // URL de tu Google Apps Script
    const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxOxMXytFzphjVGZ13jIFZxZ8HNCWABjjLTQC2Lpiiac2Vw9nwqlNsn82hK5_yCUQxbjw/exec';

    // --- Función para enviar datos a Google Sheets ---
    async function enviarAGoogleSheets(formData) {
        try {
            console.log('Enviando datos a Google Sheets:', GOOGLE_SHEETS_URL);
            console.log('Datos a enviar:', JSON.stringify(formData));
            
            const response = await fetch(GOOGLE_SHEETS_URL, {
                method: 'POST',
                mode: 'no-cors', // Importante para Google Apps Script
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            console.log('Respuesta del servidor:', response);
            // Como no-cors no permite leer la respuesta, asumimos éxito
            return { success: true };
        } catch (error) {
            console.error('Error enviando a Google Sheets:', error);
            return { success: false, error: error.message };
        }
    }

    // --- Manejo del formulario ---
    const sorteoForm = document.getElementById('sorteoForm');
    if (sorteoForm) {
        console.log('✅ Formulario encontrado:', sorteoForm);
        sorteoForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('🎯 Formulario enviado - Iniciando proceso');

            // Validar que el pago fue confirmado (opcional por ahora)
            if (pagado !== 'ok') {
                console.log('Pago no confirmado, pagado =', pagado);
                // Permitir continuar sin validación estricta del pago
                console.log('Continuando sin validación estricta del pago');
            } else {
                console.log('Pago confirmado, procediendo con envío');
            }

            // Obtener datos del formulario
            const nombre = document.getElementById('nombre').value;
            const apellido = document.getElementById('apellido').value;
            const email = document.getElementById('email').value;
            const dni = document.getElementById('dni').value;
            const telefono = document.getElementById('telefono').value;
            const cantidadChances = document.getElementById('cantidadChances').value;
            
            console.log('📋 Campos del formulario:');
            console.log('  - Nombre:', nombre);
            console.log('  - Apellido:', apellido);
            console.log('  - Email:', email);
            console.log('  - DNI:', dni);
            console.log('  - Teléfono:', telefono);
            console.log('  - Cantidad de Chances:', cantidadChances);
            
            const formData = {
                nombre: nombre,
                apellido: apellido,
                email: email,
                dni: dni,
                telefono: telefono,
                cantidadChances: cantidadChances,
                pagoConfirmado: true,
                fechaRegistro: new Date().toISOString(),
                timestamp: new Date().getTime()
            };
            
            console.log('📊 Datos completos del formulario:', formData);

            // Validar campos requeridos
            if (!formData.nombre || !formData.apellido || !formData.email || 
                !formData.dni || !formData.telefono || !formData.cantidadChances) {
                alert('Por favor completa todos los campos requeridos.');
                return;
            }

            // Mostrar estado de envío
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Enviando...';
            submitBtn.disabled = true;

            try {
                console.log('Iniciando envío a Google Sheets...');
                // Enviar a Google Sheets
                const result = await enviarAGoogleSheets(formData);
                
                if (result.success) {
                    console.log('✅ Envío exitoso a Google Sheets');
                    
                    // Limpiar formulario
                    sorteoForm.reset();
                    
                    // Ocultar botón de submit
                    ocultarBotonSubmit();
                    
                    // Redirigir a la página de agradecimiento
                    window.location.href = 'agradecimiento.html';
                } else {
                    console.log('❌ Error en el envío:', result.error);
                    throw new Error(result.error || 'Error desconocido');
                }
            } catch (error) {
                console.error('❌ Error inesperado:', error);
                alert('Hubo un error al enviar el formulario. Por favor intenta nuevamente.');
                
                // Restaurar botón
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    } else {
        console.log('❌ No se encontró el formulario sorteoForm');
    }

    console.log('✅ Sorteo.js inicializado correctamente');

    // Función de prueba para simular pago (temporal)
    window.simularPago = function() {
        console.log('🧪 Simulando pago manualmente...');
        window.location.href = 'https://codes-unlu.github.io/Web-Codes/sorteo.html?pagado=ok';
    };

    // Función para simular pago completo con animación
    window.simularPagoCompleto = function() {
        console.log('💳 Iniciando simulación de pago completo...');
        
        const goToPayBtn = document.getElementById('goToPayBtn');
        if (goToPayBtn) {
            // Cambiar el texto del botón
            goToPayBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Procesando pago...';
            goToPayBtn.disabled = true;
            
            console.log('⏳ Simulando procesamiento de pago...');
            
            // Simular el proceso de pago
            setTimeout(() => {
                console.log('✅ Pago procesado exitosamente');
                goToPayBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i> ¡Pago exitoso!';
                
                // Mostrar mensaje de agradecimiento
                setTimeout(() => {
                    alert('¡Gracias por tu pago! Tu participación ha sido confirmada.');
                    console.log('🔄 Redirigiendo con parámetro de pago confirmado...');
                    window.location.href = 'https://codes-unlu.github.io/Web-Codes/sorteo.html?pagado=ok';
                }, 1000);
                
            }, 2000);
        } else {
            console.log('❌ No se encontró el botón de pago');
            // Fallback: simular pago directamente
            window.location.href = 'https://codes-unlu.github.io/Web-Codes/sorteo.html?pagado=ok';
        }
    };

    // Función para enviar datos inmediatamente después del pago
    window.enviarDatosInmediatamente = function() {
        console.log('📤 Enviando datos inmediatamente después del pago...');
        
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const email = document.getElementById('email').value;
        const dni = document.getElementById('dni').value;
        const telefono = document.getElementById('telefono').value;
        const cantidadChances = document.getElementById('cantidadChances').value;
        
        if (!nombre || !apellido || !email || !dni || !telefono || !cantidadChances) {
            alert('Por favor completa todos los campos antes de simular el pago.');
            return;
        }
        
        const formData = {
            nombre: nombre,
            apellido: apellido,
            email: email,
            dni: dni,
            telefono: telefono,
            cantidadChances: cantidadChances,
            pagoConfirmado: true,
            fechaRegistro: new Date().toISOString(),
            timestamp: new Date().getTime()
        };
        
        console.log('📊 Datos a enviar:', formData);
        
        // Enviar datos inmediatamente
        enviarAGoogleSheets(formData).then(result => {
            if (result.success) {
                console.log('✅ Datos enviados exitosamente');
                // Redirigir a la página de agradecimiento
                window.location.href = 'agradecimiento.html';
            } else {
                console.log('❌ Error enviando datos:', result.error);
                alert('Error al enviar los datos. Por favor intenta nuevamente.');
            }
        });
    };

    // Función para ir a pagar con Mercado Pago real
    window.irAPagar = function() {
        console.log('💳 Redirigiendo a Mercado Pago...');
        
        const cantidadChances = document.getElementById('cantidadChances').value;
        const goToPayBtn = document.getElementById('goToPayBtn');
        
        if (goToPayBtn) {
            // Cambiar el texto del botón
            goToPayBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Redirigiendo...';
            goToPayBtn.disabled = true;
            
            console.log('🔄 Redirigiendo a Mercado Pago para', cantidadChances, 'chances');
            
            // Redirigir al link de pago correspondiente
            setTimeout(() => {
                const paymentLink = paymentLinks[cantidadChances];
                if (paymentLink) {
                    console.log('🌐 Abriendo:', paymentLink);
                    window.open(paymentLink, '_blank');
                    
                    // Mostrar instrucciones al usuario
                    setTimeout(() => {
                        alert('✅ Pago iniciado en nueva ventana.\n\nDespués de completar el pago:\n1. Regresa a esta página\n2. Completa el formulario con tus datos\n3. Haz clic en "Registrar Participación"\n\n¡Gracias por participar!');
                        
                        // Mostrar el botón de submit para que pueda completar el formulario
                        mostrarBotonSubmit();
                        if (goToPayContainer) goToPayContainer.style.display = 'none';
                        
                        // Restaurar el botón de pago
                        goToPayBtn.innerHTML = `<i class="bi bi-credit-card me-2"></i> Ir a pagar (${cantidadChances} chance${cantidadChances=="1"?"":"s"})`;
                        goToPayBtn.disabled = false;
                    }, 2000);
                    
                } else {
                    console.log('❌ No se encontró el link de pago para', cantidadChances, 'chances');
                    alert('Error: No se encontró el link de pago. Por favor selecciona otra cantidad de chances.');
                    goToPayBtn.innerHTML = `<i class="bi bi-credit-card me-2"></i> Ir a pagar (${cantidadChances} chance${cantidadChances=="1"?"":"s"})`;
                    goToPayBtn.disabled = false;
                }
            }, 1000);
        } else {
            console.log('❌ No se encontró el botón de pago');
        }
    };

    // Función que combina simulación de pago + envío de datos
    window.simularPagoYEnviar = function() {
        console.log('💳 Iniciando simulación de pago y envío de datos...');
        
        const goToPayBtn = document.getElementById('goToPayBtn');
        if (goToPayBtn) {
            // Cambiar el texto del botón
            goToPayBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Procesando pago...';
            goToPayBtn.disabled = true;
            
            console.log('⏳ Simulando procesamiento de pago...');
            
            // Simular el proceso de pago
            setTimeout(() => {
                console.log('✅ Pago procesado exitosamente');
                goToPayBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i> ¡Pago exitoso!';
                
                // Enviar datos inmediatamente después del pago
                setTimeout(() => {
                    console.log('📤 Enviando datos después del pago...');
                    enviarDatosInmediatamente();
                }, 1000);
                
            }, 2000);
        } else {
            console.log('❌ No se encontró el botón de pago');
            // Fallback: enviar datos directamente
            enviarDatosInmediatamente();
        }
    };

    // Función para mostrar agradecimiento elegante
    function mostrarAgradecimiento() {
        console.log('🎉 Mostrando pantalla de agradecimiento...');
        
        // Ocultar el formulario
        const formStep = document.getElementById('formStep');
        if (formStep) {
            formStep.style.display = 'none';
        }
        
        // Crear y mostrar pantalla de agradecimiento
        const agradecimientoHTML = `
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-8">
                        <div class="product-card text-center">
                            <div class="product-details">
                                <div class="mb-4">
                                    <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
                                </div>
                                <h2 class="product-title text-success mb-3">¡Participación Confirmada!</h2>
                                <p class="lead mb-4">Gracias por participar en nuestro sorteo de la Tablet Android 15.</p>
                                
                                <div class="alert alert-success">
                                    <i class="bi bi-info-circle me-2"></i>
                                    <strong>Tu participación ha sido registrada exitosamente.</strong><br>
                                    Te notificaremos si resultas ganador/a.
                                </div>
                                
                                <div class="mt-4">
                                    <a href="https://codes-unlu.github.io/Web-Codes/" class="btn btn-primary btn-lg me-3">
                                        <i class="bi bi-house me-2"></i>Volver al Inicio
                                    </a>
                                    <button class="btn btn-outline-secondary btn-lg" onclick="volverAlSorteo()">
                                        <i class="bi bi-arrow-left me-2"></i>Participar Nuevamente
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Insertar el agradecimiento en la página
        const sorteoContainer = document.querySelector('.sorteo-container');
        if (sorteoContainer) {
            sorteoContainer.innerHTML = agradecimientoHTML;
        }
    }

    // Función para volver al sorteo
    window.volverAlSorteo = function() {
        console.log('🔄 Volviendo al sorteo...');
        window.location.reload();
    };
});
