# Configuración del Sistema Automático de Verificación de Pagos

## 🚀 Configuración Inicial

### 1. Actualizar Google Apps Script

1. Ve a [Google Apps Script](https://script.google.com/)
2. Abre tu proyecto existente o crea uno nuevo
3. Copia y pega el código actualizado de `sistema-completo-pagos-template.gs`
4. **IMPORTANTE**: Reemplaza las variables de configuración con tus datos reales:
   ```javascript
   const MERCADOPAGO_ACCESS_TOKEN = 'TU_ACCESS_TOKEN_AQUI';
   const GOOGLE_SHEET_ID = 'TU_SHEET_ID_AQUI';
   const GOOGLE_SHEET_NAME = 'TU_NOMBRE_DE_HOJA_AQUI';
   ```

### 2. Configurar el Trigger Automático

1. En Google Apps Script, ejecuta la función `configurarTriggerAutomatico()`
2. Esto configurará una verificación automática cada hora
3. Para verificar que funciona, ejecuta `ejecutarVerificacionManual()`

### 3. Desplegar el Web App

1. Haz clic en "Deploy" → "New deployment"
2. Selecciona "Web app"
3. Configura:
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Copia la URL generada y actualízala en `verificar-pago.html`

## 🔧 Funciones Disponibles

### Verificación Automática
- **Función**: `verificarPagosAutomaticamente()`
- **Frecuencia**: Cada hora (configurable)
- **Acción**: Verifica todos los pagos pendientes en Google Sheets

### Verificación Manual
- **Función**: `ejecutarVerificacionManual()`
- **Uso**: Para testing o verificación inmediata
- **Acción**: Ejecuta la verificación automática una vez

### Verificación por Datos Específicos
- **Función**: `verificarPagoPorDatos(data)`
- **Uso**: Desde la página web
- **Acción**: Verifica un pago específico por email y fecha

## 📊 Flujo Automático

1. **Cada hora** el sistema ejecuta `verificarPagosAutomaticamente()`
2. **Busca** en Google Sheets todos los registros con `Pago Confirmado = FALSE`
3. **Verifica** en MercadoPago usando el email y fecha de registro
4. **Actualiza** automáticamente los pagos confirmados
5. **Envía** emails de confirmación a los usuarios

## 🎯 Para tu Caso Específico

### Verificar tu pago de rizzofs@gmail.com:

1. **Opción 1 - Automática**: Espera a que se ejecute la verificación automática (cada hora)
2. **Opción 2 - Manual**: Ejecuta `ejecutarVerificacionManual()` en Google Apps Script
3. **Opción 3 - Web**: Usa la página `verificar-pago.html` con:
   - Email: `rizzofs@gmail.com`
   - Fecha: `2025-08-04`

## 🔍 Verificación en MercadoPago

El sistema busca pagos que cumplan:
- **Collector ID**: 2142366374
- **Email**: rizzofs@gmail.com
- **Fecha**: 4 de agosto de 2025
- **Estado**: approved

## 📧 Emails Automáticos

Cuando se confirma un pago, se envía automáticamente:
- **Asunto**: "Pago Confirmado - Sorteo Tablet Android 15"
- **Contenido**: Detalles del pago y confirmación de participación

## ⚠️ Troubleshooting

### Si no encuentra el pago:
1. Verifica que el email en Google Sheets coincida exactamente
2. Confirma que la fecha de registro sea correcta
3. Revisa los logs en Google Apps Script para errores
4. Verifica manualmente en MercadoPago

### Si hay errores de API:
1. Verifica que el Access Token sea válido
2. Confirma que el Collector ID sea correcto
3. Revisa los permisos del Google Apps Script

## 🚀 Comandos de Configuración

```javascript
// Configurar trigger automático
configurarTriggerAutomatico()

// Ejecutar verificación manual
ejecutarVerificacionManual()

// Verificar pago específico
verificarPagoPorDatos({
  email: 'rizzofs@gmail.com',
  fecha: '2025-08-04'
})
```

## 📈 Monitoreo

- **Logs**: Revisa los logs en Google Apps Script para ver el progreso
- **Google Sheets**: Los pagos confirmados se marcan automáticamente
- **Emails**: Los usuarios reciben confirmación automática 