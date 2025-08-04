# 🚀 Sistema Completo de Pagos - CODES++

## 📋 Resumen del Sistema

Este sistema maneja completamente el flujo de pagos para el sorteo de la Tablet Android 15:

1. **Usuario completa formulario** → Datos se registran en Google Sheets
2. **Usuario hace pago en MercadoPago** → Sistema verifica automáticamente
3. **Confirmación automática** → Email enviado al usuario
4. **Verificación periódica** → Sistema busca pagos pendientes cada hora

## 🔧 Configuración Requerida

### 1. Google Apps Script

**Archivo:** `sistema-completo-pagos.gs`

**Pasos:**
1. Ir a [script.google.com](https://script.google.com)
2. Crear nuevo proyecto
3. Copiar todo el contenido de `sistema-completo-pagos.gs`
4. Guardar como "Sistema de Pagos CODES++"
5. Desplegar como aplicación web
6. Copiar la URL de despliegue

### 2. MercadoPago

**Configurar URLs de retorno en cada link de pago:**

- **URL de Éxito:** `https://codes-unlu.github.io/Web-Codes/redirect-pago.html`
- **URL de Fallo:** `https://codes-unlu.github.io/Web-Codes/sorteo.html?error=pago_fallido`
- **URL de Pendiente:** `https://codes-unlu.github.io/Web-Codes/sorteo.html?error=pago_pendiente`

### 3. Google Sheets

**ID de la hoja:** `1rCNIwjzB--xtIyK4gMvqIxJGLETra4VqnF5aL8lRTMk`
**Nombre de la hoja:** `Registros_Sorteo`

## 🧪 Pruebas del Sistema

### Función 1: `configurarTodo()`
```javascript
// Ejecutar en Google Apps Script
configurarTodo();
```
**Resultado esperado:** Sistema configurado con triggers automáticos

### Función 2: `probarTodo()`
```javascript
// Ejecutar en Google Apps Script
probarTodo();
```
**Resultado esperado:** Todas las conexiones funcionando correctamente

### Función 3: `ejecutarSistemaCompleto()`
```javascript
// Ejecutar en Google Apps Script
ejecutarSistemaCompleto();
```
**Resultado esperado:** Verificación de pagos pendientes y limpieza de registros

## 📊 Flujo de Datos

### 1. Registro Inicial
```
Usuario completa formulario → 
Clic en "Ir a pagar" → 
Datos enviados a Google Sheets (PENDIENTE) → 
Redirección a MercadoPago
```

### 2. Confirmación de Pago
```
Usuario paga en MercadoPago → 
Redirección a redirect-pago.html → 
Parámetros procesados → 
Estado actualizado a CONFIRMADO → 
Email enviado → 
Redirección a agradecimiento.html
```

### 3. Verificación Automática
```
Trigger cada hora → 
Buscar pagos PENDIENTE → 
Verificar en MercadoPago API → 
Actualizar a CONFIRMADO → 
Enviar email
```

## 🔍 Diagnóstico de Problemas

### Si no encuentra pagos:

1. **Ejecutar:** `diagnosticarPagosExistentes()`
2. **Verificar:** Headers de la hoja
3. **Comprobar:** Access Token de MercadoPago
4. **Revisar:** Logs en Google Apps Script

### Si no se envían datos:

1. **Verificar:** URL de Google Apps Script en `sorteo.js`
2. **Comprobar:** Permisos de la aplicación web
3. **Revisar:** Console del navegador para errores

### Si no llegan emails:

1. **Verificar:** Función `enviarEmailConfirmacion()`
2. **Comprobar:** Permisos de MailApp
3. **Revisar:** Logs de ejecución

## 📈 Monitoreo

### Logs Importantes:
- `🔄 Iniciando verificación de pagos pendientes...`
- `✅ Pago confirmado: [sessionId]`
- `📧 Email de confirmación enviado a: [email]`
- `✅ Verificación completada: X pagos actualizados`

### Métricas a Revisar:
- Total de registros en Google Sheets
- Pagos PENDIENTE vs CONFIRMADO
- Emails enviados exitosamente
- Errores en logs

## 🚨 Solución de Errores Comunes

### Error: "Hoja no encontrada"
**Solución:** Verificar ID de la hoja y permisos

### Error: "Access Token inválido"
**Solución:** Regenerar token en MercadoPago

### Error: "No se encontraron pagos"
**Solución:** Verificar que los pagos existan en MercadoPago

### Error: "CORS policy"
**Solución:** Verificar configuración de aplicación web

## 📞 Soporte

Para problemas técnicos:
1. Revisar logs en Google Apps Script
2. Verificar console del navegador
3. Comprobar configuración de MercadoPago
4. Validar permisos de Google Sheets

## ✅ Checklist de Configuración

- [ ] Google Apps Script desplegado
- [ ] URL de Google Apps Script actualizada en `sorteo.js`
- [ ] MercadoPago configurado con URLs de retorno
- [ ] Google Sheets con permisos correctos
- [ ] Triggers automáticos configurados
- [ ] Pruebas ejecutadas exitosamente
- [ ] Emails de confirmación funcionando
- [ ] Verificación automática activa

## 🎯 Resultado Final

Un sistema completamente automatizado que:
- Registra participantes automáticamente
- Verifica pagos en tiempo real
- Envía confirmaciones por email
- Mantiene datos organizados en Google Sheets
- Funciona sin intervención manual 