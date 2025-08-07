# Configuración para tu Google Sheet

## Información de tu Google Sheet

- **Spreadsheet ID**: `1rWh1j2LRnkPFthX_OySsO-vqb1FJsuPTeqJVnfhLwSY`
- **Nombre de la hoja**: `verificados`
- **URL completa**: `https://docs.google.com/spreadsheets/d/1rWh1j2LRnkPFthX_OySsO-vqb1FJsuPTeqJVnfhLwSY/edit#gid=0`

## Pasos para Configurar la API

### Opción 1: Google Sheets API (Recomendado)

1. **Ve a Google Cloud Console:**
   - Abre [console.cloud.google.com](https://console.cloud.google.com/)
   - Crea un nuevo proyecto o selecciona uno existente

2. **Habilita Google Sheets API:**
   - Ve a "APIs & Services" > "Library"
   - Busca "Google Sheets API"
   - Haz clic en "Enable"

3. **Crea una API Key:**
   - Ve a "APIs & Services" > "Credentials"
   - Haz clic en "Create Credentials" > "API Key"
   - Copia la API key generada

4. **Actualiza podio.html:**
   - Abre el archivo `podio.html`
   - Busca la línea que dice: `apiKey: 'TU_API_KEY'`
   - Reemplaza `'TU_API_KEY'` con tu API key real

### Opción 2: Google Apps Script (Más Fácil)

1. **Ve a Google Apps Script:**
   - Abre [script.google.com](https://script.google.com/)
   - Crea un nuevo proyecto

2. **Reemplaza el código con:**
```javascript
function doGet() {
  const spreadsheetId = '1rWh1j2LRnkPFthX_OySsO-vqb1FJsuPTeqJVnfhLwSY';
  const sheetName = 'verificados';
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
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

3. **Publica como Web App:**
   - Haz clic en "Deploy" > "New deployment"
   - Selecciona "Web app"
   - Configura:
     - Execute as: "Me"
     - Who has access: "Anyone"
   - Haz clic en "Deploy"
   - Copia la URL generada

4. **Actualiza podio.html:**
   - Busca la línea: `appsScriptUrl: 'TU_GOOGLE_APPS_SCRIPT_URL'`
   - Reemplaza con tu URL de Apps Script

## Estructura Esperada de tu Google Sheet

Tu hoja "verificados" debe tener estas columnas en orden:

| Columna | Contenido |
|---------|-----------|
| A | Fecha de compra |
| B | E-Mail |
| C | CUIL/CUIT |
| D | DNI |
| E | CHANCES REALES |
| F | Número de operación |
| G | Estado de la operación |
| H | Detalle del estado |
| I | Valor Chances |
| J | Tarifa de Mercado Pago |
| K | Monto recibido |

## Prueba la Funcionalidad

1. **Con Google Sheets API:**
   - Necesitas una API key válida
   - La hoja debe ser pública o accesible

2. **Con Google Apps Script:**
   - No requiere API key
   - Funciona inmediatamente después de publicar

3. **Con JSON estático:**
   - Usa `data/sorteo-data.json` para pruebas
   - Actualiza manualmente cuando necesites

## Troubleshooting

### Error: "No se pudieron cargar los datos"
- Verifica que la API esté configurada correctamente
- Revisa la consola del navegador (F12) para errores específicos
- Asegúrate de que el Google Sheet sea accesible

### Error: "CORS policy"
- Google Apps Script maneja CORS automáticamente
- Para Google Sheets API, considera usar un proxy

### DNI no encontrado
- Verifica que el DNI esté en la columna D de tu hoja
- Asegúrate de que los datos estén en la hoja "verificados"

## Próximos Pasos

1. **Elige una opción** (recomiendo Google Apps Script para empezar)
2. **Configura la API** siguiendo los pasos arriba
3. **Prueba con DNIs conocidos** de tu hoja
4. **Verifica que las chances se sumen** correctamente

## Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Verifica que las credenciales sean correctas
3. Asegúrate de que el Google Sheet tenga los permisos adecuados
4. Usa la opción JSON estático para pruebas iniciales 