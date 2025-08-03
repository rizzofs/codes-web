# Configuración de Google Sheets para el Sorteo

## Paso 1: Crear la hoja de Google Sheets

1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de cálculo
3. **Nombra la hoja como:** `Registros_Sorteo`
4. Configura las siguientes columnas **exactamente** en la primera fila:

```
A1: Timestamp
B1: Nombre
C1: Apellido
D1: Email
E1: DNI
F1: Teléfono
G1: Cantidad de Chances
H1: Pago Confirmado
I1: Fecha de Registro
J1: Observaciones
```

### Estructura exacta de la hoja:

| Columna | A | B | C | D | E | F | G | H | I | J |
|---------|---|---|---|---|---|---|---|---|---|---|
| Fila 1 | **Timestamp** | **Nombre** | **Apellido** | **Email** | **DNI** | **Teléfono** | **Cantidad de Chances** | **Pago Confirmado** | **Fecha de Registro** | **Observaciones** |

### Ejemplo de datos que se guardarán:

| Timestamp | Nombre | Apellido | Email | DNI | Teléfono | Cantidad de Chances | Pago Confirmado | Fecha de Registro | Observaciones |
|-----------|--------|----------|-------|-----|----------|-------------------|-----------------|-------------------|---------------|
| 15/01/2024 10:30:00 | Juan | Pérez | juan@ejemplo.com | 12345678 | 11-1234-5678 | 3 | TRUE | 2024-01-15T10:30:00.000Z | |

## Paso 2: Crear el Google Apps Script

1. En tu hoja de Google Sheets, ve a **Extensiones** → **Apps Script**
2. Se abrirá el editor de scripts
3. Reemplaza todo el contenido con este código:

```javascript
function doPost(e) {
  try {
    // Obtener la hoja activa
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Obtener los datos del formulario
    var data = JSON.parse(e.postData.contents);
    
    // Crear una nueva fila con los datos
    var rowData = [
      new Date(), // Timestamp
      data.nombre || '',
      data.apellido || '',
      data.email || '',
      data.dni || '',
      data.telefono || '',
      data.cantidadChances || '',
      data.pagoConfirmado || false,
      data.fechaRegistro || new Date().toISOString(),
      data.observaciones || ''
    ];
    
    // Agregar la fila a la hoja
    sheet.appendRow(rowData);
    
    // Devolver respuesta exitosa
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    // Devolver error
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('API funcionando correctamente')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

## Paso 3: Desplegar como aplicación web

1. En el editor de Apps Script, haz clic en **Implementar** → **Nueva implementación**
2. Configura:
   - **Tipo:** Aplicación web
   - **Descripción:** API Sorteo
   - **Ejecutar como:** Tu cuenta de Google
   - **Quién tiene acceso:** Cualquier persona
3. Haz clic en **Implementar**
4. **Autoriza** la aplicación cuando te lo solicite
5. Copia la URL que se genera (será algo como: `https://script.google.com/macros/s/TU_SCRIPT_ID/exec`)

## Paso 4: Actualizar el código JavaScript

1. Abre el archivo `assets/js/sorteo.js`
2. Busca la línea que dice:
   ```javascript
   const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/TU_SCRIPT_ID/exec';
   ```
3. Reemplaza `TU_SCRIPT_ID` con el ID real de tu script (está en la URL que copiaste)

## Paso 5: Probar la configuración

1. Abre tu página de sorteo
2. Completa el formulario
3. Haz clic en "Ir a pagar"
4. Cuando vuelvas con `?pagado=ok`, completa el formulario
5. Verifica que los datos aparezcan en tu hoja de Google Sheets

## Notas importantes:

- **Seguridad:** La URL del script es pública, pero solo puede agregar datos a tu hoja
- **Límites:** Google Apps Script tiene límites de uso diario
- **Backup:** Considera hacer copias de seguridad regulares de tu hoja
- **Pruebas:** Siempre prueba en un entorno de desarrollo antes de usar en producción

## Solución de problemas:

### Error "CORS"
- El modo `no-cors` en el fetch está configurado correctamente
- No podrás leer la respuesta, pero los datos se enviarán

### Error "Script no encontrado"
- Verifica que la URL del script sea correcta
- Asegúrate de que el script esté desplegado como aplicación web

### Los datos no aparecen en la hoja
- Verifica que el script tenga permisos para editar la hoja
- Revisa la consola del navegador para errores
- Verifica que la estructura de datos coincida con el script

## Estructura de datos esperada:

```javascript
{
  nombre: "Juan",
  apellido: "Pérez",
  email: "juan@ejemplo.com",
  dni: "12345678",
  telefono: "11-1234-5678",
  cantidadChances: "3",
  pagoConfirmado: true,
  fechaRegistro: "2024-01-15T10:30:00.000Z",
  timestamp: 1705315800000
}
``` 