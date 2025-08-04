/**
 * Sistema de Verificación Periódica de Pagos - Versión Simplificada
 * Este script verifica cada hora los pagos pendientes y los actualiza
 */

// Configuración - REEMPLAZAR CON TUS DATOS REALES
const SPREADSHEET_ID = '1rCNIwjzB--xtIyK4gMvqIxJGLETra4VqnF5aL8lRTMk'; // ID real de tu hoja
const SHEET_NAME = 'Registros_Sorteo';
const MERCADOPAGO_ACCESS_TOKEN = 'APP_USR-5908100961878781-080320-3d4cf3e45d4723bffa7e302677cce571-2142366374'; // Token de producción de MercadoPago

/**
 * Función principal que se ejecuta cada hora
 */
function verificarPagosPendientes() {
  try {
    console.log('🔄 Iniciando verificación de pagos pendientes...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      console.error('❌ Hoja no encontrada:', SHEET_NAME);
      return;
    }
    
    // Obtener todos los datos
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    console.log('📊 Headers encontrados:', headers);
    
    // Encontrar índices de columnas importantes (adaptado a tu estructura)
    const pagoConfirmadoIndex = headers.indexOf('Pago Confirmado');
    const estadoPagoIndex = headers.indexOf('Estado Pago');
    const sessionIdIndex = headers.indexOf('Session ID');
    const paymentIdIndex = headers.indexOf('Payment ID');
    const fechaRegistroIndex = headers.indexOf('Fecha de Registro');
    
    console.log('🔍 Índices encontrados:', {
      pagoConfirmado: pagoConfirmadoIndex,
      estadoPago: estadoPagoIndex,
      sessionId: sessionIdIndex,
      paymentId: paymentIdIndex,
      fechaRegistro: fechaRegistroIndex
    });
    
    if (pagoConfirmadoIndex === -1 || estadoPagoIndex === -1) {
      console.error('❌ Columnas requeridas no encontradas');
      return;
    }
    
    let pagosActualizados = 0;
    let pagosPendientes = 0;
    
    // Procesar cada fila (empezando desde la fila 2)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const pagoConfirmado = row[pagoConfirmadoIndex];
      const estadoPago = row[estadoPagoIndex];
      const sessionId = row[sessionIdIndex] || '';
      const paymentId = row[paymentIdIndex] || '';
      const fechaRegistro = row[fechaRegistroIndex];
      
      // Solo verificar pagos pendientes
      if (pagoConfirmado === 'FALSE' && estadoPago === 'PENDIENTE') {
        pagosPendientes++;
        console.log(`🔍 Verificando pago pendiente ${pagosPendientes}:`, sessionId);
        
        // Verificar pago real en MercadoPago
        const pagoConfirmado = verificarPagoEnMercadoPago(sessionId, paymentId);
        
        if (pagoConfirmado) {
          console.log('✅ Pago confirmado:', sessionId);
          
          // Actualizar el registro
          const rowIndex = i + 1; // +1 porque getValues() es 0-indexed
          sheet.getRange(rowIndex, pagoConfirmadoIndex + 1).setValue('TRUE');
          sheet.getRange(rowIndex, estadoPagoIndex + 1).setValue('CONFIRMADO');
          
          // Actualizar fecha de confirmación si existe la columna
          if (fechaRegistroIndex !== -1) {
            sheet.getRange(rowIndex, fechaRegistroIndex + 1).setValue(new Date().toISOString());
          }
          
          pagosActualizados++;
          
          // Enviar email de confirmación (opcional)
          enviarEmailConfirmacion(row, headers);
          
        } else {
          console.log('⏳ Pago aún pendiente:', sessionId);
        }
      }
    }
    
    console.log(`✅ Verificación completada: ${pagosActualizados} pagos actualizados de ${pagosPendientes} pendientes`);
    
  } catch (error) {
    console.error('❌ Error en verificación:', error);
  }
}

/**
 * Verifica el estado de un pago en MercadoPago usando la API real
 */
function verificarPagoEnMercadoPago(sessionId, paymentId) {
  try {
    console.log(`🔍 Verificando pago real en MercadoPago: sessionId=${sessionId}, paymentId=${paymentId}`);
    
    // Si tenemos paymentId, usarlo directamente
    if (paymentId && paymentId !== 'N/A' && paymentId !== '') {
      console.log(`🔍 Buscando pago por ID: ${paymentId}`);
      
      const url = `https://api.mercadopago.com/v1/payments/${paymentId}`;
      const response = UrlFetchApp.fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.getResponseCode() === 200) {
        const paymentData = JSON.parse(response.getContentText());
        console.log(`📊 Datos del pago encontrado:`, paymentData);
        
        // Verificar si el pago está aprobado
        const isApproved = paymentData.status === 'approved' || 
                          paymentData.collection_status === 'approved';
        
        console.log(`✅ Estado del pago: ${paymentData.status}, Collection: ${paymentData.collection_status}`);
        console.log(`🎯 Resultado: ${isApproved ? 'CONFIRMADO' : 'PENDIENTE'}`);
        
        return isApproved;
      } else {
        console.log(`❌ Error al buscar pago por ID: ${response.getResponseCode()}`);
        return false;
      }
    }
    
    // Si no tenemos paymentId, buscar por external_reference (sessionId)
    if (sessionId && sessionId !== 'N/A' && sessionId !== '') {
      console.log(`🔍 Buscando pago por external_reference: ${sessionId}`);
      
      const url = `https://api.mercadopago.com/v1/payments/search?external_reference=${sessionId}`;
      const response = UrlFetchApp.fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.getResponseCode() === 200) {
        const searchData = JSON.parse(response.getContentText());
        console.log(`📊 Resultados de búsqueda:`, searchData);
        
        if (searchData.results && searchData.results.length > 0) {
          const payment = searchData.results[0];
          console.log(`📊 Pago encontrado:`, payment);
          
          // Verificar si el pago está aprobado
          const isApproved = payment.status === 'approved' || 
                            payment.collection_status === 'approved';
          
          console.log(`✅ Estado del pago: ${payment.status}, Collection: ${payment.collection_status}`);
          console.log(`🎯 Resultado: ${isApproved ? 'CONFIRMADO' : 'PENDIENTE'}`);
          
          return isApproved;
        } else {
          console.log(`❌ No se encontraron pagos para sessionId: ${sessionId}`);
          return false;
        }
      } else {
        console.log(`❌ Error al buscar pago por sessionId: ${response.getResponseCode()}`);
        return false;
      }
    }
    
    console.log(`❌ No se pudo verificar el pago: sin paymentId ni sessionId válidos`);
    return false;
    
  } catch (error) {
    console.error(`❌ Error verificando pago en MercadoPago:`, error);
    return false;
  }
}

/**
 * Envía email de confirmación
 */
function enviarEmailConfirmacion(rowData, headers) {
  try {
    // Buscar índices de nombre y email
    const nombreIndex = headers.indexOf('Nombre');
    const emailIndex = headers.indexOf('Email');
    
    if (nombreIndex !== -1 && emailIndex !== -1) {
      const nombre = rowData[nombreIndex];
      const email = rowData[emailIndex];
      
      if (email && nombre) {
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
        console.log('📧 Email de confirmación enviado a:', email);
      }
    }
    
  } catch (error) {
    console.error('❌ Error enviando email:', error);
  }
}

/**
 * Configurar trigger para ejecutar cada hora
 */
function configurarTrigger() {
  try {
    // Eliminar triggers existentes
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'verificarPagosPendientes') {
        ScriptApp.deleteTrigger(trigger);
        console.log('🗑️ Trigger anterior eliminado');
      }
    });
    
    // Crear nuevo trigger para ejecutar cada hora
    ScriptApp.newTrigger('verificarPagosPendientes')
      .timeBased()
      .everyHours(1)
      .create();
    
    console.log('✅ Trigger configurado para ejecutar cada hora');
    
  } catch (error) {
    console.error('❌ Error configurando trigger:', error);
  }
}

/**
 * Función para limpiar registros antiguos (más de 24 horas)
 */
function limpiarRegistrosAntiguos() {
  try {
    console.log('🧹 Iniciando limpieza de registros antiguos...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    const pagoConfirmadoIndex = headers.indexOf('Pago Confirmado');
    const estadoPagoIndex = headers.indexOf('Estado Pago');
    const fechaRegistroIndex = headers.indexOf('Fecha de Registro');
    
    const ahora = new Date();
    const limite24h = new Date(ahora.getTime() - (24 * 60 * 60 * 1000));
    
    let registrosLimpiados = 0;
    
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
        
        console.log('🗑️ Limpiando registro antiguo en fila:', i + 1);
        
        // Marcar como cancelado
        sheet.getRange(i + 1, estadoPagoIndex + 1).setValue('CANCELADO');
        sheet.getRange(i + 1, pagoConfirmadoIndex + 1).setValue('FALSE');
        
        registrosLimpiados++;
      }
    }
    
    console.log(`✅ Limpieza completada: ${registrosLimpiados} registros limpiados`);
    
  } catch (error) {
    console.error('❌ Error en limpieza:', error);
  }
}

/**
 * Función para probar manualmente
 */
function probarVerificacion() {
  console.log('🧪 Ejecutando prueba de verificación...');
  verificarPagosPendientes();
}

/**
 * Función para configurar todo de una vez
 */
function configurarTodo() {
  console.log('⚙️ Configurando sistema completo...');
  
  // Actualizar estructura de la hoja
  actualizarEstructuraHoja();
  
  // Configurar trigger
  configurarTrigger();
  
  // Ejecutar primera verificación
  verificarPagosPendientes();
  
  // Limpiar registros antiguos
  limpiarRegistrosAntiguos();
  
  console.log('✅ Sistema configurado completamente');
}

/**
 * Actualiza la estructura de la hoja agregando las columnas necesarias
 */
function actualizarEstructuraHoja() {
  try {
    console.log('📊 Actualizando estructura de la hoja...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      console.error('❌ Hoja no encontrada:', SHEET_NAME);
      return;
    }
    
    // Obtener headers actuales
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    console.log('📋 Headers actuales:', headers);
    
    // Columnas que necesitamos agregar
    const columnasNecesarias = [
      'Estado Pago',
      'Session ID', 
      'Payment ID',
      'Fecha Confirmación'
    ];
    
    let columnaActual = headers.length + 1;
    
    columnasNecesarias.forEach(columna => {
      if (headers.indexOf(columna) === -1) {
        console.log(`➕ Agregando columna: ${columna} en posición ${columnaActual}`);
        sheet.getRange(1, columnaActual).setValue(columna);
        columnaActual++;
      } else {
        console.log(`✅ Columna ya existe: ${columna}`);
      }
    });
    
    // Actualizar registros existentes con valores por defecto
    const ultimaFila = sheet.getLastRow();
    if (ultimaFila > 1) {
      console.log('🔄 Actualizando registros existentes...');
      
      // Buscar índices de las nuevas columnas
      const headersActualizados = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      const estadoPagoIndex = headersActualizados.indexOf('Estado Pago');
      const sessionIdIndex = headersActualizados.indexOf('Session ID');
      const paymentIdIndex = headersActualizados.indexOf('Payment ID');
      
      // Actualizar registros existentes
      for (let fila = 2; fila <= ultimaFila; fila++) {
        // Estado Pago por defecto: PENDIENTE
        if (estadoPagoIndex !== -1) {
          const pagoConfirmado = sheet.getRange(fila, headersActualizados.indexOf('Pago Confirmado') + 1).getValue();
          const estadoPago = pagoConfirmado === 'TRUE' ? 'CONFIRMADO' : 'PENDIENTE';
          sheet.getRange(fila, estadoPagoIndex + 1).setValue(estadoPago);
        }
        
        // Session ID por defecto
        if (sessionIdIndex !== -1) {
          const sessionId = sheet.getRange(fila, sessionIdIndex + 1).getValue();
          if (!sessionId) {
            sheet.getRange(fila, sessionIdIndex + 1).setValue('SES_' + Date.now() + '_' + fila);
          }
        }
        
        // Payment ID por defecto
        if (paymentIdIndex !== -1) {
          const paymentId = sheet.getRange(fila, paymentIdIndex + 1).getValue();
          if (!paymentId) {
            sheet.getRange(fila, paymentIdIndex + 1).setValue('N/A');
          }
        }
      }
    }
    
    console.log('✅ Estructura de hoja actualizada');
    
  } catch (error) {
    console.error('❌ Error actualizando estructura:', error);
  }
} 