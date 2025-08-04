# Sistema Automático de Verificación de Pagos - CODES++

## 📋 Descripción General

Este sistema permite verificar automáticamente los pagos de MercadoPago y actualizar la hoja de Google Sheets con todos los datos necesarios, incluyendo `Session ID` y `Payment ID`.

## 🔧 Configuración Inicial

### 1. Actualizar Google Apps Script

1. Abre tu proyecto de Google Apps Script
2. Reemplaza el código existente con el contenido de `sistema-completo-pagos-template.gs`
3. **IMPORTANTE**: Actualiza las siguientes variables con tus datos reales:
   ```javascript
   const MERCADOPAGO_ACCESS_TOKEN = 'TU_ACCESS_TOKEN_AQUI';
   const GOOGLE_SHEET_ID = 'TU_SHEET_ID_AQUI';
   const GOOGLE_SHEET_NAME = 'TU_NOMBRE_DE_HOJA_AQUI';
   const COLLECTOR_ID = 2142366374; // Tu ID de colector
   const COLLECTOR_EMAIL = 'rizzofs.eu@gmail.com'; // Tu email
   ```

### 2. Configurar Trigger Automático

1. En Google Apps Script, ve a "Triggers" (Reloj)
2. Crea un nuevo trigger:
   - **Función**: `verificarPagosAutomaticamente`
   - **Tipo**: Time-driven
   - **Frecuencia**: Hour timer
   - **Hora**: Every hour

### 3. Desplegar como Web App

1. Ve a "Deploy" → "New deployment"
2. Selecciona "Web app"
3. Configura:
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Copia la URL generada

## 🚀 Funciones Principales

### `verificarPagosAutomaticamente()`
- **Propósito**: Verifica automáticamente todos los pagos pendientes
- **Ejecución**: Cada hora (via trigger)
- **Proceso**:
  1. Lee la hoja de Google Sheets
  2. Busca registros con `Pago Confirmado = FALSE`
  3. Para cada registro, busca el pago en MercadoPago por email y fecha
  4. Actualiza la hoja con todos los datos del pago

### `verificarPagoPorDatos(data)`
- **Propósito**: Verifica un pago específico usando email y fecha
- **Parámetros**:
  ```javascript
  {
    email: "usuario@email.com",
    nombre: "Nombre",
    apellido: "Apellido", 
    fechaRegistro: "2025-01-15T10:30:00.000Z",
    sessionId: "SES_1234567890_abc123" // opcional
  }
  ```
- **Retorna**:
  ```javascript
  {
    success: true,
    message: "Pago verificado y actualizado",
    data: {
      sessionId: "SES_1234567890_abc123",
      paymentId: "1234567890",
      status: "approved",
      amount: 2800,
      paymentMethod: "credit_card",
      // ... más datos
    }
  }
  ```

### `completarDatosFaltantes()`
- **Propósito**: Completa datos faltantes en registros existentes
- **Proceso**:
  1. Busca registros con `Pago Confirmado = TRUE` pero sin `Session ID` o `Payment ID`
  2. Verifica el pago en MercadoPago
  3. Completa los datos faltantes

### `actualizarPagoEnGoogleSheets(datos)`
- **Propósito**: Actualiza un registro específico en Google Sheets
- **Búsqueda**: Por `sessionId` o `email`
- **Actualiza**: `Pago Confirmado`, `Estado Pago`, `Payment ID`, `Fecha Confirmación`, `Session ID`

## 🔄 Flujo Automático

### 1. Registro Inicial
```
Usuario llena formulario → Se guarda en Google Sheets (PENDIENTE) → Redirige a MercadoPago
```

### 2. Verificación Automática
```
Trigger cada hora → Busca pagos pendientes → Verifica en MercadoPago → Actualiza hoja
```

### 3. Confirmación
```
Pago encontrado → Actualiza todos los campos → Envía email de confirmación
```

## 🛠️ Uso Manual

### Página de Verificación (`verificar-pago.html`)

1. **Verificar Pago Individual**:
   - Ingresa email y fecha de registro
   - El sistema busca el pago en MercadoPago
   - Actualiza la hoja con todos los datos

2. **Ejecutar Verificación Automática**:
   - Verifica todos los pagos pendientes de una vez
   - Útil para limpiar datos históricos

3. **Completar Datos Faltantes**:
   - Busca registros con datos incompletos
   - Completa `Session ID` y `Payment ID` faltantes

## 📊 Estructura de la Hoja de Google Sheets

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| Timestamp | Fecha de registro | 2025-01-15 10:30:00 |
| Nombre | Nombre del usuario | Juan |
| Apellido | Apellido del usuario | Pérez |
| Email | Email del usuario | juan@email.com |
| DNI | DNI del usuario | 12345678 |
| Teléfono | Teléfono del usuario | 1123456789 |
| Cantidad de Chances | Cantidad de chances | 3 |
| Pago Confirmado | Estado del pago | TRUE/FALSE |
| Estado Pago | Estado detallado | PENDIENTE/CONFIRMADO |
| Session ID | ID único de sesión | SES_1234567890_abc123 |
| Payment ID | ID del pago en MercadoPago | 1234567890 |
| Fecha Confirmación | Fecha de confirmación | 2025-01-15T10:35:00.000Z |

## 🔍 Solución de Problemas

### Problema: "No se encontró un pago aprobado"
- **Causa**: El email o fecha no coinciden exactamente
- **Solución**: Verifica que el email sea el mismo usado en MercadoPago

### Problema: "Error comunicándose con MercadoPago"
- **Causa**: Token de acceso inválido o expirado
- **Solución**: Renueva el `MERCADOPAGO_ACCESS_TOKEN`

### Problema: "No se encontró la hoja especificada"
- **Causa**: ID de hoja incorrecto o permisos insuficientes
- **Solución**: Verifica el `GOOGLE_SHEET_ID` y los permisos

### Problema: Datos incompletos después de la verificación
- **Causa**: El pago existe pero faltan algunos campos
- **Solución**: Usa la función `completarDatosFaltantes()`

## 📈 Monitoreo

### Logs de Google Apps Script
- Revisa los logs en Google Apps Script para ver el progreso
- Los logs muestran cada pago verificado y actualizado

### Métricas de Verificación
- **Pagos verificados**: Total de registros procesados
- **Pagos confirmados**: Registros actualizados exitosamente

## 🔐 Seguridad

- **Tokens**: Nunca subas tokens reales al repositorio
- **Permisos**: Usa permisos mínimos necesarios
- **Logs**: Los logs pueden contener información sensible

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de Google Apps Script
2. Verifica la configuración de tokens y IDs
3. Prueba la verificación manual primero
4. Contacta al equipo de desarrollo

---

**Última actualización**: Enero 2025
**Versión**: 2.0.0 