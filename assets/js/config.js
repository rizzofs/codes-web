/**
 * Configuración del Frontend
 * Centraliza todas las configuraciones del lado cliente
 */

const SORTEO_CONFIG = {
    // Configuración de la aplicación
    app: {
        name: 'Sorteo CODES++',
        version: '2.0.0',
        apiUrl: '/api/process_sorteo.php'
    },

    // Configuración de precios
    prices: {
        1: 1000,
        3: 2800,
        4: 4000
    },

    // Enlaces de pago
    paymentLinks: {
        1: 'https://mpago.la/link-para-1-chance',
        3: 'https://mpago.la/link-para-3-chances',
        4: 'https://mpago.la/link-para-4-chances'
    },

    // Configuración de validación
    validation: {
        minNameLength: 2,
        dniPattern: /^\d{7,8}$/,
        phonePattern: /^[\d\s\-\+\(\)]{10,}$/,
        emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },

    // Configuración de UI
    ui: {
        carouselInterval: 3000,
        scrollThreshold: 300,
        alertTimeout: 5000
    },

    // Mensajes
    messages: {
        success: {
            registration: 'Participación registrada exitosamente',
            payment: '¡Pago procesado correctamente! Ya puedes registrar tu participación.'
        },
        error: {
            connection: 'Error de conexión. Inténtalo de nuevo.',
            validation: 'Por favor, verifica los datos ingresados.',
            duplicate: 'Ya existe una participación con este email o DNI'
        },
        validation: {
            required: 'Este campo es requerido',
            email: 'El email debe ser válido',
            dni: 'El DNI debe tener 7 u 8 dígitos',
            phone: 'El teléfono debe ser válido',
            chances: 'La cantidad de chances debe ser 1, 3 o 4'
        }
    },

    // Configuración de animaciones
    animations: {
        duration: 300,
        easing: 'ease-in-out'
    }
};

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SORTEO_CONFIG;
} 