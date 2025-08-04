/**
 * Webhook Handler para MercadoPago
 * Este script recibe notificaciones de MercadoPago cuando se confirma un pago
 */

// ID de la hoja de cálculo donde se guardan los datos
const SPREADSHEET_ID = 'TU_SPREADSHEET_ID_AQUI'; // Reemplazar con tu ID real
const SHEET_NAME = 'Participaciones';

function doPost(e) {
  try {
    // Log de la petición recibida
    console.log('Webhook recibido:', e.postData.contents);
    
    // Parsear los datos recibidos
    const data = JSON.parse(e.postData.contents);
    
    // Verificar que es una notificación de MercadoPago
    if (data.type === 'payment' && data.data) {
      const payment = data.data;
      
      console.log('Pago recibido:', payment);
      
      // Verificar si el pago está aprobado
      if (payment.status === 'approved' || payment.collection_status === 'approved') {
        console.log('Pago aprobado, actualizando registro...');
        
        // Buscar y actualizar el registro correspondiente
        updatePaymentStatus(payment);
        
        return ContentService.createTextOutput('OK');
      } else {
        console.log('Pago no aprobado:', payment.status);
        return ContentService.createTextOutput('Pago no aprobado');
      }
    }
    
    return ContentService.createTextOutput('Notificación recibida');
    
  } catch (error) {
    console.error('Error en webhook:', error);
    return ContentService.createTextOutput('Error: ' + error.message);
  }
}

function updatePaymentStatus(payment) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      console.error('Hoja no encontrada:', SHEET_NAME);
      return;
    }
    
    // Obtener todos los datos
    const data = sheet.getDataRange().getValues();
    
    // Buscar el registro por sessionId o paymentId
    let rowIndex = -1;
    
    for (let i = 1; i < data.length; i++) { // Empezar desde la fila 2 (después del header)
      const row = data[i];
      const sessionId = row[8]; // Columna I (sessionId)
      const paymentId = row[9]; // Columna J (paymentId)
      
      // Buscar por sessionId o paymentId
      if (sessionId === payment.external_reference || 
          paymentId === payment.id.toString()) {
        rowIndex = i + 1; // +1 porque getValues() es 0-indexed pero las filas empiezan en 1
        break;
      }
    }
    
    if (rowIndex > 0) {
      // Actualizar el estado del pago
      sheet.getRange(rowIndex, 7).setValue('TRUE'); // Columna G (pagoConfirmado)
      sheet.getRange(rowIndex, 8).setValue('CONFIRMADO'); // Columna H (estadoPago)
      sheet.getRange(rowIndex, 9).setValue(new Date().toISOString()); // Columna I (fechaConfirmacion)
      sheet.getRange(rowIndex, 10).setValue(payment.id); // Columna J (paymentId)
      sheet.getRange(rowIndex, 11).setValue(payment.collection_status); // Columna K (collectionStatus)
      sheet.getRange(rowIndex, 12).setValue(payment.status); // Columna L (status)
      
      console.log('Registro actualizado en fila:', rowIndex);
    } else {
      console.log('No se encontró registro para actualizar');
    }
    
  } catch (error) {
    console.error('Error actualizando estado:', error);
  }
}

/**
 * Función para configurar el webhook en MercadoPago
 * Esta función debe ejecutarse una vez para configurar el webhook
 */
function setupWebhook() {
  // URL del webhook (debe ser pública)
  const webhookUrl = 'https://script.google.com/macros/s/TU_SCRIPT_ID/exec';
  
  console.log('URL del webhook para configurar en MercadoPago:');
  console.log(webhookUrl);
  console.log('');
  console.log('Instrucciones:');
  console.log('1. Ve a tu cuenta de MercadoPago');
  console.log('2. Configuración > Webhooks');
  console.log('3. Agrega la URL del webhook');
  console.log('4. Selecciona los eventos: payment.created, payment.updated');
}

/**
 * Función para probar el webhook
 */
function testWebhook() {
  const testPayment = {
    type: 'payment',
    data: {
      id: 123456789,
      status: 'approved',
      collection_status: 'approved',
      external_reference: 'TEST_' + Date.now(),
      amount: 1000
    }
  };
  
  const payload = JSON.stringify(testPayment);
  
  // Simular una petición POST al webhook
  const response = UrlFetchApp.fetch('https://script.google.com/macros/s/TU_SCRIPT_ID/exec', {
    method: 'POST',
    contentType: 'application/json',
    payload: payload
  });
  
  console.log('Respuesta del test:', response.getContentText());
} 