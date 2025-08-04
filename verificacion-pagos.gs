/**
 * Sistema de Verificación Periódica de Pagos
 * Este script verifica cada hora los pagos pendientes y los actualiza
 */

// Configuración
const SPREADSHEET_ID = 'TU_SPREADSHEET_ID_AQUI';
const SHEET_NAME = 'Participaciones';
const MERCADOPAGO_ACCESS_TOKEN = 'TU_ACCESS_TOKEN_AQUI'; // Token de MercadoPago

/**
 * Función principal que se ejecuta cada hora
 */
function verificarPagosPendientes() {
  try {
    console.log('Iniciando verificación de pagos pendientes...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      console.error('Hoja no encontrada:', SHEET_NAME);
      return;
    }
    
    // Obtener todos los datos
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // Encontrar índices de columnas importantes
    const pagoConfirmadoIndex = headers.indexOf('pagoConfirmado');
    const estadoPagoIndex = headers.indexOf('estadoPago');
    const sessionIdIndex = headers.indexOf('sessionId');
    const paymentIdIndex = headers.indexOf('paymentId');
    const fechaRegistroIndex = headers.indexOf('fechaRegistro');
    
    if (pagoConfirmadoIndex === -1 || estadoPagoIndex === -1) {
      console.error('Columnas requeridas no encontradas');
      return;
    }
    
    // Procesar cada fila (empezando desde la fila 2)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const pagoConfirmado = row[pagoConfirmadoIndex];
      const estadoPago = row[estadoPagoIndex];
      const sessionId = row[sessionIdIndex];
      const paymentId = row[paymentIdIndex];
      const fechaRegistro = row[fechaRegistroIndex];
      
      // Solo verificar pagos pendientes
      if (pagoConfirmado === 'FALSE' && estadoPago === 'PENDIENTE') {
        console.log('Verificando pago pendiente:', sessionId);
        
        // Verificar si el pago fue confirmado
        const pagoInfo = verificarPagoEnMercadoPago(sessionId, paymentId);
        
        if (pagoInfo && pagoInfo.status === 'approved') {
          console.log('Pago confirmado:', sessionId);
          
          // Actualizar el registro
          const rowIndex = i + 1; // +1 porque getValues() es 0-indexed
          sheet.getRange(rowIndex, pagoConfirmadoIndex + 1).setValue('TRUE');
          sheet.getRange(rowIndex, estadoPagoIndex + 1).setValue('CONFIRMADO');
          sheet.getRange(rowIndex, fechaRegistroIndex + 1).setValue(new Date().toISOString());
          
          // Enviar email de confirmación (opcional)
          enviarEmailConfirmacion(row);
          
        } else if (pagoInfo && pagoInfo.status === 'rejected') {
          console.log('Pago rechazado:', sessionId);
          
          // Marcar como cancelado
          const rowIndex = i + 1;
          sheet.getRange(rowIndex, estadoPagoIndex + 1).setValue('CANCELADO');
          
        } else {
          console.log('Pago aún pendiente:', sessionId);
        }
      }
    }
    
    console.log('Verificación completada');
    
  } catch (error) {
    console.error('Error en verificación:', error);
  }
}

/**
 * Verifica el estado de un pago en MercadoPago
 */
function verificarPagoEnMercadoPago(sessionId, paymentId) {
  try {
    // Si tenemos paymentId, usarlo directamente
    if (paymentId && paymentId !== 'N/A') {
      const url = `https://api.mercadopago.com/v1/payments/${paymentId}`;
      const response = UrlFetchApp.fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`
        }
      });
      
      if (response.getResponseCode() === 200) {
        return JSON.parse(response.getContentText());
      }
    }
    
    // Si no tenemos paymentId, buscar por external_reference (sessionId)
    const url = `https://api.mercadopago.com/v1/payments/search?external_reference=${sessionId}`;
    const response = UrlFetchApp.fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`
      }
    });
    
    if (response.getResponseCode() === 200) {
      const data = JSON.parse(response.getContentText());
      if (data.results && data.results.length > 0) {
        return data.results[0];
      }
    }
    
    return null;
    
  } catch (error) {
    console.error('Error verificando pago:', error);
    return null;
  }
}

/**
 * Envía email de confirmación (opcional)
 */
function enviarEmailConfirmacion(rowData) {
  try {
    const nombre = rowData[0]; // Asumiendo que nombre está en la primera columna
    const email = rowData[2]; // Asumiendo que email está en la tercera columna
    
    if (email) {
      const subject = '¡Tu participación ha sido confirmada! - CODES++';
      const body = `
        <h2>¡Hola ${nombre}!</h2>
        <p>Tu pago ha sido confirmado exitosamente.</p>
        <p>Tu participación en el sorteo de la Tablet Android 15 ha sido registrada.</p>
        <p>Te notificaremos si resultas ganador/a.</p>
        <br>
        <p>Saludos,</p>
        <p>Equipo CODES++</p>
      `;
      
      MailApp.sendEmail(email, subject, '', {htmlBody: body});
      console.log('Email de confirmación enviado a:', email);
    }
    
  } catch (error) {
    console.error('Error enviando email:', error);
  }
}

/**
 * Configurar trigger para ejecutar cada hora
 */
function configurarTrigger() {
  // Eliminar triggers existentes
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'verificarPagosPendientes') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Crear nuevo trigger para ejecutar cada hora
  ScriptApp.newTrigger('verificarPagosPendientes')
    .timeBased()
    .everyHours(1)
    .create();
  
  console.log('Trigger configurado para ejecutar cada hora');
}

/**
 * Función para limpiar registros antiguos (más de 24 horas)
 */
function limpiarRegistrosAntiguos() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    const pagoConfirmadoIndex = headers.indexOf('pagoConfirmado');
    const estadoPagoIndex = headers.indexOf('estadoPago');
    const fechaRegistroIndex = headers.indexOf('fechaRegistro');
    
    const ahora = new Date();
    const limite24h = new Date(ahora.getTime() - (24 * 60 * 60 * 1000));
    
    // Procesar desde el final para no afectar los índices
    for (let i = data.length - 1; i > 0; i--) {
      const row = data[i];
      const pagoConfirmado = row[pagoConfirmadoIndex];
      const estadoPago = row[estadoPagoIndex];
      const fechaRegistro = new Date(row[fechaRegistroIndex]);
      
      // Si es pendiente y tiene más de 24 horas
      if (pagoConfirmado === 'FALSE' && 
          estadoPago === 'PENDIENTE' && 
          fechaRegistro < limite24h) {
        
        console.log('Limpiando registro antiguo en fila:', i + 1);
        
        // Marcar como cancelado
        sheet.getRange(i + 1, estadoPagoIndex + 1).setValue('CANCELADO');
        sheet.getRange(i + 1, pagoConfirmadoIndex + 1).setValue('FALSE');
      }
    }
    
    console.log('Limpieza de registros antiguos completada');
    
  } catch (error) {
    console.error('Error en limpieza:', error);
  }
} 