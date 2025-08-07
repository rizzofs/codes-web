# Configuración Rápida - Prueba Inmediata

## ✅ Estado Actual

Tu `podio.html` está configurado para usar **datos de ejemplo** por defecto. Esto significa que puedes probar la funcionalidad inmediatamente.

## 🧪 Probar Ahora

1. **Abre `podio.html`** en tu navegador
2. **Prueba con estos DNIs de ejemplo:**
   - `45478095` → Debería mostrar 1 chance
   - `28989342` → Debería mostrar 5 chances

## 🚀 Configurar con tu Google Sheet Real

### Opción A: Google Apps Script (Recomendado)

1. **Ve a [script.google.com](https://script.google.com/)**
2. **Crea un nuevo proyecto**
3. **Reemplaza todo el código con:**

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

4. **Publica como Web App:**
   - Haz clic en "Deploy" > "New deployment"
   - Selecciona "Web app"
   - Configura:
     - Execute as: "Me"
     - Who has access: "Anyone"
   - Haz clic en "Deploy"
   - **Copia la URL generada**

5. **Actualiza `podio.html`:**
   - Busca la línea: `appsScriptUrl: 'TU_GOOGLE_APPS_SCRIPT_URL'`
   - Reemplaza `'TU_GOOGLE_APPS_SCRIPT_URL'` con tu URL real

### Opción B: Google Sheets API

1. **Ve a [console.cloud.google.com](https://console.cloud.google.com/)**
2. **Crea un proyecto nuevo**
3. **Habilita Google Sheets API**
4. **Crea una API Key**
5. **Actualiza `podio.html`:**
   - Busca: `apiKey: 'TU_API_KEY'`
   - Reemplaza con tu API key real

## 📊 Verificar que Funciona

1. **Abre `podio.html`**
2. **Ingresa un DNI que esté en tu Google Sheet**
3. **Debería mostrar las chances sumadas**

## 🔧 Si hay Problemas

### Error: "No se pudieron cargar los datos"
- Verifica que el Google Sheet sea accesible
- Revisa la consola del navegador (F12)

### Error: "DNI no encontrado"
- Verifica que el DNI esté en la columna D de tu hoja "verificados"
- Asegúrate de que los datos estén en el formato correcto

## 📝 Próximos Pasos

1. **Prueba primero** con los datos de ejemplo
2. **Configura Google Apps Script** (más fácil)
3. **Prueba con DNIs reales** de tu hoja
4. **Verifica que las chances se sumen** correctamente

## 💡 Consejo

Te recomiendo empezar con **Google Apps Script** porque:
- No requiere API keys
- Es más fácil de configurar
- Funciona inmediatamente
- No tiene problemas de CORS 