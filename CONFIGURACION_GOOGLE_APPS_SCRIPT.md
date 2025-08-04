# Configuración del Google Apps Script

## ✅ CONFIGURACIÓN COMPLETADA

El archivo `sistema-completo-pagos-template.gs` ya está configurado con tus datos reales:

- ✅ **GOOGLE_SHEET_ID**: `1rCNIwjzB--xtIyK4gMvqIxJGLETra4VqnF5aL8lRTMk`
- ✅ **GOOGLE_SHEET_NAME**: `Registros_Sorteo`
- ✅ **MERCADOPAGO_ACCESS_TOKEN**: Configurado
- ✅ **COLLECTOR_ID**: `2142366374`
- ✅ **COLLECTOR_EMAIL**: `rizzofs.eu@gmail.com`

## 🔧 Pasos para Desplegar

### Paso 1: Copiar el Código
1. Abre el archivo `sistema-completo-pagos-template.gs`
2. Copia todo el contenido

### Paso 2: Crear el Google Apps Script
1. Ve a [script.google.com](https://script.google.com)
2. Crea un nuevo proyecto
3. Pega el código copiado

### Paso 3: Desplegar el Script
1. Haz clic en "Deploy" → "New deployment"
2. Selecciona "Web app"
3. Configura:
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Copia la URL generada

### Paso 4: Actualizar la URL en el Frontend
1. En `redirect-pago.html`, línea 250, actualiza:
   ```javascript
   const GOOGLE_SHEETS_URL = 'TU_URL_DEL_SCRIPT_AQUI';
   ```

## 🧪 Probar la Configuración

### Función de Prueba
Ejecuta esta función desde el editor de Apps Script: `probarConfiguracion()`
1. Revisa los logs en la consola del editor
2. Verifica que todas las constantes estén configuradas correctamente

### Acceso Directo al Script
Ahora puedes acceder directamente a la URL del script desde tu navegador. Verás una página informativa que confirma que el sistema está funcionando correctamente.

**URL del script:** `https://script.google.com/macros/s/AKfycbyNohciKk11nGGjUCHbX-eP4uMSYBs_MfEgZ8cQCt7S8i2KxzOX80wxxLMFAxxXIXY69w/exec`

## 🚨 Problemas Comunes

### Error: "No se encontró la hoja especificada"
- Verifica que el `GOOGLE_SHEET_ID` sea correcto
- Verifica que el `GOOGLE_SHEET_NAME` coincida exactamente

### Error: "Unauthorized" en MercadoPago
- Verifica que el `MERCADOPAGO_ACCESS_TOKEN` sea válido
- Asegúrate de que el token tenga permisos de lectura

### Error: "Script not found"
- Verifica que el script esté desplegado correctamente
- Verifica que la URL del script sea la correcta

## 📞 Soporte

Si tienes problemas con la configuración:
1. Ejecuta `probarConfiguracion()` en el editor de Apps Script
2. Revisa los logs en la consola del editor
3. Verifica que todas las constantes estén configuradas correctamente

## 🔒 Seguridad

- ✅ El archivo con datos sensibles está en `.gitignore`
- ✅ Se creó un archivo de ejemplo sin datos sensibles
- ✅ Los datos reales están protegidos 