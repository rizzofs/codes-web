/**
 * Analytics Debug Script
 * This script helps diagnose Google Analytics issues
 */

class AnalyticsDebugger {
    constructor() {
        this.issues = [];
        this.warnings = [];
        this.success = [];
    }

    // Check if Google Analytics is loaded
    checkAnalyticsLoaded() {
        if (typeof gtag === 'undefined') {
            this.issues.push('Google Analytics (gtag) no está cargado');
            return false;
        }
        
        if (typeof window.dataLayer === 'undefined') {
            this.issues.push('DataLayer no está inicializado');
            return false;
        }
        
        this.success.push('Google Analytics está cargado correctamente');
        return true;
    }

    // Check if the tracking ID is valid
    checkTrackingId() {
        const trackingId = 'G-C73GLNE05C';
        
        if (!trackingId || trackingId.length < 10) {
            this.issues.push('ID de tracking inválido o muy corto');
            return false;
        }
        
        if (!trackingId.startsWith('G-')) {
            this.issues.push('ID de tracking no tiene formato GA4 válido (debe empezar con G-)');
            return false;
        }
        
        this.success.push('ID de tracking parece válido: ' + trackingId);
        return true;
    }

    // Check if the page is being tracked
    checkPageTracking() {
        if (typeof gtag === 'undefined') {
            this.issues.push('No se puede verificar tracking de página - gtag no disponible');
            return false;
        }

        // Check if page view was sent
        const dataLayer = window.dataLayer || [];
        const pageViewEvents = dataLayer.filter(item => 
            item[0] === 'config' && item[1] === 'G-C73GLNE05C'
        );

        if (pageViewEvents.length === 0) {
            this.issues.push('No se detectó evento de page view');
            return false;
        }

        this.success.push('Page view detectado en dataLayer');
        return true;
    }

    // Check for common issues
    checkCommonIssues() {
        // Check if running on localhost (analytics might be blocked)
        if (window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1') {
            this.warnings.push('Ejecutando en localhost - Analytics puede estar bloqueado por ad blockers');
        }

        // Check for ad blockers
        if (typeof window.google_tag_manager === 'undefined') {
            this.warnings.push('Google Tag Manager no detectado - posible ad blocker activo');
        }

        // Check if scripts are blocked
        const analyticsScript = document.querySelector('script[src*="googletagmanager"]');
        if (!analyticsScript) {
            this.issues.push('Script de Google Analytics no encontrado en el DOM');
        } else {
            this.success.push('Script de Google Analytics encontrado en el DOM');
        }
    }

    // Test sending an event
    testEvent() {
        if (typeof gtag === 'undefined') {
            this.issues.push('No se puede enviar evento de prueba - gtag no disponible');
            return false;
        }

        try {
            gtag('event', 'debug_test', {
                event_category: 'debug',
                event_label: 'test_event',
                value: 1
            });
            this.success.push('Evento de prueba enviado correctamente');
            return true;
        } catch (error) {
            this.issues.push('Error al enviar evento de prueba: ' + error.message);
            return false;
        }
    }

    // Run all checks
    runDiagnostics() {
        console.log('🔍 Iniciando diagnóstico de Google Analytics...');
        
        this.checkAnalyticsLoaded();
        this.checkTrackingId();
        this.checkPageTracking();
        this.checkCommonIssues();
        this.testEvent();

        this.displayResults();
    }

    // Display results
    displayResults() {
        console.log('\n📊 RESULTADOS DEL DIAGNÓSTICO:');
        console.log('=====================================');
        
        if (this.success.length > 0) {
            console.log('\n✅ ÉXITOS:');
            this.success.forEach(msg => console.log('  ✓ ' + msg));
        }
        
        if (this.warnings.length > 0) {
            console.log('\n⚠️  ADVERTENCIAS:');
            this.warnings.forEach(msg => console.log('  ⚠ ' + msg));
        }
        
        if (this.issues.length > 0) {
            console.log('\n❌ PROBLEMAS:');
            this.issues.forEach(msg => console.log('  ✗ ' + msg));
        }

        console.log('\n📋 DataLayer actual:');
        console.log(window.dataLayer || 'No disponible');
        
        console.log('\n🔧 SOLUCIONES SUGERIDAS:');
        if (this.issues.length === 0 && this.warnings.length === 0) {
            console.log('  ✓ Analytics parece estar funcionando correctamente');
        } else {
            if (this.issues.includes('Google Analytics (gtag) no está cargado')) {
                console.log('  1. Verificar que el script de GA esté incluido en el HTML');
                console.log('  2. Verificar que no haya errores de red');
                console.log('  3. Desactivar ad blockers temporalmente');
            }
            if (this.warnings.includes('posible ad blocker activo')) {
                console.log('  1. Desactivar ad blockers para este sitio');
                console.log('  2. Agregar excepción para googletagmanager.com');
            }
        }
    }
}

// Auto-run diagnostics after page load
window.addEventListener('load', function() {
    setTimeout(() => {
        const debugger = new AnalyticsDebugger();
        debugger.runDiagnostics();
        
        // Make debugger available globally
        window.analyticsDebugger = debugger;
    }, 2000);
});

// Export for manual use
window.AnalyticsDebugger = AnalyticsDebugger; 