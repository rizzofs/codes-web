# Google Analytics Setup & Troubleshooting

## Configuración Actual

El sitio web de CODES++ utiliza **Google Analytics 4 (GA4)** con el ID de tracking: `G-C73GLNE05C`

### Archivos de Configuración

1. **index.html** - Configuración principal de GA4
2. **assets/js/main.js** - Funciones de tracking personalizadas
3. **assets/js/analytics-debug.js** - Script de diagnóstico

## Verificación de Funcionamiento

### 1. Verificación Básica

Abre la consola del navegador (F12) y verifica:

```javascript
// Verificar si gtag está disponible
typeof gtag !== 'undefined'

// Verificar dataLayer
window.dataLayer

// Verificar configuración
gtag('config', 'G-C73GLNE05C')
```

### 2. Script de Diagnóstico Automático

El sitio incluye un script de diagnóstico que se ejecuta automáticamente. Revisa la consola para ver:

- ✅ ÉXITOS: Funciones que están funcionando
- ⚠️ ADVERTENCIAS: Posibles problemas
- ❌ PROBLEMAS: Errores que necesitan atención

### 3. Página de Prueba

Abre `analytics-test.html` para una verificación manual:

- Botón "Verificar Analytics" - Confirma que GA está cargado
- Botón "Probar Evento" - Envía un evento de prueba

## Problemas Comunes y Soluciones

### ❌ Google Analytics no está cargado

**Síntomas:**
- `typeof gtag === 'undefined'`
- No hay eventos en dataLayer

**Soluciones:**
1. Verificar que el script esté incluido en el HTML
2. Desactivar ad blockers temporalmente
3. Verificar conexión a internet
4. Revisar errores de red en DevTools

### ⚠️ Ad Blocker Detectado

**Síntomas:**
- Scripts de Google bloqueados
- Advertencias sobre googletagmanager.com

**Soluciones:**
1. Desactivar ad blocker para el sitio
2. Agregar excepción para `*.googletagmanager.com`
3. Usar modo incógnito para pruebas

### ❌ ID de Tracking Inválido

**Síntomas:**
- ID no empieza con "G-"
- ID muy corto o vacío

**Soluciones:**
1. Verificar el ID en Google Analytics
2. Crear nueva propiedad si es necesario
3. Actualizar el ID en el código

### ⚠️ Ejecutando en Localhost

**Síntomas:**
- Analytics funciona en producción pero no en desarrollo

**Soluciones:**
1. Usar servidor local con HTTPS
2. Configurar excepciones en ad blockers
3. Usar herramientas de desarrollo de GA

## Eventos Personalizados Implementados

### Navegación
```javascript
gtag('event', 'navigation_click', {
    section: 'nosotros',
    link_text: 'Nosotros'
});
```

### Búsqueda
```javascript
gtag('event', 'search_input', {
    search_term: 'término buscado',
    search_term_length: 10
});
```

### Enlaces Externos
```javascript
gtag('event', 'external_link_click', {
    link_url: 'https://example.com',
    link_text: 'Texto del enlace'
});
```

### Cambio de Tema
```javascript
gtag('event', 'theme_toggle', {
    theme: 'dark'
});
```

### Profundidad de Scroll
```javascript
gtag('event', 'scroll_depth', {
    scroll_percent: 75
});
```

## Verificación en Google Analytics

### 1. Tiempo Real
- Ve a Google Analytics > Informes > Tiempo real
- Verifica que aparezcan visitantes activos

### 2. Eventos
- Ve a Google Analytics > Informes > Eventos
- Busca los eventos personalizados implementados

### 3. Páginas
- Ve a Google Analytics > Informes > Páginas y pantallas
- Verifica que las secciones aparezcan como páginas separadas

## Comandos de Debug

### En la Consola del Navegador

```javascript
// Ejecutar diagnóstico manual
new AnalyticsDebugger().runDiagnostics()

// Enviar evento de prueba
gtag('event', 'manual_test', {test: true})

// Ver dataLayer
console.log(window.dataLayer)

// Verificar configuración
gtag('config', 'G-C73GLNE05C')
```

## Herramientas Útiles

### Extensiones de Navegador
- **Google Analytics Debugger** - Para Chrome
- **Tag Assistant Legacy** - Para debugging
- **GA Checker** - Para verificar implementación

### Herramientas de Desarrollo
- **Network Tab** - Verificar requests a GA
- **Console** - Verificar errores y dataLayer
- **Application Tab** - Verificar cookies de GA

## Contacto

Si tienes problemas con analytics, contacta al equipo de desarrollo o revisa la documentación oficial de Google Analytics 4.

---

**Última actualización:** Diciembre 2024
**Versión:** 1.0 