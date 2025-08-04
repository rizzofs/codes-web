# Configuración de MercadoPago para CODES++

## URLs de Configuración

### URL de Éxito (Success URL)
```
https://codes-unlu.github.io/Web-Codes/redirect-pago.html
```

### URL de Fallo (Failure URL)
```
https://codes-unlu.github.io/Web-Codes/sorteo.html?error=pago_fallido
```

### URL de Pendiente (Pending URL)
```
https://codes-unlu.github.io/Web-Codes/sorteo.html?error=pago_pendiente
```

## Parámetros que envía MercadoPago

Cuando el usuario completa el pago, MercadoPago redirige con estos parámetros:

- `collection_status`: Estado del cobro (approved, pending, rejected, etc.)
- `status`: Estado del pago (approved, pending, rejected, etc.)
- `payment_id`: ID único del pago
- `external_reference`: Referencia externa (nuestro Session ID)
- `collection_id`: ID del cobro
- `merchant_order_id`: ID de la orden del comercio
- `preference_id`: ID de la preferencia

## Flujo de Pago

1. **Usuario completa formulario** → Datos se envían a Google Sheets con estado "PENDIENTE"
2. **Usuario hace clic en "Ir a pagar"** → Se redirige a MercadoPago
3. **Usuario completa pago en MercadoPago** → MercadoPago redirige a `redirect-pago.html`
4. **redirect-pago.html procesa parámetros** → Actualiza estado a "CONFIRMADO" en Google Sheets
5. **Usuario es redirigido a agradecimiento.html** → Página de confirmación final

## Sistema de Verificación Automática

El sistema también incluye verificación automática cada hora que:

- Busca pagos pendientes en Google Sheets
- Verifica estado real en MercadoPago usando la API
- Actualiza automáticamente pagos confirmados
- Envía emails de confirmación

## Access Token

```
APP_USR-5908100961878781-080320-3d4cf3e45d4723bffa7e302677cce571-2142366374
```

## Links de Pago

- **Chance de prueba ($1)**: `https://mpago.la/2n46a5E`
- **1 chance ($1000)**: `https://mpago.la/1rXwpEV`
- **3 chances ($2.800)**: `https://mpago.la/1eSB8pw`
- **4 chances ($4.000)**: `https://mpago.la/1kM9Q6y`

## Notas Importantes

- Los datos se registran **antes** del pago con estado "PENDIENTE"
- El sistema verifica automáticamente los pagos cada hora
- Si el usuario no regresa de MercadoPago, el sistema igual detectará el pago
- Se envían emails de confirmación automáticamente
- Los registros antiguos (más de 24h) se marcan como "CANCELADO" 