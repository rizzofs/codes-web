/**
 * Script de prueba para verificar la configuración
 */

// Configuración
const SPREADSHEET_ID = '1rCNIwjzB--xtIyK4gMvqIxJGLETra4VqnF5aL8lRTMk';
const SHEET_NAME = 'Registros_Sorteo';
const MERCADOPAGO_ACCESS_TOKEN = 'APP_USR-5908100961878781-080320-3d4cf3e45d4723bffa7e302677cce571-2142366374';

/**
 * Función para probar la conexión básica
 */
function probarConexionBasica() {
  try {
    console.log('🧪 Iniciando prueba de conexión básica...');
    
    // 1. Probar acceso a la hoja
    console.log('📊 Probando acceso a Google Sheets...');
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      console.error('❌ Hoja no encontrada:', SHEET_NAME);
      return;
    }
    
    console.log('✅ Hoja encontrada:', SHEET_NAME);
    
    // 2. Obtener datos básicos
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const totalRows = data.length;
    
    console.log('📋 Headers encontrados:', headers);
    console.log('📊 Total de filas:', totalRows);
    
    // 3. Verificar columnas necesarias
    const pagoConfirmadoIndex = headers.indexOf('Pago Confirmado');
    const estadoPagoIndex = headers.indexOf('Estado Pago');
    
    console.log('🔍 Índices encontrados:', {
      pagoConfirmado: pagoConfirmadoIndex,
      estadoPago: estadoPagoIndex
    });
    
    if (pagoConfirmadoIndex === -1 || estadoPagoIndex === -1) {
      console.error('❌ Columnas requeridas no encontradas');
      return;
    }
    
    console.log('✅ Columnas requeridas encontradas');
    
    // 4. Mostrar algunos datos de ejemplo
    if (totalRows > 1) {
      console.log('📊 Datos de ejemplo (fila 2):', data[1]);
    }
    
    console.log('✅ Prueba de conexión básica completada');
    
  } catch (error) {
    console.error('❌ Error en prueba de conexión:', error);
  }
}

/**
 * Función para probar la API de MercadoPago
 */
function probarAPIMercadoPago() {
  try {
    console.log('🔍 Probando API de MercadoPago...');
    
    // Probar una búsqueda simple
    const url = 'https://api.mercadopago.com/v1/payments/search?limit=1';
    const response = UrlFetchApp.fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📊 Código de respuesta:', response.getResponseCode());
    
    if (response.getResponseCode() === 200) {
      const data = JSON.parse(response.getContentText());
      console.log('✅ API de MercadoPago funcionando');
      console.log('📊 Respuesta:', data);
    } else {
      console.error('❌ Error en API de MercadoPago:', response.getResponseCode());
      console.error('📄 Respuesta:', response.getContentText());
    }
    
  } catch (error) {
    console.error('❌ Error probando API de MercadoPago:', error);
  }
}

/**
 * Función para probar todo de una vez
 */
function probarTodo() {
  console.log('🚀 Iniciando pruebas completas...');
  
  // Probar conexión básica
  probarConexionBasica();
  
  // Probar API de MercadoPago
  probarAPIMercadoPago();
  
  console.log('✅ Pruebas completadas');
} 