# Configuración de API para Consulta de Chances

Este documento explica las diferentes opciones para configurar la API que alimenta los datos del sorteo en `podio.html`.

## Opciones Disponibles

### 1. Google Sheets API (Recomendado)

**Ventajas:**
- Acceso directo a Google Sheets
- Actualización en tiempo real
- Seguro y confiable

**Configuración:**

1. **Habilitar Google Sheets API:**
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Crea un nuevo proyecto o selecciona uno existente
   - Ve a "APIs & Services" > "Library"
   - Busca "Google Sheets API" y habilítala

2. **Crear API Key:**
   - Ve a "APIs & Services" > "Credentials"
   - Haz clic en "Create Credentials" > "API Key"
   - Copia la API key generada

3. **Configurar el código:**
   En `podio.html`, modifica la sección `API_CONFIG`:
   ```javascript
   const API_CONFIG = {
       sheetsApiUrl: 'https://sheets.googleapis.com/v4/spreadsheets/',
       spreadsheetId: 'TU_SPREADSHEET_ID', // ID de tu Google Sheet
       apiKey: 'TU_API_KEY', // Tu API key de Google Cloud
       // ... otras opciones
   };
   ```

4. **Obtener Spreadsheet ID:**
   - Abre tu Google Sheet
   - El ID está en la URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

### 2. Google Apps Script (Más Fácil)

**Ventajas:**
- Configuración más simple
- No requiere API keys
- Fácil de mantener

**Configuración:**

1. **Crear Google Apps Script:**
   - Ve a [script.google.com](https://script.google.com/)
   - Crea un nuevo proyecto
   - Reemplaza el código con:

```javascript
function doGet() {
  const spreadsheetId = 'TU_SPREADSHEET_ID'; // Reemplaza con tu ID
  const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  // Procesar datos
  const headers = data[0];
  const rows = data.slice(1);
  const processedData = [];
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row.length >= 5) {
      processedData.push({
        fecha: row[0] || '',
        email: row[1] || '',
        cuil: row[2] || '',
        dni: row[3] || '',
        chances: parseInt(row[4]) || 0,
        numeroOperacion: row[5] || '',
        estado: row[6] || '',
        detalleEstado: row[7] || '',
        valorChances: row[8] || '',
        tarifa: row[9] || '',
        montoRecibido: row[10] || ''
      });
    }
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(processedData))
    .setMimeType(ContentService.MimeType.JSON);
}
```

2. **Publicar como Web App:**
   - Haz clic en "Deploy" > "New deployment"
   - Selecciona "Web app"
   - Configura:
     - Execute as: "Me"
     - Who has access: "Anyone"
   - Haz clic en "Deploy"
   - Copia la URL generada

3. **Configurar el código:**
   En `podio.html`, modifica:
   ```javascript
   const API_CONFIG = {
       appsScriptUrl: 'TU_GOOGLE_APPS_SCRIPT_URL', // URL de tu Apps Script
       // ... otras opciones
   };
   ```

### 3. JSON Estático (Temporal)

**Ventajas:**
- Funciona inmediatamente
- No requiere configuración externa
- Bueno para pruebas

**Configuración:**
- Los datos están en `data/sorteo-data.json`
- Actualiza manualmente cuando necesites

## Estructura de Datos Esperada

El sistema espera datos con esta estructura:

```json
[
  {
    "fecha": "6/08/2025 18:06:29",
    "email": "wri***@gmail.com",
    "cuil": "CUIL 20454780958",
    "dni": "45478095",
    "chances": 1,
    "numeroOperacion": "121276499342",
    "estado": "approved",
    "detalleEstado": "accredited",
    "valorChances": "$1.000,00",
    "tarifa": "-$76,10",
    "montoRecibido": "$923,90"
  }
]
```

## Columnas de Google Sheets

Asegúrate de que tu Google Sheet tenga estas columnas en orden:

1. **A**: Fecha de compra
2. **B**: E-Mail
3. **C**: CUIL/CUIT
4. **D**: DNI
5. **E**: CHANCES REALES
6. **F**: Número de operación
7. **G**: Estado de la operación (status)
8. **H**: Detalle del estado de la operación
9. **I**: Valor Chances
10. **J**: Tarifa de Mercado Pago
11. **K**: Monto recibido

## Seguridad

### Para Google Sheets API:
- Restringe tu API key a solo Google Sheets API
- Considera usar autenticación OAuth2 para mayor seguridad

### Para Google Apps Script:
- La URL es pública, pero solo devuelve datos del sorteo
- Considera agregar autenticación si es necesario

## Troubleshooting

### Error: "No se pudieron cargar los datos"
- Verifica que la API esté configurada correctamente
- Revisa la consola del navegador para errores específicos
- Asegúrate de que el Google Sheet sea público o accesible

### Error: "CORS policy"
- Google Apps Script maneja CORS automáticamente
- Para Google Sheets API, considera usar un proxy

### Datos no actualizados
- Google Apps Script puede tener cache
- Google Sheets API es en tiempo real
- JSON estático requiere actualización manual

## Próximos Pasos

1. **Elige una opción** de las tres disponibles
2. **Configura la API** siguiendo las instrucciones
3. **Actualiza `podio.html`** con tus credenciales
4. **Prueba la funcionalidad** con DNIs conocidos
5. **Monitorea el rendimiento** y ajusta según sea necesario

## Soporte

Si tienes problemas con la configuración:
1. Revisa la consola del navegador (F12)
2. Verifica que las credenciales sean correctas
3. Asegúrate de que el Google Sheet tenga los permisos adecuados
4. Considera usar la opción JSON estático para pruebas iniciales 