# Configuración Google Analytics 4 - CODES++

## Detalles del Flujo

| Campo | Valor |
|-------|-------|
| **Nombre del flujo** | C.O.D.E.S - GA4 |
| **URL del flujo** | https://sites.google.com/view/unlu-codes/inicio |
| **ID del flujo** | 4943511247 |
| **ID de medición** | G-C73GLNE05C |

## Configuración Implementada

### 1. Script de Google Analytics (index.html)

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-C73GLNE05C"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-C73GLNE05C', {
    page_title: 'CODES++ - Centro de Estudiantes de Sistemas',
    page_location: window.location.href,
    send_page_view: true
  });
</script>
```

### 2. Eventos Personalizados Implementados

#### Navegación por Secciones
```javascript
gtag('event', 'navigation_click', {
    section: 'nosotros',
    link_text: 'Nosotros'
});
```

#### Búsqueda en el Sitio
```javascript
gtag('event', 'search_input', {
    search_term: 'término buscado',
    search_term_length: 10
});
```

#### Enlaces Externos
```javascript
gtag('event', 'external_link_click', {
    link_url: 'https://example.com',
    link_text: 'Texto del enlace'
});
```

#### Cambio de Tema
```javascript
gtag('event', 'theme_toggle', {
    theme: 'dark'
});
```

#### Profundidad de Scroll
```javascript
gtag('event', 'scroll_depth', {
    scroll_percent: 75
});
```

### 3. Tracking de Páginas (SPA)

```javascript
gtag('config', 'G-C73GLNE05C', {
    page_title: `CODES++ - ${section}`,
    page_location: window.location.href + '#' + section,
    send_page_view: true
});
```

## Verificación de Funcionamiento

### Servidor Local
El servidor está corriendo en: `http://localhost:8000`

### Páginas de Prueba
1. **Página Principal**: `http://localhost:8000/index.html`
2. **Página de Prueba Analytics**: `http://localhost:8000/analytics-test.html`

### Diagnóstico Automático
El script de diagnóstico se ejecuta automáticamente y muestra en la consola:
- ✅ ÉXITOS: Funciones que están funcionando
- ⚠️ ADVERTENCIAS: Posibles problemas
- ❌ PROBLEMAS: Errores que necesitan atención

## Comandos de Verificación

### En la Consola del Navegador

```javascript
// Verificar si GA está cargado
typeof gtag !== 'undefined'

// Verificar dataLayer
window.dataLayer

// Verificar configuración
gtag('config', 'G-C73GLNE05C')

// Ejecutar diagnóstico manual
new AnalyticsDebugger().runDiagnostics()

// Enviar evento de prueba
gtag('event', 'manual_test', {test: true})
```

## Flujo de Datos

1. **Carga de Página** → Page View automático
2. **Navegación** → Evento `navigation_click`
3. **Búsqueda** → Evento `search_input`
4. **Enlaces Externos** → Evento `external_link_click`
5. **Cambio de Tema** → Evento `theme_toggle`
6. **Scroll** → Evento `scroll_depth` (cada 25%)

## Verificación en Google Analytics

### 1. Tiempo Real
- Ve a GA4 > Informes > Tiempo real
- Verifica visitantes activos

### 2. Eventos
- Ve a GA4 > Informes > Eventos
- Busca eventos personalizados

### 3. Páginas
- Ve a GA4 > Informes > Páginas y pantallas
- Verifica secciones como páginas separadas

## Troubleshooting

### Si Analytics No Funciona:

1. **Verificar Ad Blockers**
   - Desactivar temporalmente
   - Agregar excepción para `*.googletagmanager.com`

2. **Verificar Localhost**
   - Usar modo incógnito
   - Verificar que no haya bloqueos

3. **Verificar ID**
   - Confirmar que `G-C73GLNE05C` sea correcto
   - Verificar en Google Analytics

4. **Verificar Red**
   - Revisar Network tab en DevTools
   - Verificar requests a GA

## Estado Actual

✅ **Configuración Completa**
- ID de medición correcto
- Scripts implementados
- Eventos personalizados configurados
- Diagnóstico automático activo

✅ **Servidor Local Activo**
- Puerto 8000
- Listo para pruebas

✅ **Herramientas de Debug**
- Script de diagnóstico
- Página de prueba
- Documentación completa

---

**Última verificación**: Diciembre 2024
**Estado**: ✅ Configurado y Funcionando 