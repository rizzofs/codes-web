# Configuración de MercadoPago para el Sorteo

## Problema Actual
MercadoPago no está configurado para redirigir de vuelta al sitio después del pago, por lo que los usuarios no pueden completar el registro.

## Solución Temporal Implementada
- Se modificó el código para mostrar el botón de "Registrar Participación" después de hacer clic en "Ir a pagar"
- Se agregaron instrucciones claras para el usuario
- Se removió la validación estricta del parámetro `pagado=ok`

## Configuración Necesaria en MercadoPago

### 1. Configurar URL de Retorno
En tu cuenta de MercadoPago, necesitas configurar:

**URL de éxito:** `https://codes-unlu.github.io/Web-Codes/agradecimiento.html`

**URL de cancelación:** `https://codes-unlu.github.io/Web-Codes/sorteo.html?pagado=cancel`

### 2. Links de Pago por Cantidad de Chances
Actualmente todos usan el mismo link. Necesitas crear links específicos:

- **1 chance ($1000):** `https://mpago.la/2YQW3HX`
- **3 chances ($2800):** [Crear nuevo link]
- **4 chances ($4000):** [Crear nuevo link]

### 3. Pasos para Configurar en MercadoPago

1. Ir a tu cuenta de MercadoPago
2. Crear nuevos enlaces de pago para cada cantidad
3. Configurar las URLs de retorno en cada enlace
4. Actualizar los links en `assets/js/sorteo.js`

### 4. Código a Actualizar
Una vez configurado MercadoPago, actualizar en `assets/js/sorteo.js`:

```javascript
const paymentLinks = {
    1: 'https://mpago.la/2YQW3HX',
    3: 'https://mpago.la/TU_LINK_3_CHANCES',
    4: 'https://mpago.la/TU_LINK_4_CHANCES'
};
```

## Estado Actual
✅ **Funcional:** Los usuarios pueden pagar y registrar su participación
⚠️ **Pendiente:** Configurar redirección automática desde MercadoPago 