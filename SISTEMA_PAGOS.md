# Sistema de Doble Validación de Pagos - Sorteo CODES++

## 🎯 **Objetivo**
Implementar un sistema robusto que maneje tanto los pagos exitosos como los fallidos, manteniendo un registro completo de todas las transacciones.

## 🔄 **Flujo del Sistema**

### **Paso 1: Registro Inicial (PENDIENTE)**
1. Usuario completa formulario
2. Hace clic en "Ir a pagar"
3. **Datos se envían a Google Sheets** con estado `PENDIENTE`
4. Se genera un `sessionId` único para tracking
5. Datos se guardan en `localStorage` para seguimiento
6. Se abre MercadoPago en nueva ventana

### **Paso 2: Procesamiento del Pago**
- **Si el pago es exitoso:**
  - MercadoPago redirige a `agradecimiento.html`
  - Sistema detecta parámetros de pago exitoso
  - **Actualiza estado a `CONFIRMADO`** en Google Sheets
  - Limpia datos de `localStorage`
  - Usuario ve página de agradecimiento

- **Si el pago falla o se cancela:**
  - Usuario regresa sin parámetros de pago
  - Datos permanecen como `PENDIENTE`
  - Sistema de limpieza automática los maneja

### **Paso 3: Limpieza Automática**
- **Registros pendientes** se revisan al cargar la página
- Si han pasado **más de 24 horas**, se marcan como `CANCELADO`
- Se envían a Google Sheets con motivo "Tiempo expirado"

## 📊 **Estados de Pago**

| Estado | Descripción | Acción |
|--------|-------------|---------|
| `PENDIENTE` | Usuario registrado, pago iniciado | Esperar confirmación |
| `CONFIRMADO` | Pago exitoso completado | ✅ Participación válida |
| `CANCELADO` | Pago fallido o expirado | ❌ No participa |

## 🔧 **Campos en Google Sheets**

### **Registro Inicial (PENDIENTE):**
- `nombre`, `apellido`, `email`, `dni`, `telefono`
- `cantidadChances`
- `estadoPago: "PENDIENTE"`
- `pagoConfirmado: false`
- `fechaRegistro`
- `timestamp`
- `sessionId` (único para tracking)

### **Actualización (CONFIRMADO):**
- `sessionId` (para identificar el registro)
- `estadoPago: "CONFIRMADO"`
- `pagoConfirmado: true`
- `fechaConfirmacion`
- `paymentId` (de MercadoPago)
- `collectionStatus` (de MercadoPago)
- `status` (de MercadoPago)

### **Cancelación (CANCELADO):**
- `sessionId`
- `estadoPago: "CANCELADO"`
- `pagoConfirmado: false`
- `fechaCancelacion`
- `motivo: "Tiempo expirado (24h)"`

## 🛡️ **Beneficios del Sistema**

### **Para el Usuario:**
- ✅ Datos se guardan inmediatamente (no se pierden)
- ✅ Confirmación clara del estado del pago
- ✅ Experiencia fluida y confiable

### **Para la Organización:**
- ✅ Registro completo de todas las transacciones
- ✅ Seguimiento de pagos pendientes
- ✅ Limpieza automática de registros antiguos
- ✅ Datos para análisis y auditoría

### **Para el Sistema:**
- ✅ Prevención de pérdida de datos
- ✅ Manejo robusto de errores
- ✅ Tracking único por transacción
- ✅ Estados claros y rastreables

## 📋 **Mantenimiento**

### **Revisión Manual (Opcional):**
- Revisar registros `PENDIENTE` en Google Sheets
- Contactar usuarios que no completaron el pago
- Limpiar registros manualmente si es necesario

### **Monitoreo Automático:**
- Sistema limpia registros > 24h automáticamente
- Logs en consola para debugging
- Estados claros en Google Sheets

## 🚀 **Implementación Actual**

El sistema está **completamente implementado** y funcionando con:
- ✅ Validación en tiempo real del formulario
- ✅ Envío de datos antes del pago
- ✅ Actualización de estado post-pago
- ✅ Limpieza automática de registros antiguos
- ✅ Tracking único por sesión
- ✅ Manejo de errores robusto

¡El sistema está listo para producción! 